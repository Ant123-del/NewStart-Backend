const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json())


app.listen(PORT, () => {
    console.log('running on ' + PORT)
})