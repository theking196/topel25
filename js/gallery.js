// Sample data array - replace with your actual data source
        const galleryData = [
            {
                id: 1,
                type: 'video',
                src: '/assets/wedding/videos/vid001.mp4',
                title: 'Beautiful Ceremony Moment',
                tags: ['ceremony',, 'the couples', 'highlights', 'romantic', 'short video'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'ceremony'
            },
            {
                id: 2,
                type: 'video',
                src: '/assets/wedding/videos/vid002.mp4',
                // poster: '/assets/wedding/photos/passport.jpg',
                title: 'Pre Vow',
                tags: ['ceremony', 'Vow', 'highlights', 'short video'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses','Pst........'],
                category: 'ceremony'
            },
            {
                id: 3,
                type: 'video',
                src: '/assets/wedding/videos/vid003.mp4',
                title: 'Couples Dance In',
                tags: ['the couples', 'dance', 'short video'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'reception'
            },
            {
                id: 4,
                type: 'image',
                src: '/assets/wedding/photos/001.jpg',
                title: 'Couples In Black and White',
                tags: ['smile', 'black and white', 'the couples'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'couples'
            },
            {
                id: 5,
                type: 'image',
                src: '/assets/wedding/photos/002.jpg',
                title: 'Couple Studio',
                tags: ['Peter\'s studio', 'studio', 'casual', 'the couples'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'ceremony'
            },
            {
                id: 6,
                type: 'image',
                src: '/assets/wedding/photos/003.jpg',
                title: 'Wedding Poster',
                tags: ['art', 'poster', 'graphics', 'verses', 'the couples'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'art'
            },
            {
                id: 7,
                type: 'image',
                src: '/assets/wedding/photos/004.jpg',
                title: 'Latest Couples In Town.',
                tags: ['ceremony', 'the couples',  'highlights'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'highlights'
            },
            {
                id: 8,
                type: 'image',
                src: '/assets/wedding/photos/005.jpg',
                title: 'Groom\'s sister',
                tags: ['family', 'groom', 'groom sister', 'single'],
                names: ['Testimony'],
                category: 'family & friends'
            },
            {
                id: 9,
                type: 'image',
                src: '/assets/wedding/photos/006.jpg',
                title: 'TKM Group',
                tags: ['reception', 'TKM', 'highlights', 'Group'],
                names: ['TKMites'],
                category: 'reception'
            },
            {
                id: 10,
                type: 'image',
                src: '/assets/wedding/photos/007.jpg',
                title: 'Studio Photo\'s ',
                tags: ['studio', 'the couples', 'the couples'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'Personal'
            },
            {
                id: 11,
                type: 'image',
                src: '/assets/wedding/photos/008.jpg',
                title: 'Studio Photo\'s II',
                tags: ['studio', 'the couples'],
                names: ['Papa T', 'the couples', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'Personal'
            },
            {
                id: 12,
                type: 'video',
                src: '/assets/wedding/videos/vid004.mp4',
                title: 'Bride Preparing',
                tags: ['bride', 'preparing'],
                names: ['Mrs. Pelumi Moses'],
                category: 'bride'
            },
            {
                id: 13,
                type: 'image',
                src: '/assets/wedding/photos/009.jpg',
                title: 'TKM Group II',
                tags: ['ceremony', 'TKM', 'highlights', 'Group'],
                names: ['TKMites'],
                category: 'ceremony'
            },
            {
                id: 14,
                type: 'image',
                src: '/assets/wedding/photos/010.jpg',
                title: 'Smiles 😊',
                tags: ['friend','TKM','smile', 'single'],
                names: ['Laanu'],
                category: 'family & friends'
            },
            {
                id: 15,
                type: 'image',
                src: '/assets/wedding/photos/011.jpg',
                title: '______',
                tags: ['the couples','ceremony','highlights'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'ceremony'
            },
            {
                id: 16,
                type: 'video',
                src: '/assets/wedding/videos/vid005.mp4',
                title: 'Couples Dance In II',
                tags: ['the couples', 'dance', 'short video'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'reception'
            },
            {
                id: 17,
                type: 'image',
                src: '/assets/wedding/photos/012.jpg',
                title: 'Papa T Vibes',
                tags: ['groom','engagement','highlights', 'single'],
                names: ['Papa T', 'Mr. Oluwatosin Moses'],
                category: 'engagement'
            },
            {
                id: 18,
                type: 'image',
                src: '/assets/wedding/photos/013.jpg',
                title: 'Papa T Vibes II',
                tags: ['groom','engagement','highlights', 'single'],
                names: ['Papa T', 'Mr. Oluwatosin Moses'],
                category: 'engagement'
            },
            {
                id: 19,
                type: 'video',
                src: '/assets/wedding/videos/vid006.mp4',
                title: 'TKMites',
                tags: ['reception', 'TKM', 'highlights', 'Group', 'short video'],
                names: ['TKMites'],
                category: 'reception'
            },
            {
                id: 20,
                type: 'image',
                src: '/assets/wedding/photos/014.jpg',
                title: 'Papa T & his Sister',
                tags: ['groom','groom sister','engagement','highlights'],
                names: ['Papa T', 'Mr. Oluwatosin Moses', 'Testimony'],
                category: 'engagement'
            },
            {
                id: 21,
                type: 'video',
                src: '/assets/wedding/videos/vid007.mp4',
                title: 'When You call TKM 📞. We shall be there 🏃‍♂️',
                tags: ['ceremony', 'TKM', 'highlights', 'Group', 'short video'],
                names: ['TKMites'],
                category: 'ceremony'
            },
            {
                id: 22,
                type: 'video',
                src: '/assets/wedding/videos/vid008.mp4',
                title: 'Engagement',
                tags: ['engagement', 'short video'],
                names: [],
                category: 'engagement'
            },
            {
                id: 23,
                type: 'video',
                src: '/assets/wedding/videos/vid009.mp4',
                title: 'When You call TKM 📞. We shall be there 🏃‍♂️ (Extended)',
                tags: ['ceremony', 'TKM', 'highlights', 'Group', 'short video'],
                names: ['TKMites'],
                category: 'ceremony'
            },
            {
                id: 24,
                type: 'image',
                src: '/assets/wedding/photos/015.jpg',
                title: 'Toluwani',
                tags: ['engagement','highlights', 'single'],
                names: ['Toluwani'],
                category: 'engagement'
            },
            {
                id: 25,
                type: 'image',
                src: '/assets/wedding/photos/016.jpg',
                title: 'TKM Group III',
                tags: ['ceremony', 'TKM', 'highlights', 'Group'],
                names: ['TKMites'],
                category: 'ceremony'
            },
            {
                id: 26,
                type: 'image',
                src: '/assets/wedding/photos/017.jpg',
                title: 'Opemipo',
                tags: ['reception','highlights', 'single', 'smile'],
                names: ['Ope'],
                category: 'reception'
            },
            {
                id: 27,
                type: 'image',
                src: '/assets/wedding/photos/018.jpg',
                title: 'TKM Group IV',
                tags: ['ceremony', 'TKM', 'highlights', 'Group'],
                names: ['TKMites'],
                category: 'ceremony'
            },
            {
                id: 28,
                type: 'image',
                src: '/assets/wedding/photos/019.jpg',
                title: 'Ope & Ini ',
                tags: ['ceremony', 'highlights', 'friends'],
                names: ['Opemipo','Inioluwa'],
                category: 'friends'
            },
            {
                id: 29,
                type: 'image',
                src: '/assets/wedding/photos/020.jpg',
                title: 'Ope, Ini, _____, _____& _____',
                tags: ['ceremony', 'highlights', 'friends','Group'],
                names: ['Opemipo','Inioluwa','_____','_____','_____'],
                category: 'friends'
            },
            {
                id: 30,
                type: 'image',
                src: '/assets/wedding/photos/021.jpg',
                title: 'Tolu & Christiana ',
                tags: ['engagement', 'highlights', 'friends'],
                names: ['Toluwani','Christiana'],
                category: 'friends'
            },
            {
                id: 31,
                type: 'image',
                src: '/assets/wedding/photos/022.jpg',
                title: 'Chobukem, Ope, Christiana & Toluwani',
                tags: ['engagement', 'highlights', 'friends','Group'],
                names: ['Chibukem','Opemipo','Christiana','Toluwani'],
                category: 'friends'
            },
            {
                id: 32,
                type: 'image',
                src: '/assets/wedding/photos/024.jpg',
                title: 'Christiana & Pelumi',
                tags: ['engagement', 'highlights', 'friends'],
                names: ['Christiana','Pelumi'],
                category: 'friends'
            },
            {
                id: 33,
                type: 'image',
                src: '/assets/wedding/photos/025.jpg',
                title: 'Oba',
                tags: ['reception', 'highlights','single'],
                names: ['Oba'],
                category: 'reception'
            },
            {
                id: 34,
                type: 'image',
                src: '/assets/wedding/photos/026.jpg',
                title: 'Chibukem',
                tags: ['reception', 'highlights','single'],
                names: ['Chibukem'],
                category: 'engagement'
            },
            {
                id: 35,
                type: 'image',
                src: '/assets/wedding/photos/027.jpg',
                title: 'Toluwani & Chibukem',
                tags: ['engagement', 'highlights', 'friends'],
                names: ['Toluwani','Chibukem'],
                category: 'friends'
            },
            {
                id: 36,
                type: 'image',
                src: '/assets/wedding/photos/028.jpg',
                title: 'Christiana & Toluwani',
                tags: ['engagement', 'highlights', 'friends'],
                names: ['Christiana','Toluwani'],
                category: 'friends'
            },
            {
                id: 37,
                type: 'image',
                src: '/assets/wedding/photos/029.jpg',
                title: 'Testimony & Chibukem',
                tags: ['engagement', 'groom sister', 'highlights', 'friends'],
                names: ['Testimony','Chibukem'],
                category: 'friends'
            },
            {
                id: 37,
                type: 'image',
                src: '/assets/wedding/photos/030.jpg',
                title: 'Chibukem, Christiana & Toluwani',
                tags: ['engagement', 'highlights', 'friends'],
                names: ['Chibukem','Christiana','Toluwani'],
                category: 'friends'
            },
            {
                id: 37,
                type: 'image',
                src: '/assets/wedding/photos/031.jpg',
                title: 'Christiana, Pelumi, Ope, Toluwani, Testimony, Chibukem',
                tags: ['engagement', 'highlights', 'friends', 'groom sister'],
                names: ['Christiana','Pelumi','Opemipo','Toluwani','Testimony','Chibukem'],
                category: 'friends'
            },
            {
                id: 38,
                type: 'image',
                src: '/assets/wedding/photos/032.jpg',
                title: 'Testimony, Christiana, Ope, Pelumi, Papa T, Toluwani,  ________, ________',
                tags: ['engagement', 'highlights', 'groom sister', 'groom'],
                names: ['Testimony','Christiana','Opemipo','Pelumi','Papa T','Toluwani','______','______'],
                category: 'engagement'
            },
            {
                id: 39,
                type: 'image',
                src: '/assets/wedding/photos/033.jpg',
                title: 'TKM Group V',
                tags: ['reception', 'TKM', 'highlights', 'Group'],
                names: ['TKMites'],
                category: 'reception'
            },
            {
                id: 40,
                type: 'image',
                src: '/assets/wedding/photos/034.jpg',
                title: 'Tolwani, Testimony & Chibukem',
                tags: ['engagement', 'groom sister', 'highlights', 'friends'],
                names: ['Tolwani','Testimony','Chibukem'],
                category: 'friends'
            },
            {
                id: 41,
                type: 'image',
                src: '/assets/wedding/photos/035.jpg',
                title: 'Testimony & Toluwani',
                tags: ['engagement', 'groom sister', 'highlights', 'friends'],
                names: ['Testimony','Tolwani'],
                category: 'friends'
            },
            {
                id: 42,
                type: 'image',
                src: '/assets/wedding/photos/036.jpg',
                title: 'Toluwani & Papa T',
                tags: ['groom','engagement','highlights'],
                names: ['Tolwani','Papa T', 'Mr. Oluwatosin Moses'],
                category: 'engagement'
            },
            {
                id: 43,
                type: 'image',
                src: '/assets/wedding/photos/037.jpg',
                title: 'Papa T & _____',
                tags: ['groom','engagement','highlights'],
                names: ['Papa T', 'Mr. Oluwatosin Moses','_____'],
                category: 'engagement'
            },
            {
                id: 44,
                type: 'image',
                src: '/assets/wedding/photos/038.jpg',
                title: 'Christiana & Papa T',
                tags: ['groom','engagement','highlights'],
                names: ['Chriatiana','Papa T', 'Mr. Oluwatosin Moses'],
                category: 'engagement'
            },
            {
                id: 45,
                type: 'image',
                src: '/assets/wedding/photos/039.jpg',
                title: 'Chibukem & Papa T',
                tags: ['groom','engagement','highlights'],
                names: ['Chibukem','Papa T', 'Mr. Oluwatosin Moses'],
                category: 'engagement'
            },
            {
                id: 46,
                type: 'image',
                src: '/assets/wedding/photos/040.jpg',
                title: 'Toluwani & Papa T II',
                tags: ['groom','engagement','highlights'],
                names: ['Tolwani','Papa T', 'Mr. Oluwatosin Moses'],
                category: 'engagement'
            },
            {
                id: 47,
                type: 'image',
                src: '/assets/wedding/photos/041.jpg',
                title: 'Tolu & Christiana II',
                tags: ['engagement','highlights', 'friends'],
                names: ['Tolwani','Christiana'],
                category: 'engagement'
            },
            {
                id: 48,
                type: 'image',
                src: '/assets/wedding/photos/042.jpg',
                title: 'Christiana & Pelumi',
                tags: ['engagement','highlights', 'friends'],
                names: ['Christiana','Pelumi'],
                category: 'engagement'
            },
            {
                id: 49,
                type: 'image',
                src: '/assets/wedding/photos/043.jpg',
                title: 'Chibukem & Christiana',
                tags: ['engagement','highlights', 'friends'],
                names: ['Chibukem','Christiana'],
                category: 'engagement'
            },
            {
                id: 50,
                type: 'image',
                src: '/assets/wedding/photos/044.jpg',
                title: '_____ & Christiana',
                tags: ['engagement','highlights', 'friends'],
                names: ['_____','Christiana'],
                category: 'engagement'
            },
            {
                id: 51,
                type: 'image',
                src: '/assets/wedding/photos/045.jpg',
                title: '_____',
                tags: ['engagement','highlights', 'single'],
                names: ['_____'],
                category: 'engagement'
            },
            {
                id: 52,
                type: 'image',
                src: '/assets/wedding/photos/046.jpg',
                title: 'Ope & Pelumi',
                tags: ['engagement','highlights', 'friends'],
                names: ['Opemipo','Pelumi'],
                category: 'engagement'
            },
            {
                id: 53,
                type: 'image',
                src: '/assets/wedding/photos/047.jpg',
                title: 'Testimony & Progress',
                tags: ['engagement','highlights', 'friends'],
                names: ['Testimony','Progress'],
                category: 'engagement'
            },
            {
                id: 54,
                type: 'image',
                src: '/assets/wedding/photos/048.jpg',
                title: '_____, Bukunmi, Toluwani, _____',
                tags: ['reception','highlights','friends'],
                names: ['_____','Bukunmi','Toluwani','_____'],
                category: 'reception'
            },
            {
                id: 54,
                type: 'image',
                src: '/assets/wedding/photos/049.jpg',
                title: 'Toluwani, Groom\'s Mother, Pelumi',
                tags: ['reception','highlights'],
                names: ['Toluwani','Groom\'s Mother','Pelumi'],
                category: 'reception'
            },
            {
                id: 55,
                type: 'video',
                src: '/assets/wedding/videos/vid010.mp4',
                // poster: '/assets/wedding/photos/passport.jpg',
                title: 'TKM Group VI',
                tags: ['reception', 'highlights', 'short video'],
                names: ['TKMites'],
                category: 'reception'
            },
            {
                id: 56,
                type: 'video',
                src: '/assets/wedding/videos/vid011.mp4',
                // poster: '/assets/wedding/photos/passport.jpg',
                title: 'TKM Group VII',
                tags: ['reception', 'highlights', 'short video'],
                names: ['TKMites'],
                category: 'reception'
            },
            {
                id: 57,
                type: 'image',
                src: '/assets/wedding/photos/050.jpg',
                title: 'Freedom, Laanu',
                tags: ['reception','highlights', 'friends'],
                names: ['Freedom','Laanu'],
                category: 'reception'
            },
            {
                id: 58,
                type: 'image',
                src: '/assets/wedding/photos/051.jpg',
                title: '_____, Laanu, _____',
                tags: ['reception','highlights', 'friends'],
                names: ['_____','Laanu','_____'],
                category: 'reception'
            },
            {
                id: 59,
                type: 'image',
                src: '/assets/wedding/photos/052.jpg',
                title: '_____, Ini',
                tags: ['reception','highlights', 'friends'],
                names: ['_____','Inioluwa'],
                category: 'reception'
            },
            {
                id: 60,
                type: 'image',
                src: '/assets/wedding/photos/053.jpg',
                title: '_____, _____',
                tags: ['reception','highlights', 'friends'],
                names: ['_____','_____'],
                category: 'reception'
            },
        ];
class ModernGallery {
    constructor() {
        this.data = galleryData;
        this.filteredData = [...this.data];
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.searchTimeout = null;
        
        // Mobile swipe properties
        this.currentMobileIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.threshold = 100;
        this.swipeWrapper = null;
        this.hasInteracted = false;
        
        // Loading management
        this.loadedItems = new Set();
        this.loadingItems = new Set();
        this.observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        this.intersectionObserver = null;
        
        // Preloading management
        this.preloadQueue = [];
        this.maxPreloadItems = 3;
        this.isPreloading = false;
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.generateFilters();
        this.setupEventListeners();
        this.renderDesktopGallery();
        this.setupMobileGallery();
        this.startPreloading();
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const itemId = entry.target.dataset.itemId;
                    if (itemId && !this.loadedItems.has(itemId)) {
                        this.loadMediaItem(entry.target, itemId);
                    }
                }
            });
        }, this.observerOptions);
    }

    async loadMediaItem(element, itemId) {
        if (this.loadingItems.has(itemId) || this.loadedItems.has(itemId)) {
            return;
        }

        this.loadingItems.add(itemId);
        const item = this.data.find(d => d.id.toString() === itemId);
        if (!item) return;

        const mediaContainer = element.querySelector('.media-container');
        const loadingSpinner = element.querySelector('.loading-spinner');
        const mediaElement = element.querySelector('img, video');

        // Show loading animation
        if (loadingSpinner) {
            loadingSpinner.style.display = 'flex';
        }

        try {
            if (item.type === 'video') {
                await this.loadVideo(mediaElement, item.src, item.poster);
            } else {
                await this.loadImage(mediaElement, item.src);
            }

            // Hide loading animation and show media
                if (loadingSpinner) {
                    loadingSpinner.remove();
                }
                mediaElement.style.opacity = '0';
                mediaElement.style.display = 'block';
            
            // Fade in animation
            requestAnimationFrame(() => {
                mediaElement.style.transition = 'opacity 0.4s ease-in-out';
                mediaElement.style.opacity = '1';
            });

            this.loadedItems.add(itemId);
            this.loadingItems.delete(itemId);

            // Add to preload queue for next items
            this.queueNextItemsForPreload(itemId);

        } catch (error) {
            console.error(`Failed to load media item ${itemId}:`, error);
            this.loadingItems.delete(itemId);
            
            // Show error state
            if (loadingSpinner) {
                loadingSpinner.innerHTML = `
                    <div class="error-state">
                        <i class="error-icon">⚠️</i>
                        <span>Failed to load</span>
                    </div>
                `;
            }
        }
    }

    loadImage(imgElement, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                imgElement.src = src;
                resolve();
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    loadVideo(videoElement, src, poster) {
        return new Promise((resolve, reject) => {
            videoElement.preload = 'metadata';
            if (poster) {
                videoElement.poster = poster;
            }
            
            const source = videoElement.querySelector('source') || document.createElement('source');
            source.src = src;
            source.type = 'video/mp4';
            
            if (!videoElement.contains(source)) {
                videoElement.appendChild(source);
            }

            videoElement.onloadedmetadata = resolve;
            videoElement.onerror = reject;
            videoElement.load();
        });
    }

    queueNextItemsForPreload(currentItemId) {
        const currentIndex = this.filteredData.findIndex(item => item.id.toString() === currentItemId);
        if (currentIndex === -1) return;

        // Queue next few items for preloading
        for (let i = 1; i <= this.maxPreloadItems; i++) {
            const nextIndex = currentIndex + i;
            if (nextIndex < this.filteredData.length) {
                const nextItem = this.filteredData[nextIndex];
                if (!this.loadedItems.has(nextItem.id.toString()) && 
                    !this.preloadQueue.includes(nextItem.id.toString())) {
                    this.preloadQueue.push(nextItem.id.toString());
                }
            }
        }

        this.processPreloadQueue();
    }

    async processPreloadQueue() {
        if (this.isPreloading || this.preloadQueue.length === 0) return;

        this.isPreloading = true;
        const itemId = this.preloadQueue.shift();
        const item = this.data.find(d => d.id.toString() === itemId);

        if (item && !this.loadedItems.has(itemId)) {
            try {
                if (item.type === 'video') {
                    const video = document.createElement('video');
                    await this.loadVideo(video, item.src, item.poster);
                } else {
                    await this.loadImage(new Image(), item.src);
                }
                this.loadedItems.add(itemId);
            } catch (error) {
                console.log(`Preload failed for item ${itemId}:`, error);
            }
        }

        this.isPreloading = false;
        
        // Continue processing queue
        if (this.preloadQueue.length > 0) {
            setTimeout(() => this.processPreloadQueue(), 100);
        }
    }

    startPreloading() {
        // Preload first few visible items
        const visibleItems = this.filteredData.slice(0, this.itemsPerPage);
        visibleItems.forEach(item => {
            if (!this.preloadQueue.includes(item.id.toString())) {
                this.preloadQueue.push(item.id.toString());
            }
        });
        this.processPreloadQueue();
    }

    createMediaElement(item, isLazy = true) {
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'media-container';
        mediaContainer.dataset.itemId = item.id.toString();

        // Loading spinner
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        loadingSpinner.innerHTML = `
            <div class="spinner-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <span class="loading-text">Loading...</span>
        `;

        let mediaElement = '';
        if (item.type === 'video') {
            mediaElement = `
                <video preload="none" style="display: none;">
                    <source type="video/mp4">
                </video>
            `;
        } else {
            mediaElement = `<img alt="${item.title}" style="display: none;">`;
        }

        mediaContainer.innerHTML = mediaElement + loadingSpinner.outerHTML;

        // Set up lazy loading
        if (isLazy) {
            // Add placeholder background
            mediaContainer.style.background = 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)';
            mediaContainer.style.backgroundSize = '20px 20px';
            mediaContainer.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
            
            this.intersectionObserver.observe(mediaContainer);
        } else {
            // Load immediately for mobile current item
            setTimeout(() => this.loadMediaItem(mediaContainer, item.id.toString()), 0);
        }

        return mediaContainer;
    }

    generateFilters() {
        const categories = new Set();
        categories.add('all');

        this.data.forEach(item => {
            if (item.category) {
                categories.add(item.category);
            }
            item.tags.forEach(tag => {
                categories.add(tag);
            });
        });

        const filterContainer = document.getElementById('filterContainer');
        filterContainer.innerHTML = '';

        const filterOrder = ['all', 'ceremony', 'reception', 'family', 'friends', 'highlights'];
        const filterDisplayNames = {
            'all': 'All',
            'ceremony': 'Ceremony',
            'reception': 'Reception', 
            'family': 'Family',
            'friends': 'Friends',
            'highlights': 'Highlights'
        };

        filterOrder.forEach(filter => {
            if (categories.has(filter)) {
                const filterTag = document.createElement('div');
                filterTag.className = `filter-tag ${filter === 'all' ? 'active' : ''}`;
                filterTag.dataset.filter = filter;
                filterTag.textContent = filterDisplayNames[filter] || filter.charAt(0).toUpperCase() + filter.slice(1);
                filterContainer.appendChild(filterTag);
                categories.delete(filter);
            }
        });

        categories.forEach(category => {
            const filterTag = document.createElement('div');
            filterTag.className = 'filter-tag';
            filterTag.dataset.filter = category;
            filterTag.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            filterContainer.appendChild(filterTag);
        });
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });

        // Filter functionality
        document.getElementById('filterContainer').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-tag')) {
                this.handleFilter(e.target.dataset.filter);
                this.updateActiveFilter(e.target);
            }
        });

        // Mobile swipe events
        this.setupMobileSwipeEvents();

        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.goToPrevious());
        document.getElementById('nextBtn').addEventListener('click', () => this.goToNext());

        // Lightbox
        document.getElementById('lightboxClose').addEventListener('click', () => this.closeLightbox());
        document.getElementById('lightbox').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeLightbox();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    setupMobileSwipeEvents() {
        this.swipeWrapper = document.getElementById('mobileSwipeWrapper');
        if (!this.swipeWrapper) return;

        // Touch events
        this.swipeWrapper.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.swipeWrapper.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.swipeWrapper.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Mouse events for desktop testing
        this.swipeWrapper.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.swipeWrapper.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.swipeWrapper.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.swipeWrapper.addEventListener('mouseleave', (e) => this.handleMouseUp(e));

        // Prevent context menu on long press
        this.swipeWrapper.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    handleTouchStart(e) {
        this.handleSwipeStart(e.touches[0].clientX);
    }

    handleTouchMove(e) {
        if (this.isDragging) {
            e.preventDefault();
            this.handleSwipeMove(e.touches[0].clientX);
        }
    }

    handleTouchEnd(e) {
        this.handleSwipeEnd();
    }

    handleMouseDown(e) {
        this.handleSwipeStart(e.clientX);
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            this.handleSwipeMove(e.clientX);
        }
    }

    handleMouseUp(e) {
        this.handleSwipeEnd();
    }

    handleSwipeStart(clientX) {
        this.isDragging = true;
        this.startX = clientX;
        this.currentX = clientX;
        this.swipeWrapper.classList.add('dragging');
        
        if (!this.hasInteracted) {
            this.hasInteracted = true;
            this.hideSwipeHint();
        }
    }

    handleSwipeMove(clientX) {
        if (!this.isDragging) return;
        
        this.currentX = clientX;
        const deltaX = this.currentX - this.startX;
        const currentTranslate = -(this.currentMobileIndex * 100) + (deltaX / window.innerWidth * 100);
        
        this.swipeWrapper.style.transform = `translateX(${currentTranslate}%)`;
    }

    handleSwipeEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.swipeWrapper.classList.remove('dragging');
        
        const deltaX = this.currentX - this.startX;
        const threshold = window.innerWidth * 0.2; // 20% of screen width
        
        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0 && this.currentMobileIndex > 0) {
                this.goToPrevious();
            } else if (deltaX < 0 && this.currentMobileIndex < this.filteredData.length - 1) {
                this.goToNext();
            } else {
                this.updateMobilePosition();
            }
        } else {
            this.updateMobilePosition();
        }
    }

    goToPrevious() {
        if (this.currentMobileIndex > 0) {
            this.currentMobileIndex--;
            this.updateMobilePosition();
            this.updateProgressBar();
            this.updateNavigationButtons();
            this.updateSwipeIndicators();
            this.loadAdjacentMobileItems();
        }
    }

    goToNext() {
        if (this.currentMobileIndex < this.filteredData.length - 1) {
            this.currentMobileIndex++;
            this.updateMobilePosition();
            this.updateProgressBar();
            this.updateNavigationButtons();
            this.updateSwipeIndicators();
            this.loadAdjacentMobileItems();
        }
    }

    loadAdjacentMobileItems() {
        // Load current and adjacent items immediately
        const indicesToLoad = [
            this.currentMobileIndex - 1,
            this.currentMobileIndex,
            this.currentMobileIndex + 1
        ].filter(index => index >= 0 && index < this.filteredData.length);

        indicesToLoad.forEach(index => {
            const item = this.filteredData[index];
            const mobileItem = this.swipeWrapper.children[index];
            if (mobileItem && !this.loadedItems.has(item.id.toString())) {
                const mediaContainer = mobileItem.querySelector('.media-container');
                if (mediaContainer) {
                    this.loadMediaItem(mediaContainer, item.id.toString());
                }
            }
        });
    }

    updateMobilePosition() {
        const translateX = -(this.currentMobileIndex * 100);
        this.swipeWrapper.style.transform = `translateX(${translateX}%)`;
    }

    hideSwipeHint() {
        const hint = document.getElementById('swipeHint');
        if (hint) {
            hint.classList.add('hidden');
        }
    }

    handleSearch(query) {
        this.currentSearch = query.trim();
        this.applyFiltersAndSearch();
    }

    handleFilter(filter) {
        this.currentFilter = filter;
        this.applyFiltersAndSearch();
    }

    applyFiltersAndSearch() {
        let filteredByCategory = [];
        if (this.currentFilter === 'all') {
            filteredByCategory = [...this.data];
        } else {
            filteredByCategory = this.data.filter(item => 
                item.category === this.currentFilter || item.tags.includes(this.currentFilter)
            );
        }

        if (!this.currentSearch) {
            this.filteredData = filteredByCategory;
        } else {
            const searchTerm = this.currentSearch.toLowerCase();
            this.filteredData = filteredByCategory.filter(item => 
                item.title.toLowerCase().includes(searchTerm) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                item.names.some(name => name.toLowerCase().includes(searchTerm))
            );
        }
        
        this.currentPage = 1;
        this.currentMobileIndex = 0;
        
        // Clear preload queue and reset loading state
        this.preloadQueue = [];
        
        this.renderDesktopGallery();
        this.setupMobileGallery();
        this.showNoResults();
        this.updateSearchPlaceholder();
        this.startPreloading();
    }

    updateSearchPlaceholder() {
        const searchInput = document.getElementById('searchInput');
        if (this.currentFilter === 'all') {
            searchInput.placeholder = 'Search photos, videos, tags, names...';
        } else {
            const filterName = this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1);
            searchInput.placeholder = `Search in ${filterName}...`;
        }
    }

    updateActiveFilter(activeTag) {
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        activeTag.classList.add('active');
    }

    renderDesktopGallery() {
        const gallery = document.getElementById('desktopGallery');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageItems = this.filteredData.slice(startIndex, endIndex);

        gallery.innerHTML = '';

        pageItems.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const mediaContainer = this.createMediaElement(item, true);
            
            galleryItem.appendChild(mediaContainer);

            const overlay = document.createElement('div');
            overlay.className = 'item-overlay';
            overlay.innerHTML = `
                <div class="item-title">${item.title}</div>
                <div class="item-tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="item-names">${item.names.join(', ')}</div>
            `;
            
            galleryItem.appendChild(overlay);
            galleryItem.addEventListener('click', () => this.openLightbox(item));
            gallery.appendChild(galleryItem);
        });

        this.renderPagination();
    }

    setupMobileGallery() {
        const mobileWrapper = document.getElementById('mobileSwipeWrapper');
        if (!mobileWrapper) return;

        mobileWrapper.innerHTML = '';

        this.filteredData.forEach((item, index) => {
            const mobileItem = document.createElement('div');
            mobileItem.className = 'mobile-item';

            // Load current item immediately, others lazily
            const isCurrentOrAdjacent = Math.abs(index - this.currentMobileIndex) <= 1;
            const mediaContainer = this.createMediaElement(item, !isCurrentOrAdjacent);

            mobileItem.appendChild(mediaContainer);

            const overlay = document.createElement('div');
            overlay.className = 'mobile-overlay';
            overlay.innerHTML = `
                <div class="item-title">${item.title}</div>
                <div class="item-tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="item-names">${item.names.join(', ')}</div>
            `;

            mobileItem.appendChild(overlay);
            mobileItem.addEventListener('click', () => this.openLightbox(item));
            mobileWrapper.appendChild(mobileItem);
        });

        this.updateMobilePosition();
        this.updateProgressBar();
        this.updateNavigationButtons();
        this.setupSwipeIndicators();
        this.resetSwipeHint();
        this.loadAdjacentMobileItems();
    }

    setupSwipeIndicators() {
        const indicatorsContainer = document.getElementById('swipeIndicators');
        if (!indicatorsContainer) return;

        indicatorsContainer.innerHTML = '';

        // Only show indicators if there are items and not too many
        if (this.filteredData.length <= 10) {
            this.filteredData.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = `swipe-dot ${index === this.currentMobileIndex ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    this.currentMobileIndex = index;
                    this.updateMobilePosition();
                    this.updateProgressBar();
                    this.updateNavigationButtons();
                    this.updateSwipeIndicators();
                    this.loadAdjacentMobileItems();
                });
                indicatorsContainer.appendChild(dot);
            });
        }
    }

    updateSwipeIndicators() {
        const dots = document.querySelectorAll('.swipe-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentMobileIndex);
        });
    }

    updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        if (this.filteredData.length > 0) {
            const progress = ((this.currentMobileIndex + 1) / this.filteredData.length) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${this.currentMobileIndex + 1} of ${this.filteredData.length}`;
        } else {
            progressBar.style.width = '0%';
            progressText.textContent = '0 of 0';
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = this.currentMobileIndex === 0;
        nextBtn.disabled = this.currentMobileIndex === this.filteredData.length - 1;
    }

    resetSwipeHint() {
        const hint = document.getElementById('swipeHint');
        if (hint && this.filteredData.length > 1) {
            this.hasInteracted = false;
            hint.classList.remove('hidden');
            
            // Auto-hide hint after 3 seconds
            setTimeout(() => {
                if (!this.hasInteracted) {
                    this.hideSwipeHint();
                }
            }, 3000);
        }
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);

        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        // Previous button
        if (this.currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'page-btn';
            prevBtn.textContent = '←';
            prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
            pagination.appendChild(prevBtn);
        }

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            const firstBtn = document.createElement('button');
            firstBtn.className = 'page-btn';
            firstBtn.textContent = '1';
            firstBtn.addEventListener('click', () => this.goToPage(1));
            pagination.appendChild(firstBtn);

            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.color = 'black';
                ellipsis.style.padding = '10px 5px';
                pagination.appendChild(ellipsis);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => this.goToPage(i));
            pagination.appendChild(pageBtn);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.color = 'black';
                ellipsis.style.padding = '10px 5px';
                pagination.appendChild(ellipsis);
            }

            const lastBtn = document.createElement('button');
            lastBtn.className = 'page-btn';
            lastBtn.textContent = totalPages;
            lastBtn.addEventListener('click', () => this.goToPage(totalPages));
            pagination.appendChild(lastBtn);
        }

        // Next button
        if (this.currentPage < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'page-btn';
            nextBtn.textContent = '→';
            nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
            pagination.appendChild(nextBtn);
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderDesktopGallery();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    openLightbox(item) {
        const lightbox = document.getElementById('lightbox');
        const content = document.getElementById('lightboxContent');

        // Show loading in lightbox
        content.innerHTML = `
            <div class="lightbox-loading">
                <div class="spinner-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <span>Loading...</span>
            </div>
        `;

        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Load full quality media
        if (item.type === 'video') {
            const video = document.createElement('video');
            video.controls = true;
            video.autoplay = true;
            video.preload = 'auto';
            
            const source = document.createElement('source');
            source.src = item.src;
            source.type = 'video/mp4';
            video.appendChild(source);

            video.onloadeddata = () => {
                content.innerHTML = '';
                content.appendChild(video);
            };

            video.onerror = () => {
                content.innerHTML = '<div class="error-state">Failed to load video</div>';
            };
        } else {
            const img = new Image();
            img.onload = () => {
                img.alt = item.title;
                content.innerHTML = '';
                content.appendChild(img);
            };
            img.onerror = () => {
                content.innerHTML = '<div class="error-state">Failed to load image</div>';
            };
            img.src = item.src;
        }
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Pause any playing videos
        const videos = lightbox.querySelectorAll('video');
        videos.forEach(video => video.pause());
    }

    handleKeyboard(e) {
        // Only handle keyboard events when not typing in search
        if (document.activeElement === document.getElementById('searchInput')) {
            return;
        }

        switch(e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                if (window.innerWidth <= 768) {
                    this.goToPrevious();
                }
                break;
            case 'ArrowRight':
                if (window.innerWidth <= 768) {
                    this.goToNext();
                }
                break;
        }
    }

            showNoResults() {
                const noResults = document.getElementById('noResults');
                const desktopGallery = document.getElementById('desktopGallery');
                const mobileGallery = document.getElementById('mobileGallery');
                const pagination = document.getElementById('pagination');

                if (this.filteredData.length === 0) {
                    noResults.style.display = 'block';
                    if (window.innerWidth > 768) {
                        desktopGallery.style.display = 'none';
                        pagination.style.display = 'none';
                    } else {
                        mobileGallery.style.display = 'none';
                    }
                } else {
                    noResults.style.display = 'none';
                    if (window.innerWidth > 768) {
                        desktopGallery.style.display = 'grid';
                        pagination.style.display = 'flex';
                    } else {
                        mobileGallery.style.display = 'block';
                    }
                }
            }

            // Utility method to refresh gallery on window resize
            handleResize() {
                if (window.innerWidth <= 768) {
                    this.updateMobilePosition();
                } else {
                    this.renderDesktopGallery();
                }
            }
        }

        // Additional utility functions for performance
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        function throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }

