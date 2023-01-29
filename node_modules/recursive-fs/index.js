
var promisify = (fn, op) => (...args) => typeof args.slice(-1)[0] === 'function'
  ? fn(...args)
  : new Promise((resolve, reject) =>
    fn(...args, (...args) => args[0] ? reject(args[0]) :
      op === 'read' ? resolve({dirs: args[1], files: args[2]}) :
      op === 'size' ? resolve({size: args[1]}) :
      resolve()
    ))

var op = {
  read: require('./lib/read'),
  copy: require('./lib/copy'),
  remove: require('./lib/remove'),
  size: require('./lib/size'),
}

var api = {
  read: promisify(op.read.async, 'read'),
  copy: promisify(op.copy.async),
  remove: promisify(op.remove.async),
  size: promisify(op.size.async, 'size'),
  sync: {
    read: op.read.sync,
    size: op.size.sync,
  }
}

api.cpdirs = promisify(op.copy.cpdirs)
api.cpfiles = promisify(op.copy.cpfiles)
api.rmfiles = promisify(op.remove.rmfiles)
api.rmdirs = promisify(op.remove.rmdirs)

// deprecated
api.readdirr = api.read
api.cpdirr = api.copy
api.rmdirr = api.remove

module.exports = api
