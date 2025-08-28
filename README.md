# QuadKillers Using PixiJS

FUTURE ME PLEASE READ THIS SO THAT YOU UNDERSTAND WHAT'S HAPPENING

# Basic Usage
Comment out top comment of main.js
```js
// import * as PIXI from "pixi.js"
```
Start server (Look at [making a server](#making-a-server))
```
http-server -c-1 ./src
```
Between uses, press **CTRL + + SHIFT + R** to hard refresh the page (avoid browser caching)

# Installing Pixi

## Using pixijs in a single html file
To use pixi on the html file, the browser first needs to download the library. This comes in the form of a script import in the head. This format is called **cdn**

Builds of pixijs can be found in the [Pixi Github Releases](https://github.com/pixijs/pixijs/releases)

Development link: https://cdn.jsdelivr.net/npm/pixi.js@8.12.0/dist/pixi.js

Production link: https://cdn.jsdelivr.net/npm/pixi.js@8.12.0/dist/pixi.min.js

### Example usage:
```html
<html>
<head>
    <script src= "https://cdn.jsdelivr.net/npm/pixi.js@8.12.0/dist/pixi.js"></script>
</head>
<body>
    <script type="module" src="main.js"></script>
</body>
</html>
```

Note that the root script uses `type="module"` to tell the browser to use the new module syntax.
Example of module syntax:
```
import {blah} from "./some_file.js"
```

## Importing pixijs using npm
Installing the package using npm DOES NOT allow the html file to access it. The npm package allows the debugger to figure out js imports while scripting.
```
npm install pixi.js
```

# Accessing the pixi library
The pixi library is exposed in the `PIXI` global variable by default.

To allow type checking, this line of code accesses the npm package on your computer that's not in the html file.
```
import * as PIXI from "pixi.js"
```
To prevent html from getting confused, make sure to **COMMENT OUT** this line whenever you 

# Making a server

When you open an html file in a browser, it doesn't let you import cdns. You have to host a server first, then access your local port. This is easier than it sounds.

Install `http-server`:
```
<!-- The g flag means that npm installs it globally, not just in this directory -->
npm install -g http-server
```

Start the server. Because the index.html file is stored in the `src` folder, initialize the http-server in `./src`
```
http-server ./src
```

Access the server from your browser:
```
Available on:
  http://10.147.20.181:8080
  http://10.0.0.232:8080
  http://127.0.0.1:8080
```

# Server Caching
To be efficient, the browser caches the html and js files. Use this flag to prevent the browser from caching:
```
http-server -c-1 ./src
```
This disables the cache time by setting it to -1.