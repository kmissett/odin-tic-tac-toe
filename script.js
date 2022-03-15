const gameBoardDisplay = document.getElementById("gameBoard")
const cells = document.querySelectorAll(".cell")
const currentPlayerDisplay = document.querySelector(".current-player")

const instructionsButton = document.querySelector(".instructions")
const instructionsModal = document.querySelector(".instructions-modal")
const closeModal = document.querySelector(".close-modal")

const newGameButton = document.querySelector('.new-game')
const resetButton = document.querySelector(".reset")
const newGameModal = document.querySelector(".new-game-modal")
const outcome = document.querySelector(".outcome")

// player factory function
const Player = (symbol) => {
  const playerName = `Player ${symbol.toUpperCase()}`
  const playerSymbol = document.getElementById(symbol).outerHTML
  const playerCells = []
  const score = 0
  const scoreDisplay = document.querySelector(`.player-${symbol} .score`)
  
  const displayName = () => {
    const nameDisplay = document.querySelector(`.player-${symbol} .name`)
    nameDisplay.innerText = `${playerName}: `
  }
  return {playerName, playerSymbol, playerCells, score, scoreDisplay, displayName}
}

// create the players
const playerX = Player("x")
const playerO = Player("o")

// gameBoard module
const gameBoard = (() => {
  let currentPlayer = playerX
  let turnCount = 0
  let numberOfGames = 0

  const winningPatterns = [
    [0,1,2], [3,4,5], [6,7,8],  // rows
    [0,3,6], [1,4,7], [2,5,8],  // columns
    [0,4,8], [2,4,6]            // diagonals
  ]
  
  const assignCell = (e) => {
    currentPlayer.playerCells.push(parseInt(e.target.dataset.cell))
    e.target.innerHTML = currentPlayer.playerSymbol
    e.target.disabled = true
    e.target.blur()
  }

  const togglePlayer = () => {
    currentPlayer = (currentPlayer === playerX) ? playerO : playerX
    currentPlayerDisplay.innerText = currentPlayer.playerName
  }

  const turn = (e) => {
    
    if(e.target.classList.contains("cell") && e.target.innerText === "") {
      turnCount += 1
      assignCell(e)
      togglePlayer()
    }

    if(checkWin(playerX)) {
      winGame(playerX)

      numberOfGames += 1
    }
    if(checkWin(playerO)) {
      winGame(playerO)
      numberOfGames += 1
    }

    if(turnCount === 9 && !checkWin(playerX) && !checkWin(playerO)) {
      outcome.innerText = "It's a tie! Play again?"
      numberOfGames += 1
      newGameButton.addEventListener("click", startNewGame)
      resetButton.addEventListener("click", reset)
      newGameModal.classList.remove("display-none")
    }
  }

  const checkWin = (player) => {

    let playerWins = false
    winningPatterns.forEach(pattern => {
      if (pattern.every(cell => player.playerCells.includes(cell))) playerWins = true
    })

    return playerWins
  }

  const winGame = (player) => {
    gameBoardDisplay.removeEventListener("click", gameBoard.turn)
    
    player.score += 1
    
    outcome.textContent = `${player.playerName} wins! Play again?`
    newGameButton.addEventListener("click", startNewGame)
    resetButton.addEventListener("click", reset)
    newGameModal.classList.remove("display-none")
  }

  const startNewGame = () => { 

    newGameButton.removeEventListener("click", startNewGame)
    resetButton.removeEventListener("click", reset)

    cells.forEach(cell=> {
      cell.innerHTML = ""
      cell.disabled = false
    })
    turnCount = 0
    playerX.displayName()
    playerO.displayName()
    playerX.scoreDisplay.innerText = playerX.score
    playerO.scoreDisplay.innerText = playerO.score
    playerX.playerCells = []
    playerO.playerCells = []
    currentPlayer = numberOfGames % 2 === 0 ? playerX : playerO
    currentPlayerDisplay.innerText = currentPlayer.playerName
    newGameModal.classList.add("display-none")
    instructionsModal.classList.add("display-none")
    gameBoardDisplay.addEventListener("click", turn)

    // allow playing by keyboard; Tab and Shift-Tab to focus, Enter to select
    cells.forEach(cell => cell.addEventListener("keydown", (e) => {
      if(e.key === "Enter" && cell.innerHTML === "") turn 
    },
      {once: true}))
  }

  const reset = () => {
    numberOfGames = 0
    playerX.score = 0
    playerO.score = 0

    startNewGame()

  }

  return {startNewGame}
})()



// start the game
gameBoard.startNewGame()


// add event listeners for instructions window
instructionsButton.addEventListener("click", () => {
  instructionsModal.classList.remove("display-none")
  closeModal.addEventListener("click", () => instructionsModal.classList.add("display-none"))
})

instructionsModal.addEventListener("click", (e) => {
  if(e.target.classList.contains("close-modal") || e.target.classList.contains("instructions-modal")) {
    instructionsModal.classList.add("display-none")
  }
})
document.addEventListener("keydown", (e) => {
  if(!instructionsModal.classList.contains("display-none") && e.key === "Escape") { instructionsModal.classList.add("display-none") }
})