
var fs = require('fs')
var read = require('./read')


function async (dpath, done) {
  read.async(dpath, function (err, dirs, files) {
    if (err) return done(err)
    rmfiles(files, function (err) {
      if (err) return done(err)
      rmdirs(dirs, done)
    })
  })
}

function rmfiles (files, done) {
  ;(function walk (index) {
    if (index == files.length) return done()
    fs.unlink(files[index], function (err) {
      if (err) return done(err)
      walk(++index)
    })
  }(0))
}

function rmdirs (dirs, done) {
  dirs.sort((a, b) => a > b ? -1 : a < b ? 1 : 0)
  ;(function walk (index) {
    if (index == dirs.length) return done()
    fs.rmdir(dirs[index], function (err) {
      if (err) return done(err)
      walk(++index)
    })
  }(0))
}

module.exports = {
  async,
  rmdirs,
  rmfiles,
}
