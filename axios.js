const axios = require('axios')

function getData(ip) {
    return axios.get(ip + ':3001')
        .then(resp => resp.data)
}


getData('http://10.225.129.13')
    .then(console.log)