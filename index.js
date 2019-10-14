const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())


app.get('/', (req, res) => {
    axios.get('http://64.124.131.146')
        .then(resp => res.json(resp.data))
})


const port = process.env.PORT || 3002

app.listen(port, () => {
    console.log(`listening on ${port}...`)
})