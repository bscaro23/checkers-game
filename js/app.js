/*-------------------------------- Constants --------------------------------*/


/*------------------------ Cached Element References ------------------------*/

const boardElm = document.querySelector('#board');
const whichTurnElm = document.querySelector('#which-turn');
const modeButtonElm = document.querySelector('#mode')
const player1ScoreElm = document.querySelector('#player1-score');
const player2ScoreElm = document.querySelector('#player2-score');
const player1PieceElm = document.querySelector('#player1-piece');
const player2PieceElm = document.querySelector('#player2-piece');
const victoryMessageElm = document.querySelector('#victory-message');
const victorySectionElm = document.querySelector('#victory-section');
const resetButtonElm = document.querySelector('#reset');
const replayButtonElm = document.querySelector('#replay');
let sqrElms = [];

/*---------------------------- Variables (state) ----------------------------*/

let winner, tie, turn, pieceInHand, king, takeAgain;
let player1Score = 0, player2Score = 0; tieCounter = 0;
let board = [], pieceToTake = [], spaceToLand = [], possiblePieces = [];
let player1Piece = 'white';
let player2Piece = 'black';
let mode = 'ENGLISH';

/*-------------------------------- Functions --------------------------------*/

const addKing = (i, j) => {
    if ((turn === 'white' && i === 7) || (turn === 'black' && i === 0)){
        board[i][j].king = true;
    }
}

const changeTurn = () => {
    if (turn === 'white') {
        turn = 'black';
        opposite = 'white';
    } else {
        turn = 'white';
        opposite = 'black';
    }
}

const checkForTake = ([i, j], [posI, posJ]) =>{

    if (!board[i][j].king){
        if ((turn === 'white' && i > posI) || (turn === 'black' && i < posI)) return;
    } 

    const newPosI = posI + (posI - i); // Checks the next row whether it is going down or up 
    let newPosJ = posJ;
    if (i % 2 === 0){
         if (posJ === j){
            newPosJ = posJ - 1;
         }
    } else {
        if (posJ === j){
            newPosJ = posJ + 1;
        }
    }
   
    if (newPosI >= 0 && newPosI < 8 && newPosJ >= 0 && newPosJ < 4 && board[newPosI][newPosJ].color === ''){ // Ensuring indices are within bounds   
        pieceToTake.push([posI, posJ]);
        spaceToLand.push(convertFrom2D(newPosI, newPosJ));
        return convertFrom2D(newPosI, newPosJ);
    }
}

const checkForTie = () => {
    if (tieCounter === 40) tie = true;
}

const checkForWinner = () => {
    let whiteExists = false, blackExists = false;

    sqrElms.forEach((sqrElm) => {
        const piece = sqrElm.querySelector('.piece');
        if (piece.classList.contains('white')) {
            whiteExists = true;
        } else if (piece.classList.contains('black')) {
            blackExists = true;
        }
    });

    if (!whiteExists || !blackExists) {
        victorySectionElm.style.display = 'flex';
        winner = (player1Piece === turn) ? 'Player 1 Wins Congratulations!' : 'Player 2 Wins Congratulations';
        victorySectionElm.querySelector('#winning-piece').classList.add(`${turn}-king`);
        if (player1Piece === turn) player1Score++;
        else player2Score++;
    }
};

const clearBoard = () => {
    sqrElms.forEach((sqrElm) => sqrElm.querySelector('.piece').textContent = '');
}

const clickableAgain = () =>{
    sqrElms.forEach((sqrElm) => sqrElm.style.pointerEvents = 'auto');
}

const convertFrom2D = (x, y) => x * 4 + y;

