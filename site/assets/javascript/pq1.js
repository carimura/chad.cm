(() => {
    const world = document.getElementById('pq1-world');
    const officer = document.getElementById('pq1-officer');
    const locationLabel = document.getElementById('pq1-location');
    const leftButton = document.getElementById('pq1-left');
    const rightButton = document.getElementById('pq1-right');
    const parser = document.getElementById('pq1-parser');
    const command = document.getElementById('pq1-command');

    if (!world || !officer) {
        return;
    }

    const rooms = [
        { label: 'CHAD.CM', command: 'home', path: '/' },
        { label: 'WRITING', command: 'writing', path: '/writing.html' },
        { label: 'THOUGHTS', command: 'thoughts', path: '/thoughts.html' },
        { label: 'SPEAKING', command: 'speaking', path: '/speaking.html' },
        { label: 'PLAYGROUND', command: 'playground', path: '/playground.html' }
    ];
    let position = 0;
    let frame = 0;

    function setPosition(next, direction = 'idle') {
        position = Math.max(0, Math.min(rooms.length - 1, next));
        world.style.setProperty('--pq1-position', String(position));
        if (locationLabel) {
            locationLabel.textContent = rooms[position].label;
        }
        officer.dataset.direction = direction;
        if (direction === 'idle') {
            officer.dataset.step = '0';
        } else {
            frame += 1;
            officer.dataset.step = String(frame % 2);
        }
    }

    function walk(delta) {
        const direction = delta < 0 ? 'left' : 'right';
        setPosition(position + delta, direction);
        window.clearTimeout(walk.idleTimer);
        walk.idleTimer = window.setTimeout(() => setPosition(position), 260);
    }

    leftButton?.addEventListener('click', () => walk(-1));
    rightButton?.addEventListener('click', () => walk(1));

    document.addEventListener('keydown', (event) => {
        if (event.target === command) {
            return;
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            walk(-1);
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            walk(1);
        }
    });

    parser?.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = command.value.trim().toLowerCase();
        const targetIndex = rooms.findIndex((room) => room.command === value || room.label.toLowerCase() === value);

        if (value === 'look') {
            command.value = `You are outside ${rooms[position].label}.`;
            command.select();
            return;
        }
        if (value === 'exit' || value === 'www') {
            window.location.href = '/';
            return;
        }
        if (targetIndex >= 0) {
            const direction = targetIndex < position ? 'left' : targetIndex > position ? 'right' : 'idle';
            setPosition(targetIndex, direction);
            window.clearTimeout(walk.idleTimer);
            walk.idleTimer = window.setTimeout(() => setPosition(position), 420);
            command.value = '';
            return;
        }

        command.value = "I don't understand.";
        command.select();
    });

    setPosition(0);
})();
