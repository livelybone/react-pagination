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
```typescript jsx
import React, { useRef } from 'react'
import ReactPagination from '@livelybone/react-pagination'


// HasPage mode
const Comp = () => (
  <ReactPagination
    pageSize={10}
    initPageNumber={1}
    pageCount={10}
    currentPageSize={undefined}
    maxPageBtn={7}
    inputConfig={{
     enable: true,
     text: 'Go to',
    }}
    turnBtns={{
     pre: { text: '<' },
     next: { text: '>' },
    }}
    debounceTime={500}
    onPageChange={console.log}
  />
)


// NoPage mode
const Comp1 = () => (
  <ReactPagination
    pageSize={10}
    initPageNumber={1}
    pageCount={undefined}
    currentPageSize={10}
    maxPageBtn={7}
    inputConfig={{
      enable: true,
      text: 'Go to',
    }}
    turnBtns={{
      pre: { text: '<' },
      next: { text: '>' },
    }}
    debounceTime={500}
    onPageChange={console.log}
  />
)

// This component will maintain the current page number automatically
// If you want to change the page number outside of it, please use `setPageNumber` method:
let page = 1
const Comp2 = ({props}) => {
  const paginationProps = {
    pageSize: 10,
    onPageChange: console.log
    // ...
  }
  
  let paginationRef = useRef<ReactPagination>(null)
 
  const setPageNumber = (page: number | string, triggerChange?: boolean) => {
    paginationRef.current.setPageNumber(page, triggerChange)
  }
  
  return (
    <>
      <ReactPagination
        {...paginationProps}
        ref={r => paginationRef = r}
      />
      <button onClick={() => setPageNumber(page += 1, true)}>
        set page number outside of the pagination, 
        and trigger to call the `onPageChange` prop
      </button>
    </>
  )
}
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
