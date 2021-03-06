const express = require('express')
const session = require('express-session')
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')
const pg = require('pg')
const request = require('request')
const ws = require('ws')
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const discord = require('discord.js')

const storage = multer.memoryStorage()
const upload = multer({ storage, preservePath: true })
const app = express()
const port = process.env.API_PORT || 8000

const localStrategyConfig = {
  usernameField: 'username',
  passwordField: 'password'
}

const localStrategyHandler = (username, password, done) => {
  // console.log('local_strategy', username, password)
  // given the username and password from a request, see if it's valid in a db for instance
  // there are three variations of ways to call done() based on db query
  if (username !== 'braun') {
    done(null, false)
  } else if (password !== 'braun') {
    done(null, false)
  } else {
    done(null, { id: 0 })
  }
}

passport.serializeUser((user, done) => {
  // handle how to return the id of the user if given the user
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  // find user and user id in database, and pass it second param
  done( null, { id })
})

passport.use(new LocalStrategy(localStrategyConfig, localStrategyHandler))

app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'sbyr395sriby9353597isr3rsyib5s7ryir7sb7isb9fh6sh8fgj568s65r3ybd5b68fgdjr',
  resave: true,
  saveUninitialized: true
}))
app.use(cors())
app.use(morgan('tiny'))
app.use(passport.initialize())
app.use(passport.session())

const localPassportAuthenticationDirective = {
  successRedirect: '/api/v2/authorized',
  failureRedirect: '/api/v2/unauthorized'
}

app.post('/api/v2/authenticate', passport.authenticate('local', localPassportAuthenticationDirective))

app.get('/api/v2/authorized', async (req, res) => {
  res.send('authorized')
})

app.get('/api/v2/unauthorized', async (req, res) => {
  res.send('unauthorized')
})

app.get('/api/v2/ping', async (req, res) => {
  res.send('pong')
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
