const express = require('express')
const morgan  = require('morgan')
const app     = express()
const port    = 3000

app.use(morgan('tiny'))

app.get('/api', (req, res) => {
  res.send('Empty')
})

app.get('/api/hello', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})