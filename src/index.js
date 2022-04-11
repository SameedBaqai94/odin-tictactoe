const prompt = require("prompt-sync")({ sigint: true });

const Players = () => {
  let _mark = null;
  let _active = false;

  const setMark = (mark) => (_mark = mark);
  const setActive = () => (_active = !_active);
  const getActive = () => _active;
  const getMark = () => _mark;

  return { setMark, setActive, getMark, getActive };
};

const Board = (() => {
  let _board = null;

  const setBoard = () => {
    _board = Array(3)
      .fill()
      .map(() => Array(3).fill(""));
  };

  const printBoard = () => {
    _board.forEach((value) => {
      console.log(value);
    });
  };

  const getBoard = () => _board;

  const checkIfBoardIsFull = () =>
    _board.some((row) => row.some((cell) => cell == 0));

  const checkIfNotTaken = (x, y) => (_board[x][y] == 0 ? true : false);

  const putMarker = (x, y, mark) => {
    if (checkIfNotTaken(x, y)) {
      _board[x][y] = mark;
    }
  };

  return {
    printBoard,
    checkIfNotTaken,
    putMarker,
    checkIfBoardIsFull,
    getBoard,
    setBoard,
  };
})();

const gameController = (() => {
  const placeMark = (x, y, mark) => {
    if (mark == "X" || mark == "O") {
      Board.putMarker(x, y, mark);
    }
  };

  const checkWinner = (mark) => {
    let board = Board.getBoard();

    //horizontal
    for (let i = 0; i < board.length; i++) {
      if (board[i][0] == mark && board[i][1] == mark && board[i][2] == mark) {
        return true;
      }
    }
    //vertical
    for (let i = 0; i < board.length; i++) {
      if (board[0][i] == mark && board[1][i] == mark && board[2][i] == mark) {
        return true;
      }
    }
    //diagonal
    if (board[0][0] == mark && board[1][1] == mark && board[2][2] == mark) {
      return true;
    }
    //reverse-diagonal
    if (board[0][2] == mark && board[1][1] == mark && board[2][0] == mark) {
      return true;
    }

    return false;
  };

  const checkDraw = () => (!Board.checkIfBoardIsFull() ? true : false);

  const reset = () => Board.setBoard();

  return { placeMark, checkWinner, checkDraw, reset };
})();

const game = (() => {
  return () => {
    let _player1 = Players();
    let _player2 = Players();

    _player1.setMark("X");
    _player2.setMark("O");

    _player1.setActive();
    Board.setBoard();

    while (Board.checkIfBoardIsFull()) {
      if (_player1.getActive()) {
        let markXY = prompt(
          "Player 1, Where do you want to put your mark? (x,y) "
        );
        markXY = markXY.split(",");
        if (!Board.checkIfNotTaken(markXY[0], markXY[1])) {
          console.log("Sorry, spot is taken.");
          continue;
        }

        gameController.placeMark(markXY[0], markXY[1], _player1.getMark());

        if (gameController.checkWinner(_player1.getMark())) {
          console.log("Player 1, is the winner");
          console.log("Game will reset");
          gameController.reset();
          continue;
        }

        if (gameController.checkDraw()) {
          console.log("Game is drawn");
          console.log("Game will reset");
          gameController.reset();
          continue;
        }

        _player1.setActive();
        _player2.setActive();
      } else if (_player2.getActive()) {
        let markXY = prompt(
          "Player 2, Where do you want to put your mark? (x,y) "
        );

        markXY = markXY.split(",");
        if (!Board.checkIfNotTaken(markXY[0], markXY[1])) {
          console.log("Sorry, spot is taken.");
          continue;
        }

        gameController.placeMark(markXY[0], markXY[1], _player2.getMark());

        if (gameController.checkWinner(_player2.getMark())) {
          console.log("Player 2, is the winner");
          console.log("Game will reset");
          gameController.reset();
          continue;
        }

        if (gameController.checkDraw()) {
          console.log("Game is drawn");
          console.log("Game will reset");
          gameController.reset();
          continue;
        }

        _player1.setActive();
        _player2.setActive();
      }
      Board.printBoard();
    }
  };
})();

game();
