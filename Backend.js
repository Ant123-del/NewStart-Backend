const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000




app.listen(PORT, () => {
    console.log('running on ' + PORT)
})