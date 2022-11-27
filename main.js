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

const CleanMe = document.querySelector("#cleanMe");
CleanMe.addEventListener("click", () => cleanBoard(userSquares));

const CleanEnemy = document.querySelector("#cleanEnemy");
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

function generate(GridSquares, shipId) {
    let randomDirection = Math.round(Math.random());
    let shipById = document.querySelector(`[id="${shipId}"]`);
    let randomStart = Math.abs(Math.floor(Math.random() * GridSquares.length));

    let shipStartY
    let shipEndY
    let step
    if (randomDirection === 0) {
        step = 1
        shipStartY = Math.floor(randomStart / 10)
        shipEndY = Math.floor((randomStart + shipById.childElementCount - 1) / 10)

        for (let i = randomStart; i < (randomStart + shipById.childElementCount); i++) {
            if (GridSquares[i].classList.contains("taken") || shipStartY != shipEndY || randomStart + shipById.childElementCount > GridSquares.length - 1) {
                generate(GridSquares, shipId)
                return
            }
        }
    }
    if (randomDirection === 1) {
        step = 10

        for (let i = randomStart; i < (randomStart + shipById.childElementCount * step); i += step) {
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

function shipSectionIdGenerator(numSq, numShip) {
    let step = { 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 4, 8: 4, 9: 4, 10: 4 }[numShip];
    return `${(numSq ? 'e' : '') + 'ship-section' + step}`
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

    // for (let i = 1; i <= countShips; i++) {
    //     shipById = document.querySelector(`[id="${shipIdGenerator(sqSelector, i)}"]`)
    //     shipById.classList.remove('ship-checker-dead')
    // }

    if (!sqSelector) {
        cleanBoardFromObj()
    }
}

function cleanBoardFromObj() {
    let section
    for (let i = 1; i <= countShips; i++) {
        shipById = document.querySelector(`[id="${shipIdGenerator(0, i)}"]`)
        section = document.querySelector(`.${shipSectionIdGenerator(0, i)}`)
        console.log('section', section);
        section.append(shipById)
    }
    myShips.forEach(ship => {
        ship.classList.remove('ship-vertical');
    });
    myShipSection.forEach(sec => {
        sec.classList.remove('ship-section-vertical');
    });
    userShipsArea.classList.remove('user-ships-vertical');
    isHorizontal = true
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
        shipById.classList.remove('ship-checker-dead')
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

    myShips.forEach(ship => {
        ship.setAttribute('draggable', false);
    });
    cleanBoardFromObj()
    showMyShips(userSquares)
    shipChecker(userSquares)
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

const dragDropBtn = document.querySelector("#dragDrop");
dragDropBtn.addEventListener("click", dragDropFunc);

let draggedShip
let draggedShipLength
let currentSquare
let takingSectionId

let gameStart = false

//console.log(myShips);
let myShips = document.querySelectorAll('.user-ships > .ship-section > .ship')
function dragDropFunc() {
    console.log('dragDropFunc active');
    myShips.forEach(ship => {
        ship.setAttribute('draggable', true);
    });

    myShips.forEach(ship => {
        ship.addEventListener('dragstart', dragStart)
        ship.addEventListener('dragend', dragEnd)
        //ship.addEventListener('drag', drag)
    });

    userSquares.forEach(square => {
        square.addEventListener('dragenter', dragEnter)
        //square.addEventListener('dragleave', dragLeave)
        square.addEventListener('dragover', dragOver)
        square.addEventListener('drop', dragDrop)
    });

    ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
        takingSectionId = parseInt(e.target.id.substr(-1))
        console.log("takingSection", takingSectionId)
    }))

    function dragStart(e) {
        console.log('dragStart');

        draggedShip = this
        draggedShipLength = this.childElementCount
        this.classList.add("ship-active")
        e.dataTransfer.setData("ship", this.id);

        for (let i = 0; i < 100; i++) {
            if (userSquares[i].classList.contains(`${this.id}`)) {
                userSquares[i].classList.remove('takenByShip')
                userSquares[i].classList.remove(`${this.id}`)
            }
        }

        for (let i = 0; i < 100; i++) {
            for (let k = -1; k <= 1; k++) {
                for (let g = -1; g <= 1; g++) {
                    if (i + k * 10 + g >= 0 && i + k * 10 + g < 100) {
                        if (Math.floor(i / 10) === Math.floor((i + g) / 10)) {
                            if (userSquares[i + k * 10 + g].classList.contains('takenByShip')) {
                                userSquares[i].classList.add('taken');
                                userSquares[i].classList.add('MyTaken');
                            }
                        }
                    }
                }
            }
        }
    }

    function dragEnter(e) {
        e.preventDefault();
        currentSquare = parseInt(this.dataset.y) * 10 + parseInt(this.dataset.x)
        console.log("currentSquare", currentSquare)
    }

    // function dragLeave() {
    //     console.log('dragLeave')
    // }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragDrop(e) {
        if (draggedShip !== undefined) {
            //console.log("dragDrop", dragDrop)



            //console.log("shipStartY", shipStartY)
            //console.log("shipEndY", shipEndY)
            let step = (isHorizontal) ? 1 : 10;

            if (isHorizontal) {
                let shipStartY = Math.floor((currentSquare - takingSectionId) / 10);
                let shipEndY = Math.floor((currentSquare - takingSectionId + draggedShipLength - 1) / 10);
                if (shipStartY !== shipEndY) {
                    return;
                }
            }

            for (let i = currentSquare - takingSectionId * step; i < (currentSquare - (takingSectionId - draggedShipLength) * step); i += step) {
                if (userSquares[i].classList.contains("taken") || i > userSquares.length - 1) {
                    console.log("return")
                    return;
                }
            }


            let flag = e.dataTransfer.getData("ship");
            let ditem = document.querySelector(`[id="${flag}"]`)

            for (let i = currentSquare - takingSectionId * step; i < (currentSquare - (takingSectionId - draggedShipLength) * step); i += step) {
                console.log(currentSquare, takingSectionId, draggedShipLength, step)
                userSquares[i].classList.add("takenByShip")
                //userSquares[i].classList.add("MyShips")
                userSquares[i].classList.add(`${flag}`)
            }

            let y = Math.floor((currentSquare - takingSectionId * step) / 10);
            let x = (currentSquare - takingSectionId * step) % 10;

            //console.log(y)
            //console.log(x)

            let dsq = document.querySelector(`[data-y="${y}"][data-x="${x}"]`)

            //console.log(ditem)
            //console.log("dsq", dsq)
            dsq.append(ditem)
            //this.classList.remove("box-active") 

        }
    }

    function dragEnd() {
        userSquares.forEach(square => {
            //square.className = ""
            square.classList.remove('MyTaken')
            draggedShip.classList.remove("ship-active")
        })
        draggedShip = undefined
    }
}

const rotateBtn = document.querySelector("#rotate");
rotateBtn.addEventListener("click", rotate);

let myShipSection = document.querySelectorAll('.user-ships > .ship-section')
let myShipsRotate
let isHorizontal = true
function rotate() {
    myShipsRotate = document.querySelectorAll('.user-ships > .ship-section > .ship')
    myShipsRotate.forEach(ship => {
        ship.classList.toggle('ship-vertical');
    });
    myShipSection.forEach(sec => {
        sec.classList.toggle('ship-section-vertical');
    });
    userShipsArea.classList.toggle('user-ships-vertical');
    isHorizontal = !isHorizontal
}
