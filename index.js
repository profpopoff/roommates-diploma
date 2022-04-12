const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')
const apartmentRouter = require('./routes/apartment')
const favouritesRouter = require('./routes/favourites')
const messagesRouter = require('./routes/messages')
const conversationsRouter = require('./routes/conversations')

const app = express()

app.use(express.json({ extended: true }))

dotenv.config()

mongoose
   .connect(process.env.MONGO_URL)
   .then(() => console.log('Database is connected...'))
   .catch((error) => console.log(error))

app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/apartments', apartmentRouter)
app.use('/api/favourites', favouritesRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/conversations', conversationsRouter)

app.listen(process.env.PORT || 5000, () => {
   console.log('Server is running...')
})