const handleClick = (event, idx) =>{

    if (winner || tie) return;
    let availableArr;

    //change to the 2d array
    const i = Math.floor(idx / 4), j = idx % 4;

    
    // saves the new click as a 2d index
    const newClick = [i, j];

    // if there is no piece in hand, add a piece to hand
    if (!pieceInHand){

        // wont allow you to click on other pieces
        if (board[i][j].color !== turn) return;


        if (mode === 'ENGLISH'){
            availableArr = sqrsAvailableEnglish(i, j);
        } else {
            availableArr = sqrsAvailableTurkish(i, j);
        }

        
        //Allows you to only click on the relevant squares
        sqrElms.forEach((sqrElm, idx) => sqrElm.style.pointerEvents = availableArr.includes(idx) ? 'auto' : 'none'); //There was a bug with .find() was returning false on 0 index so had to swap to include
        //highlight the clicked piece
        sqrElms[idx].classList.add('clicked');
        // sets the piece in hand
        pieceInHand = newClick;
        possiblePieces = [];
        return;
    }

    // if you click the same piece again
    if (pieceInHand[0] === newClick[0] && pieceInHand[1] === newClick[1]){
        sqrElms[idx].classList.remove('clicked');

        if (takeAgain){
            changeTurn();
            takeAgain = false;
            pieceToTake = [];
            spaceToLand = [];
        }
        render();
        clickableAgain();
        pieceInHand = null;
        return;
    }
   
    // Handle the second click
    if (pieceInHand){

        board[pieceInHand[0]][pieceInHand[1]].color = '';
        board[i][j].color = turn;

        if (board[pieceInHand[0]][pieceInHand[1]].king){
            board[pieceInHand[0]][pieceInHand[1]].king = false;
            board[i][j].king = true;
        }
        
        addKing(i, j);
        const takeIndex = spaceToLand.indexOf(idx);

        if (takeIndex !== -1) {
            const [takeI, takeJ] = pieceToTake[takeIndex];
            board[takeI][takeJ].color = ''; 
            board[takeI][takeJ].king = false; 
            tieCounter = 0;
            render();
            pieceToTake = [];
            spaceToLand = [];
            if (mode === 'ENGLISH'){
                availableArr = sqrsAvailableEnglish(i, j);
            } else {
                availableArr = sqrsAvailableTurkish(i, j);
            }
            console.log(`pieceToTake = ${pieceToTake}, spaceToLand = ${spaceToLand}`);
            if (pieceToTake.length > 0){
                sqrElms.forEach((sqrElm, idx) => sqrElm.style.pointerEvents = availableArr.includes(idx) ? 'auto' : 'none');
                sqrElms[convertFrom2D(pieceInHand[0], pieceInHand[1])].classList.remove('clicked');
                sqrElms[idx].classList.add('clicked');
                pieceInHand = [i, j];
                takeAgain = true;
                return;
            } 
        } 
        
        sqrElms[convertFrom2D(pieceInHand[0], pieceInHand[1])].classList.remove('clicked');
        checkForWinner();
        changeTurn();
        pieceInHand = null;
        takeAgain = false;
        clickableAgain();
        if (mode === 'TURKISH'){
            checkForTakeTurkish();
            console.log(possiblePieces);
            if (possiblePieces.length > 0){
                sqrElms.forEach((sqrElm, idx) => sqrElm.style.pointerEvents = possiblePieces    .includes(idx) ? 'auto' : 'none');
            }
        }
        render();
        tieCounter += 1;
        pieceToTake = [];
        spaceToLand = [];
        return; 
    
    }
}

const init = () => {
    for (let i = 0; i < 8; i++) {
        board[i] = [];
        for (let j = 0; j < 4; j++) {
            board[i][j] = { color: '', king: false };
            if (i < 3) board[i][j].color = 'white';
            if (i > 4) board[i][j].color = 'black';
        }
    }
    resetGameState();
    clearBoard();
    render();
}

const reset = () =>{
    player1Score = 0, player2Score = 0;
    player1Piece = 'white', player2Piece = 'black';
    init();
}

const replay = () => {
    if (!winner && !tie) return;
    [player1Piece, player2Piece] = player1Piece === 'white' ? ['black', 'white'] : ['white', 'black'];
    init();
}
const modeClick = () =>{
    mode = mode === 'ENGLISH' ? 'TURKISH' : 'ENGLISH';
    reset();
}

const resetGameState = () => {
    winner = '';
    tie = false;
    turn = 'white';
    opposite = 'black';
    pieceInHand = null;
    pieceToTake = [];
    spaceToLand = [];
    clickableAgain();
    king = false;
    takeAgain = false;
    sqrElms.forEach((sqr) => sqr.classList.remove('clicked'));
    victorySectionElm.querySelector('#winning-piece').classList.remove('white', 'black');
    victorySectionElm.style.display = 'none';
}

const sqrsAvailableEnglish = (i, j) => {
    const originalPosition = convertFrom2D(i, j);
    let possiblePositions = [originalPosition];

    for (let x = -1; x <= 1; x += 2) {
        const posI = i + x;
        if (posI >= 0 && posI < 8) {
            let [a, b] = i % 2 === 0 ? [0, 2] : [-1, 1];
            for (let y = a; y < b; y++) {
                const posJ = j + y;
                if (posJ >= 0 && posJ < 4) {
                    if (board[posI][posJ].color === '') {
                        possiblePositions.push(convertFrom2D(posI, posJ));
                    } else if (board[posI][posJ].color !== turn) {
                        possiblePositions.push(checkForTake([i, j], [posI, posJ]));
                    }
                }
            }
        }
    }
    if (board[i][j].king) return possiblePositions;

    return possiblePositions.filter(pos => {
        const isWhiteTurn = turn === 'white';
        const isValidMove = (sqrElms[originalPosition].querySelector('.piece').textContent !== '') || (isWhiteTurn ? pos >= originalPosition : pos <= originalPosition);
        return isValidMove;
    });
}

