
var fs = require('fs')


function async (dpath, done) {
  var dirs = [], files = []
  dirs.push(dpath)
  ;(function walk (_dirs) {
    if (!_dirs.length) return done(null, dirs, files)

    var complete = 0
    var __dirs = []

    for (let dir of _dirs) {
      fs.readdir(dir, {withFileTypes: true}, function (err, _files) {
        if (err) return done(err)

        for (var entry of _files) {
          var fpath = `${dir}/${entry.name}`
          if (entry.isDirectory()) {
            __dirs.push(fpath)
            dirs.push(fpath)
          }
          else {
            files.push(fpath)
          }
        }

        if (++complete === _dirs.length) {
          walk(__dirs)
        }
      })
    }
  }([dpath]))
}

function sync (dpath) {
  var dirs = [], files = []
  dirs.push(dpath)
  return (function walk (_dirs) {
    if (!_dirs.length) return {dirs, files}

    var complete = 0
    var __dirs = []

    for (var dir of _dirs) {
      var _files = fs.readdirSync(dir, {withFileTypes: true})

      for (var entry of _files) {
        var fpath = `${dir}/${entry.name}`
        if (entry.isDirectory()) {
          __dirs.push(fpath)
          dirs.push(fpath)
        }
        else {
          files.push(fpath)
        }
      }

      if (++complete === _dirs.length) {
        return walk(__dirs)
      }
    }
  }([dpath]))
}

module.exports = {async, sync}
