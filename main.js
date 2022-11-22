console.log("main.js is connected!)");
const userGrid = document.querySelector('.user-grid')
const computerGrid = document.querySelector('.computer-grid')
const userShipsArea = document.querySelector('.user-ships')
const computerShipsArea = document.querySelector('.computer-ships')
const ships = document.querySelectorAll('.ship')
const AllSquares = document.querySelectorAll('.square')
const userSquares = []
const computerSquares = []
const width = 10
const countShips = 10
let isGameOver = false;
let isPlayer1 = true;
let sqSelector;

const turnDisplay = document.querySelector('#whose-go')

const startG = document.querySelector("#playGame");
startG.addEventListener("click", playGameBtn);

const randForMe = document.querySelector("#randForMe");
randForMe.addEventListener("click", () => createShips(userSquares));

const randForEnemy = document.querySelector("#randForEnemy");
randForEnemy.addEventListener("click", () => createShips(computerSquares));

const CleanMe = document.querySelector("#CleanMe");
CleanMe.addEventListener("click", () => cleanBoard(userSquares));

const CleanEnemy = document.querySelector("#CleanEnemy");
CleanEnemy.addEventListener("click", () => cleanBoard(computerSquares));

//Create Board
function createBoard(grid, squares) {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
            const square = document.createElement('div')
            square.dataset.y = i
            square.dataset.x = j
            square.classList.add("square")
            grid.appendChild(square)
            squares.push(square)
        }
    }
}

createBoard(userGrid, userSquares)
createBoard(computerGrid, computerSquares)


let draggedShip
let draggedShipLength
let currentSquare
let takingSectionId

function generate(GridSquares, shipId) {
    let randomDirection = Math.round(Math.random());
    //let randomDirection = 1
    let shipById = document.querySelector(`[id="${shipId}"]`);
    let randomStart = Math.abs(Math.floor(Math.random() * GridSquares.length));
    //let randomStart = 62
    //console.log("randomStart", randomStart)

    let shipStartY
    let shipEndY
    let step
    if (randomDirection === 0) {
        step = 1
        shipStartY = Math.floor(randomStart / 10)
        shipEndY = Math.floor((randomStart + shipById.childElementCount - 1) / 10)

        for (let i = randomStart; i < (randomStart + shipById.childElementCount); i++) { // проверить не мешают ли ему корабли на другом У
            if (GridSquares[i].classList.contains("taken") || shipStartY != shipEndY || randomStart + shipById.childElementCount > GridSquares.length - 1) {
                generate(GridSquares, shipId)
                return
            }
        }
    }
    if (randomDirection === 1) {
        step = 10

        for (let i = randomStart; i < (randomStart + shipById.childElementCount * step); i += step) { // проверить не мешают ли ему корабли на другом У
            if (GridSquares[i].classList.contains("taken") || randomStart + shipById.childElementCount * step - 10 > GridSquares.length - 1) {
                generate(GridSquares, shipId)
                return
            }
        }
    }

    for (let i = randomStart; i < (randomStart + shipById.childElementCount * step); i += step) {
        GridSquares[i].classList.add('takenByShip');
        GridSquares[i].classList.add(`${shipId}`);
    }

    for (let i = 0; i < 100; i++) {
        for (let k = -1; k <= 1; k++) {
            for (let g = -1; g <= 1; g++) {
                if (i + k * 10 + g >= 0 && i + k * 10 + g < 100) {
                    if (Math.floor(i / 10) === Math.floor((i + g) / 10)) {
                        if (GridSquares[i + k * 10 + g].classList.contains('takenByShip')) {
                            GridSquares[i].classList.add('taken');
                        }
                    }
                }
            }
        }
    }
}

function showMyShips(squares) {
    squares.forEach(square => {
        if (square.classList.contains("takenByShip")) {
            square.classList.add("MyShips")
        }
    })
}

//generate(userSquares, "ship10");

function shipIdGenerator(numSq, numShip) {
    return `${(numSq ? 'enemyS' : 's') + 'hip' + numShip}`
}

function createShips(squares) {
    sqSelector = (squares !== userSquares);

    cleanBoard(squares);

    for (let i = 1; i <= countShips; i++) {
        generate(squares, shipIdGenerator(sqSelector, i))
    }

    if (!sqSelector) {
        showMyShips(squares)
    }

    shipChecker(squares);
}

function cleanBoard(squares) {
    sqSelector = (squares !== userSquares); //because it can be press after another createShips pressed

    //let shipsArea
    //let shipNameStart
    squares.forEach(square => {
        square.className = ""
        square.classList.add('square')
    })
    removeShipChecker(squares);

    for (let i = 1; i <= countShips; i++) {
        shipById = document.querySelector(`[id="${shipIdGenerator(sqSelector, i)}"]`)
        shipById.classList.remove('ship-checker-dead')
    }
}

function shipChecker() { //squares
    for (let i = 1; i <= countShips; i++) {
        shipById = document.querySelector(`[id="${shipIdGenerator(sqSelector, i)}"]`)
        shipById.classList.add('ship-checker')
    }
}

function removeShipChecker() { //squares
    for (let i = 1; i <= countShips; i++) {
        shipById = document.querySelector(`[id="${shipIdGenerator(sqSelector, i)}"]`)
        shipById.classList.remove('ship-checker')
    }
}

