const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('./Database/db')
const { json } = require('body-parser')

const accountRouter = express.Router()

passport.use(new LocalStrategy(
     async function(username, password, done) {
        const user = await db.getUserByName(username)
        if(!user) return done(null, false)
        if(!bcrypt.compare(password, user.password)) {
            return done(null, false)
        } else {
            done(null, user)
        }
    }
))

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(async function(id, done) {
    const user = await db.getUserById(id)
    console.log(user)
    if(!user) return done(true, null)
    done(null, user)
})

accountRouter.post("/login", function(req, res, next) {
    passport.authenticate("local")(req, res, function() {
        if (!req.user) {
          console.log("User not found!");
        } else {
          res.json({msg: 'successfull login'})
          console.log("signed in")
        }
      })
})

accountRouter.post('/register', async (req, res) => {
    const {username, password, email} = req.body

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)
    console.log(username, email, hashed)
    try {
        await db.registerAccount(email, username, hashed)
        res.json({
            message: 'account successful',
            username,
            password: hashed,
            email
        })
    } catch(err) {
        res.json({err})
        console.log(err)
    }
    
})

accountRouter.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if(err) {return next(err)}
        console.log('logged out')
        res.json({
            msg: 'logout successful'
        })
    })
})

accountRouter.get('/testing', (req, res) => {
    res.json({success: 'success'})
})

accountRouter.post('/testing', (req, res) => {
    const {password} = req.body
    res.status(200).send({password})
})

module.exports = {
    passport,
    accountRouter
}