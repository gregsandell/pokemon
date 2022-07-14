# Pokemon

## Install & Run
1. Use Node 16.  (`nvm use` will work)
2. `npm i`
3. `npm run dev`

Sample invocations:
* endpoint1:  http://localhost:5000/endpoint1?chars=ditto,pikachu,bulbasaur,snorlax,charmander
* endpoint2:  http://localhost:5000/endpoint2?chars=ditto,pikachu,bulbasaur,snorlax,charmander

## Comments on my Solution
I called the two requests endpoints `endpoint1` and `endpoint2`.

Documentation on my solution can be found in code comments.

Improvements for later:
1. Modularize the code more in `src/app.js`
2. Add tests
3. Include middlewares to make code DRYER, handle promises/failures
4. Set globals with an `.env`
5. Make error messages more informative, improve the error chaining

Thank you for a very interesting challenge.  - Greg Sandell

### Requirements alterations
1. I substituted the original `average, mean, and median` with `mean, median and mode` 
2. I calculated mean, median and mode on `weight` rather than `base_happiness` because it appears that all Pokemon share the same base_happiness of `50`.

## Original Instructions from SKIMS
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
variable "base1": https://pokeapi.co/api/v2/pokemon
variable "base2": https://pokeapi.co/api/v2/pokemon-species

Calling the character service for various characters:
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
  
URLs for required data:
* name: `base1/character` - `data.forms[0].name`
* height `base1/character`: `data.height`
* weight `base1/character`: `data.weight`
* color: `base2/character`: `data.color.name`
* 2 random moves `base1/character`:  `data.abilities.moves[n].move.name`.  Characters may have fewer than two moves!
* base_happiness: `base2`/`character`: `data.base_happiness`

