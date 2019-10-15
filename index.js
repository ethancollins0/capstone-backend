const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())


app.post('/soil_data', (req, res) => {
    res.json(`Body: ${req.body.name} and Headers: ${req.headers.authorization} to backend`)
})

app.get('/', (req, res) => {
    res.json('worked get to backend')
})

app.post('/pi', (req, res) => {
    req.body.email && req.body.pi_name
        ? console.log(createToken(req.body.email, 1))
        : res.json(null)
})

app.post('/livedata', validateToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        err
            ? res.json(err)
            : res.json(decoded)
    })
})


function createToken(email, pi_id){
    return jwt.sign({ email, pi_id }, 'secret', {expiresIn: 60 * 60 * 24 * 30}, (err, token) => { // 30 days
        console.log(token)
    })
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