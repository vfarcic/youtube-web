// YouTube Automation Web Frontend Mockup JavaScript

// ===== MOCK DATA FOR VIDEO EDITING =====
const MOCK_VIDEO_DATA = {
    // Sample videos with all aspects data
    'kubernetes-advanced-tutorial': {
        id: 'devops/kubernetes-advanced-tutorial', // PRD #18: String-based ID format "category/filename"
        name: 'kubernetes-advanced-tutorial',
        title: 'Kubernetes Advanced Tutorial',
        category: 'devops',
        phase: 2, // Work phase
        init: {
            projectName: 'Kubernetes Advanced Tutorial',
            projectURL: 'https://github.com/vfarcic/k8s-specs',
            publishDate: '2024-01-15T10:00',
            gistPath: 'manuscript/devops/kubernetes-advanced-tutorial.md',
            sponsorshipAmount: '$500',
            sponsorshipEmails: 'sponsor@example.com, marketing@sponsor.com',
            sponsorshipBlockedReason: ''
        },
        work: {
            codeDone: true,
            talkingHeadDone: true,
            screenRecordingDone: false,
            relatedVideos: 'kubernetes-basics, docker-fundamentals',
            thumbnailsDone: false,
            diagramsDone: true,
            screenshotsDone: false,
            filesLocation: 'https://drive.google.com/folder/kubernetes-advanced',
            tagline: 'Master advanced Kubernetes concepts with hands-on examples',
            taglineIdeas: 'Alternative taglines: "Production K8s Mastery", "Advanced Kubernetes Guide"',
            otherLogos: 'CNCF logo, Kubernetes logo, company sponsor logo'
        },
        define: {
            title: 'Kubernetes Advanced Tutorial - Networking, RBAC & Operators',
            description: '',
            highlight: 'Learn advanced Kubernetes in 45 minutes',
            tags: 'kubernetes,devops,containers,networking,rbac,operators',
            descriptionTags: '#Kubernetes #DevOps #Containers #Networking #RBAC',
            tweetText: 'Just released: Advanced Kubernetes Tutorial! Deep dive into networking, RBAC, and operators. Perfect for DevOps engineers! 🚀 #Kubernetes #DevOps',
            animationsScript: 'Show K8s cluster animation, RBAC flow diagram, operator lifecycle',
            requestThumbnailGeneration: true
        },
        edit: {
            thumbnailPath: '/path/to/kubernetes-thumbnail.jpg',
            members: 'Viktor Farcic',
            requestEdit: false,
            timecodes: '00:00 - Introduction\n05:00 - Advanced Networking\n15:00 - RBAC Security\n25:00 - Custom Operators\n40:00 - Conclusion',
            movieDone: false,
            slidesDone: true
        },
        publish: {
            videoFilePath: '/path/to/kubernetes-advanced-final.mp4',
            uploadToYouTube: false,
            createHugoPost: false,
            hugoPath: ''
        },
        postPublish: {
            dotPosted: false,
            blueSkyPostSent: false,
            linkedInPostSent: false,
            slackPostSent: false,
            youTubeHighlightCreated: false,
            youTubePinnedCommentAdded: false,
            repliedToYouTubeComments: false,
            gdeAdvocuPostSent: false,
            codeRepositoryURL: 'https://github.com/vfarcic/k8s-specs',
            notifiedSponsors: false
        }
    },
    'docker-compose-deep-dive': {
        id: 'containers/docker-compose-deep-dive', // PRD #18: String-based ID format "category/filename"
        name: 'docker-compose-deep-dive',
        title: 'Docker Compose Deep Dive',
        category: 'containers',
        phase: 3, // Definition phase
        init: {
            projectName: 'Docker Compose Deep Dive',
            projectURL: 'https://github.com/vfarcic/docker-compose-samples',
            publishDate: '2024-02-20T14:00',
            gistPath: 'manuscript/containers/docker-compose-deep-dive.md',
            sponsorshipAmount: '$750',
            sponsorshipEmails: 'docker@sponsors.com',
            sponsorshipBlockedReason: ''
        },
        work: {
            codeDone: true,
            talkingHeadDone: true,
            screenRecordingDone: true,
            thumbnailsDone: false,
            diagramsDone: true,
            screenshotsDone: true,
            filesLocation: 'https://drive.google.com/folder/docker-compose',
            tagline: 'Master Docker Compose for production deployments'
        },
        define: {
            title: 'Docker Compose Deep Dive - Production Ready Deployments',
            description: 'Comprehensive guide to Docker Compose for complex multi-container applications. Learn networking, volumes, and production deployment strategies.',
            highlight: 'Production Docker Compose in 40 minutes',
            tags: 'docker,compose,containers,microservices,deployment',
            descriptionTags: '#Docker #Compose #Containers #Microservices',
            tweetText: 'New Docker Compose tutorial! Deep dive into production deployments with networking and volumes. Perfect for developers! 🐳 #Docker #Compose',
            requestThumbnailGeneration: false
        },
        edit: {
            thumbnailPath: '/path/to/docker-compose-thumbnail.jpg',
            members: 'Viktor Farcic',
            requestEdit: true,
            timecodes: '00:00 - Introduction\n05:00 - Basic Compose\n15:00 - Networks & Volumes\n25:00 - Production Deployment\n35:00 - Best Practices',
            movieDone: true,
            slidesDone: true
        },
        publish: {
            videoFilePath: '/path/to/docker-compose-final.mp4',
            uploadToYouTube: true,
            createHugoPost: true
        },
        postPublish: {
            blueSkyPostSent: false,
            linkedInPostSent: false,
            slackPostSent: false,
            youTubeHighlightCreated: false,
            youTubePinnedCommentAdded: false,
            repliedToYouTubeComments: false,
            gdeAdvocuPostSent: false,
            codeRepositoryURL: 'https://github.com/vfarcic/docker-compose-samples',
            notifiedSponsors: false
        }
    },
    'terraform-infrastructure': {
        id: 'infrastructure/terraform-infrastructure', // PRD #18: String-based ID format "category/filename"
        name: 'terraform-infrastructure',
        title: 'Terraform Infrastructure',
        category: 'infrastructure',
        phase: 4, // Post-production phase
        init: {
            projectName: 'Terraform Infrastructure as Code',
            projectURL: 'https://github.com/vfarcic/terraform-examples',
            publishDate: '2024-03-15T16:00',
            gistPath: 'manuscript/infrastructure/terraform-infrastructure.md',
            sponsorshipAmount: '',
            sponsorshipEmails: '',
            sponsorshipBlockedReason: 'No sponsor found for this topic'
        },
        work: {
            codeDone: true,
            talkingHeadDone: true,
            screenRecordingDone: true,
            thumbnailsDone: true,
            diagramsDone: true,
            screenshotsDone: true,
            filesLocation: 'https://drive.google.com/folder/terraform-infra',
            tagline: 'Complete guide to Terraform for cloud infrastructure'
        },
        define: {
            title: 'Terraform Infrastructure as Code - Complete Guide',
            description: 'Master Terraform for building scalable cloud infrastructure. Learn state management, modules, and best practices for production deployments.',
            highlight: 'Infrastructure as Code mastery in 45 minutes',
            tags: 'terraform,iac,aws,infrastructure,cloud',
            descriptionTags: '#Terraform #InfrastructureAsCode #AWS #Cloud',
            tweetText: 'New Terraform Infrastructure as Code guide! Master cloud infrastructure with best practices and real examples. Perfect for DevOps engineers! ☁️ #Terraform #IaC',
            requestThumbnailGeneration: false
        },
        edit: {
            thumbnailPath: '/path/to/terraform-iac-thumbnail.jpg',
            members: 'Viktor Farcic',
            requestEdit: false,
            timecodes: '00:00 - Introduction\n05:00 - Terraform Basics\n15:00 - State Management\n25:00 - Modules\n35:00 - Best Practices',
            movieDone: true,
            slidesDone: true
        },
        publish: {
            videoFilePath: '/path/to/terraform-final.mp4',
            uploadToYouTube: true,
            createHugoPost: true
        },
        postPublish: {
            blueSkyPostSent: true,
            linkedInPostSent: true,
            slackPostSent: true,
            youTubeHighlightCreated: true,
            youTubePinnedCommentAdded: true,
            repliedToYouTubeComments: false,
            gdeAdvocuPostSent: true,
            codeRepositoryURL: 'https://github.com/vfarcic/terraform-examples',
            notifiedSponsors: false
        }
    },
    'aws-lambda-serverless': {
        id: 'serverless/aws-lambda-serverless', // PRD #18: String-based ID format "category/filename"
        name: 'aws-lambda-serverless',
        title: 'AWS Lambda Serverless Architecture',
        category: 'serverless',
        phase: 1, // Initial phase
        init: {
            projectName: 'AWS Lambda Serverless Architecture',
            projectURL: 'https://github.com/vfarcic/aws-lambda-examples',
            publishDate: '2024-04-01T12:00',
            gistPath: 'manuscript/serverless/aws-lambda-serverless.md',
            sponsorshipAmount: '',
            sponsorshipEmails: '',
            sponsorshipBlockedReason: 'Sponsored by AWS (handled separately)'
        },
        work: {
            codeDone: false,
            talkingHeadDone: false,
            screenRecordingDone: false,
            relatedVideos: '',
            thumbnailsDone: false,
            diagramsDone: false,
            screenshotsDone: false,
            filesLocation: '',
            tagline: 'Complete serverless development guide',
            taglineIdeas: '',
            otherLogos: ''
        },
        define: {
            title: 'AWS Lambda Serverless Architecture - Complete Guide',
            description: 'Master serverless applications with AWS Lambda. Learn event triggers, monitoring, debugging, and best practices for production deployments.',
            highlight: 'Serverless mastery with AWS Lambda',
            tags: 'aws,lambda,serverless,cloud,functions',
            descriptionTags: '#AWS #Lambda #Serverless #Cloud',
            tweetText: 'New AWS Lambda serverless guide! Master cloud functions with triggers and monitoring. Perfect for cloud developers! ⚡ #AWS #Lambda',
            animationsScript: '',
            requestThumbnailGeneration: true
        },
        edit: {
            thumbnailPath: '',
            members: 'Viktor Farcic',
            requestEdit: false,
            timecodes: '',
            movieDone: false,
            slidesDone: false
        },
        publish: {
            videoFilePath: '',
            uploadToYouTube: false,
            createHugoPost: false,
            hugoPath: ''
        },
        postPublish: {
            dotPosted: false,
            blueSkyPostSent: false,
            linkedInPostSent: false,
            slackPostSent: false,
            youTubeHighlightCreated: false,
            youTubePinnedCommentAdded: false,
            repliedToYouTubeComments: false,
            gdeAdvocuPostSent: false,
            codeRepositoryURL: 'https://github.com/vfarcic/aws-lambda-examples',
            notifiedSponsors: false
        }
    },
    'gitops-argocd': {
        id: 'gitops/gitops-argocd', // PRD #18: String-based ID format "category/filename"
        name: 'gitops-argocd',
        title: 'GitOps with ArgoCD',
        category: 'gitops',
        phase: 5, // Publishing phase
        init: {
            projectName: 'GitOps with ArgoCD',
            projectURL: 'https://github.com/vfarcic/argocd-demo',
            publishDate: '2024-01-15T15:00',
            gistPath: 'manuscript/gitops/gitops-argocd.md'
        },
        work: {
            codeDone: true,
            talkingHeadDone: true,
            screenRecordingDone: true,
            thumbnailsDone: true,
            diagramsDone: true,
            screenshotsDone: true,
            filesLocation: 'https://drive.google.com/folder/gitops-argocd',
            tagline: 'Complete GitOps implementation guide'
        },
        define: {
            title: 'GitOps with ArgoCD - Automated Kubernetes Deployments',
            description: 'Learn GitOps principles and implement automated Kubernetes deployments with ArgoCD. Master declarative deployments and continuous delivery.',
            highlight: 'GitOps automation with ArgoCD',
            tags: 'gitops,argocd,kubernetes,automation,cicd',
            descriptionTags: '#GitOps #ArgoCD #Kubernetes #Automation',
            tweetText: 'New GitOps with ArgoCD tutorial! Master automated Kubernetes deployments with continuous delivery. Perfect for DevOps teams! 🚀 #GitOps #ArgoCD',
            requestThumbnailGeneration: false
        },
        edit: {
            thumbnailPath: '/path/to/gitops-argocd-thumbnail.jpg',
            members: 'Viktor Farcic',
            requestEdit: false,
            timecodes: '00:00 - Introduction\n05:00 - GitOps Principles\n15:00 - ArgoCD Setup\n25:00 - Application Deployment\n35:00 - Best Practices',
            movieDone: true,
            slidesDone: true
        },
        publish: {
            videoFilePath: '/path/to/gitops-argocd-final.mp4',
            uploadToYouTube: true,
            createHugoPost: true
        },
        postPublish: {
            blueSkyPostSent: true,
            linkedInPostSent: true,
            slackPostSent: true,
            youTubeHighlightCreated: true,
            youTubePinnedCommentAdded: true,
            repliedToYouTubeComments: false,
            gdeAdvocuPostSent: true,
            codeRepositoryURL: 'https://github.com/vfarcic/argocd-demo',
            notifiedSponsors: true
        }
    },
    'microservices-patterns': {
        id: 'architecture/microservices-patterns', // PRD #18: String-based ID format "category/filename"
        name: 'microservices-patterns',
        title: 'Microservices Design Patterns',
        category: 'architecture',
        phase: 6, // Post-publish phase
        init: {
            projectName: 'Microservices Design Patterns',
            projectURL: 'https://github.com/vfarcic/microservices-patterns',
            publishDate: '2024-01-01T11:00',
            gistPath: 'manuscript/architecture/microservices-patterns.md'
        },
        work: {
            codeDone: true,
            talkingHeadDone: true,
            screenRecordingDone: true,
            thumbnailsDone: true,
            diagramsDone: true,
            screenshotsDone: true,
            filesLocation: 'https://drive.google.com/folder/microservices-patterns',
            tagline: 'Master microservices architecture patterns'
        },
        define: {
            title: 'Microservices Design Patterns - Architecture Best Practices',
            description: 'Learn essential microservices design patterns for scalable architecture. Master service patterns, data consistency, and communication strategies.',
            highlight: 'Microservices architecture mastery',
            tags: 'microservices,patterns,architecture,design,scalability',
            descriptionTags: '#Microservices #Patterns #Architecture #Design',
            tweetText: 'New Microservices Design Patterns guide! Master architecture patterns for scalable systems. Perfect for software architects! 🏗️ #Microservices #Architecture',
            requestThumbnailGeneration: false
        },
        edit: {
            thumbnailPath: '/path/to/microservices-patterns-thumbnail.jpg',
            members: 'Viktor Farcic',
            requestEdit: false,
            timecodes: '00:00 - Introduction\n05:00 - Service Patterns\n15:00 - Data Patterns\n25:00 - Communication Patterns\n35:00 - Best Practices',
            movieDone: true,
            slidesDone: true
        },
        publish: {
            videoFilePath: '/path/to/microservices-patterns-final.mp4',
            uploadToYouTube: true,
            createHugoPost: true
        },
        postPublish: {
            blueSkyPostSent: true,
            linkedInPostSent: true,
            slackPostSent: true,
            youTubeHighlightCreated: true,
            youTubePinnedCommentAdded: true,
            repliedToYouTubeComments: true,
            gdeAdvocuPostSent: true,
            codeRepositoryURL: 'https://github.com/vfarcic/microservices-patterns',
            notifiedSponsors: true
        }
    }
};

