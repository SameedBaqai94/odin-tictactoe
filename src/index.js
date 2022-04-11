const prompt = require("prompt-sync")({ sigint: true });

const Players = () => {
    let _mark = null;
    let _active = false;

    const setMark = (mark) => _mark = mark;
    const setActive = () => _active = !_active;
    const getActive = () => _active;
    const getMark = () => _mark;

    return { setMark, setActive, getMark, getActive }
}

const Board = (() => {
    let _board = Array(3).fill().map(() => Array(3).fill(0));

    const printBoard = () => console.log(_board);

    const checkIfBoardIsFull = () => _board.some(row => row.some(cell => cell == 0))

    const checkIfNotTaken = (x, y) => _board[x][y] == 0 ? true : false;

    const putMarker = (x, y, mark) => {
        if (checkIfNotTaken(x, y)) {
            _board[x][y] = mark;
        }
    }

    return { printBoard, checkIfNotTaken, putMarker, checkIfBoardIsFull }
})();

const gameController = (() => {

    const placeMark = (x, y, mark) => {
        if ((mark == 1 || mark == 2)) {
            Board.putMarker(x, y, mark);
        }
    }



    return { placeMark }
})();

const game = (() => {
    return () => {
        let _player1 = Players();
        let _player2 = Players();

        _player1.setMark(1);
        _player2.setMark(2);

        _player1.setActive();
        while (Board.checkIfBoardIsFull()) {
            if (_player1.getActive()) {
                let markXY = prompt("Player 1, Where do you want to put your mark? (x,y) ");
                markXY = markXY.split(',');
                if (!Board.checkIfNotTaken(markXY[0], markXY[1])) {
                    console.log('Sorry, spot is taken.');
                    continue;
                }

                gameController.placeMark(markXY[0], markXY[1], _player1.getMark());

                _player1.setActive();
                _player2.setActive();

            }
            else if (_player2.getActive()) {
                let markXY = prompt("Player 2, Where do you want to put your mark? (x,y) ");
                markXY = markXY.split(',');
                if (!Board.checkIfNotTaken(markXY[0], markXY[1])) {
                    console.log('Sorry, spot is taken.')
                    continue;
                }

                gameController.placeMark(markXY[0], markXY[1], _player2.getMark());
                _player1.setActive();
                _player2.setActive();
            }
            Board.printBoard();
        }
    }
})();

game();
