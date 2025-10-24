// Dynamic cheatsheet viewer controller
(function() {
  document.addEventListener('DOMContentLoaded', async () => {
    // Get the language from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get('lang');

    if (!language) {
      document.getElementById('cheatsheet-content').innerHTML = `
        <div class="error-message">
          <h2>Error</h2>
          <p>No language specified. Please select a language from the home page.</p>
          <a href="../index.html" class="btn">Go Back Home</a>
        </div>
      `;
      return;
    }

    // Normalize language display to slug for API
    function toSlug(display) {
      const map = {
        'javascript': 'javascript', 'JavaScript': 'javascript',
        'typescript': 'typescript', 'TypeScript': 'typescript',
        'python': 'python', 'Python': 'python',
        'ruby': 'ruby', 'Ruby': 'ruby',
        'go': 'go', 'Go': 'go',
        'php': 'php', 'PHP': 'php',
        'java': 'java', 'Java': 'java',
        'c#': 'csharp', 'C#': 'csharp', 'csharp': 'csharp',
        'c++': 'cpp', 'C++': 'cpp', 'cpp': 'cpp',
        'rust': 'rust', 'Rust': 'rust',
        'node.js': 'nodejs', 'Node.js': 'nodejs', 'nodejs': 'nodejs',
        '.NET': 'dotnet', 'dotnet': 'dotnet',
        'VS Code': 'vscode', 'vscode': 'vscode',
        'React': 'react', 'react': 'react',
        'Vue': 'vue', 'vue': 'vue',
        'Angular': 'angular', 'angular': 'angular',
        'CSS': 'css', 'css': 'css',
        'HTML': 'html', 'html': 'html',
        'Docker': 'docker', 'docker': 'docker',
        'Git': 'git', 'git': 'git',
        'Bash': 'bash', 'bash': 'bash'
      };
      return map[display] || display.toLowerCase();
    }

    const slug = toSlug(language);

    // Update the page title
    document.getElementById('cheatsheet-title').textContent = `${language} Cheatsheet`;
    document.getElementById('cheatsheet-description').textContent = `Quick reference guide for ${language}`;
    document.title = `${language} Cheatsheet - DevCheatSheet`;

    try {
      // Fetch the cheatsheet content from API (mock/devhints bridge)
      const cheatsheet = await api.getCheatsheet(slug);

      if (cheatsheet.error) {
        document.getElementById('cheatsheet-content').innerHTML = `
          <div class="error-message">
            <h2>Cheatsheet Not Available</h2>
            <p>We couldn't load the ${language} cheatsheet right now.</p>
            <a href="../index.html" class="btn">Go Back Home</a>
          </div>
        `;
        return;
      }

      // Display the content (already HTML)
      const contentDiv = document.getElementById('cheatsheet-content');
      contentDiv.innerHTML = cheatsheet.html;

      // Set random views and likes for demo purposes
      document.getElementById('views').textContent = Math.floor(Math.random() * 1000) + 500;
      document.getElementById('likes').textContent = Math.floor(Math.random() * 200) + 50;
      document.getElementById('last-updated').textContent = new Date().toLocaleDateString();

      // Add source attribution
      const sourceDiv = document.createElement('div');
      sourceDiv.className = 'source-link';
      sourceDiv.innerHTML = `Source: <a href="https://devhints.io/${encodeURIComponent(slug)}" target="_blank">DevHints.io</a>`;
      contentDiv.appendChild(sourceDiv);

      // Enhance code blocks with copy buttons
      document.querySelectorAll('pre code').forEach(codeBlock => {
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        btn.addEventListener('click', () => {
          navigator.clipboard.writeText(codeBlock.textContent);
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy', 1500);
        });
        codeBlock.parentElement.style.position = 'relative';
        btn.style.position = 'absolute';
        btn.style.top = '8px';
        btn.style.right = '8px';
        codeBlock.parentElement.appendChild(btn);
      });
    } catch (error) {
      console.error('Error loading cheatsheet:', error);
      document.getElementById('cheatsheet-content').innerHTML = `
        <div class="error-message">
          <h2>Error Loading Cheatsheet</h2>
          <p>There was a problem loading the ${language} cheatsheet.</p>
          <p>Error details: ${error.message}</p>
          <a href="../index.html" class="btn">Go Back Home</a>
        </div>
      `;
    }
  });
})();