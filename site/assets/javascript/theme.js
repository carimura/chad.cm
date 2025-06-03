(function() {
    const storedTheme = localStorage.getItem('theme');
    const defaultTheme = storedTheme || 'light';
    document.documentElement.style.colorScheme = defaultTheme;
    
    document.addEventListener('DOMContentLoaded', function() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        updateToggleButton(defaultTheme);
        
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            const currentTheme = document.documentElement.style.colorScheme;
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.style.colorScheme = newTheme;
            localStorage.setItem('theme', newTheme);
            updateToggleButton(newTheme);
        });
        
        function updateToggleButton(theme) {
            themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }
    });
})(); 