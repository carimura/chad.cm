
Built with [Arc](https://github.com/carimura/arc/)

## To Build

`arc && node tools/generate-bbs-posts.mjs`

Both steps are required: `arc` generates the normal theme, and the script rebuilds the bbs and game routes from that output. Skipping the script leaves new posts missing from the bbs and game themes.

## To Run Locally

`cd site; jwebserver;`

