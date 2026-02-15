# Authored Component Example

This repo is a template for authors to create versioned, distributable React components for IoT Studio dashboards. It now targets browser-native ESM with dynamic import(), plus an `exposes.json` manifest for discovery.

## Goals
- Build React components as distributable ESM bundles
- Versioned releases for easy updates
- Manifest (`exposes.json`) describing exported components, their capabilities and settings.
- Simple authoring and publishing workflow

## To Get Started

### Fork this repo:
1) Go to this example repo on GitHub: https://github.com/iotstud-io/authored-component-example
2) Click Code → Download ZIP
3) Extract the ZIP to where you want your new repo to live and rename the extracted folder to your new repo name, e.g. `my-new-repo`.
4) Reset the package and manifest version number in `package.json` to `0.0.1`.
5) Change the file name of the component jsx file to your liking and its export name (filename must match export name).
6) Then in `vite.config.js` update the entry file name and fileName and in `exposes.json` update the component name.
5) Then initialize and create the first commit in the new folder:
```sh
cd /path/to/my-new-repo

git init
git add .
git commit -m "Initial commit"
```
6) Create an new repo on your GitHub account (Gitlab or Gitea are also supported)
7) Add as origin and push:
```sh
git branch -M main
git remote add origin git@github.com:your-username/my-new-repo.git
git push -u origin main
```
Result:
You now have a repo with one initial commit and no history from the original, a clean fork.

## Development Workflow

### Install Dependencies:
```sh
npm install
```

### Develop your component(s):
1) Edit your React Component @ `src/<ComponentFileName>.jsx` (more components can be added as needed)
2) Update `exposes.json` to describe your component's capabilities and settings (guide coming soon).
   - Define component styles in `components[].css` (array of local relative `.css` files).
   - Shared styles can be reused by listing the same css file in multiple components.
3) Bump the version in `package.json`.
4) Commit changes to GitHub `git add -A && git commit -m "My first change to my new authored component for IoT Studio" && git push origin main`
5) Optionally tag the commit with the version: `git tag v0.0.2 && git push origin v0.0.2`

 > Repeat these steps to iterate on your Component.

### Build the bundle:
```sh
npm run build
```
- Output will be in `dist/` as ESM bundles

### Release:
- Add contents of dist to a zip file (named with version):
```bash
tar -czf dist-v0.0.2.tar.gz -C dist .
```
- Use the zip as a release in the repo (github example):
```bash
gh release create v0.0.2 dist-v0.0.2.tar.gz -t "v0.0.2" -n "First release of your IoT Studio component."
```
Or the equivalent with your preferred method of publishing releases. Make sure you tag with the same version as in `package.json`.

## Directory Structure
```
/
  src/
    <ComponentName>.jsx
    <OtherComponentName>.jsx
  exposes.json
  vite.config.js
  package.json
  README.md
```

## Authoring Guidelines
- React and JSX runtimes are externals; host provides them via import maps/shims.
- Export your component as default (or named) from your entry or component files.
- Update `exposes.json` for each exported component.
- Define style files in `components[].css`; top-level `css` is not supported.
- Keep only the following bare imports unbundled (externals):
  - `react`, `react-dom/client`, `react/jsx-runtime`, `react/jsx-dev-runtime`
- Bundle all other dependencies.
- Use semantic versioning for releases.
- Test your bundle using the IoT Studio Sandbox (guide coming soon).
