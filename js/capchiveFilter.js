// capchiveFilter.js

export function setupFilter(bento) {
    // Select the first dropdown (Filter)
    const filterDropdownItems = document.querySelectorAll('.nav-actions .dropdown:first-child .dropdown-menu .dropdown-item');
    const filterButton = document.querySelector('.nav-actions .dropdown:first-child .action-btn');

    if (!filterDropdownItems.length || !filterButton) {
        console.error('Filter dropdown items or button not found.');
        return;
    }

    filterDropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const criteria = e.target.textContent.trim();
            
            // Update button text to show selected filter
            filterButton.innerHTML = `${criteria} <span class="material-symbols-outlined">filter_alt</span>`;
            
            // Trigger sort/filter on the bento instance
            bento.sort(criteria);
        });
    });
}
