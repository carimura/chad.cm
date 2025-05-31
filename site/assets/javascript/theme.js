(function() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.style.colorScheme = currentTheme;
    document.addEventListener('DOMContentLoaded', function() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        updateToggleButton(currentTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.style.colorScheme || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.style.colorScheme = newTheme;
            localStorage.setItem('theme', newTheme);
            updateToggleButton(newTheme);
        });
        
        function updateToggleButton(theme) {
            themeToggle.innerHTML = theme === 'dark' 
                ? '☀️'
                : '🌙';
            themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }
    });
})(); 