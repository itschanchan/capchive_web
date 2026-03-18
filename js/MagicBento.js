// Data Configuration
const cardData = [
  {
    color: '#ffffff',
    title: 'Analytics',
    description: 'Track user behavior',
    label: 'Insights'
  },
  {
    color: '#ffffff',
    title: 'Dashboard',
    description: 'Centralized data view',
    label: 'Overview'
  },
  {
    color: '#ffffff',
    title: 'Collaboration',
    description: 'Work together seamlessly',
    label: 'Teamwork'
  },
  {
    color: '#ffffff',
    title: 'Automation',
    description: 'Streamline workflows',
    label: 'Efficiency'
  },
  {
    color: '#ffffff',
    title: 'Integration',
    description: 'Connect favorite tools',
    label: 'Connectivity'
  },
  {
    color: '#ffffff',
    title: 'Security',
    description: 'Enterprise-grade protection',
    label: 'Protection'
  }
];

export default class MagicBento {
    constructor(container, config = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        
        // Default Configuration
        this.config = {
            textAutoHide: true,
            enableStars: false,
            enableSpotlight: false,
            enableBorderGlow: false,
            enableTilt: false,
            enableMagnetism: false,
            clickEffect: true,
            spotlightRadius: 300,
            particleCount: 12,
            glowColor: '0, 54, 77',
            disableAnimations: true,
            ...config
        };

        this.init();
    }

    init() {
        if (!this.container) {
            console.error('MagicBento: Container not found');
            return;
        }
        this.render();
        this.attachEvents();
    }

    render() {
        const { textAutoHide, enableBorderGlow, glowColor } = this.config;
        
        const grid = document.createElement('div');
        grid.className = 'card-grid bento-section';

        cardData.forEach((card) => {
            const cardEl = document.createElement('div');
            
            // Build class list
            let classes = 'magic-bento-card';
            if (textAutoHide) classes += ' magic-bento-card--text-autohide';
            if (enableBorderGlow) classes += ' magic-bento-card--border-glow';
            
            cardEl.className = classes;
            
            // Styles
            cardEl.style.backgroundColor = card.color;
            cardEl.style.setProperty('--glow-color', glowColor);

            // Inner HTML
            cardEl.innerHTML = `
                <div class="magic-bento-card__header">
                    <div class="magic-bento-card__label">${card.label}</div>
                </div>
                <div class="magic-bento-card__content">
                    <h2 class="magic-bento-card__title">${card.title}</h2>
                    <p class="magic-bento-card__description">${card.description}</p>
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