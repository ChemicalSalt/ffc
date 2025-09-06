const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// In-memory storage
let users = []
let exercises = []

// Create new user
app.post('/api/users', (req, res) => {
  const { username } = req.body
  if (!username) return res.status(400).json({ error: 'Username is required' })

  const _id = (Date.now() + Math.floor(Math.random() * 1000)).toString()
  const newUser = { username, _id }

  users.push(newUser)
  res.json(newUser)
})

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users)
})

// Add exercise
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params
  const { description, duration, date } = req.body

  const user = users.find(u => u._id === _id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  if (!description || !duration) {
    return res.status(400).json({ error: 'Description and duration are required' })
  }

  const exerciseDate = date ? new Date(date) : new Date()

  const newExercise = {
    userId: _id,
    description,
    duration: Number(duration),
    date: exerciseDate
  }

  exercises.push(newExercise)

  res.json({
    _id: user._id,
    username: user.username,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date.toDateString()
  })
})

// Get exercise log
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params
  const { from, to, limit } = req.query

  const user = users.find(u => u._id === _id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  let log = exercises.filter(e => e.userId === _id)

  if (from) log = log.filter(e => e.date >= new Date(from))
  if (to) log = log.filter(e => e.date <= new Date(to))
  if (limit) log = log.slice(0, Number(limit))

  const formattedLog = log.map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }))

  res.json({
    _id: user._id,
    username: user.username,
    count: formattedLog.length,
    log: formattedLog
  })
})

// Serve index
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})



