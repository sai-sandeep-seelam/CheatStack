document.addEventListener('DOMContentLoaded', function() {
    // Tab switching for editors
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabContainer = this.closest('.editor-tabs').nextElementSibling;
            
            // Remove active class from all tabs
            this.parentElement.querySelectorAll('.tab-btn').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab content
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected tab content
            const activeTab = tabContainer.querySelector(`#${tabId}-tab`);
            if (activeTab) {
                activeTab.classList.add('active');
            }
            
            // If preview tab, render markdown
            if (tabId === 'preview' || tabId === 'preview-improve') {
                const textareaId = tabId === 'preview' ? 'content' : 'improvement-content';
                const textarea = document.getElementById(textareaId);
                const previewContent = tabContainer.querySelector('.preview-content');
                
                if (textarea && previewContent) {
                    // Simple markdown rendering (in a real app, use a proper markdown library)
                    const markdownText = textarea.value;
                    previewContent.innerHTML = renderMarkdown(markdownText);
                }
            }
        });
    });
    
    // Editor toolbar functionality
    const toolbarBtns = document.querySelectorAll('.toolbar-btn');
    toolbarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const textarea = this.closest('.editor-container').querySelector('textarea');
            
            if (!textarea) return;
            
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            let replacement = '';
            
            switch (action) {
                case 'heading':
                    replacement = `## ${selectedText}`;
                    break;
                case 'bold':
                    replacement = `**${selectedText}**`;
                    break;
                case 'italic':
                    replacement = `*${selectedText}*`;
                    break;
                case 'code':
                    replacement = `\`${selectedText}\``;
                    break;
                case 'codeblock':
                    replacement = `\`\`\`\n${selectedText}\n\`\`\``;
                    break;
                case 'link':
                    replacement = `[${selectedText}](url)`;
                    break;
                case 'list-ul':
                    replacement = selectedText.split('\n').map(line => `- ${line}`).join('\n');
                    break;
                case 'list-ol':
                    replacement = selectedText.split('\n').map((line, i) => `${i+1}. ${line}`).join('\n');
                    break;
            }
            
            // Insert the replacement text
            textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
            
            // Set cursor position after the inserted text
            textarea.focus();
            textarea.selectionStart = start + replacement.length;
            textarea.selectionEnd = start + replacement.length;
        });
    });
    
    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle the clicked item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // Form submission handling
    const newCheatsheetForm = document.getElementById('new-cheatsheet-form');
    if (newCheatsheetForm) {
        newCheatsheetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm(this)) {
                // In a real app, submit the form data to the server
                showNotification('Your cheatsheet has been submitted for review!', 'success');
                this.reset();
            }
        });
    }
    
    const improveCheatsheetForm = document.getElementById('improve-cheatsheet-form');
    if (improveCheatsheetForm) {
        improveCheatsheetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm(this)) {
                // In a real app, submit the form data to the server
                showNotification('Your improvement has been submitted for review!', 'success');
                this.reset();
            }
        });
    }
    
    // Save draft functionality
    const saveDraftBtn = document.querySelector('.btn-outline');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            const form = this.closest('form');
            if (form) {
                // In a real app, save the form data to local storage or server
                showNotification('Draft saved successfully!', 'info');
            }
        });
    }
});

// Simple form validation
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Add error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required';
            
            // Remove existing error messages
            const existingError = field.nextElementSibling;
            if (existingError && existingError.classList.contains('error-message')) {
                existingError.remove();
            }
            
            field.parentNode.insertBefore(errorMsg, field.nextSibling);
        } else {
            field.classList.remove('error');
            
            // Remove error message if exists
            const existingError = field.nextElementSibling;
            if (existingError && existingError.classList.contains('error-message')) {
                existingError.remove();
            }
        }
    });
    
    return isValid;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Simple markdown renderer (in a real app, use a proper markdown library)
function renderMarkdown(text) {
    if (!text) return '<p>Content preview will appear here...</p>';
    
    // Replace headings
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Replace bold and italic
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace code blocks
    text = text.replace(/```(.*?)\n([\s\S]*?)```/g, function(match, lang, code) {
        return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
    });
    
    // Replace inline code
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Replace links
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Replace unordered lists
    text = text.replace(/^\s*- (.*$)/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)\s+(?=<li>)/g, '$1</ul><ul>');
    text = text.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    
    // Replace ordered lists
    text = text.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)\s+(?=<li>)/g, '$1</ol><ol>');
    text = text.replace(/(<li>.*<\/li>)/g, '<ol>$1</ol>');
    
    // Replace paragraphs
    text = text.replace(/^(?!<[hou]|<li|<pre|<blockquote)(.+)$/gm, '<p>$1</p>');
    
    // Fix nested lists
    text = text.replace(/<\/ul>\s*<ul>/g, '');
    text = text.replace(/<\/ol>\s*<ol>/g, '');
    
    return text;
}