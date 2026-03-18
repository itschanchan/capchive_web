export default class MagicBento {
    constructor(container, config = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.allCardData = [];
        
        // Default Configuration
        this.currentData = []; // Store currently displayed data for sorting
        this.config = {
            textAutoHide: true,
            enableStars: false,
            enableSpotlight: false,
            enableBorderGlow: false,
            enableTilt: true,
            enableMagnetism: false,
            clickEffect: true,
            spotlightRadius: 300,
            particleCount: 12,
            glowColor: '0, 54, 77',
            disableAnimations: true,
            ...config
        };
    }

    async init() {
        if (!this.container) {
            console.error('MagicBento: Container not found');
            return;
        }
        await this.fetchData();
        this.render(this.allCardData);
        this.attachEvents();
    }

    async fetchData() {
        try {
            const response = await fetch('./js/cardData.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.allCardData = await response.json();
            this.currentData = [...this.allCardData]; // Initialize currentData
        } catch (error) {
            console.error("Could not fetch card data:", error);
        }
    }

    render(cardsToRender) {
        this.container.innerHTML = ''; // Clear previous content
        const { enableBorderGlow, glowColor } = this.config;
        
        const grid = document.createElement('div');
        grid.className = 'card-grid bento-section';

        if (!cardsToRender || cardsToRender.length === 0) {
            grid.innerHTML = `<p style="color: #555; text-align: center; grid-column: 1 / -1; padding: 2rem 0;">No projects found for this category.</p>`;
            this.container.appendChild(grid);
            return;
        }

        cardsToRender.forEach((card) => {
            const cardEl = document.createElement('div');
            
            // Build class list
            let classes = 'magic-bento-card';
            if (enableBorderGlow) classes += ' magic-bento-card--border-glow';
            
            cardEl.className = classes;
            
            // Styles
            cardEl.style.backgroundColor = '#ffffff';
            cardEl.style.setProperty('--glow-color', glowColor);

            // Inner HTML
            cardEl.innerHTML = `
                <div style="flex: 1; overflow: hidden; border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
                    <img src="${card.image}" alt="${card.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                <div style="flex-shrink: 0;">
                    <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 4px; color: #2c3e50;">${card.title}</div>
                    <small style="display: block; color: #6c757d; margin-bottom: 10px;">${card.authors}</small>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                        <span style="background-color: var(--button-hover-bg-color); color: var(--header-bg-color); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">${card.year}</span>
                        <span style="background-color: var(--nav-btn-bg-color); color: var(--header-bg-color); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">${card.course}</span>
                    </div>
                </div>
            `;

            grid.appendChild(cardEl);
        });

        this.container.appendChild(grid);
    }

    attachEvents() {
        const cards = this.container.querySelectorAll('.magic-bento-card');

        cards.forEach(card => {
            // Click Effect
            if (this.config.clickEffect) {
                card.addEventListener('click', (e) => this.handleClick(e, card));
            }

            // Mouse Move (Tilt/Magnetism logic would go here if enabled)
            if (!this.config.disableAnimations && (this.config.enableTilt || this.config.enableMagnetism)) {
                card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
                card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
            }
        });
    }

    handleClick(e, element) {
        if (!window.gsap) return;

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const maxDistance = Math.max(
            Math.hypot(x, y),
            Math.hypot(x - rect.width, y),
            Math.hypot(x, y - rect.height),
            Math.hypot(x - rect.width, y - rect.height)
        );

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${maxDistance * 2}px;
            height: ${maxDistance * 2}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(${this.config.glowColor}, 0.4) 0%, rgba(${this.config.glowColor}, 0.2) 30%, transparent 70%);
            left: ${x - maxDistance}px;
            top: ${y - maxDistance}px;
            pointer-events: none;
            z-index: 1000;
        `;

        element.appendChild(ripple);

        gsap.fromTo(
            ripple,
            { scale: 0, opacity: 1 },
            {
                scale: 1,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            }
        );
    }

    filter(category) {
        const filteredData = category === 'All'
            ? this.allCardData
            : this.allCardData.filter(card => card.course === category);
        
        this.render(filteredData);
        this.attachEvents();
    }
    
    sort(criteria) {
        // If we haven't filtered yet, use all data, otherwise use the current subset
        // For simplicity, we'll sort whatever is 'currentData' or 'allCardData'
        // Note: Ideally, 'filter' should update 'currentData'. Let's fix filter first.
        
        let dataToSort = [...this.currentData]; 

        switch (criteria) {
            case 'Relevance':
                // Default order from JSON
                // To restore default relative to current filter, we might need original indices, 
                // but here we'll just reset to allCardData if no filter is active, or just shuffle/reset.
                // For this implementation, let's treat "Relevance" as "Default ID order".
                // Since we don't track IDs, we'll just use the text comparison or no-op.
                break;
            case 'Latest':
                dataToSort.sort((a, b) => b.year - a.year);
                break;
            case 'Most Viewed':
                // Simulation: Random sort or by title length for demo
                dataToSort.sort(() => Math.random() - 0.5); 
                break;
            case 'Highest Rated':
                // Simulation: Reverse alphabetical by title for demo
                dataToSort.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
        this.render(dataToSort);
        this.attachEvents();
    }

    filter(category) {
        this.currentData = category === 'All'
            ? [...this.allCardData]
            : this.allCardData.filter(card => card.course === category);
        
        this.render(this.currentData);
        this.attachEvents();
    }

    // Placeholder handlers for features if enabled in future
    handleMouseMove(e, element) {
        if (this.config.disableAnimations) return;
        // Tilt/Magnetism logic implementation...
    }

    handleMouseLeave(e, element) {
        if (this.config.disableAnimations) return;
        // Reset Tilt/Magnetism...
    }
}