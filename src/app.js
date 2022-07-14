const express = require('express')
const fetch = require('node-fetch')
const Util = require('./util')
const util = new Util()
const app = express()

const pokeURLs = {
  character: 'https://pokeapi.co/api/v2/pokemon',
  species: 'https://pokeapi.co/api/v2/pokemon-species'
}
//
// endpoint1
//
// Sample invocation:  http://localhost:5000/endpoint1?chars=ditto,pikachu,bulbasaur,snorlax,charmander
//
// Strategy (using sample above):
//   1. async the calls to the pokeapi for the five characters, wait for them to complete with a
//      Promise.all.
//   2. Upon completion of (1) the same is applied to the species calls for the five characters,
//      wait for them to complete with a second Promise.all.
//   3. Upon completion of (2) the desired values are pruned and merged together.  The correct alignment
//      of character and species data is ensured with a match on their ids.
//
//   Failure handling:
//      * Failed calls will result in the service returning: { message: 'Failure explanation' }
//      * Inappropriate commas in the chars input parameter are ignored gracefully.  See Util.sanitizeCharsParam
//      * A failure in (1) will fail the service without going onto (3)
//      * A failure in (2) will fail at that stage without going to the final Promise.all().  This
//        failure is unlikely if (1) did not fail
//
app.get('/endpoint1', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}/`)
  const queryObj = new URLSearchParams(url.search)
  const chars = queryObj.get('chars')
  if (!chars) {
    res.status(500).send({ error: '/endpoint1 requires a `chars` parameter and value (comma-separated list of  Pokemon nanes)' })
    return
  }
  const charsArray = util.sanitizeCharsParam(chars.split(','))
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
          const species = speciesData.find((spec) => spec.id === charData.id)
          return {
            id: charData.id,
            name: charData.forms[0].name,
            height: charData.height,
            weight: charData.weight,
            moves: util.getRandomMoves(2, charData.moves),
            base_happiness: species.base_happiness,
            color: species.color.name
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
//
// endpoint2
//
// Sample invocation:  http://localhost:5000/endpoint2?chars=ditto,pikachu,bulbasaur,snorlax,charmander
//
// Strategy (using sample above):
//   1. /endpoint1 service is called and failures are consumed there, failed with a throw, and consumed
//      here as on as a Promise catch and reported with a .then() reject handler.
//
app.get('/endpoint2', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}/`)
  const queryObj = new URLSearchParams(url.search)
  const chars = queryObj.get('chars')
  if (!chars) {
    res.status(500).send({ error: '/endpoint1 requires a `chars` parameter and value (comma-separated list of  Pokemon nanes)' })
    return
  }
  const promise = new Promise((resolve, reject) => {
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
  promise.then((data) => {
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

module.exports = app
