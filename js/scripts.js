let numBombs = 20;
let gameBoard = document.getElementById('gameboard')
let newGameButton = document.getElementById('newGame')
const nodes = []
let boardWidth = 10
let boardHeight = 10
let flagCount = 0
let isGameActive = true

window.onload = function() {
    createNewGame(numBombs)
}

/**
 * Generate a new game
 * @param {event} click event
 */
newGameButton.addEventListener("click", function(event) {
    createNewGame(numBombs)
});

/**
 * Clear all divs from the gameBoard
 */
const clearGameBoard = function() {
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }
}

/**
 * Create a new minesweeper game
 * @param {Integer} numBombs
 */
const createNewGame = function(numBombs) {
    isGameActive = true
    clearGameBoard()
    const boardSize = boardWidth * boardHeight
    const bombLocations = getBombLocations(boardSize, numBombs)
    for (let i=0; i < boardSize; i++ ) {
        const thisNode = document.createElement('div')
        thisNode.id = i
        thisNode.classList.add('node')
        if (bombLocations.indexOf(i) > -1) {
            thisNode.classList.add('bomb')
        }

        // Left-click (normal click)
        thisNode.addEventListener("click", function(event) {
            if (isGameActive) {
                processLeftClick(parseInt(this.id))
            }
        });
        
        // Right-click (context menu)
        thisNode.addEventListener("contextmenu", function(event) {
            event.preventDefault(); // Prevents the default right-click menu
            if (isGameActive) {
                processRightClick(parseInt(this.id))
            }
        });

        nodes.push(thisNode)
        gameBoard.appendChild(thisNode)
    }
}

/**
 * Distributes numBombs throughtout boardSize field
 * @param {Integer} boardSize
 * @param {Integer} numBombs
 * @return {Array} of the bomb locations
 */
const getBombLocations = function(boardSize, numBombs) {
    const bombLocations = []
    for (let i = 0; i < numBombs; i++) {
        const bombLocation = getRandomBombLocation(boardSize, bombLocations)
        bombLocations.push(bombLocation)
    }
    return bombLocations
}

/**
 * Randomly select an integer between 1 & boardsize that is not in bombLocations
 * @param {Integer} boardSize
 * @param {Integer} bombLocations
 * @return {Integer} of the bomb location
 */
const getRandomBombLocation = function(boardSize, bombLocations) {
    let rand = Math.floor(Math.random() * boardSize)
    if (!bombLocations.indexOf(rand) > -1) {
        return rand
    } else {
        return getRandomBombLocation(boardSize, bombLocations)
    }
}

const processLeftClick = function(nodeId) {
    const thisNode = document.getElementById(nodeId)
    if (thisNode.classList.contains('checked')) return
    if (thisNode.classList.contains('flag')) return
    thisNode.classList.add('checked')

    // Check clicked node for bomb
    if (thisNode.classList.contains('bomb')) {
        youLoseGame(thisNode)
        return
    }

    // Get bomb count from neighbors
    const neighbors = getNeighbors(nodeId)
    let numBombs = 0
    neighbors.forEach(neighbor => {
        const thisNeighbor = document.getElementById(neighbor)
        if (thisNeighbor.classList.contains('bomb')) {
            numBombs++
        }
    })

    if (numBombs == 0) {
        thisNode.classList.add('blank')
        neighbors.forEach(neighbor => {
            processLeftClick(neighbor)
        })
    } else {
        thisNode.classList.add(`bombcount-${numBombs}`)
        thisNode.textContent = numBombs
    }
}

const processRightClick = function(nodeId) {
    const thisNode = document.getElementById(nodeId)
    if (thisNode.classList.contains('checked')) return
    
    
    // If already has flag, remove the flag
    if (thisNode.classList.contains('flag')) {
        flagCount--
        thisNode.textContent = ''
        thisNode.classList.remove('flag')
        return
    }
    
    thisNode.classList.add('flag')
    thisNode.textContent = '🚩'
    flagCount++
}


/**
 * Identify the nodes that the given nodeID is connected to
 * @param {Integer} nodeId
 * @return {Array} of nodeIds that this node is touching
 */
const getNeighbors = function(nodeId) {
    const neighbors = []
    const isLeftEdge = nodeId % boardWidth == 0
    const isRightEdge = (nodeId + 1)  % boardWidth == 0

    // if node not in the top row, process the top row
    if  (nodeId > 9) {
        if (!isLeftEdge) {
            neighbors.push(nodeId - 11)
        }
        neighbors.push(nodeId - 10)
        if (!isRightEdge) {
            neighbors.push(nodeId - 9)
        }
    }

    // Process left & right
    if (!isLeftEdge) {
        neighbors.push(nodeId - 1)
    }
    if (!isRightEdge) {
        neighbors.push(nodeId + 1)
    }

    // if node not in the bottom row, process the bottom row
    if  (nodeId < 90) {
        if (!isLeftEdge) {
            neighbors.push(nodeId +9 )
        }
        neighbors.push(nodeId + 10)
        if (!isRightEdge) {
            neighbors.push(nodeId + 11)
        }
    }

    return neighbors
}

/**
 * End game
 * @param {Object} thisNode - The node that was clicked incorrectly
 */
const youLoseGame = function(thisNode) {
    thisNode.classList.add('explode')
    isGameActive = false
    const nodes = document.getElementsByClassName('node')
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].classList.contains('bomb') && !nodes[i].classList.contains('flag')) {
            nodes[i].textContent = '💣'
        }
    }
}
