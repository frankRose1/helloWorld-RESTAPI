const os = require('os')
const cluster = require('cluster')
const server = require('./lib/server')

const app = {}

app.init = () => {

  if (cluster.isMaster){
    // on every loop a fork is created which will will execute this index.js script
    // on forks the else condition will run and it will init the server several different times
    for (let i = 0; i < os.cpus().length; i++) {
      cluster.fork()
    }
  } else {
    server.init()
  }

}

app.init()