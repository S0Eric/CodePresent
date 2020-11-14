# CodePresent
A simple tool to create a script for a presentation that contains code snippets. A simple textbox is presented
where you paste simple text that supports a Markdown subset. You then click a button to format it. The main
purpose is for code blocks that allow a single click to copy to the clipboard.

Only these Markdown features are supported: headings, paragraphs, code blocks, bold, italic.

When first run, the initial text demonstrates all supported syntax.


### Requirement:
- Node


After cloning, run this command to download all dependencies:

```
npm install
```

### Project Commands:

To launch Webpack's development server (has hot loading):

```
npm run start
```

To launch Webpack's development server (has hot loading) and open the web application in your default browser:

```
npm run open
```

To compile the TypeScript source into public/ts-bundle.js (mode=development):

```
npm run build-dev
```

To compile the TypeScript source into public/ts-bundle.min.js (mode=production):

```
npm run build
```

To watch the source folder and execute the build-dev script whenever a change is detected:

```
npm run watch
```
