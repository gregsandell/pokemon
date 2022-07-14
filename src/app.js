const express = require('express')
const fetch = require('node-fetch')
const Util = require('./util')
const util = new Util()
const middlewares = require('./middlewares')
const app = express()
const api = require('./api')

const pokeURLs = {
  character: 'https://pokeapi.co/api/v2/pokemon',
  species: 'https://pokeapi.co/api/v2/pokemon-species'
}
const base2 = 'https://pokeapi.co/api/v2/pokemon-species'
app.get('/endpoint1', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}/`)
  const queryObj = new URLSearchParams(url.search)
  const chars = queryObj.get('chars')
  if (!chars) {
    res.status(500).send({ error: '/endpoint1 requires a `chars` parameter and value (comma-separated list of  Pokemon nanes)' })
    return
  }
  const charsArray = chars.split(',')
  let characterData = []
  const speciesData = []
  const endpont1Errors = []
  const promises1 = charsArray.map((char) => {
    return new Promise((resolve, reject) => {
      fetch(`${pokeURLs.character}/${char}`)
        .then(data => data.json())
        .then(data => {
          characterData.push(data)
          resolve()
        })
        .catch((e) => {
          endpont1Errors.push(`fetch for char '${char}' failed with: ${e}`)
          reject(e)
        })
    })
  })
  Promise.all(promises1).then(
    () => {
      const promises2 = charsArray.map((char) => {
        return new Promise((resolve, reject) => {
          fetch(`${pokeURLs.species}/${char}`)
            .then(data => data.json())
            .then(data => {
              speciesData.push(data)
              resolve()
            })
            .catch((e) => {
              endpont1Errors.push(`fetch for char '${char}' failed with: ${e}`)
              reject(e)
            })
        })
      })
      Promise.all(promises2).then(() => {
        characterData = characterData.map((charData, i) => {
          return {
            id: charData.id,
            name: charData.forms[0].name,
            height: charData.height,
            weight: charData.weight,
            moves: util.getRandomMoves(2, charData.moves),
            base_happiness: speciesData[i].base_happiness,
            color: speciesData[i].color.name
          }
        })

        res.json(characterData)
      })
    },
    (e) => {
      const mesg = `One or more failures for character input array '${chars}', first failure = ${JSON.stringify(endpont1Errors)}`
      res.status(500).send({ error: mesg })
    }
  )
})
app.get('/endpoint2', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}/`)
  const queryObj = new URLSearchParams(url.search)
  const chars = queryObj.get('chars')
  if (!chars) {
    res.status(500).send({ error: '/endpoint1 requires a `chars` parameter and value (comma-separated list of  Pokemon nanes)' })
    return
  }
  const promise3 = new Promise((resolve, reject) => {
    const endpoint1URL = `${req.protocol}://${req.hostname}:${req.socket.localPort}/endpoint1`
    fetch(`${endpoint1URL}?chars=${chars}`)
      .then(data => {
        return data.json()
      })
      .then(data => {
        if ('error' in data) {
          reject(data)
        }
        resolve(data)
      })
      .catch((e) => {
        reject(e)
      })
  })
  promise3.then((data) => {
    const base_weights = data.map((char) => char.weight)
    res.send({
      characters: data,
      base_weight_stats: {
        mean: Number(util.mean(base_weights).toFixed(2)),
        median: Number(util.median(base_weights).toFixed(2)),
        mode: Number(util.mode(base_weights).toFixed(2))
      }
    })
  },
  (e) => {
    const mesg = `one or more failures for character input array '${chars}'`
    res.status(500).send({ error: mesg })
  })
})

app.use('/api/v1', api)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

module.exports = app
