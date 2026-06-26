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
        // Side profile, drawn facing RIGHT (mirrored for left). Three-position
        // bent-arm walk: forward reach -> arm down -> folded back-swing. Arm is
        // the darker navy 'n' sleeve with a skin hand at the tip.
        frames: [
            [ // 0 — contact: arm reaching forward, legs in stride
                "................",
                "......KKK.......",
                ".....KKKKK......",
                ".....KKKKKK.....",
                ".....SSSSS......",
                ".....SSSoSS.....",
                ".....SSSS.......",
                ".......NN.......",
                "......NNNN......",
                "......NNnN......",
                "......NNnN......",
                "......NNnnnnS...",
                "......NNNN......",
                "......NNNN......",
                "......BBBB......",
                "......NNNN......",
                ".....NN.NN......",
                "....NN...NN.....",
                "....NN...NN.....",
                "...OOO..OOO.....",
                "................",
                "................",
                "................",
                "................"
            ],
            [ // 1 — passing: arm down the middle (bent), legs together
                "................",
                "......KKK.......",
                ".....KKKKK......",
                ".....KKKKKK.....",
                ".....SSSSS......",
                ".....SSSoSS.....",
                ".....SSSS.......",
                ".......NN.......",
                "......NNNN......",
                "......NNnN......",
                "......NNnN......",
                "......NNnN......",
                "......NNNn......",
                "......NNNNS....",
                "......BBBB......",
                "......NNNN......",
                "......NNNN......",
                "......NNNN......",
                "......NNNN......",
                ".....OO.OO......",
                "................",
                "................",
                "................",
                "................"
            ],
            [ // 2 — contact: arm swung back (elbow folded), legs in stride
                "................",
                "......KKK.......",
                ".....KKKKK......",
                ".....KKKKKK.....",
                ".....SSSSS......",
                ".....SSSoSS.....",
                ".....SSSS.......",
                ".......NN.......",
                "......NNNN......",
                "......NNnN......",
                "......NnNN......",
                "......nNNN......",
                "......NnNN......",
                "......NNSN......",
                "......BBBB......",
                "......NNNN......",
                ".....NN.NN......",
                "....NN...NN.....",
                "....NN...NN.....",
                "...OOO..OOO.....",
                "................",
                "................",
                "................",
                "................"
            ]
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
    // Front-facing officer — shown when standing still (the side profile only walks).
    const FRONT_TOP = [
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
    ];
    const FRONT_STAND_LEGS = [
        "...._NN__NN_....",
        "...._NN__NN_....",
        "...._NN__NN_....",
        "...._NN__NN_....",
        "...._NN__NN_....",
        ".....OO__OO.....",
        "................",
        "................"
    ];

    // The side frames sit ~2 rows higher than the front sprite; drop them so the
    // feet line up at the same ground level whether walking or standing still.
    function shiftDown(rows, n) {
        const empty = ".".repeat(GW);
        return Array(n).fill(empty).concat(rows).slice(0, GH);
    }

    const walkFrames = COP.frames.map((f) => shiftDown(buildFrame(f, []), 2));
    const standFrame = buildFrame(FRONT_TOP, FRONT_STAND_LEGS);
    const walkSeq = [0, 1, 2, 1];       // ping-pong: forward -> mid -> back -> mid

    function renderOfficer() {
        if (!ctx) return;
        if (officer.dataset.direction === 'idle') {
            drawFrame(ctx, standFrame, COP.palette);
        } else {
            drawFrame(ctx, walkFrames[walkSeq[frame % walkSeq.length]], COP.palette);
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
    let walkTimer = null;
    let idleTimer = null;

    const STEP_MS = 140;                    // one leg/arm step of the walk cycle
    const WALK_STEPS = 8;                   // steps per room move (~2 full cycles)
    const SLIDE_MS = STEP_MS * WALK_STEPS;  // must match the world-scroll CSS transition

    function setRoom(next) {
        position = Math.max(0, Math.min(rooms.length - 1, next));
        world.style.setProperty('--pq1-position', String(position));
        if (locationLabel) {
            locationLabel.textContent = rooms[position].label;
        }
    }

    function stand() {                      // settle to the front-facing idle pose
        if (walkTimer) { window.clearInterval(walkTimer); walkTimer = null; }
        officer.dataset.direction = 'idle';
        renderOfficer();
    }

    // Walk in profile, cycling legs/arm for the length of the room slide.
    function startWalking(direction) {
        officer.dataset.direction = direction;
        window.clearTimeout(idleTimer);
        if (walkTimer) window.clearInterval(walkTimer);
        renderOfficer();
        walkTimer = window.setInterval(() => { frame += 1; renderOfficer(); }, STEP_MS);
        idleTimer = window.setTimeout(stand, SLIDE_MS + 80);
    }

    function walk(delta) {
        setRoom(position + delta);
        startWalking(delta < 0 ? 'left' : 'right');
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
            setRoom(targetIndex);
            if (direction === 'idle') {
                stand();
            } else {
                startWalking(direction);
            }
            command.value = '';
            return;
        }

        command.value = "I don't understand.";
        command.select();
    });

    setRoom(0);
    stand();
})();
