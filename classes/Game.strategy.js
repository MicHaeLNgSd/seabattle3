class Game {
    #isGameOver = false
    #isUserTurn = true

    #userBoard
    #computerBoard

    #userSquaresEls
    #computerSquaresEls

    onScoreboardUpdated

    constructor () {
        const userGridEl = document.querySelector('.user-grid')
        const computerGridEl = document.querySelector('.computer-grid')
        const userShipsEl = document.querySelector('.user-ships')
        const userShipsEls = document.querySelectorAll('.user-ships > .ship-section > .ship')

        const userStrategy = new UserStrategy(userShipsEl, userShipsEls);
        const computerStrategy = new ComputerStrategy();

        this.#userBoard = new Board(userGridEl, userStrategy);
        this.#computerBoard = new Board(computerGridEl, computerStrategy, (square) => this.#playerGo(square));

        this.#userSquaresEls = this.#userBoard.generateSquares()
        this.#computerSquaresEls = this.#computerBoard.generateSquares()
    }

    start() {
        this.onScoreboardUpdated('Ваш Хід')

        this.#isGameOver = false
        this.#isUserTurn = true

        this.#userBoard.showShips()
    }

    putRandomShips() {
        this.#userBoard.putRandomShips()
        this.#computerBoard.putRandomShips()

        this.onScoreboardUpdated('Натисніть Старт')
    }

    restart() {
        this.#userBoard.clean()
        this.#computerBoard.clean()

        this.onScoreboardUpdated('Розставте кораблі')
    }

    #switchTurn() {
        if (this.#isGameOver) return
    
        if (this.#isUserTurn) {
            this.onScoreboardUpdated('Ваш Хід')
        } else {
            this.onScoreboardUpdated('Хід Суперника')

            setTimeout(() => this.#computerGo(), 500)
        }
    }

    #playerGo(square) {
        if (this.#isGameOver ||
            !this.#isUserTurn ||
            square.classList.contains('boom') ||
            square.classList.contains('miss')
        )
            return
    
        if (square.classList.contains('takenByShip')) {
            square.classList.add('boom')
            this.#computerBoard.checkerDead()
            this.#checkGameOver()
    
            return
        } else {
            square.classList.add('miss')
        }
    
        this.#isUserTurn = false;
    
        this.#switchTurn();
    }
    
    #computerGo() {
        if (this.#isGameOver) return

        let nextCoord = Math.floor(Math.random() * this.#userSquaresEls.length)

        for (let i = 0; i < 100; i++) {
            if (this.#userSquaresEls[i].classList.contains('boom') && !this.#userSquaresEls[i].classList.contains('dead')) {
                nextCoord = this.#computerAI(i)

                break
            }
        }

        if (this.#userSquaresEls[nextCoord].classList.contains('boom') || this.#userSquaresEls[nextCoord].classList.contains('miss')) {
            return this.#computerGo()
        } else {
            if (this.#userSquaresEls[nextCoord].classList.contains('takenByShip')) {
                this.#userSquaresEls[nextCoord].classList.add('boom')

                this.#userBoard.checkerDead()
                this.#checkGameOver()

                setTimeout(() => this.#computerGo(), 500)

                return
            } else {
                this.#userSquaresEls[nextCoord].classList.add('miss')
            }
        }

        this.#isUserTurn = true;

        this.#switchTurn()
    }
    
    #checkGameOver() {
        let userDeadShipsScore = 0
        let compDeadShipsScore = 0
    
        this.#userSquaresEls.forEach(sq => {
            if (sq.classList.contains('dead')) {
                userDeadShipsScore += 1
            }
        })

        this.#computerSquaresEls.forEach(sq => {
            if (sq.classList.contains('dead')) {
                compDeadShipsScore += 1
            }
        })

        if (userDeadShipsScore === 20 || compDeadShipsScore === 20) {
            this.onScoreboardUpdated(userDeadShipsScore > compDeadShipsScore ? 'Ви Програли' : 'Ви Перемогли')

            this.#isGameOver = true
    
            document.querySelectorAll('.computer-grid > .takenByShip').forEach(ship => {
                if (!ship.classList.contains('boom')) {
                    ship.classList.add("takenGOVision");
                }
            });
        }
    }
    
    #computerAI(hitCoordinates) {
        let boomLast
        let boom
        let directionTemp
        let rand
        let step
    
        for (let i = hitCoordinates + 1; i < 100; i++) {
            if (this.#userSquaresEls[i].classList.contains('boom') && !this.#userSquaresEls[i].classList.contains('dead')) {
                boomLast = i
            }
        }
    
        if (boomLast === undefined) {
            rand = Math.floor(Math.random() * 4);
            step = { 0: -10, 1: 1, 2: 10, 3: -1 }[rand];

            if (this.#AILogicIsCanBePlaced(hitCoordinates, step)) {
                return hitCoordinates + step;
            }
            else {
                return this.#computerAI(hitCoordinates);
            }
        }
    
        directionTemp = (boomLast - hitCoordinates < 10) ? 1 : 10
    
        rand = Math.floor(Math.random() * 2);
        step = rand ? -1 * directionTemp : 1 * directionTemp;
        boom = (step > 0) ? boomLast : hitCoordinates;
    
        if (this.#AILogicIsCanBePlaced(boom, step)) {
            return boom + step;
        }
        else {
            return this.#computerAI(hitCoordinates);
        }
    }

    #AILogicIsCanBePlaced(boom, step) { // TODO: rename
        return (boom + step >= 0 && boom + step < 100 &&
            !((boom % 10 === 0 && (boom + step) % 10 === 9) ||
                (boom % 10 === 9 && (boom + step) % 10 === 0)) &&
            !this.#userSquaresEls[boom + step].classList.contains('miss')) // make faster
    }
}
