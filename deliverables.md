# Checkers Game

User should be able to pick a piece and move it, if it jumps a piece it is taken. When all of the pieces are taken the relevent winning message is shown. There should be the ability to chain moves. Additionally there should be the ability to reset the game.


1. Make the board
2. Refer to 32 squares as those are the only you can be on. I have had a look at the data structures available. I decided to use a 2D array. `Board[row][square in row]`. 
3. Set up the board for loop inside forEach reference each .sqr with a counter when all squares are referenced in a row increment the row index and reset counter.
4. When it is your turn you can click on any of your pieces. Change the mouse to that piece so it appears to have been picked up. Or simply highlight the piece.
5. Upon the click. Determine the positions available. To move.
6. Allow only move to those squares if they click anywhere else display error message 
7. remove the piece if taken
7. each time a piece is taken remove from a counter that is initiated at the start. And check if there is another way to take a piece.
8. If counter low or certain amount of turns progress without a piece being taken end the game with a win/loss/tie statement
9. I may try to add the functionality to play both standard checkers and european checkers.