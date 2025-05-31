(function() {
    const storedTheme = localStorage.getItem('theme');
    const defaultTheme = storedTheme || 'light';
    document.documentElement.style.colorScheme = defaultTheme;
    
    document.addEventListener('DOMContentLoaded', function() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        // Update button on load
        updateToggleButton(defaultTheme);
        
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent any default button behavior
            
            const currentTheme = document.documentElement.style.colorScheme;
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Apply new theme
            document.documentElement.style.colorScheme = newTheme;
            localStorage.setItem('theme', newTheme);
            updateToggleButton(newTheme);
            
            // Force style recalculation on mobile
            document.documentElement.style.display = 'none';
            document.documentElement.offsetHeight; // Trigger reflow
            document.documentElement.style.display = '';
        });
        
        function updateToggleButton(theme) {
            themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }
    });
})(); 