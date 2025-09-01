# Authored Component Example

This repo is a template for authors to create versioned, distributable React components for IoT Studio dashboards. It now targets browser-native ESM with dynamic import(), plus an `exposes.json` manifest for discovery.

## Goals
- Build React components as distributable ESM bundles
- Versioned releases for easy updates
- Manifest (`exposes.json`) describing exported components and entry
- Simple authoring and publishing workflow

## Quick Start

1. Clone this repo:
```sh
git clone https://github.com/iotstud-io/authored-component-example.git
cd authored-component-example
```

2. Install dependencies:
```sh
npm install
```

3. Develop your component:
- Edit `src/MyComponent.jsx` (or add more components)
- Update `exposes.json` to describe your exports and entry point

4. Build:
```sh
npm run build
```
- Output will be in `dist/` as ESM bundles

5. Release:
- Tag your release (e.g., `v1.0.0`)
- Upload a zip containing: `dist/`, `exposes.json`, `README.md`, `LICENSE`

## Directory Structure
```
/
  src/
    MyComponent.jsx
  exposes.json
  rollup.config.js
  package.json
  README.md
```

## Example Component
See `src/MyComponent.jsx` for a sample React component.

## Manifest (`exposes.json`) — ESM schema
```json
{
  "name": "authored-component-example",
  "version": "1.0.0",
  "runtime": "esm",
  "entry": "dist/MyComponent.esm.js",
  "css": [],
  "components": [
    {
      "name": "MyComponent",
      "export": "default",
      "description": "DHT22 temperature/humidity tile",
      "propsSchema": {
        "type": "object",
        "properties": {
          "temperature": { "type": "number" },
          "humidity": { "type": "number" }
        },
        "additionalProperties": true
      }
    }
  ]
}
```

## Rollup Build
- ESM: `dist/MyComponent.esm.js`
- React and JSX runtimes are externals; host provides them via import maps/shims.

## Authoring Guidelines
- Export your component as default (or named) from your entry or component files.
- Update `exposes.json` for each exported component and set `entry` to the ESM file.
- Keep only the following bare imports unbundled (externals):
  - `react`, `react-dom/client`, `react/jsx-runtime`, `react/jsx-dev-runtime`
- Bundle all other dependencies.
- Use semantic versioning for releases.
- Test your bundle with a simple HTML page using import maps.

## Updating and releasing
- Bump the version in `package.json` and `exposes.json`.
- Build and release as above.
- Add contents of dist to a zip file:
```bash
tar -czf dist-v0.0.1.tar.gz -C dist .
```
- Use zip as a release in the repo (github example):
```bash
git aa && git cm "Release v0.0.1" && git tag v0.0.1 && git push origin v0.0.1 && git push origin main

gh release create v0.0.1 dist-v0.0.1.zip -t "v0.0.1" -n "First release of authored-component-example"
```