// Phase statistics for dashboard
const MOCK_PHASE_STATS = {
    1: { name: 'Initial', count: 1, color: '#3B82F6' },       // aws-lambda-serverless
    2: { name: 'Work', count: 1, color: '#F59E0B' },          // kubernetes-advanced-tutorial
    3: { name: 'Definition', count: 1, color: '#8B5CF6' },    // docker-compose-deep-dive
    4: { name: 'Post-Production', count: 1, color: '#EF4444' }, // terraform-infrastructure
    5: { name: 'Publishing', count: 1, color: '#10B981' },    // gitops-argocd
    6: { name: 'Post-Publish', count: 1, color: '#6B7280' }   // microservices-patterns
};

// ===== MOCK API FUNCTIONS =====

function getVideoList(phase = null) {
    const videos = Object.values(MOCK_VIDEO_DATA);
    if (phase) {
        return videos.filter(video => video.phase === phase);
    }
    return videos;
}

function getVideoDetails(videoName) {
    return MOCK_VIDEO_DATA[videoName] || null;
}

function getPhaseStatistics() {
    return MOCK_PHASE_STATS;
}

function getAspectData(videoName, aspect) {
    const video = MOCK_VIDEO_DATA[videoName];
    return video ? video[aspect] : null;
}

// Simulate API delay
function simulateApiCall(data, delay = 300) {
    return new Promise(resolve => {
        setTimeout(() => resolve(data), delay);
    });
}

