
var fs = require('fs')


function async (files, done) {
  var size = 0
  var limit = 100
  var complete = 0

  ;(function walk (offset, _files) {
    if (!_files.length) return done(null, size)
    var _complete = 0
    for (var file of _files) {
      fs.stat(file, (err, stat) => {
        if (err) return done(err)
        size += stat.size
        if (++_complete === _files.length) {
          offset += limit
          walk(offset, files.slice(offset, offset + limit))
        }
      })
    }
  }(0, files.slice(0, limit)))
}

function sync (files) {
  var size = 0
  for (var file of files) {
    size += fs.statSync(file).size
  }
  return {size}
}

module.exports = {async, sync}
