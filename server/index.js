const express = require('express')
const session = require('express-session')
const massive = require('massive')
require('dotenv').config()

const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

const app = express();

// const PORT = 4001;

app.use(express.json())

const {SERVER_PORT,CONNECTION_STRING,SESSION_SECRET} = process.env;

app.use(
    session({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: false
    })
)

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db => {
    console.log("Database snarfing down tacos")
    app.set('db',db)
    app.listen(SERVER_PORT,()=>{console.log(`Eating tacos on port: ${SERVER_PORT}`)})
})

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly,treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly,treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly,auth.adminsOnly,treasureCtrl.getAllTreasure)