// Test function - available in browser console
function testMockAPI() {
    console.log('=== Testing Mock API Functions ===');
    console.log('All videos:', getVideoList());
    console.log('Work phase videos:', getVideoList(2));
    console.log('Kubernetes video:', getVideoDetails('kubernetes-advanced-tutorial'));
    console.log('Phase stats:', getPhaseStatistics());
    console.log('Kubernetes work-progress aspect:', getAspectData('kubernetes-advanced-tutorial', 'work-progress'));
    console.log('=== Mock API Test Complete ===');
}

// Make functions available globally for testing
window.getVideoList = getVideoList;
window.getVideoDetails = getVideoDetails;
window.getPhaseStatistics = getPhaseStatistics;
window.getAspectData = getAspectData;
window.simulateApiCall = simulateApiCall;
window.testMockAPI = testMockAPI;

// ===== VIDEO EDITING FUNCTIONS =====

// Helper function to get video name from display title
function getVideoNameFromTitle(title) {
    // Map display titles to video names in mock data
    const titleMap = {
        'Kubernetes Advanced Tutorial': 'kubernetes-advanced-tutorial',
        'Docker Compose Deep Dive': 'docker-compose-deep-dive',
        'Terraform Infrastructure': 'terraform-infrastructure',
        'AWS Lambda Serverless Architecture': 'aws-lambda-serverless',
        'GitOps with ArgoCD': 'gitops-argocd',
        'Microservices Design Patterns': 'microservices-patterns'
    };
    return titleMap[title] || title.toLowerCase().replace(/\s+/g, '-');
}

