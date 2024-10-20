# Build distributable file
build:
    npm run --silent esbuild -- \
        src/index.ts \
        --bundle \
        --platform=node \
        --packages=external \
        --target=node20 \
        --banner:js="#!/usr/bin/env node" \
        --outfile=dist/readability-cli.js
    chmod +x dist/readability-cli.js

run *ARGS: build
    node dist/readability-cli.js {{ARGS}}

# Remove any existing build artefacts
clean:
    rm -rf ./dist

# run static checks
lint:
    npm run --silent tsc --

# Run script from source
@dev *ARGS: lint build
    node dist/readability-cli.js {{ARGS}}

# Setup development environment
setup:
    npm install --include=dev

@deploy: setup lint clean build
    npm publish --access public
