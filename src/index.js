const  express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const trackRoutes = require('./routes/trackRoutes')
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const requireAuth = require('./middlewares/requireAuth')

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(authRoutes)
app.use(trackRoutes)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

mongoose.connection.on('connected', () => console.log('connected to mongo instance'))
mongoose.connection.on('error', () => console.error('connected to mongo instance'))

app.get('/', requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`)
})

app.listen(PORT, () => console.log(`Sstarted on port ${PORT}`))