// Calculate aspect completion progress
function calculateAspectProgress(video, aspectKey) {
    const aspectData = video[aspectKey];
    if (!aspectData) return { completed: 0, total: 1 };
    
    const fields = Object.keys(aspectData);
    const completed = fields.filter(field => {
        const value = aspectData[field];
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value.trim().length > 0;
        if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
        return value !== null && value !== undefined;
    }).length;
    
    return { completed, total: fields.length };
}

// Get aspect definitions for UI
function getEditingAspects() {
    return {
        'init': {
            key: 'init',
            title: 'Initial Details',
            description: 'Project information, publication date, and gist path',
            icon: 'fas fa-play-circle',
            color: '#3B82F6'
        },
        'work': {
            key: 'work', 
            title: 'Work Progress',
            description: 'Content creation tasks: code, recordings, thumbnails, diagrams',
            icon: 'fas fa-cogs',
            color: '#F59E0B'
        },
        'define': {
            key: 'define',
            title: 'Definition',
            description: 'Title, description, tags, and social media content',
            icon: 'fas fa-edit',
            color: '#8B5CF6'
        },
        'edit': {
            key: 'edit',
            title: 'Post-Production',
            description: 'Thumbnail, members, editing requests, and timecodes',
            icon: 'fas fa-film',
            color: '#EF4444'
        },
        'publish': {
            key: 'publish',
            title: 'Publishing',
            description: 'Video file path, YouTube upload, and Hugo post creation',
            icon: 'fas fa-upload',
            color: '#10B981'
        },
        'postPublish': {
            key: 'postPublish',
            title: 'Post-Publish',
            description: 'Social media posts, notifications, and sponsor updates',
            icon: 'fas fa-chart-line',
            color: '#6B7280'
        }
    };
}

// Main edit modal function
function openEditModal(videoName) {
    const video = getVideoDetails(videoName);
    if (!video) {
        showNotification('Video not found: ' + videoName, 'error');
        return;
    }
    
    showEditModal(video);
}

// Show the edit modal with aspect selection
function showEditModal(video) {
    const modal = document.getElementById('edit-modal');
    const modalTitle = document.getElementById('edit-modal-title');
    
    modalTitle.textContent = `Edit: ${video.title}`;
    
    // Store current video in global state for access by other functions
    window.currentEditingVideo = video;
    
    // Generate aspect selection cards
    generateAspectCards(video);
    
    // Show modal and aspect selection view
    modal.style.display = 'flex';
    showAspectSelection();
}

// Close the edit modal
function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'none';
    window.currentEditingVideo = null;
}

// Show aspect selection view
function showAspectSelection() {
    document.getElementById('aspect-selection-view').classList.add('active');
    document.getElementById('aspect-edit-view').classList.remove('active');
}

// Show aspect edit form view
function showAspectEdit(aspectKey) {
    const video = window.currentEditingVideo;
    if (!video) return;
    
    const aspects = getEditingAspects();
    const aspect = aspects[aspectKey];
    
    if (!aspect) return;
    
    // Update title
    document.getElementById('aspect-edit-title').textContent = `Edit: ${aspect.title}`;
    
    // Generate form for this aspect
    generateAspectForm(video, aspectKey);
    
    // Show form view
    document.getElementById('aspect-selection-view').classList.remove('active');
    document.getElementById('aspect-edit-view').classList.add('active');
}

// Generate aspect selection cards
function generateAspectCards(video) {
    const aspectsGrid = document.getElementById('aspects-grid');
    const aspects = getEditingAspects();
    
    aspectsGrid.innerHTML = '';
    
    Object.keys(aspects).forEach(aspectKey => {
        const aspect = aspects[aspectKey];
        const progress = calculateAspectProgress(video, aspectKey);
        const progressPercent = Math.round((progress.completed / progress.total) * 100);
        
        const aspectCard = document.createElement('div');
        aspectCard.className = 'aspect-card';
        aspectCard.onclick = () => showAspectEdit(aspectKey);
        
        aspectCard.innerHTML = `
            <div class="aspect-icon" style="color: ${aspect.color}">
                <i class="${aspect.icon}"></i>
            </div>
            <div class="aspect-content">
                <h4>${aspect.title}</h4>
                <p>${aspect.description}</p>
                <div class="aspect-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%; background-color: ${aspect.color}"></div>
                    </div>
                    <span class="progress-text">${progress.completed}/${progress.total} fields completed</span>
                </div>
            </div>
            <div class="aspect-arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
        `;
        
        aspectsGrid.appendChild(aspectCard);
    });
}

// Generate form for specific aspect
function generateAspectForm(video, aspectKey) {
    const formContainer = document.getElementById('aspect-form-container');
    const aspectData = video[aspectKey] || {};
    
    // Store current aspect for saving BEFORE creating form fields
    window.currentEditingAspect = aspectKey;
    
    formContainer.innerHTML = '';
    
    // Create form elements based on aspect data
    Object.keys(aspectData).forEach(fieldKey => {
        const fieldValue = aspectData[fieldKey];
        const formGroup = createFormField(fieldKey, fieldValue);
        formContainer.appendChild(formGroup);
    });
}

