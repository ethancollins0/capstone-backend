const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const db = require('./db_queries')

dotenv.config()

const app = express()
// const User = require('./models/User')

const whitelist = ['http://localhost:8080', 'https://capstone-frontend.firebaseapp.com']
const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        return whitelist.includes(origin)
            ? callback(null, true)
            : callback(new Error('Not allowed by CORS'))
    }
}

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

const http = require('http').Server(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
    jwt.verify(socket.request._query.token, process.env.SECRET, (err, decoded) => {
        if (err){
            socket.disconnect()
        } else {
            // io.emit('works')
            if (decoded.user_id && decoded.pi_id){
                socket.join(`${decoded.user_id}${decoded.pi_id}`)
                socket.emit('room_joined', {room: `${decoded.user_id}${decoded.pi_id}`})
                let clients = io.sockets.adapter.rooms[`${decoded.user_id}${decoded.pi_id}`]
                if (clients && clients.length > 1){
                    io.in(`${decoded.user_id}${decoded.pi_id}`).emit('length', clients.length)
                }
                io.in(`${decoded.user_id}${decoded.pi_id}`).emit('length', clients.length)
            } else {
                socket.join(`${decoded.user_id}${socket.request._query.pi_id}`)
                socket.emit('room_joined', {room: `${decoded.user_id}${socket.request._query.pi_id}`})
                let clients = io.sockets.adapter.rooms[`${decoded.user_id}${socket.request._query.pi_id}`]
                if (clients && clients.length > 1){
                    io.in(`${decoded.user_id}${socket.request._query.pi_id}`).emit('online')
                }
                io.in(`${decoded.user_id}${socket.request._query.pi_id}`).emit('length', clients.length)
            }
        }
        
        socket.on('get_length', () => {
            let clients = io.sockets.adapter.rooms[`${decoded.user_id}${socket.request._query.pi_id}`]
            io.in(`${decoded.user_id}${socket.request._query.pi_id}`).emit('length', clients.length)
        })
        
        socket.on('water_data', (data) => {
            jwt.verify(data.token, process.env.SECRET, (err, decoded) => {
                if (err) throw err;
                io.in(`${decoded.user_id}${decoded.pi_id}`).emit('water', {water: data.water})
            })
        })

        socket.on('disconnect', () => {
            delete socket
            io.sockets.emit('unit_disconnect')
            console.log('unit disconnected')
        })
    })
})

http.listen(process.env.PORT || 3001, () => {
    console.log('socket listening on 3001...')
})

app.get('/port', (req, res) => {
    res.json(process.env.PORT || 3001)
})

app.post('/login', (req, res) => {
    const { email, password } = req.body
    email && password
        ? db.verifyUser(email, password)
            .then(user => {
                if (user){
                        const { name } = user
                        let token = createToken({ user_id: user.id, email, name })
                        res.json(token)
                    } else {
                    res.json(null)
                }
            })
        : res.json(null)
})

app.post('/token', validateToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        err
            ? res.json(null)
            : db.getUserSystems(decoded.user_id)
                .then(systems => res.json({user: decoded, systems}))
                
    })
})

app.post('/pi/token', validateToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        err
            ? res.json(null)
            : res.json(createToken({ user_id: decoded.user_id, 
                                     pi_id: req.body.pi_id 
                                    }))
    })
})

app.post('/signup', (req, res) => {
    const { email, name, password } = req.body
    db.createUser({email, name, password})
        .then(result => {
            if (typeof result[0] == 'number'){
                let token = createToken({ user_id: result[0], email, name })
                res.json(token)
            } else {
                res.json(null)
            }
        })
        .catch(() => res.json(null))
})

app.post('/pi', validateToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        const { user_id } = decoded
        const {name, model} = req.body
        user_id && name && model
            ? db.createPi(user_id, req.body)
                .then(result => typeof result[0] == 'number' 
                    ? res.json(createToken({ user_id, pi_id: result[0] }))
                    : res.json(null))
                .catch(() => res.json(null))
            : res.json(null)
    })
})

app.delete('/pi', validateToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        const { user_id } = decoded
        const { pi_id } = req.body
        user_id && pi_id
            ? db.deletePi(user_id, pi_id)
                .then(result => {
                    result == 1
                        ? res.json(true)
                        : res.json(null)
                })
            : res.json(null)
    })
})

function createToken(data){
        console.log(data)
        return jwt.sign(data, process.env.SECRET, {expiresIn: 60 * 60 * 24 * 30})
}

function validateToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader == 'string'){
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next();
    } else {
        res.json('forbidden')
    }
}


const port = process.env.PORT || 3002

// app.listen(port, () => {
//     console.log(`listening on ${port}...`)
// })