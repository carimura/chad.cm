(function() {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    if (defaultTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }

    document.addEventListener('DOMContentLoaded', function() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        updateToggleButton(defaultTheme);

        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();

            const isDark = document.documentElement.classList.toggle('dark');
            const newTheme = isDark ? 'dark' : 'light';

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
