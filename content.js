// YouTube Clean - Content Script
// Removes advertisements and suggestions from YouTube

class YouTubeClean {
    constructor() {
        this.observer = null;
        this.isEnabled = true;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('YouTube Clean: Starting...');
        
        // Check what type of page we're on
        if (window.location.href.includes('/watch?v=')) {
            // Video watch page - show only video player
            document.body.setAttribute('data-youtube-clean-page', 'watch');
            this.createVideoOnlyExperience();
        } else if (window.location.href.includes('/results?search_query=')) {
            // Search results page
            document.body.setAttribute('data-youtube-clean-page', 'results');
            
            // Remove the search overlay immediately
            const searchOverlay = document.querySelector('.youtube-clean-search-container');
            if (searchOverlay) {
                searchOverlay.remove();
            }
            
            this.removeAds();
            this.removeSuggestions();
            this.ensureSearchResultsVisible();
            
            // Run visibility check multiple times to ensure results show
            setTimeout(() => this.ensureSearchResultsVisible(), 500);
            setTimeout(() => this.ensureSearchResultsVisible(), 1500);
            setTimeout(() => this.ensureSearchResultsVisible(), 3000);
        } else {
            // Landing/home page - show centered search
            document.body.setAttribute('data-youtube-clean-page', 'home');
            this.ensureSearchBarVisible();
        }
        
        // Set up observer for dynamic content
        this.setupObserver();
        
        // Run cleanup periodically
        setInterval(() => {
            if (this.isEnabled) {
                if (window.location.href.includes('/watch?v=')) {
                    document.body.setAttribute('data-youtube-clean-page', 'watch');
                    this.createVideoOnlyExperience();
                } else if (window.location.href.includes('/results?search_query=')) {
                    document.body.setAttribute('data-youtube-clean-page', 'results');
                    
                    // Remove search overlay
                    const searchOverlay = document.querySelector('.youtube-clean-search-container');
                    if (searchOverlay) {
                        searchOverlay.remove();
                    }
                    
                    this.removeAds();
                    this.removeSuggestions();
                    this.ensureSearchResultsVisible();
                } else {
                    document.body.setAttribute('data-youtube-clean-page', 'home');
                    this.ensureSearchBarVisible();
                }
            }
        }, 1000);
    }

    createVideoOnlyExperience() {
        // Hide the centered search bar
        this.hideCenteredSearchBar();
        
        // Remove all ads and suggestions
        this.removeAds();
        this.removeSuggestions();
        
        // Create video-only layout
        this.setupVideoOnlyLayout();
        
        // Remove end screen elements continuously
        this.removeEndScreenElements();
        
        // Optimize video display
        this.optimizeVideoDisplay();
    }

    optimizeVideoDisplay() {
        // Continuously ensure video is optimally displayed
        setInterval(() => {
            if (!window.location.href.includes('/watch?v=')) return;

            // Find and optimize video element
            const video = document.querySelector('video, .html5-main-video');
            if (video) {
                video.style.width = '100% !important';
                video.style.height = '100% !important';
                video.style.maxWidth = '100% !important';
                video.style.maxHeight = '100% !important';
                video.style.objectFit = 'contain !important';
            }

            // Find and optimize player container
            const player = document.querySelector('#movie_player, #player-container, #player');
            if (player) {
                player.style.width = '100% !important';
                player.style.height = '100vh !important';
                player.style.maxWidth = '100vw !important';
                player.style.maxHeight = '100vh !important';
            }

            // Ensure theater mode is maintained
            const playerContainer = document.querySelector('#movie_player');
            if (playerContainer && !playerContainer.classList.contains('ytp-fullscreen')) {
                // Force theater-like mode without actually triggering theater mode
                playerContainer.style.width = '100% !important';
                playerContainer.style.height = '100vh !important';
            }

        }, 2000); // Check every 2 seconds
    }