const checkForTakeTurkish = () => {
    for (let x = 0; x < 8; x++){
        for (let y = 0; y < 4; y++){
            spaceToLand = [], pieceToTake = [];
            if (board[x][y].color === turn){
                console.log(x, y);
                sqrsAvailableTurkish(x, y);
                if (spaceToLand.length > 0){
                    possiblePieces.push(convertFrom2D(x, y));
                }
            }
        }
    }
    spaceToLand = [], pieceToTake = [];
} 


const sqrsAvailableTurkish = (i, j) =>{
    const originalPosition = convertFrom2D(i, j);
    let possiblePositions = [originalPosition];
    const direction = [[0, -1], [1, 0], [1, 0], [0, -1]] //Cached diections from tl clockwise [even, odd] row
    for (let x = 0; x < 4; x++){
        let pieceToTakeTemp;
        let y;
        let posI = i;
        let posJ = j;
        if (x < 2){
            y = -1
        } else{
            y= 1;
        }
        do{
            posI += y;
            if (posI % 2 !== 0){
                posJ += direction[x][0];
            } else{
                posJ += direction[x][1];
            }

            if(posI < 0 || posI > 7 || posJ < 0 || posJ > 3){
                break;
            }

            if (board[posI][posJ].color === turn){
                break;
            } else if(pieceToTakeTemp && board[posI][posJ].color === opposite){
                break;
            } else if (pieceToTakeTemp){
                possiblePositions.push(convertFrom2D(posI, posJ));
                spaceToLand.push(convertFrom2D(posI, posJ));
                pieceToTake.push(pieceToTakeTemp);
            }else if (board[posI][posJ].color === opposite){
                pieceToTakeTemp = [posI, posJ];
            }else if (board[posI][posJ].color === ''){
                possiblePositions.push(convertFrom2D(posI, posJ));
            }
        } while (posI >= 0 && posJ >= 0 && posI < 8 && posJ < 4);
    } 

    //If there is a take available it must be done
    if (board[i][j].king) {
        if (spaceToLand.length > 0) return spaceToLand;
        return possiblePositions;
    }

    spaceToLand = spaceToLand.filter((pos)=>{ 
        return (pos > originalPosition - 10 && pos < originalPosition + 10);
    })
    
    if (spaceToLand.length > 0) return spaceToLand;
    
    return possiblePositions = possiblePositions.filter((pos) =>{
        if (turn === 'white'){
            return (pos > originalPosition && pos < originalPosition + 6);
        } else {
            return (pos < originalPosition && pos > originalPosition - 6);
        }
    })
} 

const render = () => {
    updateBoard();
    updateScore();
    updateMessage();
}

const renderBoard = () =>{
    for (let i = 0; i < 64; i++){
        let newSqr = document.createElement('div');

        // Alternating color logic
        let row = Math.floor(i / 8);
        let col = i % 8;

        if ((row + col) % 2 !== 0) {
            newSqr.classList.add('sqr');
            let piece = document.createElement('div');
            piece.classList.add('piece');
            newSqr.appendChild(piece);
            sqrElms.push(newSqr);
        } 

        boardElm.appendChild(newSqr);
    }
}

const updateBoard = () => {
    let x = 0;
    for (let i = 0; i < 8; i++) {
        board[i].forEach((square) => {
            const piece = sqrElms[x].querySelector('.piece');
            if (piece) {
                // Clear any previously applied classes ('white', 'black' etc.)
                piece.classList.remove('white', 'black', 'white-king', 'black-king');

                // Add the appropriate class based on the piece's color
                if (square.king) {
                    piece.classList.add(`${square.color}-king`);
                } else if (square.color !== ''){
                    piece.classList.add(square.color);
                }

                // Add the king class if applicable
                if (square.king) piece.classList.add('king');
            }
            x += 1;
        });
    }
}

const updateMessage = () => {
    whichTurnElm.classList.remove('white', 'black');
    whichTurnElm.classList.add(turn);
    modeButtonElm.textContent = mode;
}

const updateScore = () => {
    victoryMessageElm.textContent = winner;
    player1ScoreElm.textContent = player1Score;
    player2ScoreElm.textContent = player2Score;
    player1PieceElm.classList.remove('white', 'black');
    player2PieceElm.classList.remove('white', 'black');
    player1PieceElm.classList.add(player1Piece);
    player2PieceElm.classList.add(player2Piece);
    
}
renderBoard();
init();

/*----------------------------- Event Listeners -----------------------------*/

sqrElms.forEach((square, idx) => {  
    square.addEventListener('click', (event) => handleClick(event, idx));
});

replayButtonElm.addEventListener('click', replay);
resetButtonElm.addEventListener('click', reset);
modeButtonElm.addEventListener('click', modeClick);
/*------------------------ Cached Element References ------------------------*/


//Todo 2. finish styling victory page and mobile version, 3. add the ability to play different checkers versions