// Create individual form field
function createFormField(fieldKey, fieldValue) {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    
    const label = document.createElement('label');
    const isCompleted = isFieldCompleted(fieldValue, fieldKey);
    
    // Add completion status to label
    const statusIndicator = document.createElement('span');
    statusIndicator.className = `field-status ${isCompleted ? 'completed' : 'pending'}`;
    statusIndicator.innerHTML = isCompleted ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-clock"></i>';
    
    const labelText = document.createElement('span');
    labelText.textContent = formatFieldLabel(fieldKey);
    
    label.appendChild(statusIndicator);
    label.appendChild(labelText);
    label.className = isCompleted ? 'label-completed' : 'label-pending';
    
    // Check if we need AI generation button
    const needsAiButton = shouldAddAiButton(fieldKey);
    
    let input;
    
    if (Array.isArray(fieldValue)) {
        // Handle arrays as comma-separated text
        input = document.createElement('textarea');
        input.value = fieldValue.join(', ');
        input.rows = 3;
    } else if (typeof fieldValue === 'object' && fieldValue !== null) {
        // Handle objects as JSON text
        input = document.createElement('textarea');
        input.value = JSON.stringify(fieldValue, null, 2);
        input.rows = 4;
    } else if (typeof fieldValue === 'string' && fieldValue.length > 100) {
        // Long strings as textarea
        input = document.createElement('textarea');
        input.value = fieldValue;
        input.rows = 4;
    } else if (fieldKey.toLowerCase().includes('date')) {
        // Date fields get date picker
        input = document.createElement('input');
        input.type = 'datetime-local';
        // Convert ISO date string to datetime-local format if needed
        if (fieldValue && typeof fieldValue === 'string') {
            // Remove 'Z' and ensure proper format for datetime-local
            const dateValue = fieldValue.replace('Z', '').replace(/\+.*$/, '');
            input.value = dateValue;
        }
    } else if (typeof fieldValue === 'boolean' || isBooleanField(fieldKey)) {
        // Boolean fields get Yes/No radio buttons
        const radioContainer = document.createElement('div');
        radioContainer.className = 'radio-group';
        
        const yesOption = createRadioOption(fieldKey, 'yes', 'Yes', fieldValue === true);
        const noOption = createRadioOption(fieldKey, 'no', 'No', fieldValue === false);
        
        radioContainer.appendChild(yesOption);
        radioContainer.appendChild(noOption);
        
        // Set name attribute on container for form processing
        radioContainer.setAttribute('data-field', fieldKey);
        input = radioContainer;
    } else {
        // Regular input
        input = document.createElement('input');
        input.type = 'text';
        input.value = fieldValue || '';
    }
    
    input.name = fieldKey;
    input.className = 'form-input';
    
    formGroup.appendChild(label);
    
    // Create input container with AI button if needed
    if (needsAiButton) {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container-with-ai';
        
        inputContainer.appendChild(input);
        
        // Add AI generation button
        const aiButton = document.createElement('button');
        aiButton.type = 'button';
        aiButton.className = 'ai-generate-btn';
        aiButton.innerHTML = '<i class="fas fa-magic"></i>';
        aiButton.title = 'Generate with AI';
        aiButton.onclick = () => generateWithAI(fieldKey, input);
        
        inputContainer.appendChild(aiButton);
        formGroup.appendChild(inputContainer);
    } else {
        formGroup.appendChild(input);
    }
    
    return formGroup;
}

// Check if field should have AI generation button (Definition aspect only, except requestThumbnailGeneration)
function shouldAddAiButton(fieldKey) {
    // Only for Definition aspect fields
    const definitionFields = [
        'title', 'description', 'highlight', 'tags', 'descriptionTags', 
        'tweetText', 'animationsScript'
    ];
    
    // Check if we're currently editing a Definition aspect
    const isDefineAspect = window.currentEditingAspect === 'define';
    
    return isDefineAspect && definitionFields.includes(fieldKey);
}

// Check if a field should be treated as boolean
function isBooleanField(fieldKey) {
    const booleanPatterns = [
        /Done$/i,           // codeDone, movieDone, etc.
        /^request/i,        // requestEdit, requestThumbnailGeneration
        /Sent$/i,           // blueSkyPostSent, linkedInPostSent, etc.
        /Created$/i,        // youTubeHighlightCreated
        /Added$/i,          // youTubePinnedCommentAdded
        /^upload/i,         // uploadToYouTube
        /^create/i,         // createHugoPost
        /^replied/i,        // repliedToYouTubeComments
        /^notified/i        // notifiedSponsors
    ];
    
    return booleanPatterns.some(pattern => pattern.test(fieldKey));
}

// Check if a field has meaningful completion status
function isFieldCompleted(fieldValue, fieldKey = '') {
    if (fieldValue === null || fieldValue === undefined) {
        return false;
    }
    
    if (typeof fieldValue === 'boolean') {
        // For "Done" fields, false means pending (not completed yet)
        if (fieldKey.toLowerCase().includes('done')) {
            return fieldValue === true;
        }
        // For other boolean fields, any value (true/false) is considered addressed
        return true;
    }
    
    if (typeof fieldValue === 'string') {
        return fieldValue.trim().length > 0;
    }
    
    if (Array.isArray(fieldValue)) {
        return fieldValue.length > 0 && fieldValue.some(item => 
            typeof item === 'string' ? item.trim().length > 0 : item != null
        );
    }
    
    if (typeof fieldValue === 'object') {
        return Object.keys(fieldValue).length > 0;
    }
    
    return false;
}

