// test.js
import * as tic from './src/tic-tac-toe.js';
import { readFile } from 'node:fs';
import { question } from 'readline-sync';
//If there's no configuration, config will be this one
let config = {
    'board':'         ',
    'playerLetter': 'O',
    "computerLetter": 'X',
    "computerMoves": []
};
//get the configuration file
const file2 = process.argv.slice(2);
//If there're configuration file
if(file2.length > 0){
    readFile(file2[0], 'utf8', (err, data) => {
        if(err){
            console.error('Configuration file not found');
            return;
        }
        //If configuration file can be found, config will be it instead of the default values
        config = JSON.parse(data);
        initGame(config);
    });
}
else{
    initGame(config);
}

//------------------------------Functions----------------------------------
//Initialize the info and the board of the game
function initGame(config){
    if(config.computerMoves.length != 0){
        console.log('Computer will make the following moves: [ ' + getComputerMoves(config.computerMoves) + ' ]');
    }
    console.log('Player is ' + config.playerLetter + ', Computer is ' + config.computerLetter);
    let board = tic.boardFromString(config.board);
    console.log(printBoard(board));
    gameStart(config);
}
//Make the representation of computer moves more formal
function getComputerMoves(arr){
    let val = '\'' + arr[0] + '\'';
    for(let i = 1; i < arr.length; i++){
        val += ', \'' + arr[i] + '\'';
    }
    return val;
}
//Print the board which is already an array now
function printBoard(board){
    let val = '     ';
    let len = Math.sqrt(board.length);
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let inside = 0;
    //print the number of col
    for(let i = 1; i <= len; i++){
        val += i + '   ';
    }
    val += '\n';
    let count = 0;
    //print the board
    for(let i = 0; i < len * 2; i++){
        //print the edge
        if(count % 2 == 0){
            val += '   ';
            for(let j = 0; j < len; j++){
                if(j == len - 1){
                    val += '+---+';
                }
                else{
                    val += '+---';
                }
            }
            val += '\n';
            count++;
        }
        //print inside
        else{
            let index = (count - 1)/2;
            let letter = letters[index];
            val += ' ' + letter + ' ';
            for(let j = 0; j < len; j++){
                if(j == len - 1){
                    val += '| ' + board[inside] + ' |';
                    inside++;
                }
                else{
                    val += '| ' + board[inside] + ' ';
                    inside++;
                }
            }
            val += '\n';
            count++;
        }
    }
    val += '   ';
    for(let j = 0; j < len; j++){
        if(j == len - 1){
            val += '+---+';
        }
        else{
            val += '+---';
        }
    }
    return val;
}
//Game start! SAO
function gameStart(config){
    //The game will start
    let board = tic.boardFromString(config.board);
    let computermove = config.computerMoves;
    let moved = 0;
    //As long as the board isn't full and do not have winner
    while(!tic.isBoardFull(board) && !tic.getWinner(board)){
        //player goes first as 'X'
        if(config.playerLetter == 'X'){
            let answer = question('What\'s your move?\n');
            //Determine whether the move is valid
            if(!tic.isValidMove(board, answer)){
                console.log('Your move must be in a algebraic format, and it must specify an existing empty cell!\n');
            }
            else{
                board = tic.placeLetter(board, 'X', answer);
                console.log(printBoard(board));
                //check if anyone win or the board is full
                if(tic.getWinner(board)){
                    console.log('Player Won!!!');
                    return;
                }
                if(tic.isBoardFull(board)){
                    console.log('It\'s a draw!');
                    return;
                }
                question('Press <ENTER> to show computer\'s move...');
                //Use computer's move in script or use function to determine
                if(computermove.length > moved){
                    board = tic.placeLetter(board, 'O', computermove[moved]);
                    moved++;
                    console.log(printBoard(board));
                    //check if anyone win or the board is full
                    if(tic.getWinner(board)){
                        console.log('Computer Won!!!');
                        return;
                    }
                    if(tic.isBoardFull(board)){
                        console.log('It\'s a draw!');
                        return;
                    }
                }
                else{
                    let move = getBestMove(board, "O", 'X');
                    board[move] = 'O';
                    console.log(printBoard(board));               
                    //check if anyone win or the board is full
                    if(tic.getWinner(board)){
                        console.log('Computer Won!!!');
                        return;
                    }
                    if(tic.isBoardFull(board)){
                        console.log('It\'s a draw!');
                        return;
                    }
                }
            }
        }
        //computer goes first as 'X'
        else{
            question('Press <ENTER> to show computer\'s move...');
            //Use computer's move in script or use function to determine
            if(computermove.length > moved){
                board = tic.placeLetter(board, 'X', computermove[moved]);
                moved++;
                console.log(printBoard(board));
                //check if anyone win or the board is full
                if(tic.getWinner(board)){
                    console.log('Computer Won!!!');
                    return;
                }
                if(tic.isBoardFull(board)){
                    console.log('It\'s a draw!');
                    return;
                }
            }
            else{
                let move = getBestMove(board, 'X', 'O');
                board[move] = 'X';  
                console.log(printBoard(board));
                //check if anyone win or the board is full
                if(tic.getWinner(board)){
                    console.log('Computer Won!!!');
                    return;
                }
                if(tic.isBoardFull(board)){
                    console.log('It\'s a draw!');
                    return;
                }
            }
            let answer = question('What\'s your move?\n');
            //Determine whether the move is valid
            if(!tic.isValidMove(board, answer)){
                while(!tic.isValidMove(board, answer)){
                    console.log('Your move must be in a algebraic format, and it must specify an existing empty cell!\n');
                    answer = question('What\'s your move?\n');
                }
                board = tic.placeLetter(board, 'O', answer);
                console.log(printBoard(board));
                //check if anyone win or the board is full
                if(tic.getWinner(board)){
                    console.log('Player Won!!!');
                    return;
                }
                if(tic.isBoardFull(board)){
                    console.log('It\'s a draw!');
                    return;
                }
            }
            else{
                board = tic.placeLetter(board, 'O', answer);
                console.log(printBoard(board));
                //check if anyone win or the board is full
                if(tic.getWinner(board)){
                    console.log('Player Won!!!');
                    return;
                }
                if(tic.isBoardFull(board)){
                    console.log('It\'s a draw!');
                    return;
                }
            }
        }
    }
}
function getBestMove(board, computerLetter, playerLetter) {
    let bestMove = minimax(board, 0, true, computerLetter, playerLetter, -Infinity, Infinity);
    return bestMove.move;
}
// 极小化极大算法
function minimax(board, depth, isMaximizing, computerLetter, playerLetter, alpha, beta) {
    //最深一层返回判定结果分数
    let winner = tic.getWinner(board);
    if (winner === computerLetter) {
        return { score: 1, move: null };
    } else if (winner === playerLetter) {
        return { score: -1, move: null };
    } else if (tic.isBoardFull(board)) {
        return { score: 0, move: null }; // 平局
    }
    if(depth >= 6 && board.length > 16){//depth限制之后就没有意义了
        return evaluateBoard(board, computerLetter, playerLetter);
    }
    //else if(depth >= 8 && board.length == 16){//有一点意义，但不多
        //return evaluateBoard(board, computerLetter, playerLetter);
    //}
    //是否是最大化层
    if (isMaximizing) {
        let bestScore = -Infinity;
        let bestMove = null;
        let moves = [];
        for(let i = 0; i < board.length; i++){
            if(board[i] == ' '){
                moves.push(i);
            }
        }
        //获取所有子节点中最大分数的移动
        for (let move of moves) {
            board[move] = computerLetter;
            let result = minimax(board, depth + 1, false, computerLetter, playerLetter, alpha, beta);
            board[move] = ' '; // 撤销移动
            if (result.score > bestScore) {
                bestScore = result.score;
                bestMove = move;
            }
            alpha = Math.max(alpha, bestScore);
            //如果上界小于已知的下界
            if (beta <= alpha) {
                break; // Beta 剪枝
            }
            if(depth > 5 && bestScore > alpha){
                break;//Futility剪枝
            }
        }
        console.log(bestScore);
        return { score: bestScore, move: bestMove };
    } 
    else {//如果是最小化层
        let bestScore = Infinity;
        let bestMove = null;
        let moves = [];
        for(let i = 0; i < board.length; i++){
            if(board[i] == ' '){
                moves.push(i);
            }
        }
        for (let move of moves) {
            board[move] = playerLetter;
            let result = minimax(board, depth + 1, true, computerLetter, playerLetter, alpha, beta);
            board[move] = ' '; // 撤销移动
            if (result.score < bestScore) {
                bestScore = result.score;
                bestMove = move;
            }
            beta = Math.min(beta, bestScore);
            if (beta <= alpha) {
                break; // Alpha 剪枝
            }
            // Late Move 剪枝
            if (depth > 0 && bestScore < alpha) {
                break;
            }
        }
        console.log(bestScore);
        return { score: bestScore, move: bestMove };
    }
}
function initScores(scores){
    for(let i = 0; i < scores.length; i++){
        scores[i] = 0;
    }
    return scores;
}
function evaluateBoard(board, computerLetter, playerLetter){
    //check all cells in the board
    let len = Math.sqrt(board.length);
    let scores = new Array(board.length);
    initScores(scores);
    for(let i = 0; i < board.length; i++){
        let vboard = board.slice();
        if(vboard[i] === ' '){
            vboard[i] = computerLetter;
            let cvboard = vboard.slice();
            cvboard[i] = playerLetter;
            //if computer win
            if(tic.getWinner(vboard)){
                scores[i] = 100;
            }
            else if(tic.getWinner(cvboard)){
                scores[i] = 90;
            }
            else{

                scores[i] = evaluateCell(vboard, i, computerLetter, playerLetter);
            }
        }
    }
    //console.log(printBoard(scores));
    let bestScore = scores[0];
    let bestMove = 0;
    for(let i = 0; i < scores.length; i++){
        if(scores[i] > bestScore){
            bestScore = scores[i];
            bestMove = i;
        }
    }
    return {score: bestScore, move: bestMove};
}
function evaluateCell(board, index, computerLetter, playerLetter) {
    let score = 0;
    let count = 0;
    let duplicate = 0;
    let len = Math.sqrt(board.length);
    let directions = [
        [0, 1], [1, 0], [1, 1], [-1, 1], // 行、列、对角线
        [0, -1], [-1, 0], [-1, -1], [1, -1]
    ];

    for (let dir of directions) {
        let step = 1;
        while (true) {
            let nextIndex = index + step * dir[0];
            let nextJndex = index + step * dir[1];
            if (nextIndex >= 0 && nextIndex < board.length && nextJndex >= 0 && nextJndex < board.length) {
                if (board[nextIndex] === computerLetter) {
                    if (board[nextJndex] === computerLetter) {
                        score += 10; // 双重威胁
                        duplicate = 1;
                        break;
                    } else if (board[nextJndex] === playerLetter) {
                        score += 8; // 阻止对手双重威胁
                        break;
                    }
                } else if (board[nextIndex] === playerLetter) {
                    if (board[nextJndex] === playerLetter) {
                        score += 9; // 双重威胁
                        break;
                    }
                }
                step++;
            }
            else {
                break;
            }
        }
    }
    let row = Math.floor(index/len);
    //check if this row have player, if only have one or two, don't set in there
    for(let i = row*len; i < (row+1)*len; i++){
        if(board[i] == playerLetter){
            count++;
        }
    }
    if(count >= 1 && count < 2 && duplicate){
        score = 1;
    }
    //check col now
    count = 0;
    for(let i = index % len; i < board.length; i += len){
        if(board[i] == playerLetter){
            count++;
        }
    }
    if(count >= 1 && count < 2 && duplicate){
        score = 1;
    }
    if (score === 0) {
        score = 1; // 默认分数
    }
    return score;
}