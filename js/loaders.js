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

    Promise.all([
        loadComponent('header.html', 'header-container'),
        loadComponent('nav_bar.html', 'nav-bar-container'),
        loadComponent('submit_capstone_modal.html', 'modal-container')
    ]);
});