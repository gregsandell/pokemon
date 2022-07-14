class Util {
    constructor() {

    }
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
    median(arr) {
        const mid = Math.floor(arr.length / 2),
            nums = [...arr].sort((a, b) => a - b)
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
    }
    mean(nums) {
        return nums.reduce((total, num) => total + num, 0) / nums.length
    }
    mode (arr) {
        return arr.sort((a, b) =>
            arr.filter(v => v === a).length -
            arr.filter(v => v === b).length
        ).pop()
    }
}
module.exports = Util
