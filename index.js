const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.json('works backend')
})



const port = process.env.PORT || 3002

app.listen(port, () => {
    console.log(`listening on ${port}...`)
})