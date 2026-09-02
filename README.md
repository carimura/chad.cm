
Built with [Arc](https://github.com/carimura/arc/)

## To Build

`arc && node tools/generate-bbs-posts.mjs`

or 

`./build.sh`

Both steps are required: `arc` generates the normal theme, and the script rebuilds the bbs and game routes from that output. Skipping the script leaves new posts missing from the bbs and game themes.

## To Run Locally

`../arc/target/jpackage/arc.app/Contents/MacOS/arc --watch`

`cd site; jwebserver;`

