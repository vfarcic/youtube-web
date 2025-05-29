// YouTube Automation Web Frontend Mockup JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeMockup();
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
    
    // Edit tabs
    setupEditTabs();
    
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
                showView('video-edit');
                showNotification('Editing video: ' + card.querySelector('h3').textContent, 'info');
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

function setupEditTabs() {
    const editTabs = document.querySelectorAll('.edit-tab');
    
    editTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all edit tabs
            editTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Simulate loading different phase content
            showPhaseContent(this.textContent);
        });
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
            showView('video-edit');
            showNotification(`Editing: ${videoTitle}`, 'info');
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

function showPhaseContent(phaseTitle) {
    showNotification(`Loading ${phaseTitle} phase content...`, 'info');
    
    // Simulate loading different form fields based on phase
    const formPreview = document.querySelector('.form-preview');
    if (formPreview) {
        formPreview.style.opacity = '0.5';
        setTimeout(() => {
            formPreview.style.opacity = '1';
        }, 500);
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
