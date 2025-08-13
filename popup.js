// YouTube Clean - Popup Script
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    const buttonText = document.getElementById('buttonText');
    const status = document.getElementById('status');
    
    // Get current status
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        
        if (currentTab.url.includes('youtube.com')) {
            chrome.tabs.sendMessage(currentTab.id, { action: 'getStatus' }, function(response) {
                if (chrome.runtime.lastError) {
                    status.textContent = 'Please reload YouTube page';
                    toggleButton.disabled = true;
                    return;
                }
                
                if (response && response.enabled !== undefined) {
                    updateUI(response.enabled);
                } else {
                    status.textContent = 'Please reload YouTube page';
                    toggleButton.disabled = true;
                }
            });
        } else {
            status.textContent = 'Please visit YouTube';
            toggleButton.disabled = true;
            buttonText.textContent = 'Visit YouTube';
        }
    });
    
    // Toggle functionality
    toggleButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const currentTab = tabs[0];
            
            if (!currentTab.url.includes('youtube.com')) {
                chrome.tabs.create({ url: 'https://www.youtube.com' });
                return;
            }
            
            chrome.tabs.sendMessage(currentTab.id, { action: 'toggle' }, function(response) {
                if (chrome.runtime.lastError) {
                    status.textContent = 'Error: Please reload YouTube page';
                    return;
                }
                
                if (response && response.enabled !== undefined) {
                    updateUI(response.enabled);
                    
                    // Refresh the page to apply changes
                    setTimeout(() => {
                        chrome.tabs.reload(currentTab.id);
                    }, 500);
                } else {
                    status.textContent = 'Error occurred. Please try again.';
                }
            });
        });
    });
    
    function updateUI(enabled) {
        if (enabled) {
            buttonText.textContent = 'Disable';
            toggleButton.classList.add('disabled');
            toggleButton.classList.remove('enabled');
            status.textContent = 'YouTube Clean is ON';
        } else {
            buttonText.textContent = 'Enable';
            toggleButton.classList.add('enabled');
            toggleButton.classList.remove('disabled');
            status.textContent = 'YouTube Clean is OFF';
        }
        
        toggleButton.disabled = false;
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    if (tab.url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
    } else {
        chrome.tabs.create({ url: 'https://www.youtube.com' });
    }
});
