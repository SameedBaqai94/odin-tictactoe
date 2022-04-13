/*const prompt = require("prompt-sync")({ sigint: true });*/

const mainBox = document.querySelectorAll(".box");
const gameBoard = document.getElementById("gameboard");
const reset = document.getElementById("reset");

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
  const parseInput = (e) => {
    let markLocation = e.target.id;
    let [x, y] = markLocation.split("-");
    return [parseInt(x), parseInt(y)];
  };

  return () => {

    let _player1 = Players();
    let _player2 = Players();

    _player1.setMark("X");
    _player2.setMark("O");

    _player1.setActive();
    Board.setBoard();

    mainBox.forEach((box) => {
      box.addEventListener("click", (e) => {
        if (_player1.getActive() && e.target.textContent == '') {
          let [x, y] = parseInput(e);

          if (!Board.checkIfNotTaken(x, y)) {
            console.log("Sorry, spot is taken.");
          }

          gameController.placeMark(x, y, _player1.getMark());
          box.textContent = _player1.getMark();

          if (gameController.checkWinner(_player1.getMark())) {
            alert("Player 1, is the winner");
            gameBoard.classList.add("disabledbutton");
          }

          _player1.setActive();
          _player2.setActive();
          return;
        }
        if (_player2.getActive() && e.target.textContent == '') {
          let [x, y] = parseInput(e);

          if (!Board.checkIfNotTaken(x, y)) {
            console.log("Sorry, spot is taken.");
          }

          gameController.placeMark(x, y, _player2.getMark());
          box.textContent = _player2.getMark();

          if (gameController.checkWinner(_player2.getMark())) {
            alert("Player 2, is the winner");
            gameBoard.classList.add("disabledbutton");
          }

          _player1.setActive();
          _player2.setActive();
          return;
        }
      });
    });
  };
})();

game();

//reset
reset.addEventListener("click", () => {
  mainBox.forEach((b) => {
    b.textContent = "";
  });
  gameBoard.classList.remove('disabledbutton');
  game();
});
