# Pokemon

## Testing
The code in `test` uses [Supertest](https://www.npmjs.com/package/supertest)

## The instructions from SKIMS
### Tasks
Design a Restful API endpoint to:
1) display the following attributes for each 5 of your favorite Pokemons using public data from https://pokeapi.co/:
* name 
* height
* weight
* color
* 2 random moves
* base_happiness

2) Extend the API endpoint from the above to include the Pokemons' average , mean , and median base_happiness.
### Requirements
* Choose any language or framework you are comfortable with for development. Python prefer.
* Check your code into a GitHub repository where it can be forked.

### Things to be aware of, Hints

* Pokemon base attributes ( name, height, weight, moves) can be retrieved from GET https://pokeapi.co/api/v2/pokemon/pikachu
* `color` and `base_happiness` can be retrieved from GET https://pokeapi.co/api/v2/pokemon-species/25/

### Greg's Notes
#### Characters
base1 = https://pokeapi.co/api/v2/pokemon
* Ditto is #132
  * `base1/132` or `base1/ditto`
* Pikachu is #25
  * `base1/pikachu` or `base1/25`
* Bulbasaur is #1
  * `base1/bulbasaur` or `base1/1`
* Snorlax is #143
  * `base1/snorlax` or `base1/143
* Blastoise is #9
  * `base1/blastoise` or `base1/9`
#### Attributes
base2: https://pokeapi.co/api/v2/pokemon-species
* name: `base1/character` - `data.forms[0].name`
* height `base1/character`: `data.height`
* weight `base1/character`: `data.weight`
* color: `base2/character`: `data.color.name`
* 2 random moves `base1/character`:  `data.abilities.moves[n].move.name`.  Characters may have fewer than two moves!
* base_happiness: `base2`/`character`: `data.base_happiness`

## Express-Starter-Kit

Here are the original instructions from [Create project based off of https://www.npmjs.com/package/express-starter-kit	90a39db	Greg Sandell <gsandell_99@yahoo.com>	Jul 13, 2022 at 9:26 AM
](Create project based off of https://www.npmjs.com/package/express-starter-kit)

Includes API Server utilities:

* [morgan](https://www.npmjs.com/package/morgan)
  * HTTP request logger middleware for node.js
* [helmet](https://www.npmjs.com/package/helmet)
  * Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
* [dotenv](https://www.npmjs.com/package/dotenv)
  * Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`

Development utilities:

* [nodemon](https://www.npmjs.com/package/nodemon)
  * nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
* [eslint](https://www.npmjs.com/package/eslint)
  * ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
* [mocha](https://www.npmjs.com/package/mocha)
  * ☕️ Simple, flexible, fun JavaScript test framework for Node.js & The Browser ☕️
* [supertest](https://www.npmjs.com/package/supertest)
  * HTTP assertions made easy via superagent.

### Setup

```
npm install
```

### Lint

```
npm run lint
```

### Test

```
npm run test
```

### Development

```
npm run dev
```
