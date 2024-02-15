import './config/env.js'
import express from 'express'
import http from 'http'
import {socketHandler} from './sockets/socketHandler.js'
import {Server} from 'socket.io'
import spotifyAuthenticationRoutes from './routers/spotifyAuthenticationRoutes.js'
import adminRoutes from './routers/adminRoutes.js'
import spotifyRoutes from './routers/spotifyRoutes.js'
import queueRoutes from './routers/queueRoutes.js'
import path from 'path'
import log from './logger/logger.js'
import cors from 'cors'

const app = express()

const isDev = process.argv.indexOf('devmode') !== -1


if (isDev) {
  const corsOptions = {
    origin: 'http://localhost:3000'
  };
  app.use(cors(corsOptions));
}

// GLOBAL MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// SOCKETS
const server = http.createServer(app)
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
socketHandler(io)

// ROUTES
app.use(spotifyAuthenticationRoutes)
app.use(adminRoutes)
app.use(spotifyRoutes)
app.use(queueRoutes)

// REACT APP
// REACT is not hostet by express in devmode
if (!isDev) {
    app.use(express.static('../client/build/'))
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve('../client/build/index.html'))
    })
}

server.listen(8080, (error) => {
    if (error) {
        console.log(error)
    } else {
        log.info({label: 'startup', message: 'Server is running on: 8080'})
    }
})
