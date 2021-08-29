
// Board module
const board = (() => {
  //Array to store the state of the game
  let _state = new Array(9).fill("");
  Object.seal(_state); //not necessary but I want to use it xD

  const takeBox = (index, player) => {
    _state[index] = player.getSign();
  };

  const resetBoard = () => {
    _state.fill("");
  };

  const getState = () => {
    return _state;
  }

  const isTaken = (index) => {
    return _state[index] != "";
  }

  return { takeBox, resetBoard, getState, isTaken };
})();

//Player constructor
const Player = (sign) => {
  const _sign = sign;

  const getSign = () => _sign;

  return { getSign }
}

//Game Controller Module
const gameController = (() => {
  const _playerList = [Player("X"), Player("O")];
  let _round = 0;
  let _winner = null;

  const _checkWinner = (lastTaken) => {
    const winCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]

    let gameState = board.getState();
    possibleCombinations = winCombinations.filter((combination) => combination.includes(lastTaken));
    console.log(possibleCombinations);

    const isAWinner = possibleCombinations.some((combination) => combination.every((i) => gameState[i] == gameState[lastTaken]))

    return isAWinner;
  }

  const _checkTie = () => {
    return board.getState().every((content) => content != "");
  }

  const playRound = (index) => {
    if (_winner || board.isTaken(index)) return

    let _currentPlayer = _round % 2;
    board.takeBox(index, _playerList[_currentPlayer]);

    if (_checkWinner(index)) {
      _winner = _playerList[_currentPlayer].getSign();
    }
    if (!_winner && _checkTie()) {
      _winner = "Tie";
    }
    _round++;
    console.log(`Played round: ${_round - 1}`);
  }

  const getWinner = () => {
    return _winner;
  }

  const getRound = () => {
    return _round;
  }

  const getPlayerList = () => {
    return _playerList;
  }

  const resetGame = () => {
    _round = 0;
    board.resetBoard();
    _winner = null;
  }

  return { playRound, resetGame, getWinner, getRound, getPlayerList }
})();

//Display Controller module
const displayController = (() => {

  //Get DOM Elements
  const _boxes = document.querySelectorAll(".box");
  const _resetBtn = document.querySelector("#restart-btn");
  const _messageDiv = document.querySelector('#message')
  console.log(_boxes);


  const _renderBoard = () => {
    const gameState = board.getState();
    _boxes.forEach((element, index) => {
      element.innerText = gameState[index];
    });
  }

  const _renderMessage = () => {
    if (gameController.getWinner()) {
      _renderWinner();
    } else {
      const round = gameController.getRound();
      const playerList = gameController.getPlayerList();
      _messageDiv.innerText = `${playerList[round % 2].getSign()}'s Turn`;
    }
  }

  const _renderWinner = () => {
    winner = gameController.getWinner();
    switch (winner) {
      case "X":
        _messageDiv.innerText = "The winner is X!";
        break;

      case "O":
        _messageDiv.innerText = "The winner is O!";
        break;

      case "Tie":
        _messageDiv.innerText = "Tie!";
        break;

      default:
        break;
    }
  }

  //Event Listeners
  _resetBtn.addEventListener('click', () => {
    gameController.resetGame();
    _renderBoard();
    _renderMessage();
  });


  _boxes.forEach((box) => box.addEventListener('click', () => {
    gameController.playRound(+box.dataset.index);
    _renderBoard();
    _renderMessage();
  }))

  return {}
})();