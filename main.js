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
randForMe.addEventListener("click", () => createShips(userSquares, true));

const randForEnemy = document.querySelector("#randForEnemy");
randForEnemy.addEventListener("click", () => createShips(computerSquares, false));

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

function createShips(squares, isUserSquares) {
    sqSelector = Number(!isUserSquares);

    cleanBoard(squares);

    for (let i = 1; i <= countShips; i++) {
        generate(squares, shipIdGenerator(!isUserSquares, i))
    }

    if (isUserSquares) {
        showMyShips(squares)
    }

    shipChecker(squares);
}

function cleanBoard(squares) {
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

function shipChecker(squares) {
    for (let i = 1; i <= countShips; i++) {
        shipById = document.querySelector(`[id="${shipIdGenerator(sqSelector, i)}"]`)
        shipById.classList.add('ship-checker')
    }
}

function removeShipChecker(squares) {
    for (let i = 1; i <= countShips; i++) {
        shipById = document.querySelector(`[id="${shipIdGenerator(sqSelector, i)}"]`)
        shipById.classList.remove('ship-checker')
    }
}

function checkerDead(GridSquares) {
    sqSelector = Number(GridSquares !== userSquares);

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
            console.log('boom1', i);
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

function computerAI(boom1) { //NOT OPTIMIZED
    //let boom1
    let boom2 = -1
    let boom3 = -1
    let direction
    let rand
    let temp1
    // for (let i = 0; i < 100; i++) {
    //     if (userSquares[i].classList.contains('boom') && !userSquares[i].classList.contains('dead')) {
    //         console.log('boom1', i);
    //         boom1 = i
    //         break
    //     }
    // }
    for (let i = boom1 + 1; i < 100; i++) {
        if (userSquares[i].classList.contains('boom') && !userSquares[i].classList.contains('dead')) {
            console.log('boom2', i);
            boom2 = i

            for (let j = boom2 + 1; j < 100; j++) {
                if (userSquares[j].classList.contains('boom') && !userSquares[j].classList.contains('dead')) {
                    console.log('boom3', j);
                    boom3 = j
                    break
                }
            }
            break
        }
    }

    if (boom2 < 0) {
        rand = Math.floor(Math.random() * 4);
        temp1 = { 0: -10, 1: 1, 2: 10, 3: -1 }[rand]; // this is better then switch
        // switch (rand) {
        //     case 0:
        //         temp1 = -10
        //         break;
        //     case 1:
        //         temp1 = 1
        //         break;
        //     case 2:
        //         temp1 = 10
        //         break;
        //     case 3:
        //         temp1 = -1
        //         break;
        //     default:
        //         break;
        // }
        if (boom1 + temp1 >= 0 && boom1 + temp1 < 100 &&
            !((boom1 % 10 === 0 && (boom1 + temp1) % 10 === 9) ||
                (boom1 % 10 === 9 && (boom1 + temp1) % 10 === 0)) &&
            !userSquares[boom1 + temp1].classList.contains('miss')) { //make faster can be deleted
            console.log('boom1 + temp1', boom1 + temp1);
            return boom1 + temp1;
        }
        else {
            return computerAI(boom1);
        }
    }
    else if (boom2 >= 0 && boom2 < 100 && boom3 < 0) {
        if (boom2 - boom1 === 1) {
            rand = Math.floor(Math.random() * 2);
            temp1 = rand ? -1 : 1; // this is better then switch
            // switch (rand) {
            //     case 0:
            //         temp1 = 1
            //         break;
            //     case 1:
            //         temp1 = -1
            //         break;
            //     default:
            //         break;
            // }
            if (temp1 > 0) {
                if (boom2 + temp1 >= 0 && boom2 + temp1 < 100 &&
                    !((boom2 % 10 === 0 && (boom2 + temp1) % 10 === 9) ||
                        (boom2 % 10 === 9 && (boom2 + temp1) % 10 === 0)) &&
                    !userSquares[boom2 + temp1].classList.contains('miss')) { //make faster can be deleted
                    console.log('boom2 + temp1', boom2 + temp1);
                    return boom2 + temp1;
                }
                else {
                    return computerAI(boom1);
                }
            }
            else if (temp1 < 0) {
                if (boom1 + temp1 >= 0 && boom1 + temp1 < 100 &&
                    !((boom1 % 10 === 0 && (boom1 + temp1) % 10 === 9) ||
                        (boom1 % 10 === 9 && (boom1 + temp1) % 10 === 0)) &&
                    !userSquares[boom1 + temp1].classList.contains('miss')) { //make faster can be deleted
                    console.log('boom1 + temp1', boom1 + temp1);
                    return boom1 + temp1;
                }
                else {
                    return computerAI(boom1);
                }
            }
        }
        else if (boom2 - boom1 === 10) {
            rand = Math.floor(Math.random() * 2);
            temp1 = rand ? -10 : 10; // this is better then switch
            // switch (rand) {
            //     case 0:
            //         temp1 = 10
            //         break;
            //     case 1:
            //         temp1 = -10
            //         break;
            //     default:
            //         break;
            // }
            if (temp1 > 0) {
                if (boom2 + temp1 >= 0 && boom2 + temp1 < 100 &&
                    !((boom2 % 10 === 0 && (boom2 + temp1) % 10 === 9) ||
                        (boom2 % 10 === 9 && (boom2 + temp1) % 10 === 0)) &&
                    !userSquares[boom2 + temp1].classList.contains('miss')) { //make faster can be deleted
                    console.log('boom2 + temp1', boom2 + temp1);
                    return boom2 + temp1
                }
                else {
                    return computerAI(boom1)
                }
            }
            else if (temp1 < 0) {
                if (boom1 + temp1 >= 0 && boom1 + temp1 < 100 &&
                    !((boom1 % 10 === 0 && (boom1 + temp1) % 10 === 9) ||
                        (boom1 % 10 === 9 && (boom1 + temp1) % 10 === 0)) &&
                    !userSquares[boom1 + temp1].classList.contains('miss')) { //make faster can be deleted
                    console.log('boom1 + temp1', boom1 + temp1);
                    return boom1 + temp1
                }
                else {
                    return computerAI(boom1)
                }
            }
        }
    }
    else if (boom3 >= 0 && boom3 < 100) {
        if (boom3 - boom2 === 1) {
            rand = Math.floor(Math.random() * 2);
            temp1 = rand ? -1 : 1; // this is better then switch
            // switch (rand) {
            //     case 0:
            //         temp1 = 1
            //         break;
            //     case 1:
            //         temp1 = -1
            //         break;
            //     default:
            //         break;
            // }
            if (temp1 > 0) {
                if (boom3 + temp1 >= 0 && boom3 + temp1 < 100 &&
                    !((boom3 % 10 === 0 && (boom3 + temp1) % 10 === 9) ||
                        (boom3 % 10 === 9 && (boom3 + temp1) % 10 === 0)) &&
                    !userSquares[boom3 + temp1].classList.contains('miss')) { //make faster can be deleted
                    console.log('boom3 + temp1', boom3 + temp1);
                    return boom3 + temp1
                }
                else {
                    return computerAI(boom1)
                }
            }
            else if (temp1 < 0) {
                if (boom1 + temp1 >= 0 && boom1 + temp1 < 100 &&
                    !((boom1 % 10 === 0 && (boom1 + temp1) % 10 === 9) ||
                        (boom1 % 10 === 9 && (boom1 + temp1) % 10 === 0)) &&
                    !userSquares[boom1 + temp1].classList.contains('miss')) { //make faster can be deleted
                    console.log('boom1 + temp1', boom1 + temp1);
                    return boom1 + temp1
                }
                else {
                    return computerAI(boom1)
                }
            }
        }
        else if (boom3 - boom2 === 10) {
            rand = Math.floor(Math.random() * 2);
            temp1 = rand ? -10 : 10; // this is better then switch
            // switch (rand) {
            //     case 0:
            //         temp1 = 10
            //         break;
            //     case 1:
            //         temp1 = -10
            //         break;
            //     default:
            //         break;
            // }
            if (temp1 > 0) {
                if (boom3 + temp1 >= 0 && boom3 + temp1 < 100 &&
                    !((boom3 % 10 === 0 && (boom3 + temp1) % 10 === 9) ||
                        (boom3 % 10 === 9 && (boom3 + temp1) % 10 === 0)) &&
                    !userSquares[boom3 + temp1].classList.contains('miss')) { //make faster can be deleted
                    console.log('boom3 + temp1', boom3 + temp1);
                    return boom3 + temp1
                }
                else {
                    return computerAI(boom1)
                }
            }
            else if (temp1 < 0) {
                if (boom1 + temp1 >= 0 && boom1 + temp1 < 100 &&
                    !((boom1 % 10 === 0 && (boom1 + temp1) % 10 === 9) ||
                        (boom1 % 10 === 9 && (boom1 + temp1) % 10 === 0)) &&
                    !userSquares[boom1 + temp1].classList.contains('miss')) { //make faster can be deleted
                    console.log('boom1 + temp1', boom1 + temp1);
                    return boom1 + temp1
                }
                else {
                    return computerAI(boom1)
                }
            }
        }
    }
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

// function computerAI(random){
//   let wrongDir
//   if(random < 10){
//     wrongDir = 0
//   }
//   if(random >= 90){
//     wrongDir = 1
//   }
//   if(random % 10 < 1){
//     wrongDir = 2
//   }
//   if(random % 10 > 8){
//     wrongDir = 3
//   }

//   let nearRandom = Math.floor(Math.random() * 2);
//   if (nearRandom === wrongDir){computerAI(random)};

//   switch (nearRandom){
//     case 0:
//       nearRandom = -10
//       break;
//     case 1:
//       nearRandom = 1
//       break;
//     case 2:
//       nearRandom = 10
//       break;
//     case 3:
//       nearRandom = -1
//       break;
//   }

//   if(userSquares[random + nearRandom].classList.contains('boom'))
//   {
//       computerAI(random)
//   }
//   else{
//       if (userSquares[random + nearRandom].classList.contains('takenByShip')) {
//           userSquares[random + nearRandom].classList.add('boom')
//           setTimeout(computerAI(random + nearRandom), 1000)
//       } else {
//           userSquares[random + nearRandom].classList.add('miss')
//       }
//       //checkForWins()
//   }
//   isPlayer1 = true;
//   playGame();
// }