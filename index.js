const express = require('express');
const app = express()
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Trip to paradise Server')
})

app.listen(port, () => {
    console.log('Trip to paradise server listening at', port)
})