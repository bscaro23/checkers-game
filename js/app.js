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

let winner;
let tie;
let player1Score = 0;
let player2Score = 0;
let board = [];
let clickedSqr;
let turn;
let pieceInHand;
let pieceToTake;
let spaceToLand;
let king;
let player1Piece;
let player2Piece;
let tieCounter;

/*-------------------------------- Functions --------------------------------*/

const addKing = (i, j) => {

    const index = convertFrom2D(i, j);
    //Stops multiple child nodes being added
    if (sqrElms[index].querySelector('.piece').textContent !== '') return;

    if (turn === '⚪️' && i === 7){
        sqrElms[index].querySelector('.piece').textContent = '👑';
    } else if (turn === '⚫️' && i === 0){
        sqrElms[index].querySelector('.piece').textContent = '👑';
    }

}

const changeTurn = () =>{
    if (turn === '⚪️'){
        turn = '⚫️';
    } else {
        turn = '⚪️';
    }
}

const checkForTake = ([i, j], [posI, posJ]) =>{
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
   
    if (newPosI >= 0 && newPosI < 8 && newPosJ >= 0 && newPosJ < 4 && board[newPosI][newPosJ] === ''){ // Ensuring indices are within bounds
        pieceToTake.push([posI, posJ]);
        spaceToLand.push(convertFrom2D(newPosI, newPosJ));
        return convertFrom2D(newPosI, newPosJ);
    }
}

const checkForTie = () => {
    if (tieCounter === 40) tie = true;
}

const checkForWinner = () => {
    let whiteExists = false;
    let blackExists = false;

    sqrElms.forEach((sqrElm) => {
        const piece = sqrElm.querySelector('.piece');
        if (piece.classList.contains('white')) {
            whiteExists = true;
        } else if (piece.classList.contains('black')) {
            blackExists = true;
        }
    });

    if (!whiteExists) {
        if (player1Piece === '⚫️') {
            winner = 'Player 1 Wins Congratulations!';
            player1Score += 1;
        } else {
            winner = 'Player 2 Wins Congratulations!';
            player2Score += 1;
        }
    } else if (!blackExists) {
        if (player1Piece === '⚪️') {
            winner = 'Player 1 Wins Congratulations!';
            player1Score += 1;
        } else {
            winner = 'Player 2 Wins Congratulations!';
            player2Score += 1;
        }
    }
};

const clickableAgain = () =>{
    sqrElms.forEach((sqrElm) =>{
        sqrElm.style.pointerEvents = 'auto';
    })
}

const convertFrom2D = (x, y) => {
    return x * 4 + y;
}

