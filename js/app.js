/*-------------------------------- Constants --------------------------------*/


/*------------------------ Cached Element References ------------------------*/

const boardElm = document.querySelector('#board');
const rightSpaceElm = document.querySelector('#right-space');
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

/*-------------------------------- Functions --------------------------------*/

const changeTurn = () =>{
    if (turn === 'white'){
        turn = 'black';
    } else {
        turn = 'white';
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
        console.log(spaceToLand, pieceToTake);
        return convertFrom2D(newPosI, newPosJ);
    }
}

const clickableAgain = () =>{
    sqrElms.forEach((sqrElm) =>{
        sqrElm.style.pointerEvents = 'auto';
    })
}

const convertFrom2D = (x, y) => {
    return x * 4 + y;
}

const handleClick = (event, idx) =>{
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

        // sets the piece in hand
        pieceInHand = newClick;
        return;
    }

    // if you click the same piece again
    if (pieceInHand[0] === newClick[0] && pieceInHand[1] === newClick[1]){
        sqrElms[idx].classList.remove('clicked');
        pieceInHand = null;
        return;
    }
   
    // Handle the second click
    if (pieceInHand){

        board[pieceInHand[0]][pieceInHand[1]] = '';
        board[i][j] = turn;

        if (pieceInHand[0] !== i){ // as you always have to go forward or back, so only need to check for that

            const takeIndex = spaceToLand.findIndex(space => space === idx);

            if (takeIndex !== -1) {
                const [takeI, takeJ] = pieceToTake[takeIndex];
                board[takeI][takeJ] = ''; 

                render();

                pieceToTake = [];
                spaceToLand = [];

                sqrsAvailable(i, j);

                if (pieceToTake.length > 0){
                    sqrElms[convertFrom2D(pieceInHand[0], pieceInHand[1])].classList.remove('clicked');
                    pieceInHand = null;
                    clickableAgain();
                    render(); 
                } else {
                    sqrElms[convertFrom2D(pieceInHand[0], pieceInHand[1])].classList.remove('clicked');
                    pieceInHand = null;
                    clickableAgain();
                    changeTurn();
                    render(); 
                }
            } else {
                sqrElms[convertFrom2D(pieceInHand[0], pieceInHand[1])].classList.remove('clicked');
                pieceInHand = null;
                clickableAgain();
                changeTurn();
                render();
            }
            
            pieceToTake = [];
            spaceToLand = [];
            return; 
        }
    }
    // Todo: disable all .sqr that are not available to click
}

const init = () => {
    for (let i = 0; i < 8; i++){
        board[i] = [];
        for (let j = 0; j < 4; j++){
            if (i < 3){
                board[i][j] = 'white';
            } else if (i > 4){
                board[i][j] = 'black';
            } else{
                board[i][j] = '';
            }
        }
    }
    winner = false;
    tie = false;
    turn = 'white';
    pieceInHand = null;
    pieceToTake = [];
    spaceToLand = [];
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
        if (turn === 'white'){
            return position >= originalPosition;
        } else {
            return position <= originalPosition;
        }
    });
}

const render = () => {
    updateBoard();
    // updateScore();
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
                if (square === 'white') {
                    piece.classList.add('white');
                } else if (square === 'black') {
                    piece.classList.add('black');
                }
            }
            x += 1;
        });
    }
}

const updateMessage = () => {
    rightSpaceElm.textContent = turn;
}


renderBoard();
init();

/*----------------------------- Event Listeners -----------------------------*/

sqrElms.forEach((square, idx) => {  
    square.addEventListener('click', (event) => handleClick(event, idx));
});


/*------------------------ Cached Element References ------------------------*/


//Todo: when you click on the piece the cursor will change to look like the checker. This will then only allow you to click on an available square.

