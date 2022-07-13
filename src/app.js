const express = require('express')

// Note needed?
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

// Greg's stuff
// const url = require('url')
const fetch = require('node-fetch')

require('dotenv').config()

const middlewares = require('./middlewares')
const api = require('./api')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  })
})
app.get('/endpoint1', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}/`)
  const queryObj = new URLSearchParams(url.search)
  const chars = queryObj.get('chars')
  if (!chars) {
    res.status(500).send({ error: '/endpoint1 requires a `chars` parameter and value (comma-separated list of  Pokemon nanes)' })
    return
  }
  const charsArray = chars.split(',')
  let charsData = []
  const base2Data = []
  const charsErrors = []
  const getRandomMoves = (numMoves, movesData) => {
    console.log(`length of movesData = ${movesData.length}`)
    const movesAvailable = movesData.length
    if (movesAvailable === 0) return []
    if (movesAvailable === 1) return [movesData[0].move.name]
    const scrambled = [...movesData].sort(() => Math.random() - 0.5)
    return scrambled.reduce((accum, move, i) => {
      if (i < numMoves) {
        accum.push(move.move.name)
      }
      return accum
    }, [])
  }
  const promises1 = charsArray.map((char) => {
    return new Promise((resolve, reject) => {
      fetch(`${base1}/${char}`)
        .then(data => data.json())
        .then(data => {
          charsData.push(data)
          resolve()
        })
        .catch((e) => {
          charsErrors.push(`fetch for char '${char}' failed with: ${e}`)
          reject(e)
        })
    })
  })
  Promise.all(promises1).then(
    () => {
      console.log(`all promises (${promises1.length}) succeeded, charsJson has ${charsData.length} items`)
      const promises2 = charsArray.map((char) => {
        return new Promise((resolve, reject) => {
          fetch(`${base2}/${char}`)
            .then(data => data.json())
            .then(data => {
              base2Data.push(data)
              resolve()
            })
            .catch((e) => {
              charsErrors.push(`fetch for char '${char}' failed with: ${e}`)
              reject(e)
            })
        })
      })
      Promise.all(promises2).then(() => {
        console.log('resolving promises2,')
        charsData = charsData.map((data, i) => {
          return {
            id: data.id,
            name: data.forms[0].name,
            height: data.height,
            weight: data.weight,
            moves: getRandomMoves(2, data.moves),
            base_happiness: base2Data[i].base_happiness,
            color: base2Data[i].color.name
          }
        })

        res.json(charsData)
      })
    },
    (e) => {
      const mesg = `one or more promises failed for chars array '${chars}', first failure = ${JSON.stringify(charsErrors)}`
      res.status(500).send({ error: mesg })
    }
  )

  // res.json({
  //   message: `There are ${promises.length} promises`
  // })
})
const base1 = 'https://pokeapi.co/api/v2/pokemon'
const base2 = 'https://pokeapi.co/api/v2/pokemon-species'
app.get('/delegate', (req, res) => {
  // console.log(`requesting ${ENDPOINT_URL}${req.url}`)
  fetch(`${base1}/25`)
    .then(data => data.json())
    .then(json => res.send(json))
    .catch(e => console.log(`Error: ${e}`))
})

app.use('/api/v1', api)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

module.exports = app
