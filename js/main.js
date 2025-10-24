// Event listener for DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Sort functionality
    const sortOptions = document.querySelectorAll('.sort-btn');
    if (sortOptions) {
        sortOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all buttons
                sortOptions.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const sortBy = this.getAttribute('data-sort');
                console.log(`Sorting by: ${sortBy}`);
                // In a real application, this would sort the cheatsheets
                // Trigger sorting of the current dataset
                if (window.DevCheatHub && typeof window.DevCheatHub.applySort === 'function') {
                    window.DevCheatHub.applySort(sortBy);
                }
            });
        });
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const nav = document.querySelector('nav ul');
            nav.classList.toggle('show');
        });
    }
    
    // Category section click handler
    const categoryHeadings = document.querySelectorAll('.category-container h3');
    if (categoryHeadings) {
        categoryHeadings.forEach(heading => {
            heading.addEventListener('click', function() {
                const cheatsheetGrid = this.nextElementSibling;
                if (cheatsheetGrid) {
                    cheatsheetGrid.classList.toggle('expanded');
                    this.classList.toggle('active');
                }
            });
        });
    }
});

// Dynamic navigation with devhint.io integration
document.addEventListener('click', function(e) {
    // Handle cheatsheet card clicks
    const card = e.target.closest('.cheatsheet-card');
    if (card) {
        e.preventDefault();
        const language = card.querySelector('h4') ? card.querySelector('h4').textContent : card.getAttribute('data-name');
        if (!language) return;
        // Redirect to dynamic page with language parameter
        window.location.href = `cheatsheets/dynamic.html?lang=${encodeURIComponent(language)}`;
    }
});

// ---------------------------
// Home page integration code
// ---------------------------
(function initHome() {
    if (!document.querySelector('#popular-cheatsheets')) return; // Only run on homepage

    const state = {
        all: [],
        filtered: [],
        page: 1,
        pageSize: 12,
        sortBy: 'relevance',
        query: ''
    };

    function formatName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    function cardHTML(sheet) {
        const display = sheet.displayName || formatName(sheet.name);
        return `
        <a href="cheatsheets/dynamic.html?lang=${encodeURIComponent(display)}" class="cheatsheet-card" data-name="${display}">
            <div class="card-header">
                <h4>${display}</h4>
                <span class="badge">${sheet.category}</span>
            </div>
            <div class="card-body">
                <div class="meta">
                    <span><i class="fas fa-fire"></i> ${sheet.popularity}</span>
                    <span><i class="fas fa-heart"></i> ${sheet.likes || Math.floor(Math.random()*200)+50}</span>
                </div>
            </div>
        </a>`;
    }

    function renderList(containerId, list) {
        const container = document.getElementById(containerId);
        if (!container) return;
        if (!list || list.length === 0) {
            container.innerHTML = '<div class="loading">No cheatsheets found.</div>';
            return;
        }
        container.innerHTML = list.map(cardHTML).join('');
    }

    function applySort(list, sortBy) {
        switch (sortBy) {
            case 'popularity':
                return [...list].sort((a,b) => (b.popularity||0) - (a.popularity||0));
            case 'newest':
                return [...list].sort((a,b) => new Date(b.updatedAt||Date.now()) - new Date(a.updatedAt||Date.now()));
            case 'relevance':
            default:
                return list; // keep current filtered order
        }
    }

    async function loadInitial() {
        // Popular
        const popular = await api.getPopularCheatsheets(6);
        renderList('popular-cheatsheets', popular);

        // Categories
        const languages = await api.getCheatsheetsByCategory('languages', 6);
        renderList('languages-cheatsheets', languages);
        const frontend = await api.getCheatsheetsByCategory('frontend', 6);
        renderList('frontend-cheatsheets', frontend);
        const backend = await api.getCheatsheetsByCategory('backend', 6);
        renderList('backend-cheatsheets', backend);
        const tools = await api.getCheatsheetsByCategory('tools', 6);
        renderList('tools-cheatsheets', tools);
        const databases = await api.getCheatsheetsByCategory('databases', 6);
        renderList('databases-cheatsheets', databases);

        // All
        state.all = await api.getAvailableCheatsheets();
        state.filtered = state.all.slice(0, state.pageSize);
        renderList('all-cheatsheets', state.filtered);
    }

    function runSearch() {
        const input = document.getElementById('search-input');
        const query = (input?.value || '').trim();
        state.query = query;
        if (!query) {
            state.filtered = state.all.slice(0, state.pageSize);
        } else {
            api.searchCheatsheets(query).then(results => {
                state.filtered = applySort(results, state.sortBy);
                renderList('all-cheatsheets', state.filtered);
            });
            return;
        }
        state.filtered = applySort(state.filtered, state.sortBy);
        renderList('all-cheatsheets', state.filtered);
    }

    function bindEvents() {
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        if (searchBtn) searchBtn.addEventListener('click', runSearch);
        if (searchInput) searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') runSearch();
        });

        const loadMore = document.getElementById('load-more-btn');
        if (loadMore) {
            loadMore.addEventListener('click', () => {
                state.page += 1;
                const end = state.page * state.pageSize;
                const next = state.all.slice(0, end);
                state.filtered = applySort(next, state.sortBy);
                renderList('all-cheatsheets', state.filtered);
            });
        }

        // Removed page-specific theme toggle. Handled globally by theme.js
    }

    // Expose for sort button handler above
    window.DevCheatHub = {
        applySort: (sortBy) => {
            state.sortBy = sortBy;
            state.filtered = applySort(state.filtered, sortBy);
            renderList('all-cheatsheets', state.filtered);
        }
    };

    // Initialize
    bindEvents();
    loadInitial();
})();