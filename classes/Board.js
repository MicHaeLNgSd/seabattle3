class Board {
    static SHIPS_COUNT = 10
    static SIZE = 10
    static STEPS = { 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 4, 8: 4, 9: 4, 10: 4 }

    #squares = []
    #gridEl
    #onPlayerGoFunc
    #strategy

    constructor(build) {
        this.#gridEl = build.gridEl
        this.#strategy = build.strategy;
        this.#onPlayerGoFunc = build.onPlayerGoFunc;
    }

    static get Builder() {
        class Builder {
           constructor(gridEl) {
            this.gridEl = gridEl;
           }
           forComputer() {
              this.strategy = new ComputerStrategy();
              return this;
           }
           forUser() {
            const userShipsEl = document.querySelector('.user-ships')
            const userShipsEls = document.querySelectorAll('.user-ships > .ship-section > .ship')

              this.strategy = new UserStrategy(userShipsEl, userShipsEls);
              return this;
           }
           withGoListener(func) {
             this.onPlayerGoFunc = func;
             return this;
           }
           build() {
              return new Board(this);
           }
        }
        return Builder;
     }

    generateSquares() {
        for (let i = 0; i < Board.SIZE; i++) {
            for (let j = 0; j < Board.SIZE; j++) {
                const square = document.createElement('div')
                square.dataset.y = i
                square.dataset.x = j
                square.classList.add("square")
                this.#gridEl.appendChild(square)
                this.#squares.push(square)
                    if (this.#onPlayerGoFunc != undefined) {
                    square.addEventListener('click', () => {
                        this.#onPlayerGoFunc(square)
                    })
                }
            }
        }
        return this.#squares
    }

    putRandomShips() {
        for (let i = 1; i <= Board.SHIPS_COUNT; i++) {
            this.generateShipPosition(this.#shipIdByNumber(i))
        }
        this.showShips();
    }
    showShips() {
        this.#strategy.showShips(this.#squares);
    }

    checkerDead() {
        for (let i = 1; i <= Board.SHIPS_COUNT; i++) {
            let JSchecker = true;

            this.#squares.forEach(sq => {
                if (sq.classList.contains(`${this.#shipIdByNumber(i)}`)) {
                    if (!sq.classList.contains('boom')) {
                        JSchecker = false
                    }
                }
            })

            if (JSchecker) {
                this.#squares.forEach(sq => {
                    if (sq.classList.contains(`${this.#shipIdByNumber(i)}`)) {
                        sq.classList.add('dead')
                    }
                })

                this.#shipElementByNumber(i).classList.add('ship-checker-dead')

                for (let i = 0; i < 100; i++) {
                    for (let k = -1; k <= 1; k++) {
                        for (let g = -1; g <= 1; g++) {
                            if (i + k * 10 + g >= 0 && i + k * 10 + g < 100) {
                                if (Math.floor(i / 10) === Math.floor((i + g) / 10)) {
                                    if (this.#squares[i + k * 10 + g].classList.contains('dead')) {
                                        this.#squares[i].classList.add('miss');
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    clean() {
        this.#squares.forEach(square => {
            square.className = ""
            square.classList.add('square')
        })

        for (let i = 1; i <= Board.SHIPS_COUNT; i++) {
            let shipEl = this.#shipElementByNumber(i)

            shipEl.classList.remove('ship-checker')
            shipEl.classList.remove('ship-checker-dead')
        }
        this.#strategy.clean();
    }

    #shipIdByNumber(shipNumber) {
        return this.#strategy.shipIdByNumber(shipNumber);
    }

    #shipElementByNumber(shipNumber) {
        return document.querySelector(`[id="${this.#shipIdByNumber(shipNumber)}"]`)
    }

    generateShipPosition(shipId) {
        let randomDirection = Math.round(Math.random());
        let shipById = document.querySelector(`[id="${shipId}"]`);
        let randomStart = Math.abs(Math.floor(Math.random() * this.#squares.length));

        let shipStartY
        let shipEndY
        let step
        if (randomDirection === 0) {
            step = 1
            shipStartY = Math.floor(randomStart / 10)
            shipEndY = Math.floor((randomStart + shipById.childElementCount - 1) / 10)

            for (let i = randomStart; i < (randomStart + shipById.childElementCount); i++) {
                if (this.#squares[i].classList.contains("taken") || shipStartY != shipEndY || randomStart + shipById.childElementCount > this.#squares.length - 1) {
                    this.generateShipPosition(shipId)
                    return
                }
            }
        }

        if (randomDirection === 1) {
            step = 10

            for (let i = randomStart; i < (randomStart + shipById.childElementCount * step); i += step) {
                if (this.#squares[i].classList.contains("taken") || randomStart + shipById.childElementCount * step - 10 > this.#squares.length - 1) {
                    this.generateShipPosition(shipId)
                    return
                }
            }
        }

        for (let i = randomStart; i < (randomStart + shipById.childElementCount * step); i += step) {
            this.#squares[i].classList.add('takenByShip');
            this.#squares[i].classList.add(`${shipId}`);
        }

        for (let i = 0; i < 100; i++) {
            for (let k = -1; k <= 1; k++) {
                for (let g = -1; g <= 1; g++) {
                    if (i + k * 10 + g >= 0 && i + k * 10 + g < 100) {
                        if (Math.floor(i / 10) === Math.floor((i + g) / 10)) {
                            if (this.#squares[i + k * 10 + g].classList.contains('takenByShip')) {
                                this.#squares[i].classList.add('taken');
                            }
                        }
                    }
                }
            }
        }
    }
}

class UserStrategy {
    #userShipsEl
    #userShipsEls

    constructor (userShipsEl, userShipsEls) {
        this.#userShipsEl = userShipsEl
        this.#userShipsEls = userShipsEls
    }
    
    shipSectionIdGenerator(numShip) {
        let step = Board.STEPS[numShip]
        return 'ship-section' + step
    }

    showShips(squares) {
        squares.forEach(square => {
            if (square.classList.contains("takenByShip")) {
                square.classList.add("MyShips")
            }
        })
    }

    clean() {
        for (let i = 1; i <= Board.SHIPS_COUNT; i++) {
            let section = document.querySelector(`.${this.shipSectionIdGenerator(i)}`)
            section.append(document.querySelector(`[id="${this.shipIdByNumber(i)}"]`))
        }

        this.#userShipsEls.forEach(ship => {
            ship.classList.remove('ship-vertical')
        })

        this.#userShipsEl.classList.remove('user-ships-vertical')
    }

    shipIdByNumber(shipNumber) {
        return 'ship' + shipNumber
    }
}

class ComputerStrategy {
    isComputerBoard = true

    shipSectionIdGenerator(numShip) {
        let step = Board.STEPS[numShip]

        return 'eship-section' + step
    }

    showShips(squares) {
        return
    }

    clean() {
        return
    }

    shipIdByNumber(shipNumber) {
        return 'enemyShip' + shipNumber
    }
}