const data = {
        SiteName: "TOPEL' 25",
        MenuItems: [
                { name: 'Home', link:"/index.html",active:""},
                { name: 'About', link:"/about.html",active:""},
                { name: 'details', link:"/details.html",active:""},
                { name: 'gallery', link:"/gallery.html",active:""},
                { name: 'Prayers For The Couple', link:"/prayers.html",active:""},
            ],
    };
        
    $(document).ready(async function () {
    var click = 0;
    
    
    
    // Iterate through MenuItems to find the active page
    Object.keys(data.MenuItems).forEach(menuKey => {
        const menuItem = data.MenuItems[menuKey];
        if (Array.isArray(menuItem)) {
            // Check if this menu item contains 'active'
            if (menuItem.includes('active')) {
                data.currentpage = menuKey; // Set the key (e.g., 'home') as current page
                // Or if you want the display name: data.currentpage = menuItem[0];
            }
        }
    });

        const options = { 
            builtInUtilities,
            variables: { action: "running", nextaction: "sleeping"},
            page:1,
        };
    
        // setTimeout(async () => {
        //     data.MenuItems[0].active = "active";
            var hhh = await replacePlaceholdersInDocument("body",data,options);
            $(".loader").fadeOut()
             
        // }, 1000);
    
    
            $(".hamburger").click(function () {
                $(".menu").toggleClass("active")
            })

            const gallery = new ModernGallery();
            
            // Handle window resize
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    gallery.handleResize();
                }, 250);
            });
    
})
