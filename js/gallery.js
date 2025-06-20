// Sample data array - replace with your actual data source
        const galleryData = [
            {
                id: 1,
                type: 'video',
                src: 'assets/wedding/videos/vid001.mp4',
                title: 'Beautiful Ceremony Moment',
                tags: ['ceremony',, 'the couples', 'highlights', 'romantic', 'short video'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'ceremony'
            },
            {
                id: 2,
                type: 'video',
                src: 'assets/wedding/videos/vid002.mp4',
                // poster: 'assets/wedding/photo/passport.jpg',
                title: 'Pre Vow',
                tags: ['ceremony', 'Vow', 'highlights', 'short video'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses','Pst........'],
                category: 'ceremony'
            },
            {
                id: 3,
                type: 'video',
                src: 'assets/wedding/videos/vid003.mp4',
                title: 'Couples Dance In',
                tags: ['the couples', 'dance', 'short video'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'reception'
            },
            {
                id: 4,
                type: 'image',
                src: 'assets/wedding/photo/001.jpg',
                title: 'Couples In Black and White',
                tags: ['smile', 'black and white', 'the couples'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'couples'
            },
            {
                id: 5,
                type: 'image',
                src: 'assets/wedding/photo/002.jpg',
                title: 'Couple Studio',
                tags: ['Peter\'s studio', 'studio', 'casual', 'the couples'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'ceremony'
            },
            {
                id: 6,
                type: 'image',
                src: 'assets/wedding/photo/003.jpg',
                title: 'Wedding Poster',
                tags: ['art', 'poster', 'graphics', 'verses', 'the couples'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'art'
            },
            {
                id: 7,
                type: 'image',
                src: 'assets/wedding/photo/004.jpg',
                title: 'Latest Couples In Town.',
                tags: ['ceremony', 'the couples',  'highlights'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'highlights'
            },
            {
                id: 8,
                type: 'image',
                src: 'assets/wedding/photo/005.jpg',
                title: 'Groom\'s sister',
                tags: ['family', 'groom', 'groom sister', 'single'],
                names: ['Testimony'],
                category: 'family & friends'
            },
            {
                id: 9,
                type: 'image',
                src: 'assets/wedding/photo/006.jpg',
                title: 'TKM Group',
                tags: ['reception', 'TKM', 'highlights', 'Group'],
                names: ['TKMites'],
                category: 'reception'
            },
            {
                id: 10,
                type: 'image',
                src: 'assets/wedding/photo/007.jpg',
                title: 'Studio Photo\'s ',
                tags: ['studio', 'the couples', 'the couples'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'Personal'
            },
            {
                id: 11,
                type: 'image',
                src: 'assets/wedding/photo/008.jpg',
                title: 'Studio Photo\'s II',
                tags: ['studio', 'the couples'],
                names: ['Papa T', 'the couples', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'Personal'
            },
            {
                id: 12,
                type: 'video',
                src: 'assets/wedding/videos/vid004.mp4',
                title: 'Bride Preparing',
                tags: ['bride', 'preparing'],
                names: ['Mrs. Pelumi Moses'],
                category: 'bride'
            },
            {
                id: 13,
                type: 'image',
                src: 'assets/wedding/photo/009.jpg',
                title: 'TKM Group II',
                tags: ['ceremony', 'TKM', 'highlights', 'Group'],
                names: ['TKMites'],
                category: 'ceremony'
            },
            {
                id: 14,
                type: 'image',
                src: 'assets/wedding/photo/010.jpg',
                title: 'Smiles 😊',
                tags: ['friend','TKM','smile', 'single'],
                names: ['Laanu'],
                category: 'family & friends'
            },
            {
                id: 15,
                type: 'image',
                src: 'assets/wedding/photo/011.jpg',
                title: '______',
                tags: ['the couples','ceremony','highlights'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'ceremony'
            },
            {
                id: 16,
                type: 'video',
                src: 'assets/wedding/videos/vid005.mp4',
                title: 'Couples Dance In II',
                tags: ['the couples', 'dance', 'short video'],
                names: ['Papa T', 'Mrs. Pelumi Moses', 'Mr. Oluwatosin Moses'],
                category: 'reception'
            },
            {
                id: 17,
                type: 'image',
                src: 'assets/wedding/photo/012.jpg',
                title: 'Papa T Vibes',
                tags: ['groom','engagement','highlights', 'single'],
                names: ['Papa T', 'Mr. Oluwatosin Moses'],
                category: 'engagement'
            },
            {
                id: 18,
                type: 'image',
                src: 'assets/wedding/photo/013.jpg',
                title: 'Papa T Vibes II',
                tags: ['groom','engagement','highlights', 'single'],
                names: ['Papa T', 'Mr. Oluwatosin Moses'],
                category: 'engagement'
            },
            {
                id: 19,
                type: 'video',
                src: 'assets/wedding/videos/vid006.mp4',
                title: 'TKMites',
                tags: ['reception', 'TKM', 'highlights', 'Group', 'short video'],
                names: ['TKMites'],
                category: 'reception'
            },
            {
                id: 20,
                type: 'image',
                src: 'assets/wedding/photo/014.jpg',
                title: 'Papa T & his Sister',
                tags: ['groom','groom sister','engagement','highlights'],
                names: ['Papa T', 'Mr. Oluwatosin Moses', 'Testimony'],
                category: 'engagement'
            },
            {
                id: 21,
                type: 'video',
                src: 'assets/wedding/videos/vid007.mp4',
                title: 'When You call TKM 📞. We shall be there 🏃‍♂️',
                tags: ['ceremony', 'TKM', 'highlights', 'Group', 'short video'],
                names: ['TKMites'],
                category: 'ceremony'
            },
            {
                id: 22,
                type: 'video',
                src: 'assets/wedding/videos/vid008.mp4',
                title: 'Engagement',
                tags: ['engagement', 'short video'],
                names: [],
                category: 'engagement'
            },
            {
                id: 23,
                type: 'video',
                src: 'assets/wedding/videos/vid009.mp4',
                title: 'When You call TKM 📞. We shall be there 🏃‍♂️ (Extended)',
                tags: ['ceremony', 'TKM', 'highlights', 'Group', 'short video'],
                names: ['TKMites'],
                category: 'ceremony'
            },
            {
                id: 24,
                type: 'image',
                src: 'assets/wedding/photo/015.jpg',
                title: 'Toluwani',
                tags: ['engagement','highlights', 'single'],
                names: ['Toluwani'],
                category: 'engagement'
            },
            {
                id: 25,
                type: 'image',
                src: 'assets/wedding/photo/016.jpg',
                title: 'TKM Group III',
                tags: ['ceremony', 'TKM', 'highlights', 'Group'],
                names: ['TKMites'],
                category: 'ceremony'
            },
            {
                id: 26,
                type: 'image',
                src: 'assets/wedding/photo/017.jpg',
                title: 'Opemipo',
                tags: ['reception','highlights', 'single', 'smile'],
                names: ['Ope'],
                category: 'reception'
            },
            {
                id: 27,
                type: 'image',
                src: 'assets/wedding/photo/018.jpg',
                title: 'TKM Group IV',
                tags: ['ceremony', 'TKM', 'highlights', 'Group'],
                names: ['TKMites'],
                category: 'ceremony'
            },
            {
                id: 28,
                type: 'image',
                src: 'assets/wedding/photo/019.jpg',
                title: 'Ope & Ini ',
                tags: ['ceremony', 'highlights', 'friends'],
                names: ['Opemipo','Inioluwa'],
                category: 'friends'
            },
            {
                id: 29,
                type: 'image',
                src: 'assets/wedding/photo/020.jpg',
                title: 'Ope, Ini, _____, _____& _____',
                tags: ['ceremony', 'highlights', 'friends','Group'],
                names: ['Opemipo','Inioluwa','_____','_____','_____'],
                category: 'friends'
            },
            {
                id: 30,
                type: 'image',
                src: 'assets/wedding/photo/021.jpg',
                title: 'Tolu & Christiana ',
                tags: ['engagement', 'highlights', 'friends'],
                names: ['Toluwani','Christiana'],
                category: 'friends'
            },
            {
                id: 31,
                type: 'image',
                src: 'assets/wedding/photo/022.jpg',
                title: 'Chobukem, Ope, Christiana & Toluwani',
                tags: ['engagement', 'highlights', 'friends','Group'],
                names: ['Chibukem','Opemipo','Christiana','Toluwani'],
                category: 'friends'
            },
            {
                id: 32,
                type: 'image',
                src: 'assets/wedding/photo/024.jpg',
                title: 'Christiana & Pelumi',
                tags: ['engagement', 'highlights', 'friends'],
                names: ['Christiana','Pelumi'],
                category: 'friends'
            },
            {
                id: 33,
                type: 'image',
                src: 'assets/wedding/photo/025.jpg',
                title: 'Oba',
                tags: ['reception', 'highlights','single'],
                names: ['Oba'],
                category: 'reception'
            },
            {
                id: 34,
                type: 'image',
                src: 'assets/wedding/photo/026.jpg',
                title: 'Chibukem',
                tags: ['reception', 'highlights','single'],
                names: ['Chibukem'],
                category: 'engagement'
            },
            {
                id: 35,
                type: 'image',
                src: 'assets/wedding/photo/027.jpg',
                title: 'Toluwani & Chibukem',
                tags: ['engagement', 'highlights', 'friends'],
                names: ['Toluwani','Chibukem'],
                category: 'friends'
            },
            {
                id: 36,
                type: 'image',
                src: 'assets/wedding/photo/028.jpg',
                title: 'Christiana & Toluwani',
                tags: ['engagement', 'highlights', 'friends'],
                names: ['Christiana','Toluwani'],
                category: 'friends'
            },
            {
                id: 37,
                type: 'image',
                src: 'assets/wedding/photo/029.jpg',
                title: 'Testimony & Chibukem',
                tags: ['engagement', 'groom sister', 'highlights', 'friends'],
                names: ['Testimony','Chibukem'],
                category: 'friends'
            },
            {
                id: 37,
                type: 'image',
                src: 'assets/wedding/photo/030.jpg',
                title: 'Chibukem, Christiana & Toluwani',
                tags: ['engagement', 'highlights', 'friends'],
                names: ['Chibukem','Christiana','Toluwani'],
                category: 'friends'
            },
            {
                id: 37,
                type: 'image',
                src: 'assets/wedding/photo/031.jpg',
                title: 'Christiana, Pelumi, Ope, Toluwani, Testimony, Chibukem',
                tags: ['engagement', 'highlights', 'friends', 'groom sister'],
                names: ['Christiana','Pelumi','Opemipo','Toluwani','Testimony','Chibukem'],
                category: 'friends'
            },
            {
                id: 38,
                type: 'image',
                src: 'assets/wedding/photo/032.jpg',
                title: 'Testimony, Christiana, Ope, Pelumi, Papa T, Toluwani,  ________, ________',
                tags: ['engagement', 'highlights', 'groom sister', 'groom'],
                names: ['Testimony','Christiana','Opemipo','Pelumi','Papa T','Toluwani','______','______'],
                category: 'engagement'
            },
            {
                id: 39,
                type: 'image',
                src: 'assets/wedding/photo/033.jpg',
                title: 'TKM Group V',
                tags: ['reception', 'TKM', 'highlights', 'Group'],
                names: ['TKMites'],
                category: 'reception'
            },
            {
                id: 40,
                type: 'image',
                src: 'assets/wedding/photo/034.jpg',
                title: 'Tolwani, Testimony & Chibukem',
                tags: ['engagement', 'groom sister', 'highlights', 'friends'],
                names: ['Tolwani','Testimony','Chibukem'],
                category: 'friends'
            },
            {
                id: 41,
                type: 'image',
                src: 'assets/wedding/photo/035.jpg',
                title: 'Testimony & Toluwani',
                tags: ['engagement', 'groom sister', 'highlights', 'friends'],
                names: ['Testimony','Tolwani'],
                category: 'friends'
            },
            {
                id: 42,
                type: 'image',
                src: 'assets/wedding/photo/036.jpg',
                title: 'Toluwani & Papa T',
                tags: ['groom','engagement','highlights'],
                names: ['Tolwani','Papa T', 'Mr. Oluwatosin Moses'],
                category: 'engagement'
            },
            {
                id: 43,
                type: 'image',
                src: 'assets/wedding/photo/037.jpg',
                title: 'Papa T & _____',
                tags: ['groom','engagement','highlights'],
                names: ['Papa T', 'Mr. Oluwatosin Moses','_____'],
                category: 'engagement'
            },
            {
                id: 44,
                type: 'image',
                src: 'assets/wedding/photo/038.jpg',
                title: 'Christiana & Papa T',
                tags: ['groom','engagement','highlights'],
                names: ['Chriatiana','Papa T', 'Mr. Oluwatosin Moses'],
                category: 'engagement'
            },
            {
                id: 45,
                type: 'image',
                src: 'assets/wedding/photo/039.jpg',
                title: 'Chibukem & Papa T',
                tags: ['groom','engagement','highlights'],
                names: ['Chibukem','Papa T', 'Mr. Oluwatosin Moses'],
                category: 'engagement'
            },
            {
                id: 46,
                type: 'image',
                src: 'assets/wedding/photo/040.jpg',
                title: 'Toluwani & Papa T II',
                tags: ['groom','engagement','highlights'],
                names: ['Tolwani','Papa T', 'Mr. Oluwatosin Moses'],
                category: 'engagement'
            },
            {
                id: 47,
                type: 'image',
                src: 'assets/wedding/photo/041.jpg',
                title: 'Tolu & Christiana II',
                tags: ['engagement','highlights', 'friends'],
                names: ['Tolwani','Christiana'],
                category: 'engagement'
            },
            {
                id: 48,
                type: 'image',
                src: 'assets/wedding/photo/042.jpg',
                title: 'Christiana & Pelumi',
                tags: ['engagement','highlights', 'friends'],
                names: ['Christiana','Pelumi'],
                category: 'engagement'
            },
            {
                id: 49,
                type: 'image',
                src: 'assets/wedding/photo/043.jpg',
                title: 'Chibukem & Christiana',
                tags: ['engagement','highlights', 'friends'],
                names: ['Chibukem','Christiana'],
                category: 'engagement'
            },
            {
                id: 50,
                type: 'image',
                src: 'assets/wedding/photo/044.jpg',
                title: '_____ & Christiana',
                tags: ['engagement','highlights', 'friends'],
                names: ['_____','Christiana'],
                category: 'engagement'
            },
            {
                id: 51,
                type: 'image',
                src: 'assets/wedding/photo/045.jpg',
                title: '_____',
                tags: ['engagement','highlights', 'single'],
                names: ['_____'],
                category: 'engagement'
            },
            {
                id: 52,
                type: 'image',
                src: 'assets/wedding/photo/046.jpg',
                title: 'Ope & Pelumi',
                tags: ['engagement','highlights', 'friends'],
                names: ['Opemipo','Pelumi'],
                category: 'engagement'
            },
            {
                id: 53,
                type: 'image',
                src: 'assets/wedding/photo/047.jpg',
                title: 'Testimony & Progress',
                tags: ['engagement','highlights', 'friends'],
                names: ['Testimony','Progress'],
                category: 'engagement'
            },
            {
                id: 54,
                type: 'image',
                src: 'assets/wedding/photo/048.jpg',
                title: '_____, Bukunmi, Toluwani, _____',
                tags: ['reception','highlights','friends'],
                names: ['_____','Bukunmi','Toluwani','_____'],
                category: 'reception'
            },
            {
                id: 54,
                type: 'image',
                src: 'assets/wedding/photo/049.jpg',
                title: 'Toluwani, Groom\'s Mother, Pelumi',
                tags: ['reception','highlights'],
                names: ['Toluwani','Groom\'s Mother','Pelumi'],
                category: 'reception'
            },
            {
                id: 55,
                type: 'video',
                src: 'assets/wedding/videos/vid010.mp4',
                // poster: 'assets/wedding/photo/passport.jpg',
                title: 'TKM Group VI',
                tags: ['reception', 'highlights', 'short video'],
                names: ['TKMites'],
                category: 'reception'
            },
            {
                id: 56,
                type: 'video',
                src: 'assets/wedding/videos/vid011.mp4',
                // poster: 'assets/wedding/photo/passport.jpg',
                title: 'TKM Group VII',
                tags: ['reception', 'highlights', 'short video'],
                names: ['TKMites'],
                category: 'reception'
            },
            {
                id: 57,
                type: 'image',
                src: 'assets/wedding/photo/050.jpg',
                title: 'Freedom, Laanu',
                tags: ['reception','highlights', 'friends'],
                names: ['Freedom','Laanu'],
                category: 'reception'
            },
                
            {
                id: 58,
                type: 'image',
                src: 'assets/wedding/photo/051.jpg',
                title: '_____, Laanu, _____',
                tags: ['reception','highlights', 'friends'],
                names: ['_____','Laanu','_____'],
                category: 'reception'
            },
            {
                id: 59,
                type: 'image',
                src: 'assets/wedding/photo/052.jpg',
                title: '_____, Ini',
                tags: ['reception','highlights', 'friends'],
                names: ['_____','Inioluwa'],
                category: 'reception'
            },
            {
                id: 60,
                type: 'image',
                src: 'assets/wedding/photo/053.jpg',
                title: '_____, _____',
                tags: ['reception','highlights', 'friends'],
                names: ['_____','_____'],
                category: 'reception'
            },
                {
                id: 61,
                type: 'video',
                src: 'assets/wedding/videos/vid012.mp4',
                title: 'Tkmites that attended the wedding',
                tags: ['reception', 'TKM', 'highlights', 'Group', 'short video'],
                names: ['TKMites'],
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
                this.mobileBatchSize = 3;
                this.loadedMobileCount = 0;
                
                this.init();
            }

            init() {
                this.generateFilters();
                this.setupEventListeners();
                this.renderDesktopGallery();
                this.setupMobileGallery();
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
                }
            }

            goToNext() {
                    if (this.currentMobileIndex < this.filteredData.length - 1) {
                        this.currentMobileIndex++;
                        // If the user has swiped to the last loaded item, load the next batch
                        if (
                            this.currentMobileIndex === this.loadedMobileCount - 1 &&
                            this.loadedMobileCount < this.filteredData.length
                        ) {
                            this.loadMoreMobileItems();
                        }
                        this.updateMobilePosition();
                        this.updateProgressBar();
                        this.updateNavigationButtons();
                        this.updateSwipeIndicators();
                    }
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
                this.renderDesktopGallery();
                this.setupMobileGallery();
                this.showNoResults();
                this.updateSearchPlaceholder();
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
        galleryItem.className = 'gallery-item loading'; // <-- Add loading class
        galleryItem.addEventListener('click', () => this.openLightbox(item));

        // Create media element
        let mediaElement;
        if (item.type === 'video') {
            mediaElement = document.createElement('video');
            mediaElement.poster = item.poster || 'assets/video.png';
            mediaElement.preload = 'none';

            const source = document.createElement('source');
            source.src = item.src;
            source.type = 'video/mp4';
            mediaElement.appendChild(source);

            // Remove loading class when video is ready
            mediaElement.addEventListener('loadeddata', () => {
                galleryItem.classList.remove('loading');
            });
            mediaElement.addEventListener('error', () => {
                galleryItem.classList.remove('loading');
            });
        } else {
            mediaElement = document.createElement('img');
            mediaElement.src = item.src;
            mediaElement.alt = item.title;
            mediaElement.loading = 'lazy';

            // Remove loading class when image is loaded
            mediaElement.addEventListener('load', () => {
                galleryItem.classList.remove('loading');
            });
            mediaElement.addEventListener('error', () => {
                galleryItem.classList.remove('loading');
            });
        }

        galleryItem.appendChild(mediaElement);

        // Overlay info
        const overlay = document.createElement('div');
        overlay.className = 'item-overlay';
        overlay.innerHTML = `
            <div class="item-title">${item.title}</div>
            <div class="item-tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
            <div class="item-names">${item.names.join(', ')}</div>
        `;
        galleryItem.appendChild(overlay);

        gallery.appendChild(galleryItem);
    });

    this.renderPagination();
}

        loadMoreMobileItems() {
    if (!this.swipeWrapper) return;
    const batchSize = this.mobileBatchSize || 3;
    const start = this.loadedMobileCount || 0;
    const end = Math.min(start + batchSize, this.filteredData.length);

    for (let i = start; i < end; i++) {
        const item = this.filteredData[i];
        const mobileItem = document.createElement('div');
        mobileItem.className = 'mobile-item loading'; // <-- Add loading class

        let mediaElement;
        if (item.type === 'video') {
            mediaElement = document.createElement('video');
            mediaElement.poster = item.poster || 'assets/video.png';
            mediaElement.preload = 'none';

            const source = document.createElement('source');
            source.src = item.src;
            source.type = 'video/mp4';
            mediaElement.appendChild(source);

            mediaElement.addEventListener('loadeddata', () => {
                mobileItem.classList.remove('loading');
            });
            mediaElement.addEventListener('error', () => {
                mobileItem.classList.remove('loading');
            });
        } else {
            mediaElement = document.createElement('img');
            mediaElement.src = item.src;
            mediaElement.alt = item.title;
            mediaElement.loading = 'lazy';

            mediaElement.addEventListener('load', () => {
                mobileItem.classList.remove('loading');
            });
            mediaElement.addEventListener('error', () => {
                mobileItem.classList.remove('loading');
            });
        }

        mobileItem.appendChild(mediaElement);

        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        overlay.innerHTML = `
            <div class="item-title">${item.title}</div>
            <div class="item-tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
            <div class="item-names">${item.names.join(', ')}</div>
        `;
        mobileItem.appendChild(overlay);

        // Lightbox handler
        mobileItem.addEventListener('click', () => this.openLightbox(item));

        this.swipeWrapper.appendChild(mobileItem);
    }

    this.loadedMobileCount = end;
}

            setupMobileGallery() {
                    this.swipeWrapper = document.getElementById('mobileSwipeWrapper');
                    if (!this.swipeWrapper) return;
                
                    // Reset
                    this.swipeWrapper.innerHTML = '';
                    this.currentMobileIndex = 0;
                    this.loadedMobileCount = 0;
                    this.mobileBatchSize = 3; // How many to load per batch
                
                    // Load the first batch of items
                    this.loadMoreMobileItems();
                
                    this.updateMobilePosition();
                    this.updateProgressBar();
                    this.updateNavigationButtons();
                    this.setupSwipeIndicators();
                    this.resetSwipeHint();
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

                let mediaElement = '';
                if (item.type === 'video') {
                    mediaElement = `<video controls autoplay preload="auto">
                                     <source src="${item.src}" type="video/mp4">
                                   </video>`;
                } else {
                    mediaElement = `<img src="${item.src}" alt="${item.title}">`;
                }

                content.innerHTML = mediaElement;
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
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
                { name: 'Home', link:"index.html",active:""},
                { name: 'About', link:"about.html",active:""},
                { name: 'details', link:"details.html",active:""},
                { name: 'gallery', link:"gallery.html",active:""},
                { name: 'Prayers For The Couple', link:"prayers.html",active:""},
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
