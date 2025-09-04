# Authored Component Example

This repo is a template for authors to create versioned, distributable React components for IoT Studio dashboards. It now targets browser-native ESM with dynamic import(), plus an `exposes.json` manifest for discovery.

## Goals
- Build React components as distributable ESM bundles
- Versioned releases for easy updates
- Manifest (`exposes.json`) describing exported components, their capabilities and settings.
- Simple authoring and publishing workflow

## Quick Start

### 1. Fork this repo:
```sh
git clone https://github.com/iotstud-io/authored-component-example.git
cd authored-component-example
```
- Create an empty repo on your GitHub (via UI or `gh repo create YOUR_REPO_NAME --private`)
- Then mirror-push all refs to it
`git push --mirror git@github.com:YOUR_GH_USERNAME/YOUR_NEW_REPO_NAME.git`
- Now cleanup the bare clone
```sh
cd ..
rm -rf authored-component-example
```
- Now work from your new independent repo and track it with `main` branch
```sh
git clone git@github.com:YOUR_GH_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
git push -u origin main
```

### 2. Install dependencies:
```sh
npm install
```

### 3. Develop your component:
- Edit `src/GenericClimateSensor.jsx` (or add more components)
- Change the name of the component to your liking and its export name in `rollup.config.js`
- Once you've created your component(s) now you are ready to release
- Bump the version in `package.json` and `exposes.json`.
- Update `exposes.json` to describe your exports, your components capabilities and settings (more info on those coming soon).
- Commit changes to GitHub `git add -A && git commit -m "My first authored component for IoT Studio" && git push origin main`

### 4. Build the bundle:
```sh
npm run build
```
- Output will be in `dist/` as ESM bundles

### 5. Release:
- Add contents of dist to a zip file:
```bash
tar -czf dist-v0.0.1.tar.gz -C dist .
```
- Use the zip as a release in the repo (github example):
```bash
gh release create v0.0.1 dist-v0.0.1.tar.gz -t "v0.0.1" -n "First release of authored-component-example"
```
Or the equivalent with your preferred method of publishing releases. Make sure you tag with the same version as in `package.json` and `exposes.json`.

## Directory Structure
```
/
  src/
    <ComponentName>.jsx
    <OtherComponentName>.jsx
  exposes.json
  rollup.config.js
  package.json
  README.md
```

## Authoring Guidelines
- React and JSX runtimes are externals; host provides them via import maps/shims.
- Export your component as default (or named) from your entry or component files.
- Update `exposes.json` for each exported component.
- Keep only the following bare imports unbundled (externals):
  - `react`, `react-dom/client`, `react/jsx-runtime`, `react/jsx-dev-runtime`
- Bundle all other dependencies.
- Use semantic versioning for releases.
- Test your bundle with a simple HTML page using import maps.
