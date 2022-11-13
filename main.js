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
startG.addEventListener("click", playGame);

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
    //let randomDirection = Math.round(Math.random())
    let shipById = document.querySelector(`[id="${shipId}"]`)
    
    // let shipByIdChildCount  = shipById.childElementCount
  
    // for(let j = 0; j < 100; j++){
    //   computerSquares[j].classList.add('taken')
    // }
  
    for(let j = 0; j < 200; j++){ //while(true){
      let isTaken = false;
      let randomStart = Math.abs(Math.floor(Math.random() * GridSquares.length));
      //var randomStart = 4;
  
      //console.log("try", j);
      //console.log("randomStart",randomStart,GridSquares.length)
  
      let shipStartY = Math.floor(randomStart/10) 
      let shipEndY = Math.floor((randomStart + shipById.childElementCount - 1)/10)
  
      for(let i = randomStart; i < (randomStart + shipById.childElementCount) && i < GridSquares.length - 1; i++){ // проверить не мешают ли ему корабли на другом У
        if(GridSquares[i].classList.contains("taken")){
          isTaken = true;
        }
      }
  
      //console.log("shipStartY",shipStartY)
      if (shipStartY === shipEndY && !isTaken){
  
        for(let i = -1; i <= 1; i++){
          
          //console.log("ArroundY", Math.floor((randomStart + i*10) / 10));
  
          if( (randomStart + i*10) < 0 || (randomStart + i*10) > 99){ 
            continue;
          }
  
          for(let j = randomStart + i*10 - 1; j < (randomStart + i*10 + shipById.childElementCount + 1); j++){
  
            if(j < (shipStartY + i)*10 || j > (shipStartY + i) * 10 + 9){ 
              //console.log("i,j", i,j )
              continue;
            }
            GridSquares[j].classList.add('taken');
  
            if(i === 0 && j > (randomStart + i*10 - 1) && j < (randomStart + i*10 + shipById.childElementCount)){ 
              GridSquares[j].classList.add('takenByShip');
            }
          }
        }
        //GridSquares[randomStart].append(shipById);
        break;
      }
    }
  }
  
  function createShips(squares){
    console.log("squares",squares);
    cleanBoard(squares);
  
    if(squares === computerSquares){
      console.log("ENEMY");
      generate(squares,"enemyShip1");
  
      generate(squares,"enemyShip2");
      generate(squares,"enemyShip3");
  
      generate(squares,"enemyShip4");
      generate(squares,"enemyShip5");
      generate(squares,"enemyShip6");
  
      generate(squares,"enemyShip7");
      generate(squares,"enemyShip8");
      generate(squares,"enemyShip9");
      generate(squares,"enemyShip10");
    }
    else if(squares === userSquares){
      generate(squares,"ship1");
  
      generate(squares,"ship2");
      generate(squares,"ship3");
    
      generate(squares,"ship4");
      generate(squares,"ship5");
      generate(squares,"ship6");
    
      generate(squares,"ship7");
      generate(squares,"ship8");
      generate(squares,"ship9");
      generate(squares,"ship10");
    }
    shipChecker(squares);
  }
  
  function cleanBoard(squares){
    //let shipsArea
    //let shipNameStart
    squares.forEach( square =>{
      square.classList.remove('taken')
      square.classList.remove('takenByShip')
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

function shipChecker(squares){
    if(squares === userSquares){
        shipsArea = userShipsArea
        shipNameStart = 's'
      }
      else if(squares === computerSquares){
        shipsArea = computerShipsArea
        shipNameStart = 'enemyS'
      }
  
      for(let i = 1; i <= countShips; i++){
          shipById = document.querySelector(`[id="${shipNameStart}hip${i}"]`)
          shipById.classList.add('ship-checker')
      }
}

function removeShipChecker(squares){
    if(squares === userSquares){
        shipsArea = userShipsArea
        shipNameStart = 's'
      }
      else if(squares === computerSquares){
        shipsArea = computerShipsArea
        shipNameStart = 'enemyS'
      }
  
      for(let i = 1; i <= countShips; i++){
          shipById = document.querySelector(`[id="${shipNameStart}hip${i}"]`)
          shipById.classList.remove('ship-checker')
      }
}


function playGame() {
    //if (isGameOver) return
    if (isPlayer1 === true) {
      turnDisplay.innerHTML = 'Your Go';
      computerSquares.forEach(square => square.addEventListener('click', function(e) {
        playerGo();
      }))
    }
    if (isPlayer1 === false) {
      turnDisplay.innerHTML = 'Computers Go';
      computerGo();
      //setTimeout(computerGo, 1000)
    }
}

function playerGo(square){
    isPlayer1 = false;
    // if(square.classList.contains('boom'))
    // { 
    //     playGame(); 
    //     return;
    // }
    // else {
    //     if (square.classList.contains('takenByShip')) {
    //         square.classList.add('boom')
    //     } else {
    //         square.classList.add('miss')
    //     }
    //     //checkForWins()
    // }
    console.log("playerGo");
    playGame();
    return;
}

function computerGo(){
    isPlayer1 = true;
    // let random = Math.floor(Math.random() * userSquares.length)
    // console.log("random",random);
    // // if(userSquares[random].classList.contains('boom'))
    // // { 
    // //     console.log("userSquares[random] ", userSquares[random]);
    // //     playGame();
    // //     console.log("playGame");
    // //     return;
    // // } 
    // //else 
    // //if(!userSquares[random].classList.contains('boom')){

    //     console.log("userSquares[random] ", userSquares[random]);
    //     if (userSquares[random].classList.contains('takenByShip')) {
    //         userSquares[random].classList.add('boom')
    //     } else {
    //         userSquares[random].classList.add('miss')
    //     }
    //     //checkForWins()
    // //}
    console.log("computerGo");
    playGame();
    return;
}