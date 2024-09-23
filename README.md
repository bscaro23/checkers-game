# Checkers Game
<img src='images/Screenshot 2024-09-23 at 21.07.42.png' alt="Screenshot of Gameplay">

## Description

For the first project in General Assembly Full Stack course, we were tasked with creating a web game. We were provided with a recommended list with checkers being ranked the hardest. 

I like the game itself and I like to be challenged. On a part time basis I worked on the solo project which commenced on Monday and concluded with a presentation of the project 5 days later.

I started by producing a list of non negotiable deliverables a successful checkers gaem should have below.

## Deliverables

1. Board to load
2. For all pieces to act as you woud expect
    * Only move diagonally.
    * Only land on empty squares.
    * If oposition next to your piece and space behind, to have the ability to take the piece.
    * Ability to take multiple pieces in a row if possible.
    * Ability to change your mind by clicking same piece twice.
3. Win condition/ tie condition (after 40 moves no take)
4. Ability to reset 
5. Ability to replay - increment score and switch turns

#### ***Game Link*** -  https://bscaro23.github.io/checkers-game/
#### ***Repo Clone Link*** - https://github.com/bscaro23/checkers-game.git
## Attributes

***CSS*** - for styling

***JavaScript*** - for animation/functionality

***HTML*** - for creating the DOM

## Plan and Code
1. Usin HTML and CSS I created the areas of the page with 4 distinct areas using the grid display. The board takes up the majority of the page, I don't allow the screen to scroll. 
2. Usinh JavaScript I create the board utilising append child and flex box, flex-wrap and only adding the .sqr class to the black squares. Additionally adding a child of the piece.
3. When initiating the game create the board a 2d array to track piece positions and render.
4. Within render the function update the score and messages as well as the board. Itterate through the board and add the relevent class to the piece. Makes it seem like pieces are taken and move.
5. Create the sqrsAvailable function which takes the input of i and j in reference to the board 2d array. This will be created at the start of the handle click function. Utilising patterns between rows the function returns the available squares a piece can move to. in the form of index relevent to the node list.
6. Have to create the checkForTake as well as convertFrom2D to complete that function.
7. Create the addKing function as well as win, tie, restart and replay functionality.
8. when creating the ability to take multiple pieces in sequence it was important to add the takeAgain variable to allow the user to decide whether or not they would like to take the second piece. 

### ***sqrsAvailable(i, j)***

As previously mentioned I decided to store the board state in a 2D array as it mad it easier to manipulate in my head as well as deal with edge cases.

I noticed that depending on whether the row was odd or even the movement available cchnaged and utilised that within this function.
 
```
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
```

### ***renderBoard***
Quite happy that I was able to pull this off as it made the board look neat and saved me time.

```
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
```
### ***checkForTake***
This function takes the original position as well as a possible position inhabited by an opposite piece. This will then check the square after making sure to maintain the correct direction. It will then return the relevent index for the node array. It will also populate an array with the Index of the ending position as well as the position taken, this remains as a 2D index as it is relevent to the board array.
```
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
```

### ***note in the code***
This was originally .find(). This had to be amended as the 0 index was being ommited.
```
sqrElms.forEach((sqrElm, idx) => {
            if (!availableArr.includes(idx)) sqrElm.style.pointerEvents = 'none'; //There was a bug with .find() was returning false on 0 index so had to swap to include
        })

```

## Todo

1. Add the ability to play different version of checkers.
2. Make the CSS a little nicer - the win statement is a little but cluncky -hover statement - make it work on phone - ability to pick up a piece
3. Maybe implement some AI 
