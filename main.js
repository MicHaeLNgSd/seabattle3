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
    let randomDirection = Math.round(Math.random())
    //let randomDirection = 1
    let shipById = document.querySelector(`[id="${shipId}"]`)
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
    if (squares === userSquares) {
        squares.forEach(square => {
            //square.classList.add("MyShips")
            if (square.classList.contains("takenByShip")) {
                square.classList.add("MyShips")
            }
        })
    }
}

function createShips(squares) {
    console.log("squares", squares);
    cleanBoard(squares);

    if (squares === computerSquares) {
        console.log("ENEMY");
        generate(squares, "enemyShip1");

        generate(squares, "enemyShip2");
        generate(squares, "enemyShip3");

        generate(squares, "enemyShip4");
        generate(squares, "enemyShip5");
        generate(squares, "enemyShip6");

        generate(squares, "enemyShip7");
        generate(squares, "enemyShip8");
        generate(squares, "enemyShip9");
        generate(squares, "enemyShip10");
    }
    else if (squares === userSquares) {
        generate(squares, "ship1");

        generate(squares, "ship2");
        generate(squares, "ship3");

        generate(squares, "ship4");
        generate(squares, "ship5");
        generate(squares, "ship6");

        generate(squares, "ship7");
        generate(squares, "ship8");
        generate(squares, "ship9");
        generate(squares, "ship10");

        showMyShips(squares)
    }
    shipChecker(squares);
}

function cleanBoard(squares) {
    //let shipsArea
    //let shipNameStart
    squares.forEach(square => {
        square.classList.remove('taken')
        square.classList.remove('takenByShip')
        square.classList.remove('MyShips')
        square.classList.remove('boom')
        square.classList.remove('miss')
    })
    removeShipChecker(squares);
    // if(squares === userSquares){
    //   shipsArea = userShipsArea
    //   shipNameStart = 's'
    // }
    // else if(squares === computerSquares){
    //   shipsArea = computerShipsArea
    //   shipNameStart = 'enemyS'
    // }
    // for(let i = 1; i <= countShips; i++){
    //   //console.log(`[id="${shipNameStart}hip${i}"]`)
    //   shipById = document.querySelector(`[id="${shipNameStart}hip${i}"]`)
    //   shipsArea.append(shipById)
    // }
}

function shipChecker(squares) {
    if (squares === userSquares) {
        shipsArea = userShipsArea
        shipNameStart = 's'
    }
    else if (squares === computerSquares) {
        shipsArea = computerShipsArea
        shipNameStart = 'enemyS'
    }

    for (let i = 1; i <= countShips; i++) {
        shipById = document.querySelector(`[id="${shipNameStart}hip${i}"]`)
        shipById.classList.add('ship-checker')
    }
}

function removeShipChecker(squares) {
    if (squares === userSquares) {
        shipsArea = userShipsArea
        shipNameStart = 's'
    }
    else if (squares === computerSquares) {
        shipsArea = computerShipsArea
        shipNameStart = 'enemyS'
    }

    for (let i = 1; i <= countShips; i++) {
        shipById = document.querySelector(`[id="${shipNameStart}hip${i}"]`)
        shipById.classList.remove('ship-checker')
    }
}


function playGameBtn() {
    turnDisplay.innerHTML = 'Your Move';
    computerSquares.forEach(square => square.addEventListener('click', function (e) {
        playerGo(square);
    }))
}

function playGame() {
    //if (isGameOver) return
    if (isPlayer1 === true) {
        turnDisplay.innerHTML = 'Your Move';
    }
    if (isPlayer1 === false) {
        turnDisplay.innerHTML = 'Computer`s Move';
        //computerGo();
        setTimeout(computerGo, 1000)
    }
}

function playerGo(square) {
    if (square.classList.contains('boom') || square.classList.contains('miss')) {
        return
        //playGame(); 
    }
    else {
        if (square.classList.contains('takenByShip')) {
            square.classList.add('boom')
            return
        } else {
            square.classList.add('miss')
        }
        //checkForWins()
    }
    console.log("playerGo");
    isPlayer1 = false;
    playGame();
}

function computerGo() {
    let random = Math.floor(Math.random() * userSquares.length);
    console.log("random", random);

    if (userSquares[random].classList.contains('boom') || userSquares[random].classList.contains('miss')) {
        computerGo();
    }
    else {
        if (userSquares[random].classList.contains('takenByShip')) {
            userSquares[random].classList.add('boom')
            setTimeout(computerGo, 1000)
            //setTimeout(computerAI(random), 1000)
        } else {
            userSquares[random].classList.add('miss')
        }
        //checkForWins()
    }
    console.log("computerGo");
    isPlayer1 = true;
    playGame()
}



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