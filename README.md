# Authored Component Example

This repo is a template for authors to create versioned, distributable React components for IoT Studio dashboards. It uses Rollup to build components as ESM and UMD bundles, and generates an `exposes.json` manifest for host apps to discover and load components.

## Goals
- Build React components as distributable JS bundles (ESM/UMD)
- Versioned releases for easy updates
- Manifest (`exposes.json`) describing exported components
- Simple authoring and publishing workflow

## Quick Start

1. **Clone this repo:**
   ```sh
   git clone https://github.com/techbykyle/authored-component-example.git
   cd authored-component-example
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Develop your component:**
   - Edit `src/MyComponent.jsx` (or add more components)
   - Update `exposes.json` to describe your exports

4. **Build:**
   ```sh
   npm run build
   ```
   - Output will be in `dist/` as both ESM and UMD bundles

5. **Release:**
   - Tag your release (e.g., `v1.0.0`)
   - Upload `dist/` and `exposes.json` to your release or CDN

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

## Example Manifest (`exposes.json`)
```json
{
  "components": [
    {
      "name": "MyComponent",
      "description": "Example tile for IoT dashboard",
      "entry": "MyComponent",
      "props": { "temperature": "number", "humidity": "number" },
      "version": "1.0.0"
    }
  ]
}
```

## Rollup Build
- ESM: `dist/MyComponent.esm.js`
- UMD: `dist/MyComponent.umd.js`

## Authoring Guidelines
- Export your component as default from each file you want to expose.
- Update `exposes.json` for each exported component.
- Use semantic versioning for releases.
- Test your bundle with a local React app before publishing.

## Updating
- Bump the version in `package.json` and `exposes.json`.
- Build and release as above.

## License
MIT
