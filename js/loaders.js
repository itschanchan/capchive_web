import MagicBento from './MagicBento.js';
import { setupFilter } from './capchiveFilter.js';

document.addEventListener('DOMContentLoaded', function() {
    const loadComponent = (url, elementId) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${url}`);
                return response.text();
            })
            .then(data => {
                const container = document.getElementById(elementId);
                container.innerHTML = data;

                // Execute scripts found in the loaded component
                container.querySelectorAll('script').forEach(script => {
                    const newScript = document.createElement('script');
                    Array.from(script.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.appendChild(document.createTextNode(script.innerHTML));
                    script.parentNode.replaceChild(newScript, script);
                });
            })
            .catch(error => console.error(error));
    };

    async function main() {
        // Load all HTML components concurrently
        await Promise.all([
            loadComponent('header.html', 'header-container'),
            loadComponent('nav_bar.html', 'nav-bar-container'),
            loadComponent('submit_capstone_modal.html', 'modal-container')
        ]);

        // Initialize the MagicBento grid
        const mainContent = document.querySelector('.main-content');
        const bentoConfig = {
            enableBorderGlow: true,
            clickEffect: true,
            glowColor: '0, 54, 77',
        };
        const bento = new MagicBento(mainContent, bentoConfig);
        await bento.init();

        // Initialize Filter Dropdown Logic
        setupFilter(bento);

        // Set up navigation pill filtering
        const pills = document.querySelectorAll('.nav-pills .pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Update active state
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                // Get category from button text and filter
                const category = pill.textContent.trim();
                bento.filter(category);
            });
        });
    }

    main().catch(error => console.error("Initialization failed:", error));
});