function checkerDead(GridSquares) {
    sqSelector = (GridSquares !== userSquares);

    for (let i = 1; i <= countShips; i++) {
        let JSchecker = true;
        GridSquares.forEach(sq => {
            if (sq.classList.contains(`${shipIdGenerator(sqSelector, i)}`)) {
                if (!sq.classList.contains('boom')) {
                    JSchecker = false
                }
            }
        })
        if (JSchecker) {
            GridSquares.forEach(sq => {
                if (sq.classList.contains(`${shipIdGenerator(sqSelector, i)}`)) {
                    sq.classList.add('dead')
                }
            })

            shipById = document.querySelector(`[id="${shipIdGenerator(sqSelector, i)}"]`)
            shipById.classList.add('ship-checker-dead')

            for (let i = 0; i < 100; i++) {
                for (let k = -1; k <= 1; k++) {
                    for (let g = -1; g <= 1; g++) {
                        if (i + k * 10 + g >= 0 && i + k * 10 + g < 100) {
                            if (Math.floor(i / 10) === Math.floor((i + g) / 10)) {
                                if (GridSquares[i + k * 10 + g].classList.contains('dead')) {
                                    GridSquares[i].classList.add('miss');
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    //let ship = square.classList.contains('enemyShip1')
    //console.log("sh1", ship)
    return
}

function playGameBtn() {
    turnDisplay.innerHTML = 'Your Move';
    computerSquares.forEach(square => square.addEventListener('click', function (e) {
        playerGo(square);
    }))
    isGameOver = false
    isPlayer1 = true
}

function playGame() {
    if (isGameOver) return

    if (isPlayer1) {
        turnDisplay.innerHTML = 'Your Move';
    } else {
        turnDisplay.innerHTML = 'Computer`s Move';
        //computerGo();
        //setTimeout(computerGo, 1000)
        setTimeout(computerGo, 500)
    }
}

function playerGo(square) {
    if (isGameOver ||
        !isPlayer1 ||
        square.classList.contains('boom') ||
        square.classList.contains('miss')
    )
        return

    if (square.classList.contains('takenByShip')) {
        square.classList.add('boom')
        checkerDead(computerSquares)
        checkGameOver()

        return
    } else {
        square.classList.add('miss')
    }

    isPlayer1 = false;

    playGame();
}

function computerGo() {
    if (isGameOver) return

    let coord = Math.floor(Math.random() * userSquares.length);
    let boom1
    let isAI = false
    for (let i = 0; i < 100; i++) {
        if (userSquares[i].classList.contains('boom') && !userSquares[i].classList.contains('dead')) {
            //console.log('boom1', i);
            boom1 = i
            isAI = true
            break
        }
    }

    if (isAI) {
        coord = computerAI(boom1)
    }

    if (userSquares[coord].classList.contains('boom') || userSquares[coord].classList.contains('miss')) {
        return computerGo()
    } else {
        if (userSquares[coord].classList.contains('takenByShip')) {
            userSquares[coord].classList.add('boom')

            checkerDead(userSquares)
            checkGameOver()

            setTimeout(computerGo, 500)

            return
        } else {
            userSquares[coord].classList.add('miss')
        }
    }

    isPlayer1 = true;

    playGame()
}

function checkGameOver() {
    let userDeadShipsScore = 0
    let compDeadShipsScore = 0

    userSquares.forEach(sq => {
        if (sq.classList.contains('dead')) {
            userDeadShipsScore += 1
        }
    })

    computerSquares.forEach(sq => {
        if (sq.classList.contains('dead')) {
            compDeadShipsScore += 1
        }
    })

    if (userDeadShipsScore === 20 || compDeadShipsScore === 20) {
        turnDisplay.innerHTML = userDeadShipsScore > compDeadShipsScore ? 'You Lose' : 'You Win';

        isGameOver = true
    }
}

function computerAI(boomFirst) { //OPTIMIZED
    let boomLast
    let boom
    let directionTemp
    let rand
    let step

    for (let i = boomFirst + 1; i < 100; i++) {
        if (userSquares[i].classList.contains('boom') && !userSquares[i].classList.contains('dead')) {
            boomLast = i
        }
    }

    if (boomLast === undefined) {
        rand = Math.floor(Math.random() * 4);
        step = { 0: -10, 1: 1, 2: 10, 3: -1 }[rand]; // this is better then switch
        if (AILogicIsCanBePlaced(boomFirst, step)) {
            return boomFirst + step;
        }
        else {
            return computerAI(boomFirst);
        }
    }

    directionTemp = (boomLast - boomFirst < 10) ? 1 : 10

    rand = Math.floor(Math.random() * 2);
    step = rand ? -1 * directionTemp : 1 * directionTemp; // this is better then switch
    boom = (step > 0) ? boomLast : boomFirst;

    if (AILogicIsCanBePlaced(boom, step)) {
        return boom + step;
    }
    else {
        return computerAI(boomFirst);
    }
}

function AILogicIsCanBePlaced(boom, step) {
    return (boom + step >= 0 && boom + step < 100 &&
        !((boom % 10 === 0 && (boom + step) % 10 === 9) ||
            (boom % 10 === 9 && (boom + step) % 10 === 0)) &&
        !userSquares[boom + step].classList.contains('miss'))  //make faster can be deleted
}

// generate(userSquares, "ship4");
// generate(userSquares, "ship5");
// generate(userSquares, "ship6");

// generate(userSquares, "ship11");
// generate(userSquares, "ship12");
// generate(userSquares, "ship13");
// generate(userSquares, "ship14");
// generate(userSquares, "ship15");
// showMyShips(userSquares)