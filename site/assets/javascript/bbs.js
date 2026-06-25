document.addEventListener('DOMContentLoaded', function() {
    const root = document.querySelector('.bbs-page');
    if (!root) {
        return;
    }

    const buttons = Array.from(document.querySelectorAll('[data-board]'));
    const panels = Array.from(document.querySelectorAll('[data-board-panel]'));
    const log = document.getElementById('bbs-log');
    const form = document.getElementById('bbs-command');
    const input = document.getElementById('bbs-input');

    const commandAliases = {
        s: 'home',
        system: 'home',
        sysop: 'home',
        h: 'home',
        home: 'home',
        bbs: 'home',
        w: 'writing',
        f: 'writing',
        z: 'writing',
        writing: 'writing',
        writring: 'writing',
        posts: 'writing',
        m: 'thoughts',
        b: 'thoughts',
        r: 'thoughts',
        msg: 'thoughts',
        messages: 'thoughts',
        t: 'thoughts',
        thoughts: 'thoughts',
        c: 'speaking',
        a: 'speaking',
        callers: 'speaking',
        speaking: 'speaking',
        talk: 'speaking',
        talks: 'speaking',
        d: 'playground',
        p: 'playground',
        l: 'playground',
        n: 'playground',
        doors: 'playground',
        files: 'playground',
        playground: 'playground'
    };

    const boardAliases = {
        home: 'home',
        writing: 'writing',
        thoughts: 'thoughts',
        speaking: 'speaking',
        playground: 'doors'
    };

    const routes = {
        home: '/bbs/',
        writing: '/bbs/writing.html',
        thoughts: '/bbs/thoughts.html',
        speaking: '/bbs/speaking.html',
        playground: '/bbs/playground.html'
    };

    const labels = {
        home: 'SYSTEM INFO',
        writing: 'WRITE AREA',
        thoughts: 'MSG BASE',
        speaking: 'CALLERS',
        doors: 'DOOR GAMES',
        playground: 'DOOR GAMES'
    };

    function writeLog(message, tone) {
        if (!log) {
            return;
        }

        const line = document.createElement('p');
        if (tone) {
            line.className = tone;
        }
        line.textContent = message;
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
    }

    function showBoard(board, echo, activeButton) {
        if (!buttons.length || !panels.length) {
            return false;
        }

        buttons.forEach(button => {
            button.classList.remove('active');
        });

        const nextActiveButton = activeButton || buttons.find(button => button.dataset.board === board);
        if (nextActiveButton) {
            nextActiveButton.classList.add('active');
        }

        panels.forEach(panel => {
            panel.classList.toggle('active', panel.dataset.boardPanel === board);
        });

        if (echo) {
            writeLog('Loading ' + labels[board] + ' ... OK', 'bbs-green');
        }

        return true;
    }

    function routeCommand(section) {
        const route = routes[section];
        if (!route) {
            return false;
        }

        if (window.location.pathname === route) {
            writeLog('Already in ' + labels[section] + '.', 'bbs-green');
            return true;
        }

        const homepageBoard = boardAliases[section];
        if (window.location.pathname === '/bbs/' && homepageBoard && showBoard(homepageBoard, true)) {
            if (section !== 'home') {
                window.location.href = route;
            }
            return true;
        }

        window.location.href = route;
        return true;
    }

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            showBoard(button.dataset.board, true, button);
            input.focus({ preventScroll: true });
        });
    });

    if (!form || !input) {
        return;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const raw = input.value.trim();
        const command = raw.toLowerCase();
        if (!command) {
            return;
        }

        writeLog('C:\\CHADCM> ' + raw, 'bbs-cyan');
        input.value = '';

        if (commandAliases[command] && routeCommand(commandAliases[command])) {
            return;
        }

        if (command === 'help' || command === '?') {
            writeLog('Commands: home, writing, thoughts, speaking, playground, exit', 'bbs-amber');
            return;
        }

        if (command === 'clear' || command === 'cls') {
            if (log) {
                log.innerHTML = '';
            }
            writeLog('Screen cleared. Carrier still hot.', 'bbs-green');
            return;
        }

        if (command === 'exit' || command === 'quit' || command === '0') {
            window.location.href = '/';
            return;
        }

        writeLog('Unknown command "' + raw + '". Type HELP for the command list.', 'bbs-alert');
    });

    document.addEventListener('keydown', function(event) {
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }

        const tagName = document.activeElement ? document.activeElement.tagName : '';
        const isTyping = tagName === 'INPUT' || tagName === 'TEXTAREA';
        const key = event.key.toLowerCase();

        if (commandAliases[key] && !isTyping) {
            event.preventDefault();
            routeCommand(commandAliases[key]);
            input.focus({ preventScroll: true });
        }
    });

    if (log) {
        setTimeout(function() {
            writeLog('Last caller: a curious builder from the public internet', 'bbs-amber');
        }, 800);
    }

    input.focus({ preventScroll: true });
});
