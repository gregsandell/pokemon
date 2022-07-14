class Util {
    //
    // Array sanitizeCharsParamArray(array charsParamArray)
    //
    // Filters out any empty and padded string items in the array.  This catches the comma and space errors
    // in the "chars" param of the services, for example:
    // Input ",ditto,pikachu,,bulbasaur, snorlax,charmander," leads to the array:
    //       ["","ditto","pikachu","","bulbasaur"," snorlax","charmander",""]
    // ...which would be harmful to the service processing. The final output would be:
    //       ["ditto","pikachu",\"bulbasaur","snorlax","charmander"]
    sanitizeCharsParam (charsParam) {
        try {
            return charsParam
                .filter((char) => char !== '')
                .map((char) => char.trim())
        } catch {
            return []
        }
    }

//
//  Array getRandomMove(int numMoves, array movesData)
//
//  Takes the array of moves and picks two of them at random, returning their names in an array.
//
//  Edge case:  empty movesData array.  Returns empty array.
//  Edge case:  movesData.length is 1.  Returns array of single move name.
//
    getRandomMoves (numMoves, movesData) {
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

    // Source: https://bit.ly/3yCI19j
    median(arr) {
        const mid = Math.floor(arr.length / 2),
            nums = [...arr].sort((a, b) => a - b)
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
    }
    mean(nums) {
        return nums.reduce((total, num) => total + num, 0) / nums.length
    }

    // Source: https://bit.ly/3O8h0QA
    mode (arr) {
        return arr.sort((a, b) =>
            arr.filter(v => v === a).length -
            arr.filter(v => v === b).length
        ).pop()
    }
}
module.exports = Util
