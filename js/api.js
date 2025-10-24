/**
 * DevCheatHub API
 * Handles fetching and processing cheatsheets from devhints.io
 */
class DevCheatAPI {
    constructor() {
        this.baseUrl = 'https://devhints.io';
        this.githubApiUrl = 'https://api.github.com/repos/rstacruz/cheatsheets/contents';
        this.cache = {};
        this.categories = {
            languages: ['javascript', 'typescript', 'python', 'ruby', 'go', 'php', 'java', 'csharp', 'cpp', 'rust'],
            frontend: ['react', 'vue', 'angular', 'css', 'sass', 'html', 'dom', 'svg', 'webpack', 'npm'],
            backend: ['nodejs', 'express', 'rails', 'django', 'flask', 'laravel', 'spring', 'dotnet'],
            tools: ['git', 'bash', 'vim', 'vscode', 'docker', 'kubernetes', 'terraform', 'ansible'],
            databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'graphql']
        };
        
        // Initialize local storage cache
        this.initCache();
    }

    /**
     * Initialize cache from localStorage if available
     */
    initCache() {
        try {
            const cachedData = localStorage.getItem('devcheat_cache');
            if (cachedData) {
                this.cache = JSON.parse(cachedData);
            }
        } catch (error) {
            console.error('Error initializing cache:', error);
        }
    }

    /**
     * Save cache to localStorage
     */
    saveCache() {
        try {
            localStorage.setItem('devcheat_cache', JSON.stringify(this.cache));
        } catch (error) {
            console.error('Error saving cache:', error);
        }
    }

    /**
     * Get list of available cheatsheets from GitHub API
     * @returns {Promise<Array>} List of cheatsheet files
     */
    async getAvailableCheatsheets() {
        if (this.cache.availableCheatsheets) {
            return this.cache.availableCheatsheets;
        }

        try {
            // For demo purposes, we'll use a fallback list if GitHub API fails
            const cheatsheets = await this.getFallbackCheatsheets();
            
            // Cache the results
            this.cache.availableCheatsheets = cheatsheets;
            this.saveCache();
            
            return cheatsheets;
        } catch (error) {
            console.error('Error fetching available cheatsheets:', error);
            return this.getFallbackCheatsheets();
        }
    }

    /**
     * Fallback list of cheatsheets in case GitHub API fails
     * @returns {Array} List of cheatsheet objects
     */
    getFallbackCheatsheets() {
        const cheatsheets = [];
        
        // Add languages
        this.categories.languages.forEach(lang => {
            cheatsheets.push({
                name: lang,
                path: `${lang}.md`,
                category: 'languages',
                displayName: this.formatDisplayName(lang),
                popularity: this.getPopularityScore(lang)
            });
        });
        
        // Add frontend
        this.categories.frontend.forEach(item => {
            cheatsheets.push({
                name: item,
                path: `${item}.md`,
                category: 'frontend',
                displayName: this.formatDisplayName(item),
                popularity: this.getPopularityScore(item)
            });
        });
        
        // Add backend
        this.categories.backend.forEach(item => {
            cheatsheets.push({
                name: item,
                path: `${item}.md`,
                category: 'backend',
                displayName: this.formatDisplayName(item),
                popularity: this.getPopularityScore(item)
            });
        });
        
        // Add tools
        this.categories.tools.forEach(item => {
            cheatsheets.push({
                name: item,
                path: `${item}.md`,
                category: 'tools',
                displayName: this.formatDisplayName(item),
                popularity: this.getPopularityScore(item)
            });
        });
        
        // Add databases
        this.categories.databases.forEach(item => {
            cheatsheets.push({
                name: item,
                path: `${item}.md`,
                category: 'databases',
                displayName: this.formatDisplayName(item),
                popularity: this.getPopularityScore(item)
            });
        });
        
        return cheatsheets;
    }

    /**
     * Format display name for cheatsheet
     * @param {string} name - Raw name of cheatsheet
     * @returns {string} Formatted display name
     */
    formatDisplayName(name) {
        const specialCases = {
            'js': 'JavaScript',
            'ts': 'TypeScript',
            'nodejs': 'Node.js',
            'csharp': 'C#',
            'cpp': 'C++',
            'dotnet': '.NET',
            'vscode': 'VS Code',
            'postgresql': 'PostgreSQL',
            'mysql': 'MySQL',
            'mongodb': 'MongoDB',
            'redis': 'Redis',
            'graphql': 'GraphQL',
            'elasticsearch': 'Elasticsearch',
            'css': 'CSS',
            'html': 'HTML',
            'svg': 'SVG',
            'dom': 'DOM',
            'npm': 'npm'
        };
        
        if (specialCases[name]) {
            return specialCases[name];
        }
        
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    /**
     * Get a mock popularity score for a cheatsheet
     * @param {string} name - Name of cheatsheet
     * @returns {number} Popularity score (1-100)
     */
    getPopularityScore(name) {
        const popularItems = {
            'javascript': 98,
            'python': 95,
            'git': 92,
            'react': 90,
            'css': 88,
            'nodejs': 85,
            'typescript': 82,
            'docker': 80,
            'bash': 78,
            'vue': 75
        };
        
        return popularItems[name] || Math.floor(Math.random() * 70) + 10;
    }

    /**
     * Get cheatsheet content from devhints.io
     * @param {string} name - Name of cheatsheet
     * @returns {Promise<Object>} Cheatsheet content and metadata
     */
    async getCheatsheet(name) {
        const cacheKey = `cheatsheet_${name}`;
        
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }
        
        try {
            // In a real implementation, we would fetch from devhints.io
            // For demo purposes, we'll create mock content
            const content = await this.getMockCheatsheetContent(name);
            
            // Cache the results
            this.cache[cacheKey] = content;
            this.saveCache();
            
            return content;
        } catch (error) {
            console.error(`Error fetching cheatsheet ${name}:`, error);
            return {
                title: this.formatDisplayName(name),
                content: `<div class="error">Failed to load cheatsheet for ${name}. Please try again later.</div>`,
                error: true
            };
        }
    }

    /**
     * Create mock cheatsheet content for demo purposes
     * @param {string} name - Name of cheatsheet
     * @returns {Object} Mock cheatsheet content and metadata
     */
    async getMockCheatsheetContent(name) {
        const displayName = this.formatDisplayName(name);
        
        // Basic structure for all cheatsheets
        const content = {
            title: displayName,
            sections: []
        };
        
        // Add sections based on cheatsheet type
        switch (name) {
            case 'javascript':
                content.sections = [
                    {
                        title: 'Basics',
                        items: [
                            { code: 'const name = "value"', description: 'Constant declaration' },
                            { code: 'let name = "value"', description: 'Variable declaration' },
                            { code: 'var name = "value"', description: 'Old-style variable' }
                        ]
                    },
                    {
                        title: 'Functions',
                        items: [
                            { code: 'function name(params) {\n  // code\n}', description: 'Function declaration' },
                            { code: 'const name = function(params) {\n  // code\n}', description: 'Function expression' },
                            { code: 'const name = (params) => {\n  // code\n}', description: 'Arrow function' }
                        ]
                    },
                    {
                        title: 'Arrays',
                        items: [
                            { code: 'const arr = [1, 2, 3]', description: 'Array declaration' },
                            { code: 'arr.map(item => item * 2)', description: 'Map over array' },
                            { code: 'arr.filter(item => item > 1)', description: 'Filter array' }
                        ]
                    }
                ];
                break;
                
            case 'python':
                content.sections = [
                    {
                        title: 'Basics',
                        items: [
                            { code: 'name = "value"', description: 'Variable assignment' },
                            { code: 'name: str = "value"', description: 'Type hinted variable' },
                            { code: 'CONSTANT = "value"', description: 'Constant (by convention)' }
                        ]
                    },
                    {
                        title: 'Functions',
                        items: [
                            { code: 'def function_name(params):\n    # code\n    return value', description: 'Function definition' },
                            { code: 'lambda params: expression', description: 'Lambda function' }
                        ]
                    },
                    {
                        title: 'Lists',
                        items: [
                            { code: 'my_list = [1, 2, 3]', description: 'List creation' },
                            { code: '[x * 2 for x in my_list]', description: 'List comprehension' },
                            { code: 'my_list.append(4)', description: 'Add to list' }
                        ]
                    }
                ];
                break;
                
            // Add more cases for other cheatsheets
            default:
                content.sections = [
                    {
                        title: `${displayName} Basics`,
                        items: [
                            { code: '// Example code for ' + displayName, description: 'Basic example' },
                            { code: '// Another example', description: 'Another basic example' }
                        ]
                    }
                ];
        }
        
        // Convert to HTML
        content.html = this.convertToHtml(content);
        
        return content;
    }

    /**
     * Convert cheatsheet content to HTML
     * @param {Object} content - Cheatsheet content object
     * @returns {string} HTML representation
     */
    convertToHtml(content) {
        let html = `<h1>${content.title} Cheatsheet</h1>`;
        
        content.sections.forEach(section => {
            html += `<div class="cheatsheet-section">
                <h2>${section.title}</h2>
                <div class="cheatsheet-items">`;
                
            section.items.forEach(item => {
                html += `<div class="cheatsheet-item">
                    <pre><code>${this.escapeHtml(item.code)}</code></pre>
                    <div class="description">${item.description}</div>
                </div>`;
            });
            
            html += `</div></div>`;
        });
        
        return html;
    }

    /**
     * Escape HTML special characters
     * @param {string} html - String to escape
     * @returns {string} Escaped string
     */
    escapeHtml(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Get popular cheatsheets
     * @param {number} limit - Maximum number to return
     * @returns {Promise<Array>} List of popular cheatsheets
     */
    async getPopularCheatsheets(limit = 6) {
        const cheatsheets = await this.getAvailableCheatsheets();
        return cheatsheets
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, limit);
    }

    /**
     * Get cheatsheets by category
     * @param {string} category - Category name
     * @param {number} limit - Maximum number to return
     * @returns {Promise<Array>} List of cheatsheets in category
     */
    async getCheatsheetsByCategory(category, limit = 6) {
        const cheatsheets = await this.getAvailableCheatsheets();
        return cheatsheets
            .filter(sheet => sheet.category === category)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, limit);
    }

    /**
     * Search cheatsheets
     * @param {string} query - Search query
     * @returns {Promise<Array>} List of matching cheatsheets
     */
    async searchCheatsheets(query) {
        if (!query) return [];
        
        const cheatsheets = await this.getAvailableCheatsheets();
        const lowerQuery = query.toLowerCase();
        
        return cheatsheets.filter(sheet => {
            return sheet.name.toLowerCase().includes(lowerQuery) || 
                   sheet.displayName.toLowerCase().includes(lowerQuery);
        });
    }
}

// Create and export a singleton instance
const api = new DevCheatAPI();