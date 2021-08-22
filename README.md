# 🏞 Images mock server

Tiny app that dynamically generates images on the fly with specific sizes.

## 🧐 Why?

My internet sucks, I needed to build a parser for images of specific sizes for other app, and I wanted to try [Sharp](https://www.npmjs.com/package/sharp)... so here we are.

I'm sure this could've been done better, but this is literally a tool I need for building something in a different project.

## 🚀 Usage

1. Install the dependencies: `npm install` / `yarn`.
2. Run the app: `npm start` / `yarn start`.
3. Go to `http://localhost:2506/[width]/[height]/something.png` in your browser.

## ⚙️ Config

You can change the app port by sending the `PORT` environment variable: `PORT=2507 npm start`.

To change the default port and/or the colors pallet, edit the `src/config.js` file.
