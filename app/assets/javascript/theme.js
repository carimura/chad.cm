(function() {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    // Theme states: 'auto' (system default), 'light', 'dark'
    function getTheme() {
        const stored = localStorage.getItem('theme');
        return (stored === 'light' || stored === 'dark') ? stored : 'auto';
    }

    function applyTheme(theme) {
        const dark = theme === 'dark' || (theme === 'auto' && media.matches);
        document.documentElement.classList.toggle('dark', dark);
    }

    applyTheme(getTheme());

    document.addEventListener('DOMContentLoaded', function() {
        const siteTheme = document.getElementById('site-theme');
        const themeToggle = document.getElementById('theme-toggle');

        if (siteTheme) {
            const path = window.location.pathname;
            if (path === '/bbs/' || path.startsWith('/bbs/')) {
                siteTheme.value = '/bbs/';
            } else if (path === '/game/' || path.startsWith('/game/')) {
                siteTheme.value = '/game/';
            } else {
                siteTheme.value = 'normal';
            }

            siteTheme.addEventListener('change', function() {
                if (siteTheme.value === 'normal') {
                    window.location.href = '/';
                    return;
                }

                window.location.href = siteTheme.value;
            });
        }

        media.addEventListener('change', function() {
            if (getTheme() === 'auto') applyTheme('auto');
        });

        if (!themeToggle) return;

        const icons = {
            auto: document.getElementById('icon-auto'),
            light: document.getElementById('icon-light'),
            dark: document.getElementById('icon-dark')
        };
        const labels = {
            auto: 'Theme: system default. Click to switch to light.',
            light: 'Theme: light. Click to switch to dark.',
            dark: 'Theme: dark. Click to switch to system default.'
        };

        function updateToggle(theme) {
            for (const key in icons) {
                icons[key].style.display = key === theme ? 'block' : 'none';
            }
            themeToggle.setAttribute('aria-label', labels[theme]);
        }

        function setTheme(theme) {
            if (theme === 'auto') {
                localStorage.removeItem('theme');
            } else {
                localStorage.setItem('theme', theme);
            }
            applyTheme(theme);
            updateToggle(theme);
        }

        updateToggle(getTheme());

        // Cycle: auto -> light -> dark -> auto
        themeToggle.addEventListener('click', function() {
            const current = getTheme();
            setTheme(current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto');
        });
    });
})();
