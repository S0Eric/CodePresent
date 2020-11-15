# CodePresent
When creating a screen-captured presentation with code snippets, I found that it takes too much time to click
into another app and manually select and copy the code blocks to be pasted into the presentation. I wanted a
tool that will copy a code block into the pastebuffer just by clicking it. I was unable to find something that
would do this.

So I created this simple web application to do that. To allow notes to be intermixed with the code blocks, I
selected a markdown like syntax to define the document content. To make the parser simple, it only supports
the few markdown features that I needed, and the syntax isn't very flexible.

Only these Markdown features are supported: headings, paragraphs, code blocks, bold, italic.

When first run, the initial sample text explains all supported syntax.

This web application doesn't save your document, so you shouldn't edit it in the application, but maintain a separate text file and paste the contents in when needed.

### Requirements:
- Node
- http-server (optional - for serving a production version of the application)

After cloning, run this command to download all dependencies:
```
> npm install
```

### To Serve a Production Build of the Application:

Create a production build of the TypeScript source code, with Solid runtime.
```
> npm run build
```

To serve the application using the http-server Node web server, first install it globally by running this command once:
```
> npm install http-server -g
```

Then when you want to serve the application, run this command:
```
> http-server <path-to-project-folder>/public
```

Access the application here:
[http://localhost:8080/](http://localhost:8080/)

### Project Development Commands:

To launch Webpack's development server (has hot loading):
```
> npm run start
```

To launch Webpack's development server (has hot loading) and open the web application in your default browser:
```
> npm run open
```

To compile the TypeScript source into public/ts-bundle.js (mode=development):
```
> npm run build-dev
```

To compile the TypeScript source into public/ts-bundle.min.js (mode=production):
```
> npm run build
```

To watch the source folder and execute the build-dev script whenever a change is detected:
```
> npm run watch
```
