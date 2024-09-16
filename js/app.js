/*-------------------------------- Constants --------------------------------*/


/*------------------------ Cached Element References ------------------------*/

const boardElm = document.querySelector('#board');
const whichTurnElm = document.querySelector('#which-turn');
const player1ScoreElm = document.querySelector('#player1-score');
const player2ScoreElm = document.querySelector('#player2-score');
const player1PieceElm = document.querySelector('#player1-piece');
const player2PieceElm = document.querySelector('#player2-piece');
const victoryMessageElm = document.querySelector('#victory-message');
const resetButtonElm = document.querySelector('#reset');
const replayButtonElm = document.querySelector('#replay');
let sqrElms = [];

/*---------------------------- Variables (state) ----------------------------*/

let winner, tie, turn, pieceInHand, king, player1Piece,player2Piece, takeAgain;
let player1Score = 0, player2Score = 0; tieCounter = 0;
let board = [], pieceToTake = [], spaceToLand = [];

/*-------------------------------- Functions --------------------------------*/

const addKing = (i, j) => {
    if ((turn === '⚪️' && i === 7) || (turn === '⚫️' && i === 0)){
        board[i][j].king = true;
    }
}

const changeTurn = () =>{
    turn = (turn === '⚪️') ? '⚫️' : '⚪️';
}

const checkForTake = ([i, j], [posI, posJ]) =>{

    if (!board[i][j].king){
        if ((turn === '⚪️' && i > posI) || (turn === '⚫️' && i < posI)) return;
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
        winner = (player1Piece === turn) ? 'Player 1 Wins Congratulations!' : 'Player 2 Wins Congratulations';
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


    //change to the 2d array
    const i = Math.floor(idx / 4), j = idx % 4;

    
    // saves the new click as a 2d index
    const newClick = [i, j];

    // if there is no piece in hand, add a piece to hand
    if (!pieceInHand){

        // wont allow you to click on other pieces
        if (board[i][j].color !== turn) return;

        const availableArr = sqrsAvailable(i, j);
        //Allows you to only click on the relevant squares
        sqrElms.forEach((sqrElm, idx) => sqrElm.style.pointerEvents = availableArr.includes(idx) ? 'auto' : 'none'); //There was a bug with .find() was returning false on 0 index so had to swap to include
        //highlight the clicked piece
        sqrElms[idx].classList.add('clicked');
        // sets the piece in hand
        pieceInHand = newClick;
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
            tieCounter = 0;
            render();
            pieceToTake = [];
            spaceToLand = [];
            const availableArr = sqrsAvailable(i, j);
            if (pieceToTake.length > 0){
                sqrElms.forEach((sqrElm, idx) => sqrElm.style.pointerEvents = availableArr.includes(idx) ? 'auto' : 'none');
                sqrElms[convertFrom2D(pieceInHand[0], pieceInHand[1])].classList.remove('clicked');
                sqrElms[idx].classList.add('clicked');
                pieceInHand = [i, j];
                takeAgain = true;
                return;
            } 
        } 
        
        changeTurn();
        
        sqrElms[convertFrom2D(pieceInHand[0], pieceInHand[1])].classList.remove('clicked');
        checkForWinner();
        pieceInHand = null;
        clickableAgain();
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
            if (i < 3) board[i][j].color = '⚪️';
            if (i > 4) board[i][j].color = '⚫️';
        }
    }
    resetGameState();
    clearBoard();
    render();
}

const reset = () =>{
    init();
    player1Score = 0, player2Score = 0;
    player1Piece = '⚪️', player2Piece = '⚫️';
}

const replay = () => {
    if (!winner && !tie) return;
    init();
    [player1Piece, player2Piece] = player1Piece === '⚪️' ? ['⚫️', '⚪️'] : ['⚪️', '⚫️'];
}

const resetGameState = () => {
    winner = '';
    tie = false;
    turn = '⚪️';
    opposite = '⚫️';
    pieceInHand = null;
    pieceToTake = [];
    spaceToLand = [];
    king = false;
    takeAgain = false;
}

const sqrsAvailable = (i, j) => {
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
        const isWhiteTurn = turn === '⚪️';
        const isValidMove = (sqrElms[originalPosition].querySelector('.piece').textContent !== '') || (isWhiteTurn ? pos >= originalPosition : pos <= originalPosition);
        return isValidMove;
    });
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
                // Clear any previously applied classes ('white', 'black')
                piece.classList.remove('white', 'black', 'king');

                // Add the appropriate class based on the piece's color
                if (square.color === '⚪️') {
                    piece.classList.add('white');
                } else if (square.color === '⚫️') {
                    piece.classList.add('black');
                }

                if (square.king) piece.classList.add('king');
            }
            x += 1;
        });
    }
}

const updateMessage = () => {
    whichTurnElm.textContent = turn;
    victoryMessageElm.textContent = winner;
}

const updateScore = () => {
    player1ScoreElm.textContent = player1Score;
    player2ScoreElm.textContent = player2Score;
    player1PieceElm.textContent = player1Piece;
    player2PieceElm.textContent = player2Piece;
}
renderBoard();
init();

/*----------------------------- Event Listeners -----------------------------*/

sqrElms.forEach((square, idx) => {  
    square.addEventListener('click', (event) => handleClick(event, idx));
});

replayButtonElm.addEventListener('click', replay);
resetButtonElm.addEventListener('click', reset);
/*------------------------ Cached Element References ------------------------*/


