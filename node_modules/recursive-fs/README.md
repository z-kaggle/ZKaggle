
# recursive-fs

[![npm-version]][npm] [![travis-ci]][travis] [![coveralls-status]][coveralls]

> _Asynchronous Recursive File System Operations_

## read

```js
var rfs = require('recursive-fs')

var path = require('path')
var directory = path.resolve(process.cwd(), process.argv[2])

;(async () => {
  try {
    var {dirs, files} = await rfs.read(directory)
    console.log(dirs)
    console.log(files)
    console.log('DONE!')
  }
  catch (err) {
    console.error(err)
  }
})()
```


## remove

```js
var rfs = require('recursive-fs')

var path = require('path')
var directory = path.resolve(process.cwd(), process.argv[2])

;(async () => {
  try {
    await rfs.remove(directory)
    console.log('DONE!')
  }
  catch (err) {
    console.error(err)
  }
})()
```


## copy

```js
var rfs = require('recursive-fs')

var path = require('path')
var source = path.resolve(process.cwd(), process.argv[2])
var destination = path.resolve(process.cwd(), process.argv[3])

;(async () => {
  try {
    await rfs.copy(source, destination)
    console.log('DONE!')
  }
  catch (err) {
    console.error(err)
  }
})()
```

---

## recursive-copy

```bash
npx recursive-copy 'path/to/source/directory' 'path/to/destination/directory'
```


## recursive-delete

```bash
npx recursive-delete 'path/to/directory'
```


  [npm-version]: https://img.shields.io/npm/v/recursive-fs.svg?style=flat-square (NPM Package Version)
  [travis-ci]: https://img.shields.io/travis/simov/recursive-fs/master.svg?style=flat-square (Build Status - Travis CI)
  [coveralls-status]: https://img.shields.io/coveralls/simov/recursive-fs.svg?style=flat-square (Test Coverage - Coveralls)

  [npm]: https://www.npmjs.com/package/recursive-fs
  [travis]: https://travis-ci.org/simov/recursive-fs
  [coveralls]: https://coveralls.io/github/simov/recursive-fs
