# @livelybone/react-pagination
[![NPM Version](http://img.shields.io/npm/v/@livelybone/react-pagination.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/react-pagination)
[![Download Month](http://img.shields.io/npm/dm/@livelybone/react-pagination.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/react-pagination)
![gzip with dependencies: 3kb](https://img.shields.io/badge/gzip--with--dependencies-3kb-brightgreen.svg "gzip with dependencies: 3kb")
![typescript](https://img.shields.io/badge/typescript-supported-blue.svg "typescript")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")

> `pkg.module supported`, which means that you can apply tree-shaking in you project

A react pagination component

## repository
https://github.com/livelybone/react-pagination.git

## Demo
https://github.com/livelybone/react-pagination#readme

## Run Example
Your can see the usage by run the example of the module, here is the step:

1. Clone the library `git clone https://github.com/livelybone/react-pagination.git`
2. Go to the directory `cd your-module-directory`
3. Install npm dependencies `npm i`(use taobao registry: `npm i --registry=http://registry.npm.taobao.org`)
4. Open service `npm run dev`
5. See the example(usually is `http://127.0.0.1/examples/test.html`) in your browser

## Installation
```bash
npm i -S @livelybone/react-pagination
```

## Global name
`ReactPagination`

## Interface
See in [index.d.ts](./index.d.ts)

## Usage
```js
import ReactPagination from '@livelybone/react-pagination'
```

## style
For building style, you can use the css or scss file in lib directory.
```js
// scss
import 'node_modules/@livelybone/react-pagination/lib/css/index.scss'

// css
import 'node_modules/@livelybone/react-pagination/lib/css/index.css'
```
Or
```scss
// scss
@import 'node_modules/@livelybone/react-pagination/lib/css/index.scss'

// css
@import 'node_modules/@livelybone/react-pagination/lib/css/index.css'
```

Or, you can build your custom style by copying and editing `index.scss`

## QA

1. Error `Error: spawn node-sass ENOENT`

> You may need install node-sass globally, `npm i -g node-sass`
