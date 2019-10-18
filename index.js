const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const db = require('./db_queries')



dotenv.config()


const app = express()
const User = require('./models/User')

app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

const http = require('http').Server(app)
const io = require('socket.io')

app.post('/soil_data', (req, res) => {
    res.json(`Body: ${req.body.name} and Headers: ${req.headers.authorization} to backend`)
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

app.get('/:id', (req, res) => {
    let id = +req.params.id
    User.query()
        .where('id', id)
        .eager('systems')
        .then(user => res.json(user))
})

app.post('/pi', validateToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        const { user_id } = decoded
        const {name, description, model} = req.body
        user_id && name && description && model
            ? db.createPi(user_id, req.body)
                .then(result => typeof result[0] == 'number' 
                    ? res.json(result[0]) 
                    : res.json(null))
                .catch(() => res.json(null))
            : res.json(null)
    })
})

app.post('/livedata', validateToken, (req, res) => {
    console.log(req.token)
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        if (err){
            res.json(err)
        } else {
            res.json(decoded)
        }
    })
})

function createToken(data){
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

app.listen(port, () => {
    console.log(`listening on ${port}...`)
})