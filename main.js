console.log('initialized main.js')

document.addEventListener("DOMContentLoaded", () => {
    const scoreboardEl = document.querySelector('#whose-go')
    const startGameBtn = document.querySelector("#playGame")
    const randomBtn = document.querySelector("#randForMe")
    const restartBtn = document.querySelector("#restart")

    const game = new Game()

    game.onScoreboardUpdated = (text) => {
        scoreboardEl.innerHTML = text
    }

    startGameBtn.addEventListener("click", () => {
        game.start()

        randomBtn.disabled = true
    })

    randomBtn.addEventListener("click", () => {
        game.putRandomShips()

        startGameBtn.disabled = false
    })

    restartBtn.addEventListener("click", () => {
        game.restart()

        randomBtn.disabled = false
        startGameBtn.disabled = true
    })
})
