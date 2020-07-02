const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/User')

// @route /signup
// @method POST
// @body { email: string!, password: string! }
router.post('/signup', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = new User({ email, password
    })
    await user.save()
    const token = jwt.sign({ userId: user._id}, process.env.JWT_KEY)
    res.send({ token })
  } catch (err) {
    return res.status(422).json(err.message)
  }
})

// @Route /signin
// @Method POST
// @Body { email: String!, password: String!}
router.post('/signin', async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).send({ error: 'Must Provide email and password '})
  }

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(424).send({ error: 'Invalid email or password'})
  }

  try {
    await user.comparePassword(password)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY)
    res.send({ token })
  } catch (err) {
    return res.status(422).send({ error: 'Invalid email or password' })
  }
})
module.exports = router