// Generate content with AI
async function generateWithAI(fieldKey, inputElement) {
    const aiButton = inputElement.parentElement.querySelector('.ai-generate-btn');
    const originalContent = aiButton.innerHTML;
    
    // Show loading state
    aiButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    aiButton.disabled = true;
    
    try {
        // Get context from current video
        const video = window.currentEditingVideo;
        const context = {
            videoTitle: video?.title || '',
            originalDescription: video?.init?.originalDescription || '',
            topic: video?.init?.topic || ''
        };
        
        // Simulate AI generation call
        const generatedContent = await mockAiGeneration(fieldKey, context);
        
        // Update the input field
        if (inputElement.tagName === 'TEXTAREA') {
            inputElement.value = generatedContent;
        } else if (inputElement.type === 'text') {
            inputElement.value = generatedContent;
        }
        
        // Trigger change event to update any listeners
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
        
        showNotification(`AI generated content for ${formatFieldLabel(fieldKey)}`, 'success');
        
    } catch (error) {
        console.error('AI generation failed:', error);
        showNotification('AI generation failed. Please try again.', 'error');
    } finally {
        // Restore button state
        aiButton.innerHTML = originalContent;
        aiButton.disabled = false;
    }
}

// Mock AI generation function
async function mockAiGeneration(fieldKey, context) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiResponses = {
        title: [
            `${context.topic ? context.topic + ': ' : ''}Complete Guide with Examples`,
            `Mastering ${context.topic || 'This Topic'} - Advanced Tutorial`,
            `${context.topic || 'Essential'} Best Practices for Developers`,
            `Ultimate ${context.topic || 'Guide'}: From Basics to Advanced`
        ],
        description: [
            `In this comprehensive video, we dive deep into ${context.topic || 'the topic'} and explore all the essential concepts you need to know. Perfect for both beginners and experienced developers looking to enhance their skills.`,
            `Learn everything about ${context.topic || 'this subject'} in this detailed tutorial. We'll cover practical examples, common pitfalls, and best practices to help you master these concepts.`,
            `This video provides a complete overview of ${context.topic || 'the subject matter'}, including step-by-step explanations and real-world applications. Great for anyone looking to expand their knowledge.`
        ],
        highlight: [
            `🚀 Key insight: ${context.topic || 'This approach'} dramatically improves development efficiency`,
            `💡 Pro tip: Master this ${context.topic || 'technique'} to level up your coding skills`,
            `⚡ Game changer: This ${context.topic || 'method'} will transform how you work`,
            `🎯 Essential: Every developer should know this ${context.topic || 'concept'}`
        ],
        tags: [
            `programming, coding, tutorial, ${context.topic || 'development'}, software, tech, learning`,
            `developer, coding tutorial, ${context.topic || 'programming'}, software development, tech education`,
            `programming tutorial, ${context.topic || 'coding'}, software engineering, tech skills, development`
        ],
        descriptionTags: [
            `#programming #coding #tutorial #${(context.topic || 'development').replace(/\s+/g, '')} #software #tech #learning #developer`,
            `#coding #tutorial #${(context.topic || 'programming').replace(/\s+/g, '')} #softwaredevelopment #tech #education #programming`,
            `#development #coding #${(context.topic || 'programming').replace(/\s+/g, '')} #softwareengineering #tech #skills #tutorial`
        ],
        tweetText: [
            `🚀 New video: ${context.topic || 'Essential development concepts'} explained! Perfect for developers looking to level up their skills. What's your biggest challenge with this topic? 🤔`,
            `💡 Just dropped: Complete guide to ${context.topic || 'important development topics'}! Share your thoughts and let me know what you'd like to see next 👇`,
            `⚡ Latest tutorial: Deep dive into ${context.topic || 'key programming concepts'}! Have you tried this approach? Let's discuss in the comments 💬`
        ],
        animationsScript: [
            `Scene 1: Introduction animation with title card\nScene 2: Overview diagram of main concepts\nScene 3: Code editor with syntax highlighting\nScene 4: Step-by-step implementation walkthrough\nScene 5: Common mistakes and solutions\nScene 6: Summary with key takeaways`,
            `Opening: Animated logo and topic introduction\nMain: Split-screen code demonstration\nHighlight: Important concepts with callout animations\nTransition: Smooth slides between code sections\nClosing: Subscribe reminder with animated elements`,
            `Intro: Dynamic text animation introducing ${context.topic || 'the topic'}\nDemo: Screen recording with highlighted code sections\nExplanation: Diagram animations showing relationships\nSummary: Animated checklist of covered topics\nOutro: Call-to-action with engaging visuals`
        ]
    };
    
    const responses = aiResponses[fieldKey] || [`Generated content for ${fieldKey}`];
    return responses[Math.floor(Math.random() * responses.length)];
}

// Create a radio button option
function createRadioOption(fieldName, value, label, isChecked) {
    const optionContainer = document.createElement('div');
    optionContainer.className = 'radio-option';
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = fieldName;
    radio.value = value;
    radio.checked = isChecked;
    radio.id = `${fieldName}_${value}`;
    
    const labelElement = document.createElement('label');
    labelElement.htmlFor = radio.id;
    labelElement.textContent = label;
    labelElement.className = 'radio-label';
    
    optionContainer.appendChild(radio);
    optionContainer.appendChild(labelElement);
    
    return optionContainer;
}

// Format field key into readable label
function formatFieldLabel(fieldKey) {
    return fieldKey
        .replace(/URL/g, 'Url') // Handle URL specially first
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/Url/g, 'URL'); // Convert back to uppercase URL
}

// Initialize save button functionality
function initializeEditModalSaveButton() {
    const saveBtn = document.getElementById('save-aspect-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveAspectChanges);
    }
}