    setupVideoOnlyLayout() {
        // Hide everything except the video player and essential controls
        const elementsToHide = [
            '#secondary', // Right sidebar
            '#secondary.ytd-watch-flexy',
            '#related', // Related videos
            '#guide', // Left navigation
            '#masthead', // Header
            'ytd-masthead',
            '#comments', // Comments section
            'ytd-comments',
            '#meta', // Video metadata
            '#meta.ytd-watch-flexy',
            'ytd-video-secondary-info-renderer', // Video description
            '#description',
            '.ytd-video-secondary-info-renderer',
            '#info', // Video info
            '#info.ytd-watch-flexy',
            'ytd-video-primary-info-renderer #container',
            '#top-row', // Title and view count
            '#owner', // Channel info
            '#upload-info', // Upload date
            '#subscribe-button',
            '#notification-preference-button',
            '.ytd-video-owner-renderer',
            'ytd-video-owner-renderer',
            '#above-the-fold', // Video details section
            '#below-the-fold'
        ];

        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.style.display = 'none !important';
                    element.style.visibility = 'hidden !important';
                }
            });
        });

        // Ensure video player is visible and optimally sized
        const videoPlayer = document.querySelector('#movie_player, #player-container, #player');
        if (videoPlayer) {
            videoPlayer.style.display = 'block !important';
            videoPlayer.style.visibility = 'visible !important';
            videoPlayer.style.margin = '0 auto !important';
            videoPlayer.style.maxWidth = '100vw !important';
            videoPlayer.style.width = '100% !important';
            videoPlayer.style.height = '100vh !important';
            videoPlayer.style.maxHeight = '100vh !important';
            videoPlayer.style.position = 'relative !important';
            videoPlayer.style.zIndex = '1000 !important';
        }

        // Optimize the actual video element
        const videoElement = document.querySelector('video, .html5-main-video');
        if (videoElement) {
            videoElement.style.width = '100% !important';
            videoElement.style.height = '100% !important';
            videoElement.style.maxWidth = '100% !important';
            videoElement.style.maxHeight = '100% !important';
            videoElement.style.objectFit = 'contain !important'; // Maintain aspect ratio
        }

        // Style the primary container for video-only view
        const primaryContainer = document.querySelector('#primary, #primary.ytd-watch-flexy');
        if (primaryContainer) {
            primaryContainer.style.width = '100vw !important';
            primaryContainer.style.maxWidth = '100vw !important';
            primaryContainer.style.margin = '0 !important';
            primaryContainer.style.padding = '0 !important';
            primaryContainer.style.display = 'flex !important';
            primaryContainer.style.justifyContent = 'center !important';
            primaryContainer.style.alignItems = 'center !important';
            primaryContainer.style.minHeight = '100vh !important';
            primaryContainer.style.height = '100vh !important';
            primaryContainer.style.background = '#000 !important';
            primaryContainer.style.overflow = 'hidden !important';
        }

        // Optimize page manager and app container
        const pageManager = document.querySelector('ytd-page-manager');
        if (pageManager) {
            pageManager.style.marginLeft = '0 !important';
            pageManager.style.marginRight = '0 !important';
            pageManager.style.marginTop = '0 !important';
            pageManager.style.padding = '0 !important';
            pageManager.style.width = '100vw !important';
            pageManager.style.height = '100vh !important';
            pageManager.style.overflow = 'hidden !important';
        }

        const appContainer = document.querySelector('ytd-app');
        if (appContainer) {
            appContainer.style.margin = '0 !important';
            appContainer.style.padding = '0 !important';
            appContainer.style.width = '100vw !important';
            appContainer.style.height = '100vh !important';
            appContainer.style.overflow = 'hidden !important';
        }

        // Set body and html for full screen experience
        document.body.style.margin = '0 !important';
        document.body.style.padding = '0 !important';
        document.body.style.overflow = 'hidden !important';
        document.body.style.background = '#000 !important';
        document.body.style.width = '100vw !important';
        document.body.style.height = '100vh !important';

        document.documentElement.style.margin = '0 !important';
        document.documentElement.style.padding = '0 !important';
        document.documentElement.style.overflow = 'hidden !important';
        document.documentElement.style.background = '#000 !important';
        document.documentElement.style.width = '100vw !important';
        document.documentElement.style.height = '100vh !important';

        console.log('YouTube Clean: Created full-screen video-only layout');
    }

    removeEndScreenElements() {
        // Remove end screen suggestions and overlays
        const endScreenSelectors = [
            '.ytp-ce-element', // End screen elements
            '.ytp-cards-teaser', // Cards teaser
            '.ytp-endscreen-content', // End screen content
            '.ytp-pause-overlay', // Pause screen overlay
            '.ytp-scroll-min', // Scroll suggestions
            '.ytp-suggested-action', // Suggested actions
            '.ytp-videowall-still', // Video wall
            '.ytp-show-tiles', // Tile suggestions
            '.ytp-autonav-endscreen-upnext-container', // Up next container
            '.ytp-autonav-endscreen-upnext-thumbnail', // Up next thumbnail
            '.ytp-ce-covering-overlay', // Covering overlay
            '.ytp-ce-expanding-overlay', // Expanding overlay
            '.ytp-ce-element-shadow', // Element shadows
            '.ytp-ce-channel', // Channel suggestions
            '.ytp-ce-video', // Video suggestions
            '.ytp-ce-playlist', // Playlist suggestions
            '.html5-endscreen' // HTML5 end screen
        ];

        endScreenSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.style.display = 'none !important';
                    element.style.visibility = 'hidden !important';
                    element.style.opacity = '0 !important';
                    element.remove(); // Completely remove the element
                }
            });
        });

        // Disable autoplay by hiding autoplay toggle
        const autoplayToggle = document.querySelector('.ytp-autonav-toggle-button');
        if (autoplayToggle) {
            autoplayToggle.style.display = 'none !important';
        }

        // Remove annotations
        const annotations = document.querySelectorAll('.annotation, .iv-click-target');
        annotations.forEach(annotation => {
            annotation.style.display = 'none !important';
        });
    }

    setupObserver() {
        this.observer = new MutationObserver((mutations) => {
            if (!this.isEnabled) return;
            
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    if (window.location.href.includes('/watch?v=')) {
                        this.createVideoOnlyExperience();
                    } else if (window.location.href.includes('/results?search_query=')) {
                        this.removeAds();
                        this.removeSuggestions();
                        this.hideCenteredSearchBar();
                        this.ensureSearchResultsVisible();
                    } else {
                        this.ensureSearchBarVisible();
                    }
                }
            });
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    removeAds() {
        // Video ads
        const adSelectors = [
            '.video-ads',
            '.ytp-ad-module',
            '.ytp-ad-overlay-container',
            '.ytp-ad-text-overlay',
            '.ytp-ad-player-overlay',
            '.ad-showing',
            '[class*="ad-"]',
            '[id*="ad-"]',
            '.masthead-ad-control',
            '#player-ads',
            '.ytd-display-ad-renderer',
            '.ytd-promoted-sparkles-web-renderer',
            '.ytd-ad-slot-renderer',
            '.ytd-in-feed-ad-layout-renderer',
            '.ytd-banner-promo-renderer',
            '.ytp-ad-skip-button-modern',
            '.ytp-ad-button',
            '.ytp-suggested-action',
            'ytd-promoted-video-renderer',
            'ytd-compact-promoted-video-renderer'
        ];

        adSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.style.display !== 'none') {
                    element.style.display = 'none !important';
                    console.log('YouTube Clean: Removed ad element:', selector);
                }
            });
        });

        // Remove YouTube Premium ads
        const premiumAds = document.querySelectorAll('[href*="premium"]');
        premiumAds.forEach(ad => {
            const container = ad.closest('ytd-display-ad-renderer, .ytd-banner-promo-renderer');
            if (container) {
                container.style.display = 'none !important';
            }
        });
    }

    removeSuggestions() {
        // Homepage suggestions and trending
        const suggestionSelectors = [
            '#contents.ytd-rich-grid-renderer',
            'ytd-rich-grid-renderer',
            '#dismissible.ytd-rich-grid-media',
            '.ytd-rich-grid-media',
            '#contents.ytd-section-list-renderer',
            '.ytd-shelf-renderer',
            '#contents.ytd-expanded-shelf-contents-renderer',
            'ytd-video-primary-info-renderer #top-row',
            // Complete sidebar removal (right side)
            '#secondary',
            '#secondary.ytd-watch-flexy',
            '#secondary-inner',
            '#related',
            'ytd-watch-next-secondary-results-renderer',
            'ytd-compact-video-renderer',
            'ytd-continuation-item-renderer',
            'ytd-item-section-renderer',
            'ytd-shelf-renderer',
            '#watch-sidebar-live-chat',
            // Sidebar components
            '.ytd-watch-next-secondary-results-renderer',
            '.watch-sidebar',
            '.related-list-item',
            // Left navigation menu removal
            '#guide',
            '#guide-inner',
            '#guide-wrapper',
            'ytd-guide-renderer',
            '#guide-content',
            '.ytd-guide-renderer',
            'ytd-mini-guide-renderer',
            '#mini-guide',
            '.guide-container',
            // End screen suggestions
            '.ytp-ce-element',
            '.ytp-cards-teaser',
            '.ytp-endscreen-content',
            // Comments section (optional - uncomment if you want to hide comments)
            // '#comments',
            // 'ytd-comments',
            // Autoplay suggestions
            '.ytp-autonav-endscreen-upnext-container',
            '.ytp-autonav-endscreen-upnext-thumbnail',
            // Trending and explore
            'ytd-guide-entry-renderer[href="/feed/trending"]',
            'ytd-guide-entry-renderer[href="/feed/explore"]',
            // Shorts shelf
            'ytd-rich-shelf-renderer[is-shorts]',
            'ytd-reel-shelf-renderer'
        ];

        suggestionSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.style.display !== 'none') {
                    element.style.display = 'none !important';
                    console.log('YouTube Clean: Removed suggestion element:', selector);
                }
            });
        });

        // Force hide entire sidebar container (right side)
        const sidebarContainers = document.querySelectorAll('#secondary, #secondary.ytd-watch-flexy, .watch-sidebar, #watch-sidebar');
        sidebarContainers.forEach(sidebar => {
            if (sidebar) {
                sidebar.style.display = 'none !important';
                sidebar.style.visibility = 'hidden !important';
                sidebar.style.width = '0 !important';
                sidebar.style.height = '0 !important';
                console.log('YouTube Clean: Removed sidebar container');
            }
        });

        // Force hide left navigation menu
        const leftMenuContainers = document.querySelectorAll('#guide, #guide-inner, #guide-wrapper, ytd-guide-renderer, #guide-content, .ytd-guide-renderer, ytd-mini-guide-renderer, #mini-guide, .guide-container');
        leftMenuContainers.forEach(menu => {
            if (menu) {
                menu.style.display = 'none !important';
                menu.style.visibility = 'hidden !important';
                menu.style.width = '0 !important';
                menu.style.height = '0 !important';
                menu.style.transform = 'translateX(-100%) !important';
                console.log('YouTube Clean: Removed left navigation menu');
            }
        });

        // Expand primary content to full width when both sidebars are removed
        const primaryContent = document.querySelector('#primary.ytd-watch-flexy, #primary');
        if (primaryContent) {
            primaryContent.style.width = '100% !important';
            primaryContent.style.maxWidth = '100% !important';
            primaryContent.style.marginRight = '0 !important';
            primaryContent.style.marginLeft = '0 !important';
        }

        // Expand main page content container
        const pageManager = document.querySelector('ytd-page-manager, #page-manager');
        if (pageManager) {
            pageManager.style.marginLeft = '0 !important';
            pageManager.style.paddingLeft = '0 !important';
        }

        // Expand browse content
        const browseContainer = document.querySelector('ytd-browse, #browse');
        if (browseContainer) {
            browseContainer.style.marginLeft = '0 !important';
            browseContainer.style.paddingLeft = '0 !important';
        }

        // Limit search results to top 5 items
        if (window.location.href.includes('/results?search_query=')) {
            this.limitSearchResults();
        }

        // Hide specific sections by text content
        const textBasedHiding = [
            'Recommended for you',
            'Trending',
            'Up next',
            'More videos',
            'Related videos'
        ];

        textBasedHiding.forEach(text => {
            const xpath = `//h2[contains(text(), '${text}')]/../..`;
            const result = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            
            for (let i = 0; i < result.snapshotLength; i++) {
                const element = result.snapshotItem(i);
                if (element) {
                    element.style.display = 'none !important';
                }
            }
        });
    }

    limitSearchResults() {
        // Only apply to search results pages
        if (!window.location.href.includes('/results?search_query=')) {
            return;
        }

        // Wait a bit for content to load
        setTimeout(() => {
            // Find search results container
            const searchContainer = document.querySelector('#contents.ytd-section-list-renderer, ytd-section-list-renderer #contents');
            if (!searchContainer) {
                console.log('YouTube Clean: Search container not found');
                return;
            }

            // Get all video result items
            const videoResults = searchContainer.querySelectorAll('ytd-video-renderer');
            console.log(`YouTube Clean: Found ${videoResults.length} video results`);
            
            // Hide results after the 5th one and store them
            const hiddenResults = [];
            videoResults.forEach((result, index) => {
                if (index >= 5) {
                    result.style.display = 'none !important';
                    result.style.visibility = 'hidden !important';
                    result.setAttribute('data-youtube-clean-hidden', 'true');
                    hiddenResults.push(result);
                    console.log(`YouTube Clean: Hidden search result ${index + 1}`);
                } else {
                    // Ensure first 5 are visible
                    result.style.display = 'block !important';
                    result.style.visibility = 'visible !important';
                    result.setAttribute('data-youtube-clean-visible', 'true');
                    console.log(`YouTube Clean: Showing search result ${index + 1}`);
                }
            });

            // Hide additional sections that might appear in search results
            const sectionsToHide = [
                'ytd-shelf-renderer', // Related searches, People also watched
                'ytd-horizontal-card-list-renderer', // Horizontal video lists
                'ytd-radio-renderer', // Music/playlist results
                'ytd-playlist-renderer:nth-child(n+6)', // Playlists after 5th result
                'ytd-channel-renderer:nth-child(n+6)', // Channels after 5th result
                'ytd-movie-renderer', // Movie results
                'ytd-promoted-sparkles-web-renderer', // Promoted content
            ];

            sectionsToHide.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    element.style.display = 'none !important';
                });
            });

            // Hide pagination/load more buttons
            const loadMoreButtons = document.querySelectorAll('ytd-continuation-item-renderer, .load-more-button, [aria-label*="Load more"]');
            loadMoreButtons.forEach(button => {
                button.style.display = 'none !important';
                console.log('YouTube Clean: Hidden load more button');
            });

            // Add a visual indicator showing limited results with "Show More" option
            this.addSearchLimitIndicator(hiddenResults);
        }, 1000);
    }

    addSearchLimitIndicator(hiddenResults) {
        // Remove existing indicator
        const existingIndicator = document.querySelector('.youtube-clean-search-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const searchContainer = document.querySelector('#contents.ytd-section-list-renderer');
        if (!searchContainer) {
            return;
        }

        // Create indicator element with show more functionality
        const indicator = document.createElement('div');
        indicator.className = 'youtube-clean-search-indicator';
        
        const hiddenCount = hiddenResults.length;
        const showMoreText = hiddenCount > 0 ? `Show ${hiddenCount} more results` : 'No more results';
        
        indicator.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                margin: 20px 0;
                border-radius: 12px;
                text-align: center;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            ">
                <div style="margin-bottom: 10px;">
                    📺 YouTube Clean: Showing top 5 search results
                </div>
                ${hiddenCount > 0 ? `
                <button id="youtube-clean-show-more" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    outline: none;
                " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" 
                   onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                    ${showMoreText} ▼
                </button>
                <button id="youtube-clean-show-less" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    outline: none;
                    display: none;
                    margin-left: 10px;
                " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" 
                   onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                    Show less ▲
                </button>` : ''}
            </div>
        `;

        // Insert after the 5th result
        const fifthResult = searchContainer.querySelector('ytd-video-renderer:nth-child(5)');
        if (fifthResult && fifthResult.nextSibling) {
            searchContainer.insertBefore(indicator, fifthResult.nextSibling);
        } else {
            searchContainer.appendChild(indicator);
        }

        // Add event listeners for show/hide functionality
        if (hiddenCount > 0) {
            const showMoreBtn = document.getElementById('youtube-clean-show-more');
            const showLessBtn = document.getElementById('youtube-clean-show-less');

            if (showMoreBtn) {
                showMoreBtn.addEventListener('click', () => {
                    // Show all hidden results
                    hiddenResults.forEach(result => {
                        result.style.display = 'block !important';
                        result.style.visibility = 'visible !important';
                    });
                    
                    // Update button visibility
                    showMoreBtn.style.display = 'none';
                    if (showLessBtn) showLessBtn.style.display = 'inline-block';
                    
                    console.log('YouTube Clean: Showed all search results');
                });
            }

            if (showLessBtn) {
                showLessBtn.addEventListener('click', () => {
                    // Hide results after 5th again
                    hiddenResults.forEach(result => {
                        result.style.display = 'none !important';
                        result.style.visibility = 'hidden !important';
                    });
                    
                    // Update button visibility
                    showLessBtn.style.display = 'none';
                    if (showMoreBtn) showMoreBtn.style.display = 'inline-block';
                    
                    // Scroll to top of results
                    const firstResult = searchContainer.querySelector('ytd-video-renderer:first-child');
                    if (firstResult) {
                        firstResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    
                    console.log('YouTube Clean: Showing only top 5 search results');
                });
            }
        }
    }

    ensureSearchBarVisible() {
        // Make sure search bar and related elements are always visible
        const searchElements = [
            '#search-form',
            '#search',
            '#search-input',
            '#search-icon-legacy',
            '.ytd-searchbox',
            '#container.ytd-searchbox',
            'ytd-searchbox',
            '#search-container',
            '.gsfi', // Google search input
            '#center.ytd-masthead', // Main search container
            '.ytd-masthead', // Top header
            '#masthead', // YouTube header
            '#masthead-container'
        ];

        searchElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.style.display = 'block !important';
                    element.style.visibility = 'visible !important';
                    element.style.opacity = '1 !important';
                    element.style.position = 'relative !important';
                    element.style.zIndex = '9999 !important';
                }
            });
        });

        // Create centered search bar if it doesn't exist
        this.createCenteredSearchBar();

        // Hide the original header search bar
        const originalHeader = document.querySelector('#masthead, ytd-masthead');
        if (originalHeader) {
            originalHeader.style.display = 'none !important';
        }

        // Ensure search bar container is visible and functional
        const searchForm = document.querySelector('#search-form, form[role="search"]');
        if (searchForm) {
            searchForm.style.display = 'flex !important';
            searchForm.style.visibility = 'visible !important';
            searchForm.style.position = 'relative !important';
        }

        // Ensure search icon/button is clickable
        const searchButton = document.querySelector('#search-icon-legacy, .search-btn, button[aria-label*="Search"]');
        if (searchButton) {
            searchButton.style.display = 'flex !important';
            searchButton.style.visibility = 'visible !important';
            searchButton.style.pointerEvents = 'auto !important';
        }
    }

    createCenteredSearchBar() {
        // Check if our custom search bar already exists
        if (document.querySelector('.youtube-clean-search-container')) {
            return;
        }

        // Create the centered search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'youtube-clean-search-container';
        searchContainer.innerHTML = `
            <div class="youtube-clean-search-wrapper">
                <div class="youtube-clean-logo">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="#FF0000">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>YouTube Clean</span>
                </div>
                <div class="youtube-clean-search-form">
                    <input type="text" 
                           class="youtube-clean-search-input" 
                           placeholder="Search YouTube..." 
                           autocomplete="off">
                    <button class="youtube-clean-search-button" type="button">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="#666">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Insert the search container at the beginning of the body
        document.body.insertBefore(searchContainer, document.body.firstChild);

        // Add event listeners
        const searchInput = searchContainer.querySelector('.youtube-clean-search-input');
        const searchButton = searchContainer.querySelector('.youtube-clean-search-button');

        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                // Navigate to YouTube search results
                window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
            }
        };

        // Search on button click
        searchButton.addEventListener('click', performSearch);

        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Focus on the search input
        searchInput.focus();

        console.log('YouTube Clean: Created centered search bar');
    }

    hideCenteredSearchBar() {
        const searchContainer = document.querySelector('.youtube-clean-search-container');
        if (searchContainer) {
            searchContainer.style.display = 'none !important';
        }
    }

    ensureSearchResultsVisible() {
        // Make sure search results page elements are visible
        const elementsToShow = [
            'html',
            'body',
            'ytd-app',
            '#content',
            '#primary',
            '#contents',
            'ytd-section-list-renderer',
            '#contents.ytd-section-list-renderer',
            'ytd-video-renderer',
            '#masthead',
            'ytd-masthead',
            'ytd-page-manager',
            '#page-manager',
            'ytd-browse'
        ];

        elementsToShow.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.style.display = 'block !important';
                    element.style.visibility = 'visible !important';
                    element.style.opacity = '1 !important';
                    element.style.height = 'auto !important';
                    element.style.width = 'auto !important';
                    element.style.overflow = 'visible !important';
                }
            });
        });

        // Remove any transform or positioning that might hide content
        const potentiallyHiddenElements = document.querySelectorAll('ytd-video-renderer, ytd-section-list-renderer');
        potentiallyHiddenElements.forEach(element => {
            element.style.transform = 'none !important';
            element.style.position = 'relative !important';
            element.style.left = 'auto !important';
            element.style.top = 'auto !important';
        });

        // Force show the first 5 video results
        const videoResults = document.querySelectorAll('ytd-video-renderer');
        videoResults.forEach((result, index) => {
            if (index < 5) {
                result.style.display = 'block !important';
                result.style.visibility = 'visible !important';
                result.style.opacity = '1 !important';
                result.style.height = 'auto !important';
                result.style.margin = 'inherit !important';
                result.style.padding = 'inherit !important';
                console.log(`YouTube Clean: Force showing video result ${index + 1}`);
            }
        });

        // Ensure the body shows search results
        document.body.style.display = 'block !important';
        document.body.style.visibility = 'visible !important';
        document.body.style.background = 'white !important';

        // Remove the centered search overlay completely
        const searchOverlay = document.querySelector('.youtube-clean-search-container');
        if (searchOverlay) {
            searchOverlay.remove();
        }

        console.log('YouTube Clean: Ensured search results are visible');
    }

    toggle() {
        this.isEnabled = !this.isEnabled;
        
        if (this.isEnabled) {
            console.log('YouTube Clean: Enabled');
            this.removeAds();
            this.removeSuggestions();
        } else {
            console.log('YouTube Clean: Disabled');
            // Restore hidden elements
            this.restoreElements();
        }
        
        return this.isEnabled;
    }

    restoreElements() {
        const hiddenElements = document.querySelectorAll('[style*="display: none"]');
        hiddenElements.forEach(element => {
            if (element.style.display === 'none !important') {
                element.style.display = '';
            }
        });
    }
}

// Initialize the extension
const youtubeClean = new YouTubeClean();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle') {
        const isEnabled = youtubeClean.toggle();
        sendResponse({ enabled: isEnabled });
    } else if (request.action === 'getStatus') {
        sendResponse({ enabled: youtubeClean.isEnabled });
    }
});

console.log('YouTube Clean: Content script loaded');