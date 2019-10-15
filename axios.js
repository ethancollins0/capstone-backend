const axios = require('axios')

function getData(ip) {
    return axios.get(ip + ':3001')
        .then(resp => resp.data)
}


getData('http://64.124.131.146')
    .then(console.log)