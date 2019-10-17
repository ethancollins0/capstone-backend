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


app.post('/soil_data', (req, res) => {
    res.json(`Body: ${req.body.name} and Headers: ${req.headers.authorization} to backend`)
})

app.post('/login', (req, res) => {
    
    const { email, password } = req.body
    console.log(`hit login with an email and password of ${email} and ${password}`)
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
        console.log(`reached verify with decoded of ${decoded}`)
        err
            ? res.json(null)
            : res.json(decoded)
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