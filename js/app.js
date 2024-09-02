/*-------------------------------- Constants --------------------------------*/


/*------------------------ Cached Element References ------------------------*/

const boardElm = document.querySelector('#board');
let sqrElms = [];

console.dir(sqrElms);

/*---------------------------- Variables (state) ----------------------------*/

let winner;
let tie;
let player1Score = 0;
let player2Score = 0;
let board = [];
let clickedSqr;
let turn;


/*-------------------------------- Functions --------------------------------*/

const handleClick = (event, idx) =>{
    
    

    const i = Math.floor(idx / 4);
    const j = idx % 4
    if (board[i][j] !== turn) return;
    console.log(sqrsAvailable(i, j));
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
    render();
}

const sqrsAvailable = (i, j) =>{
    // Returns an array of the possible places a piece can move to
    
    let possiblePositions = [[i, j]]

    for (let x = -1; x < 2; x+= 2){

        const posI = i + x;
        if (i % 2 === 0){
            //clickable square are j and j + 1

            for (let y = 0; y < 2; y++){
                const posJ = j + y;
                if (posI >= 0 && posI < 8 && posJ >= 0 && posJ < 4){
                    possiblePositions.push([posI, posJ]);
                }
            }
        } else {
            //clickable squares are j and j - 1 in both cases when j is between 0 and 3 
            for (let y = -1; y < 1; y++){
                const posJ = j + y;
                if (posI >= 0 && posI < 8 && posJ >= 0 && posJ < 4){
                    possiblePositions.push([posI, posJ]);
                }
            }
        }
    }

    return possiblePositions;
}

const render = () => {
    updateBoard();
    // updateScore();
    // updateMessage();
}



const renderBoard = () =>{
    for (let i = 0; i < 64; i++){
        let newSqr = document.createElement('div');

        // Alternating color logic
        let row = Math.floor(i / 8);
        let col = i % 8;

        if ((row + col) % 2 !== 0) {
            newSqr.classList.add('sqr');
            sqrElms.push(newSqr);
        } 

        boardElm.appendChild(newSqr);
    }
}

const updateBoard = () =>{
    let x = 0;
    for (let i = 0; i < 8; i++){
        board[i].forEach((square) =>{
            sqrElms[x].textContent = square; 
            x += 1;
        })
    }
}



renderBoard()
init();
/*----------------------------- Event Listeners -----------------------------*/

sqrElms.forEach((square, idx) => {  
    square.addEventListener('click', (event) => handleClick(event, idx));
})


/*------------------------ Cached Element References ------------------------*/


//Todo: when you click on the piece the cursor will change to look like the checker. This will then only allow you to click on an available square.