// Save aspect changes
function saveAspectChanges() {
    const video = window.currentEditingVideo;
    const aspectKey = window.currentEditingAspect;
    
    if (!video || !aspectKey) {
        showNotification('Error: No video or aspect selected', 'error');
        return;
    }
    
    // Collect form data
    const formContainer = document.getElementById('aspect-form-container');
    const inputs = formContainer.querySelectorAll('.form-input');
    const radioGroups = formContainer.querySelectorAll('.radio-group');
    const updatedData = {};
    
    // Handle regular inputs
    inputs.forEach(input => {
        const fieldKey = input.name;
        let value = input.value.trim();
        
        // Parse different data types
        if (input.tagName === 'TEXTAREA') {
            // Try to parse as JSON for objects
            if (value.startsWith('{') || value.startsWith('[')) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    // If not valid JSON, treat as array (comma-separated)
                    if (value.includes(',')) {
                        value = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
                    }
                }
            } else if (value.includes(',')) {
                // Comma-separated values as array
                value = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
            }
        }
        
        updatedData[fieldKey] = value;
    });
    
    // Handle radio button groups (boolean fields)
    radioGroups.forEach(radioGroup => {
        const fieldKey = radioGroup.getAttribute('data-field');
        const selectedRadio = radioGroup.querySelector('input[type="radio"]:checked');
        if (selectedRadio) {
            updatedData[fieldKey] = selectedRadio.value === 'yes';
        }
    });
    
    // Update the mock data
    MOCK_VIDEO_DATA[video.name][aspectKey] = updatedData;
    
    // Update the current video object
    window.currentEditingVideo[aspectKey] = updatedData;
    
    // Show success message and return to aspect selection
    showNotification(`${formatFieldLabel(aspectKey)} updated successfully!`, 'success');
    
    // Refresh aspect cards to show updated progress
    generateAspectCards(window.currentEditingVideo);
    
    // Go back to aspect selection
    showAspectSelection();
}

// Make functions globally available
window.closeEditModal = closeEditModal;
window.showAspectSelection = showAspectSelection;
window.showAspectEdit = showAspectEdit;

// ===== END MOCK DATA =====

document.addEventListener('DOMContentLoaded', function() {
    initializeMockup();
    initializeEditModalSaveButton();
});

function initializeMockup() {
    // Initialize tab switching
    setupTabSwitching();
    
    // Initialize interactive elements
    setupInteractiveElements();
    
    // Initialize form handling
    setupFormHandling();
    
    // Initialize demo functionality
    setupDemoFeatures();
    
    // Initialize progress videos interactions
    setupProgressVideos();

    // Setup header dropdowns
    setupHeaderDropdowns();
}

// Tab Switching Functionality
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const viewId = this.onclick.toString().match(/'([^']+)'/)[1];
            showView(viewId);
        });
    });
}

