const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const db = require('./db_queries')
dotenv.config()


const app = express()
const User = require('./models/User')

app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())


app.post('/soil_data', (req, res) => {
    res.json(`Body: ${req.body.name} and Headers: ${req.headers.authorization} to backend`)
})

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    console.log(name, email, password)
    res.json('signup endpoint hit')
})

app.get('/:id', (req, res) => {
    let id = +req.params.id
    User.query()
        .where('id', id)
        .eager('systems')
        .then(user => res.json(user))
})

app.post('/pi', validateToken, (req, res) => {
    const { user_id, pi } = req.body
    user_id && pi.name && pi.description
        ? res.json('here')
        : res.json(null)
})

app.post('/livedata', validateToken, (req, res) => {
    console.log(req.token)
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        console.log(decoded)
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