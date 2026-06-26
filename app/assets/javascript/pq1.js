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

    /* ------------------------------------------------------------------------
       Chunky-pixel sprite engine. A sprite is a palette + frames; each frame is
       a list of equal-length strings, one fat pixel per char ('.' = transparent
       and gets a dark auto-outline, '_' = hard hole that stays clear). Rendered
       to a 16x24 canvas and blown up with image-rendering:pixelated.
    ------------------------------------------------------------------------ */
    const GW = 16, GH = 24;

    const COP = {
        palette: {
            o: "#101019", S: "#e8a86a", K: "#2b3552", N: "#33508a",
            n: "#24406e", G: "#f0c64e", B: "#101019", O: "#0c0c12"
        },
        top: [
            "................",
            ".....KKKKK......",
            ".....KKKKK......",
            "....KKKKKKK.....",
            ".....SSSSS......",
            ".....SoSoS......",
            ".....SSSSS......",
            "...._..SS.._....",
            "..__N.NNNN.N__..",
            ".._NN.NNNN.NN_..",
            ".._NN.NGNN.NN_..",
            ".._NN.NNNN.NN_..",
            ".._NN.NNNN.NN_..",
            ".._SS.NNNN.SS_..",
            "...__.BBBB.__...",
            "...._NnnnnN_...."
        ],
        legsA: [
            "...._NN__NN_....",
            "...._NN__NN_....",
            "...._NN__NN_....",
            "...._NN__NN_....",
            "...._NN__OO.....",
            ".....OO.........",
            "................",
            "................"
        ],
        legsB: [
            "...._NN__NN_....",
            "...._NN__NN_....",
            "...._NN__NN_....",
            "...._NN__NN_....",
            ".....OO__NN_....",
            ".........OO.....",
            "................",
            "................"
        ],
        legsStand: [
            "...._NN__NN_....",
            "...._NN__NN_....",
            "...._NN__NN_....",
            "...._NN__NN_....",
            "...._NN__NN_....",
            ".....OO__OO.....",
            "................",
            "................"
        ]
    };

    function buildFrame(top, legs) {
        const rows = top.concat(legs);
        const out = [];
        for (let y = 0; y < GH; y++) {
            let r = rows[y] || "";
            if (r.length < GW) r = r + ".".repeat(GW - r.length);
            out.push(r.slice(0, GW));
        }
        return out;
    }

    function drawFrame(ctx, frame, palette) {
        ctx.clearRect(0, 0, GW, GH);
        const filled = (x, y) =>
            x >= 0 && x < GW && y >= 0 && y < GH &&
            frame[y][x] !== "." && frame[y][x] !== "_";

        const ink = palette.o || "#000";
        ctx.fillStyle = ink;
        for (let y = 0; y < GH; y++) {
            for (let x = 0; x < GW; x++) {
                if (frame[y][x] !== ".") continue;
                if (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1)) {
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
        for (let y = 0; y < GH; y++) {
            for (let x = 0; x < GW; x++) {
                const ch = frame[y][x];
                if (ch === "." || ch === "_") continue;
                const c = palette[ch];
                if (!c) continue;
                ctx.fillStyle = c;
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }

    const canvas = document.getElementById('pq1-officer-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    if (ctx) ctx.imageSmoothingEnabled = false;
    const walkFrames = [buildFrame(COP.top, COP.legsA), buildFrame(COP.top, COP.legsB)];
    const standFrame = buildFrame(COP.top, COP.legsStand);

    function renderOfficer() {
        if (!ctx) return;
        if (officer.dataset.direction === 'idle') {
            drawFrame(ctx, standFrame, COP.palette);
        } else {
            drawFrame(ctx, walkFrames[Number(officer.dataset.step) || 0], COP.palette);
        }
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
        renderOfficer();
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
