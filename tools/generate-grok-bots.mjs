import { readFile, writeFile } from 'node:fs/promises';

const assets = new URL('../app/assets/posts/from-hermes-to-grok-bot/', import.meta.url);
const bodies = await readFile(new URL('grok-bots-bodies.png', assets));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1672" height="761" viewBox="0 90 1672 761" role="img" aria-labelledby="title desc">
  <title id="title">Two Grok Bots</title>
  <desc id="desc">Purple and blue bots blink and occasionally glance toward each other.</desc>
  <style>
    .blink { transform-box: fill-box; transform-origin: center; animation: blink 6.5s ease-in-out infinite; }
    .blue .blink { animation-duration: 8.1s; animation-delay: -2s; }
    .purple { animation: glance-purple 12s ease-in-out infinite; }
    .blue { animation: glance-blue 12s ease-in-out infinite; }
    @keyframes blink {
      0%, 40%, 44%, 100% { transform: scaleY(1); }
      42% { transform: scaleY(.07); }
    }
    @keyframes glance-purple {
      0%, 24%, 47%, 100% { transform: translate(0, 0); }
      28%, 43% { transform: translate(12px, -3px); }
    }
    @keyframes glance-blue {
      0%, 29%, 52%, 100% { transform: translate(0, 0); }
      33%, 48% { transform: translate(-12px, -3px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .blink, .purple, .blue { animation: none; }
    }
  </style>
  <defs>
    <image id="bodies" width="1672" height="941" href="data:image/png;base64,${bodies.toString('base64')}"/>
    <clipPath id="purple-body"><rect width="850" height="941"/></clipPath>
    <clipPath id="blue-body"><rect x="850" width="822" height="941"/></clipPath>
  </defs>
  <g fill="#242424">
    <g transform="translate(-35 0)">
    <use href="#bodies" clip-path="url(#purple-body)"/>
    <g class="purple">
      <g transform="translate(646 459) rotate(-29)"><rect class="blink" x="-25" y="-61" width="50" height="122" rx="25"/></g>
      <g transform="translate(750 423) rotate(-29)"><rect class="blink" x="-24" y="-55" width="48" height="110" rx="24"/></g>
    </g>
    </g>
    <g transform="translate(35 0)">
    <use href="#bodies" clip-path="url(#blue-body)"/>
    <g class="blue">
      <g transform="translate(972 410) rotate(28)"><rect class="blink" x="-24" y="-55" width="48" height="110" rx="24"/></g>
      <g transform="translate(1077 457) rotate(28)"><rect class="blink" x="-25" y="-61" width="50" height="122" rx="25"/></g>
    </g>
    </g>
  </g>
</svg>
`;

await writeFile(new URL('grok-bots-animated.svg', assets), svg);
console.log('Generated transparent Grok Bot animation.');