const handleClick = (event, idx) =>{

    if (winner || tie) return;


    //change to the 2d array
    const i = Math.floor(idx / 4);
    const j = idx % 4;

    
    // saves the new click as a 2d index
    const newClick = [i, j];

    // if there is no piece in hand, add a piece to hand
    if (!pieceInHand){

        // wont allow you to click on other pieces
        if (board[i][j] !== turn) return;

        const availableArr = sqrsAvailable(i, j);

        //Allows you to only click on the relevant squares
        sqrElms.forEach((sqrElm, idx) => {
            if (!availableArr.find(item => item === idx)) sqrElm.style.pointerEvents = 'none';
        })

        //highlight the clicked piece
        sqrElms[idx].classList.add('clicked');

        if (sqrElms[idx].querySelector('.piece').textContent === '👑'){
            king = true;
        } else {
            king = false;
        }

        // sets the piece in hand
        pieceInHand = newClick;
        return;
    }

    // if you click the same piece again
    if (pieceInHand[0] === newClick[0] && pieceInHand[1] === newClick[1]){
        sqrElms[idx].classList.remove('clicked');
        king = false;
        clickableAgain();
        pieceInHand = null;
        return;
    }
   
    // Handle the second click
    if (pieceInHand){

        board[pieceInHand[0]][pieceInHand[1]] = '';
        board[i][j] = turn;

        if (pieceInHand[0] !== i){ // as you always have to go forward or back, so only need to check for that

            addKing(i, j);
            const takeIndex = spaceToLand.findIndex(space => space === idx);

            if (takeIndex !== -1) {
                const [takeI, takeJ] = pieceToTake[takeIndex];
                board[takeI][takeJ] = ''; 
                sqrElms[convertFrom2D(takeI, takeJ)].querySelector('.piece').textContent = '';

                tieCounter = 0;

                render();

                pieceToTake = [];
                spaceToLand = [];

                sqrsAvailable(i, j);

                if (!pieceToTake.length > 0)changeTurn();
            } else {
                changeTurn();
            }

            if (king === true){
                sqrElms[convertFrom2D(pieceInHand[0], pieceInHand[1])].querySelector('.piece').textContent = '';
                sqrElms[idx].querySelector('.piece').textContent = '👑';
            }
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
}

const init = () => {
    
    for (let i = 0; i < 8; i++){
        board[i] = [];
        for (let j = 0; j < 4; j++){
            if (i < 3){
                board[i][j] = '⚪️';
            } else if (i > 4){
                board[i][j] = '⚫️';
            } else{
                board[i][j] = '';
            }
        }
    }
    winner = '';
    tie = '';
    turn = '⚪️';
    pieceInHand = null;
    pieceToTake = [];
    spaceToLand = [];
    player1Piece = '⚪️';
    player2Piece = '⚫️';
    player1Score = 0;
    player2Score = 0;
    king = false;

    render();
}

const replay = () =>{

    if (!winner && !tie) return;

    for (let i = 0; i < 8; i++){
        board[i] = [];
        for (let j = 0; j < 4; j++){
            if (i < 3){
                board[i][j] = '⚪️';
            } else if (i > 4){
                board[i][j] = '⚫️';
            } else{
                board[i][j] = '';
            }
        }
    }
    winner = '';
    tie = '';
    turn = '⚪️';
    pieceInHand = null;
    pieceToTake = [];
    spaceToLand = [];
    if (player1Piece === '⚪️'){
        player1Piece = '⚫️';
        player2Piece = '⚪️';
    } else {
        player1Piece = '⚪️';
        player2Piece = '⚫️';
    }
    
    king = false;
    render();
}

const sqrsAvailable = (i, j) =>{
    // Returns an array of the possible places a piece can move to
    const originalPosition = convertFrom2D(i, j);
    let possiblePositions = [originalPosition];

    for (let x = -1; x < 2; x+= 2){

        const posI = i + x;
        if (posI >= 0 && posI < 8){ // Ensuring posI stays within bounds
            if (i % 2 === 0){
                //clickable square are j and j + 1
                for (let y = 0; y < 2; y++){
                    const posJ = j + y;
                    if (posJ >= 0 && posJ < 4){ // Ensuring posJ stays within bounds
                        if (board[posI][posJ] === turn) { //Stops the piece being placed on another piece of the same color.
                            continue;
                        } else if (board[posI][posJ] === ''){
                            possiblePositions.push(convertFrom2D(posI, posJ));
                        } else {
                            possiblePositions.push(checkForTake([i, j],[posI, posJ]));
                        }
                    }
                }
            } else {
                //clickable squares are j and j - 1 in both cases when j is between 0 and 3
                for (let y = -1; y < 1; y++){
                    const posJ = j + y;
                    if (posJ >= 0 && posJ < 4){ // Ensuring posJ stays within bounds
                        if (board[posI][posJ] === turn) {
                            continue;
                        } else if (board[posI][posJ]  === ''){
                            possiblePositions.push(convertFrom2D(posI, posJ));
                        } else {
                            possiblePositions.push(checkForTake([i, j],[posI, posJ]));
                        }
                    }
                }
            }
        }
    }
    return possiblePositions.filter((position) =>{
        if (sqrElms[originalPosition].querySelector('.piece').textContent !== ''){

            return position;
        } else if (turn === '⚪️'){
            return position >= originalPosition;
        } else {
            return position <= originalPosition;
        }
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
                piece.classList.remove('white', 'black');

                // Add the appropriate class based on the piece's color
                if (square === '⚪️') {
                    piece.classList.add('white');
                } else if (square === '⚫️') {
                    piece.classList.add('black');
                }
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
resetButtonElm.addEventListener('click', init);
/*------------------------ Cached Element References ------------------------*/


//Todo: when you click on the piece the cursor will change to look like the checker. This will then only allow you to click on an available square.

