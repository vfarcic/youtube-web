/**
 * AspectEditForm Component - Basic Structure
 * 
 * A dynamic form component that renders appropriate fields based on selected editing aspect.
 * This is the basic structure implementation to pass TDD tests.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { EditingFieldMetadata, apiClient } from '../../lib/api-client';

interface AspectEditFormProps {
  aspect?: {
    key: string;
    title: string;
    description?: string;
  };
  fields?: EditingFieldMetadata[];
  videoData?: {
    videoId?: string;
    videoName?: string;
    category?: string;
  };
  onBack?: () => void;
  onSave?: (formData: any) => void;
  onCancel?: () => void;
}

const AspectEditForm: React.FC<AspectEditFormProps> = ({ 
    aspect, 
    fields = [],
    videoData, 
    onBack, 
    onSave, 
    onCancel 
}) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [loadingValues, setLoadingValues] = useState(true);

    // NEW: Load current field values when component mounts or aspect changes
    useEffect(() => {
        const loadCurrentValues = async () => {
            if (!aspect?.key || !videoData?.videoId) {
                setLoadingValues(false);
                return;
            }

            try {
                setLoadingValues(true);
                console.log('🔄 Loading current values for aspect:', aspect.key, 'video:', videoData.videoId);
                
                // Pass videoName and category to use the correct API endpoint
                const valuesResponse = await apiClient.getAspectValues(
                    videoData.videoId, 
                    aspect.key,
                    videoData.videoName,
                    videoData.category
                );
                
                if (valuesResponse.values && Object.keys(valuesResponse.values).length > 0) {
                    console.log('✅ Loaded current values:', valuesResponse.values);
                    setFormData(valuesResponse.values);
                } else {
                    console.log('💡 No saved values found, starting with empty form');
                    setFormData({});
                }
            } catch (error) {
                console.error('❌ Error loading current values:', error);
                // Continue with empty form if loading fails
                setFormData({});
            } finally {
                setLoadingValues(false);
            }
        };

        loadCurrentValues();
    }, [aspect?.key, videoData?.videoId]);

    // Smart field type detection function (Subtask 6.3)
    const getFieldType = (field: EditingFieldMetadata, value: any): string => {
        // If field type is explicitly defined in metadata, use it
        if (field.type === 'date') return 'datetime-local';
        if (field.type === 'boolean') return 'boolean';
        if (field.multiline || field.inputType === 'textarea') return 'textarea';
        
        // Date detection based on field name
        if (field.name.toLowerCase().includes('date') || 
            field.name.toLowerCase().includes('time')) {
            return 'datetime-local';
        }
        
        // Boolean detection based on field name patterns
        if (field.name.endsWith('Done') || 
            field.name.endsWith('done') ||
            field.name.startsWith('request') ||
            field.name.startsWith('Request') ||
            field.name.endsWith('Sent') ||
            field.name.endsWith('sent') ||
            field.name.startsWith('is') ||
            field.name.startsWith('has') ||
            field.name.startsWith('upload') ||
            field.name.startsWith('create') ||
            field.name.startsWith('replied') ||
            field.name.startsWith('notified')) {
            return 'boolean';
        }
        
        // Long text detection based on field name patterns (before checking value)
        const fieldNameLower = field.name.toLowerCase();
        if (fieldNameLower.includes('description') ||
            fieldNameLower.includes('content') ||
            fieldNameLower.includes('notes') ||
            fieldNameLower.includes('comment') ||
            fieldNameLower.includes('message') ||
            fieldNameLower.includes('details') ||
            fieldNameLower.includes('summary') ||
            fieldNameLower.includes('bio') ||
            fieldNameLower.includes('about') ||
            fieldNameLower.includes('text') ||
            fieldNameLower.includes('story') ||
            fieldNameLower.includes('reason') ||
            fieldNameLower.includes('feedback')) {
            return 'textarea';
        }
        
        // Check actual value for type detection
        if (typeof value === 'boolean') {
            return 'boolean';
        }
        
        // Long text detection based on value length
        if (typeof value === 'string' && value.length > 100) {
            return 'textarea';
        }
        
        // Array or object detection (JSON)
        if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            return 'json';
        }
        
        // Default to text input
        return 'text';
    };

    // Format field label from camelCase to "Formatted Label"
    const formatFieldLabel = (name: string): string => {
        return name
            .replace(/URL/g, 'Url') // Handle URL specially
            .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
            .replace(/Url/g, 'URL'); // Convert back to uppercase URL
    };

    // NEW: API-driven field completion logic (Issue #17)
    const isFieldComplete = (field: EditingFieldMetadata, value: any, allFieldValues: Record<string, any>): boolean => {
        // Use API-driven completion criteria if available, fallback to legacy logic
        if (!field.completionCriteria) {
            // Legacy fallback logic for fields without completionCriteria
            return value !== undefined && value !== null && value !== '' && value !== '-';
        }

        switch (field.completionCriteria) {
            case 'filled_only':
                return value && value.toString().trim() !== '' && value !== '-';
            
            case 'empty_or_filled':
                return true; // Always considered complete regardless of value
            
            case 'conditional':
                return handleConditionalLogic(field, value, allFieldValues);
            
            case 'true_only':
                return value === true;
            
            case 'false_only':
                return value === false;
            
            case 'filled_required':
                return value && value.toString().trim() !== '' && value !== '-';
            
            default:
                console.warn('Unknown completion criteria:', field.completionCriteria);
                return false;
        }
    };

    // NEW: Handle conditional completion logic for fields like "Sponsored Emails"
    const handleConditionalLogic = (field: EditingFieldMetadata, value: any, allFieldValues: Record<string, any>): boolean => {
        if (field.name === 'Sponsorship Emails (comma separated)') {
            // Only required if Sponsorship Amount is filled and not "N/A" or "-"
            const sponsorAmount = allFieldValues['Sponsorship Amount'];
            const hasSponsor = sponsorAmount && sponsorAmount !== 'N/A' && sponsorAmount !== '-' && sponsorAmount.toString().trim() !== '';
            
            if (hasSponsor) {
                // If sponsored, emails must be filled
                return value && value.toString().trim() !== '' && value !== '-';
            } else {
                // If not sponsored, empty is complete
                return true;
            }
        }
        
        // Add other conditional fields as needed
        // For now, default to filled_only logic for unknown conditional fields
        return value && value.toString().trim() !== '' && value !== '-';
    };

    // NEW: Calculate progress using API-driven completion logic (Issue #17)
    const calculateProgress = (fields: EditingFieldMetadata[], fieldValues: Record<string, any>) => {
        const completed = fields.filter(field => 
            isFieldComplete(field, fieldValues[field.name], fieldValues)
        ).length;
        return { completed, total: fields.length };
    };

    // Enhanced validation function with comprehensive rules
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        fields.forEach(field => {
            const fieldValue = formData[field.name];
            const fieldType = getFieldType(field, fieldValue);
            
            // Required field validation
            if (field.required && (!fieldValue || fieldValue === '' || fieldValue === null || fieldValue === undefined)) {
                newErrors[field.name] = `${formatFieldLabel(field.name)} is required`;
                return;
            }
            
            // Skip validation if field is empty and not required
            if (!fieldValue && !field.required) {
                return;
            }
            
            // Field-specific validation based on type
            switch (fieldType) {
                case 'datetime-local':
                    if (fieldValue && typeof fieldValue === 'string') {
                        // Validate datetime format
                        const dateValue = new Date(fieldValue);
                        if (isNaN(dateValue.getTime())) {
                            newErrors[field.name] = `${formatFieldLabel(field.name)} must be a valid date and time`;
                        } else if (fieldValue.length < 16) {
                            newErrors[field.name] = `${formatFieldLabel(field.name)} must include both date and time`;
                        }
                    }
                    break;
                    
                case 'json':
                    if (fieldValue && typeof fieldValue === 'string') {
                        // Validate JSON format if it looks like JSON
                        if ((fieldValue.startsWith('{') || fieldValue.startsWith('[')) && fieldValue.length > 1) {
                            try {
                                JSON.parse(fieldValue);
                            } catch (e) {
                                newErrors[field.name] = `${formatFieldLabel(field.name)} must be valid JSON format`;
                            }
                        }
                    }
                    break;
                    
                case 'text':
                    // URL validation for fields that might be URLs
                    if (field.name.toLowerCase().includes('url') && fieldValue) {
                        try {
                            new URL(fieldValue);
                        } catch (e) {
                            newErrors[field.name] = `${formatFieldLabel(field.name)} must be a valid URL`;
                        }
                    }
                    
                    // Email validation for fields that might be emails
                    if (field.name.toLowerCase().includes('email') && fieldValue) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(fieldValue)) {
                            newErrors[field.name] = `${formatFieldLabel(field.name)} must be a valid email address`;
                        }
                    }
                    break;
                    
                case 'textarea':
                    // Length validation for long text fields
                    if (fieldValue && fieldValue.length > 5000) {
                        newErrors[field.name] = `${formatFieldLabel(field.name)} must be less than 5000 characters`;
                    }
                    break;
            }
            
            // Custom validation rules based on existing field metadata properties
            if (fieldValue) {
                // Pattern validation (regex)
                if (field.pattern) {
                    const regex = new RegExp(field.pattern);
                    if (!regex.test(String(fieldValue))) {
                        newErrors[field.name] = `${formatFieldLabel(field.name)} format is invalid`;
                    }
                }
                
                // Length validation for strings
                if (typeof fieldValue === 'string') {
                    if (field.minLength && fieldValue.length < field.minLength) {
                        newErrors[field.name] = `${formatFieldLabel(field.name)} must be at least ${field.minLength} characters`;
                    }
                    if (field.maxLength && fieldValue.length > field.maxLength) {
                        newErrors[field.name] = `${formatFieldLabel(field.name)} must be no more than ${field.maxLength} characters`;
                    }
                }
                
                // Numeric validation
                if (typeof fieldValue === 'number' || (typeof fieldValue === 'string' && !isNaN(Number(fieldValue)))) {
                    const numValue = Number(fieldValue);
                    if (field.min !== undefined && numValue < field.min) {
                        newErrors[field.name] = `${formatFieldLabel(field.name)} must be at least ${field.min}`;
                    }
                    if (field.max !== undefined && numValue > field.max) {
                        newErrors[field.name] = `${formatFieldLabel(field.name)} must be no more than ${field.max}`;
                    }
                }
            }
        });
        
        setErrors(newErrors);
        
        // Focus on first failed field if validation failed
        if (Object.keys(newErrors).length > 0) {
            // Use setTimeout to ensure the error states are applied first
            setTimeout(() => {
                // Find the first field with an error in DOM order
                const firstFieldWithError = fields.find(field => newErrors[field.name]);
                if (firstFieldWithError) {
                    const fieldElement = document.querySelector(`[name="${firstFieldWithError.name}"]`) as HTMLElement;
                    if (fieldElement && fieldElement.focus) {
                        fieldElement.focus();
                    }
                }
            }, 0);
        }
        
        return Object.keys(newErrors).length === 0;
    };

    // Enhanced handleChange with real-time validation
    const handleChange = (fieldName: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
        
        // Real-time validation: Clear error when user starts typing
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
        
        // Validate required fields when they become empty
        const field = fields.find(f => f.name === fieldName);
        if (field?.required && (!value || value === '')) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: `${formatFieldLabel(fieldName)} is required`
            }));
        }
        
        // Optional: Real-time validation for specific fields
        // Can be enabled for immediate feedback on critical fields
        if (fieldName.toLowerCase().includes('email') || fieldName.toLowerCase().includes('url')) {
            // Debounced validation for performance
            setTimeout(() => {
                const field = fields.find(f => f.name === fieldName);
                if (field && value) {
                    const fieldType = getFieldType(field, value);
                    let hasError = false;
                    
                    if (fieldType === 'text' && fieldName.toLowerCase().includes('url')) {
                        try {
                            new URL(value);
                        } catch (e) {
                            hasError = true;
                            setErrors(prev => ({
                                ...prev,
                                [fieldName]: `${formatFieldLabel(fieldName)} must be a valid URL`
                            }));
                        }
                    }
                    
                    if (fieldType === 'text' && fieldName.toLowerCase().includes('email')) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            hasError = true;
                            setErrors(prev => ({
                                ...prev,
                                [fieldName]: `${formatFieldLabel(fieldName)} must be a valid email address`
                            }));
                        }
                    }
                }
            }, 1000); // 1 second debounce
        }
    };

    // Handle AI generation for Definition aspect fields
    const handleAiGenerate = async (fieldName: string) => {
        try {
            console.log(`🤖 AI generation requested for field: ${fieldName}`);
            // TODO: Implement AI generation API call when backend is ready
            // For now, show a placeholder message
            const placeholderContent = `[AI Generated] Sample content for ${formatFieldLabel(fieldName)}`;
            handleChange(fieldName, placeholderContent);
        } catch (error) {
            console.error('Error generating AI content:', error);
            // Show error in form
            setErrors(prev => ({
                ...prev,
                [fieldName]: 'Failed to generate AI content. Please try again.'
            }));
        }
    };

    // Render complete field with completion indicators and AI buttons
    const renderField = (field: EditingFieldMetadata) => {
        const fieldType = getFieldType(field, formData[field.name]);
        const fieldValue = formData[field.name];
        // NEW: Use API-driven completion logic (Issue #17)
        const isCompleted = isFieldComplete(field, fieldValue, formData);
        const showAiButton = aspect?.key === 'definition'; // AI buttons only for Definition aspect
        
        return (
            <div key={field.name} className="form-group">
                <div className="field-header">
                    {/* Field completion status indicator LEFT of label following mock design */}
                    <div className="completion-status">
                        {isCompleted ? (
                            <span className="field-status completed" aria-label="Field completed">
                                <i className="fas fa-check-circle" aria-hidden="true"></i>
                            </span>
                        ) : (
                            <span className="field-status pending" aria-label="Field pending">
                                <i className="fas fa-clock" aria-hidden="true"></i>
                            </span>
                        )}
                    </div>
                    
                    <label htmlFor={field.name}>
                        {formatFieldLabel(field.name)}
                        {field.required && <span className="required-indicator">*</span>}
                    </label>
                </div>
                
                {/* Field input container following mock design */}
                {showAiButton ? (
                    <div className="input-container-with-ai">
                        {renderFieldInput(field, fieldType)}
                        <button 
                            type="button" 
                            className="ai-generate-btn" 
                            onClick={() => handleAiGenerate(field.name)}
                            aria-label={`Generate ${formatFieldLabel(field.name)} with AI`}
                            title={`Generate ${formatFieldLabel(field.name)} with AI`}
                        >
                            <i className="fas fa-magic" aria-hidden="true"></i>
                        </button>
                    </div>
                ) : (
                    <div className="field-input-container">
                        {renderFieldInput(field, fieldType)}
                    </div>
                )}
                
                {errors[field.name] && (
                    <div className="invalid-feedback">{errors[field.name]}</div>
                )}
                {field.helpText && (
                    <div className="field-help">{field.helpText}</div>
                )}
            </div>
        );
    };

    // Render individual field based on detected type
    const renderFieldInput = (field: EditingFieldMetadata, fieldType: string) => {
        // Get field value from formData (loaded from API) with fallback to empty string
        const fieldValue = formData[field.name] || '';
        
        switch (fieldType) {
            case 'datetime-local':
                let dateValue = fieldValue;
                // Convert ISO date string to datetime-local format if needed
                if (fieldValue && typeof fieldValue === 'string') {
                    dateValue = fieldValue.replace('Z', '').replace(/\+.*$/, '');
                }
                return (
                    <input
                        type="datetime-local"
                        id={field.name}
                        name={field.name}
                        value={dateValue}
                        onChange={e => handleChange(field.name, e.target.value)}
                        onBlur={() => {
                            // Validate required fields on blur
                            const currentValue = formData[field.name] || '';
                            if (field.required && (!currentValue || currentValue === '')) {
                                setErrors(prev => ({
                                    ...prev,
                                    [field.name]: `${formatFieldLabel(field.name)} is required`
                                }));
                            }
                        }}
                        className={`form-input ${errors[field.name] ? 'is-invalid' : ''}`}
                        required={field.required}
                    />
                );
            
            case 'boolean':
                return (
                    <div className="radio-group" data-field={field.name}>
                        <div className="radio-option">
                            <input
                                type="radio"
                                id={`${field.name}_yes`}
                                name={field.name}
                                value="yes"
                                checked={formData[field.name] === true}
                                onChange={() => handleChange(field.name, true)}
                            />
                            <label htmlFor={`${field.name}_yes`} className="radio-label">Yes</label>
                        </div>
                        <div className="radio-option">
                            <input
                                type="radio"
                                id={`${field.name}_no`}
                                name={field.name}
                                value="no"
                                checked={formData[field.name] === false}
                                onChange={() => handleChange(field.name, false)}
                            />
                            <label htmlFor={`${field.name}_no`} className="radio-label">No</label>
                        </div>
                    </div>
                );
            
            case 'textarea':
                return (
                    <textarea
                        id={field.name}
                        name={field.name}
                        value={fieldValue}
                        onChange={e => handleChange(field.name, e.target.value)}
                        onBlur={() => {
                            // Validate required fields on blur
                            const currentValue = formData[field.name] || '';
                            if (field.required && (!currentValue || currentValue === '')) {
                                setErrors(prev => ({
                                    ...prev,
                                    [field.name]: `${formatFieldLabel(field.name)} is required`
                                }));
                            }
                        }}
                        className={`form-input ${errors[field.name] ? 'is-invalid' : ''}`}
                        rows={field.rows || 4}
                        placeholder={field.placeholder}
                        required={field.required}
                    />
                );
            
            case 'json':
                const jsonValue = typeof fieldValue === 'object' 
                    ? JSON.stringify(fieldValue, null, 2)
                    : Array.isArray(fieldValue) 
                        ? fieldValue.join(', ')
                        : String(fieldValue || '');
                return (
                    <textarea
                        id={field.name}
                        name={field.name}
                        value={jsonValue}
                        onChange={e => {
                            let value: any = e.target.value.trim();
                            // Try to parse as JSON for objects
                            if (value.startsWith('{') || value.startsWith('[')) {
                                try {
                                    value = JSON.parse(value);
                                } catch (e) {
                                    // Keep as string if not valid JSON
                                }
                            } else if (value.includes(',')) {
                                // Comma-separated values as array
                                value = value.split(',').map((item: string) => item.trim()).filter((item: string) => item.length > 0);
                            }
                            handleChange(field.name, value);
                        }}
                        onBlur={() => {
                            // Validate required fields on blur
                            const currentValue = formData[field.name] || '';
                            if (field.required && (!currentValue || currentValue === '')) {
                                setErrors(prev => ({
                                    ...prev,
                                    [field.name]: `${formatFieldLabel(field.name)} is required`
                                }));
                            }
                        }}
                        className={`form-input ${errors[field.name] ? 'is-invalid' : ''}`}
                        rows={4}
                        placeholder="Enter JSON object, array, or comma-separated values"
                        required={field.required}
                    />
                );
            
            case 'text':
            default:
                return (
                    <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={fieldValue}
                        onChange={e => handleChange(field.name, e.target.value)}
                        onBlur={() => {
                            // Validate required fields on blur
                            const currentValue = formData[field.name] || '';
                            if (field.required && (!currentValue || currentValue === '')) {
                                setErrors(prev => ({
                                    ...prev,
                                    [field.name]: `${formatFieldLabel(field.name)} is required`
                                }));
                            }
                        }}
                        className={`form-input ${errors[field.name] ? 'is-invalid' : ''}`}
                        placeholder={field.placeholder}
                        required={field.required}
                    />
                );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('🚀 Form submission started');
        
        // Clear any previous general errors
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors._general;
            return newErrors;
        });
        
        // Enhanced validation with proper error prevention
        const isValid = validateForm();
        console.log('🔍 Form validation result:', isValid);
        
        if (!isValid) {
            console.log('❌ Form validation failed, submission prevented');
            // Validation failed - prevent submission and show errors
            // The validateForm function already sets errors and focuses on first invalid field
            return; // Early return prevents submission
        }
        
        console.log('✅ Form validation passed, proceeding with submission');
        
        // Check if we have the required data for API submission
        if (!aspect?.key || !videoData?.videoId) {
            console.warn('⚠️ Missing aspect key or video ID, using fallback submission');
            // Fallback for when API integration is not available
            if (onSave) {
                try {
                    setLoading(true);
                    console.log('💾 Calling onSave callback with form data:', formData);
                    await onSave(formData);
                    console.log('✅ Fallback save completed successfully');
                } catch (error) {
                    console.error('❌ Fallback save failed:', error);
                    setErrors({ _general: 'Failed to save changes. Please try again.' });
                } finally {
                    setLoading(false);
                }
            }
            return;
        }
        
        // API submission with enhanced error handling
        try {
            setLoading(true);
            console.log('💾 Starting API submission...');
            console.log('📋 Form data to save:', formData);
            console.log('🎯 Video ID:', videoData.videoId);
            console.log('🏷️ Aspect key:', aspect.key);
            
            // Call the API to save aspect values
            await apiClient.saveAspectValues(videoData.videoId, aspect.key, formData);
            console.log('✅ API submission completed successfully');
            
            // Call the onSave callback if provided
            if (onSave) {
                console.log('📞 Calling onSave callback after successful API save');
                await onSave(formData);
            }
            
            console.log('🎉 Form submission fully completed');
            
        } catch (error) {
            console.error('❌ API submission failed:', error);
            
            // Enhanced error handling with specific error messages
            let errorMessage = 'Failed to save changes. Please try again.';
            
            if (error instanceof Error) {
                // Check for specific error types
                if (error.message.includes('Network')) {
                    errorMessage = 'Network error. Please check your connection and try again.';
                } else if (error.message.includes('404')) {
                    errorMessage = 'Video or aspect not found. Please refresh the page and try again.';
                } else if (error.message.includes('403') || error.message.includes('401')) {
                    errorMessage = 'You do not have permission to edit this video.';
                } else if (error.message.includes('500')) {
                    errorMessage = 'Server error. Please try again later.';
                } else if (error.message.length > 0) {
                    errorMessage = `Save failed: ${error.message}`;
                }
            }
            
            // Set the general error message
            setErrors({ _general: errorMessage });
            
            // Optional: Log error for debugging
            console.log('📊 Error details:', {
                errorType: error?.constructor?.name,
                errorMessage: error instanceof Error ? error.message : String(error),
                formData: formData,
                aspectKey: aspect.key,
                videoId: videoData.videoId
            });
            
        } finally {
            setLoading(false);
            console.log('🏁 Form submission cleanup completed');
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    return (
        <div className="aspect-edit-form">
            {/* Form Header */}
            <div className="form-header">
                <button 
                    type="button" 
                    onClick={handleBack}
                    className="back-btn"
                    disabled={loading}
                >
                    ← Back to aspects
                </button>
                <h3>Edit {aspect?.title || 'Aspect'}</h3>
            </div>

            {/* Loading indicator for initial data load */}
            {loadingValues ? (
                <div className="form-loading">
                    <div className="loading-spinner">
                        <i className="fas fa-spinner"></i>
                    </div>
                    <p>Loading current values...</p>
                </div>
            ) : (
                /* Form Element */
                <form onSubmit={handleSubmit}>
                    {/* General error message */}
                    {errors._general && (
                        <div className="alert alert-error">
                            {errors._general}
                        </div>
                    )}

                    {/* Form Fields Container - using mock design class */}
                    <div className="aspect-form-container">
                        {/* Smart field type detection - render fields based on metadata */}
                        {fields.length > 0 ? (
                            fields.map((field) => renderField(field))
                        ) : (
                            // Show error state when no fields are loaded
                            <div className="form-error-state">
                                <div className="error-icon">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                <h4>Unable to Load Form Fields</h4>
                                <p>The form fields for this aspect could not be loaded. This might be due to:</p>
                                <ul>
                                    <li>Network connectivity issues</li>
                                    <li>Server problems</li>
                                    <li>Invalid aspect configuration</li>
                                </ul>
                                <p>Please try refreshing the page or contact support if the problem persists.</p>
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={handleCancel}
                            className="btn-cancel"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="btn-save"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner"></i> Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AspectEditForm; 