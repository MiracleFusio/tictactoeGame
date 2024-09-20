// tic-tac-toe.js
export function generateBoard(rows, cols, initialValue) {
    const blankValue = initialValue || " ";
    return repeat(blankValue, rows * cols);
}
export function repeat(initVal, length) {
    return Array(length).fill(initVal);
}  
export function boardFromString(s){
    for(let tic of s){
        //If tic is not a valid str, return null
        if(tic !== ' ' && tic !== 'X' && tic !== 'O'){
            return null;
        }
    }
    //If the str is not a perfect square number, return null
    if(Math.sqrt(s.length) !== Math.floor(Math.sqrt(s.length))){
        return null;
    }
    //If it's valid, create a board
    let board = new Array(s.length);
    for(let i = 0; i < s.length; i++){
        board[i] = s[i];
    }
    return board;
}
//Find out which index is the row and col represent
export function rowColToIndex(board, row, col){
    const len = Math.sqrt(board.length);
    let index = row * len + col;
    return index;
}
//Find out the index represents which row and which col
export function indexToRowCol(board, i){
    const len = Math.sqrt(board.length);
    let col = i % len;
    let row = (i - col)/len;
    return {row: row, col: col};
}
//Put the letter into a new board and return new board
export function setBoardCell(board, letter, row, col){
    let newBoard = board.slice();
    let len = Math.sqrt(board.length);
    let index = row * len + col;
    newBoard[index] = letter;
    return newBoard;
}
//Find out whether the input is valid or not, if it's valid, return it represents which row and which col
export function algebraicToRowCol(algebraicNotation){
    //The valid input should only have 2 or 3 in length
    if(algebraicNotation.length < 2 || algebraicNotation.length > 3){
        return undefined;
    }
    const regex = /[A-Z]/g;
    //The valid input should start with a uppercase letter without any ' ' in it and the rest is number
    //that less than 26
    if(!algebraicNotation[0].match(regex) || isNaN(algebraicNotation.slice(1)) || algebraicNotation.indexOf(' ') != -1
    || algebraicNotation.indexOf('e') != -1){
        return undefined;
    }
    let char = algebraicNotation[0];
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let row = letters.indexOf(char);
    let num = parseInt(algebraicNotation.slice(1), 10);
    let col = num - 1;
    return {row: row, col: col};
}
//Put the letter into the board but not find out whether the notation is valid
export function placeLetter(board, letter, algebraicNotation){
    let newBoard = board.slice();
    let char = algebraicNotation[0];
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let row = letters.indexOf(char);
    let num = parseInt(algebraicNotation.slice(1));
    let col = num - 1;
    let len = Math.sqrt(board.length);
    newBoard[row * len + col] = letter;
    return newBoard;
}
//Check if anyone win this game
export function getWinner(board){
    const len = Math.sqrt(board.length);
    let sum = 0;
    let sign = ' ';
    //check the row
    for(let i = 0; i < board.length; i += len){
        sign = board[i];
        if(sign != ' '){
            sum = 1;
            for(let j = i + 1; j < i + len; j++){
                if(board[j] === sign){
                    sum++;
                }
            }
            if(sum == len){
                return sign;
            }
        }
    }
    //check the col
    for(let i = 0; i < len; i++){
        sign = board[i];
        if(sign != ' '){
            sum = 1;
            for(let j = i + len; j < board.length; j += len){
                if(board[j] === sign){
                    sum++;
                }
            }
            if(sum == len){
                return sign;
            }
        }
    }
    //check the diagonal
    sign = board[0];
    sum = 0;
    if(sign != ' '){
        for(let i = 0; i < board.length; i += (len + 1)){
            let sign1 = board[i];
            if(sign1 == sign){
                sum++;
            }
        }
        if(sum == len){
            return sign;
        }
    }
    sign = board[len - 1];
    sum = 0;
    if(sign != ' '){
        for(let i = len - 1; i <= (board.length - len); i += (len - 1)){
            let sign1 = board[i];
            if(sign1 == sign){
                sum++;
            }
        }
        if(sum == len){
            return sign;
        }
    }
    //If there's no winner
    return undefined;
}
export function isBoardFull(board){
    for(let i = 0; i < board.length; i++){
        if(board[i] == ' '){
            return false;
        }
    }
    return true;
}
export function isValidMove(board, algebraicNotation){
    let obj = algebraicToRowCol(algebraicNotation);
    if(!obj){
        return false;
    }
    //Is obj in board
    let len = Math.sqrt(board.length);
    if(obj.row >= len || obj.col >= len){
        return false;
    }
    //Is duplicate
    let num = obj.row * len + obj.col;
    if(board[num] != ' '){
        return false;
    }
    return true;
}