function showView(viewId) {
    // Hide all views
    document.querySelectorAll('.mockup-view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // Activate corresponding tab
    const activeTab = document.querySelector(`[onclick="showView('${viewId}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// Interactive Elements Setup
function setupInteractiveElements() {
    // Phase filter buttons
    setupPhaseFilters();
    
    // Video card actions
    setupVideoCardActions();
    
    // Progress simulation
    setupProgressSimulation();
}

function setupHeaderDropdowns() {
    const notificationsBtn = document.getElementById('notifications-btn');
    const notificationsPanel = document.getElementById('notifications-panel');
    const userAvatarBtn = document.getElementById('user-avatar-btn');
    const userProfileDropdown = document.getElementById('user-profile-dropdown');

    if (notificationsBtn && notificationsPanel) {
        notificationsBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from bubbling to document
            notificationsPanel.style.display = notificationsPanel.style.display === 'block' ? 'none' : 'block';
            if (userProfileDropdown) userProfileDropdown.style.display = 'none'; // Close other dropdown
        });
    }

    if (userAvatarBtn && userProfileDropdown) {
        userAvatarBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from bubbling to document
            userProfileDropdown.style.display = userProfileDropdown.style.display === 'block' ? 'none' : 'block';
            if (notificationsPanel) notificationsPanel.style.display = 'none'; // Close other dropdown
        });
    }

    // Close dropdowns if clicked outside
    document.addEventListener('click', (event) => {
        if (notificationsPanel && !notificationsPanel.contains(event.target) && event.target !== notificationsBtn) {
            notificationsPanel.style.display = 'none';
        }
        if (userProfileDropdown && !userProfileDropdown.contains(event.target) && event.target !== userAvatarBtn) {
            userProfileDropdown.style.display = 'none';
        }
    });
}


function setupPhaseFilters() {
    const phaseButtons = document.querySelectorAll('.phase-btn');
    
    phaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all phase buttons
            phaseButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Simulate filtering (in real app, this would filter the video list)
            showFilterFeedback(this.textContent);
        });
    });
}

function setupVideoCardActions() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        // Edit button
        const editBtn = card.querySelector('.btn-edit');
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                console.log('Edit button clicked - NEW FUNCTIONALITY');
                const videoTitle = card.querySelector('h3').textContent;
                const videoName = getVideoNameFromTitle(videoTitle);
                console.log('Opening edit modal for:', videoName);
                openEditModal(videoName);
            });
        }
        
        // Delete button
        const deleteBtn = card.querySelector('.btn-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this video?')) {
                    card.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        card.remove();
                        showNotification('Video deleted successfully', 'success');
                    }, 300);
                }
            });
        }
        
        // Move button
        const moveBtn = card.querySelector('.btn-move');
        if (moveBtn) {
            moveBtn.addEventListener('click', function() {
                showMoveDialog(card.querySelector('h3').textContent);
            });
        }
    });
}

function setupProgressSimulation() {
    const checkboxes = document.querySelectorAll('.form-group input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateProgressBar();
        });
    });
}

// Form Handling
function setupFormHandling() {
    // Save button
    const saveButtons = document.querySelectorAll('.btn-save');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            simulateSave();
        });
    });
    
    // Create button
    const createButtons = document.querySelectorAll('.btn-create');
    createButtons.forEach(button => {
        button.addEventListener('click', function() {
            simulateCreateVideo();
        });
    });
    
    // Cancel buttons
    const cancelButtons = document.querySelectorAll('.btn-cancel');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            showView('dashboard');
            showNotification('Action cancelled', 'info');
        });
    });
    
    // Action buttons on dashboard
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleDashboardAction(this.textContent);
        });
    });
}

// Demo Features
function setupDemoFeatures() {
    // Template cards
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            selectTemplate(this.querySelector('h4').textContent);
        });
    });
    
    // Add some dynamic stats updates
    setInterval(updateStats, 5000);
}

// Progress Videos Setup
function setupProgressVideos() {
    // Make progress video cards clickable to edit
    const progressVideoCards = document.querySelectorAll('.progress-video-card');
    
    progressVideoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoTitle = this.querySelector('h3').textContent;
            showNotification(`Video editing coming soon for: ${videoTitle}`, 'info');
        });
        
        // Add hover effect cursor
        card.style.cursor = 'pointer';
    });
    
    // Simulate progress updates every 10 seconds
    setInterval(updateProgressVideos, 10000);
}

function updateProgressVideos() {
    const progressBars = document.querySelectorAll('.progress-fill-mini');
    const progressIndicators = document.querySelectorAll('.progress-indicator');
    
    progressBars.forEach((bar, index) => {
        const currentWidth = parseInt(bar.style.width);
        const indicator = progressIndicators[index];
        
        // Small chance of progress update
        if (Math.random() > 0.7) {
            const newWidth = Math.min(100, currentWidth + Math.floor(Math.random() * 10) + 1);
            bar.style.width = newWidth + '%';
            
            // Update the task count based on phase
            const currentText = indicator.textContent;
            const match = currentText.match(/(\d+)\/(\d+)/);
            if (match) {
                const completed = parseInt(match[1]);
                const total = parseInt(match[2]);
                const newCompleted = Math.min(total, Math.ceil((newWidth / 100) * total));
                indicator.textContent = `${newCompleted}/${total} tasks completed`;
            }
            
            // Add subtle animation
            bar.parentElement.parentElement.style.transform = 'scale(1.02)';
            setTimeout(() => {
                bar.parentElement.parentElement.style.transform = 'scale(1)';
            }, 200);
        }
    });
}

// Utility Functions
function showFilterFeedback(filterText) {
    showNotification(`Filtering by: ${filterText}`, 'info');
}

function showMoveDialog(videoTitle) {
    const phases = ['Initial', 'Work', 'Definition', 'Post-Production', 'Publishing', 'Post-Publish'];
    const selectedPhase = prompt('Move "' + videoTitle + '" to which phase?\n\n' + phases.join('\n'));
    
    if (selectedPhase && phases.includes(selectedPhase)) {
        showNotification(`Video moved to ${selectedPhase} phase`, 'success');
    }
}

function updateProgressBar() {
    const checkboxes = document.querySelectorAll('.form-group input[type="checkbox"]');
    const checkedCount = document.querySelectorAll('.form-group input[type="checkbox"]:checked').length;
    const totalCount = checkboxes.length;
    const percentage = Math.round((checkedCount / totalCount) * 100);
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
        progressFill.style.width = percentage + '%';
        progressText.textContent = `${checkedCount} of ${totalCount} tasks completed (${percentage}%)`;
    }
}

function simulateSave() {
    showNotification('Saving changes...', 'info');
    
    // Simulate API call delay
    setTimeout(() => {
        showNotification('Changes saved successfully!', 'success');
        updateProgressBar();
    }, 1000);
}

function simulateCreateVideo() {
    const videoName = document.querySelector('input[placeholder="Enter video name..."]').value;
    
    if (!videoName.trim()) {
        showNotification('Please enter a video name', 'error');
        return;
    }
    
    showNotification('Creating video...', 'info');
    
    // Simulate API call delay
    setTimeout(() => {
        showNotification(`Video "${videoName}" created successfully!`, 'success');
        showView('video-list');
        
        // Clear the form
        document.querySelector('input[placeholder="Enter video name..."]').value = '';
    }, 1500);
}

function handleDashboardAction(actionText) {
    switch(actionText) {
        case 'Create New Video':
            showView('create-video');
            break;
        case 'View All Videos':
            showView('video-list');
            break;
        case 'Videos in Work Phase':
            showView('video-list');
            // Simulate clicking on Work phase filter
            setTimeout(() => {
                const workPhaseBtn = document.querySelector('.phase-btn:nth-child(3)');
                if (workPhaseBtn) workPhaseBtn.click();
            }, 100);
            break;
        case 'Videos in Post-Production':
            showView('video-list');
            // Simulate clicking on Post-Production phase filter
            setTimeout(() => {
                const postProdBtn = document.querySelector('.phase-btn:nth-child(5)');
                if (postProdBtn) postProdBtn.click();
            }, 100);
            break;
        default:
            showNotification(`Action: ${actionText}`, 'info');
    }
}

function selectTemplate(templateName) {
    showNotification(`Template selected: ${templateName}`, 'success');
    
    // Simulate pre-filling form based on template
    const videoNameInput = document.querySelector('input[placeholder="Enter video name..."]');
    if (videoNameInput) {
        switch(templateName) {
            case 'Tutorial Template':
                videoNameInput.value = 'New Tutorial - ';
                break;
            case 'Quick Demo Template':
                videoNameInput.value = 'Demo: ';
                break;
            case 'Sponsored Content Template':
                videoNameInput.value = 'Sponsored: ';
                break;
        }
        videoNameInput.focus();
    }
}

function updateStats() {
    // Simulate real-time stats updates
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length > 0) {
        // Randomly update one of the stats
        const randomCard = statCards[Math.floor(Math.random() * statCards.length)];
        const currentText = randomCard.textContent;
        const currentNumber = parseInt(currentText.match(/\d+/)[0]);
        
        // Small random change
        const change = Math.random() > 0.5 ? 1 : -1;
        const newNumber = Math.max(0, currentNumber + change);
        
        randomCard.textContent = currentText.replace(/\d+/, newNumber);
        
        // Add a subtle animation
        randomCard.style.transform = 'scale(1.05)';
        setTimeout(() => {
            randomCard.style.transform = 'scale(1)';
        }, 200);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f59e0b';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
    
    .mockup-view {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .video-card, .stat-card, .template-card {
        transition: all 0.2s ease;
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style);
