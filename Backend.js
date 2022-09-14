const express = require('express')
const session = require('express-session')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const {passport, accountRouter} = require('./acountRouter')
const PORT = process.env.PORT || 1000

//use all middleware
app.use(cors({
    credentials: true,
    origin: true,
}))
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json())

//setting up session and passport
app.use(session({
    secret: 'testing',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', accountRouter)

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    } else {
        console.log(req.isAuthenticated())
        res.json({
            err: 'not authenticated'
        })
    }
}

//making all Routes

app.get('/profile', ensureAuthenticated, (req, res) => {
    res.status(200).send(req.user)
})

//starting port
app.listen(PORT, () => {
    console.log('running on ' + PORT)
})