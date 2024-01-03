import boats from "./Ships.js";
import { gameboard } from "./Gameboard.js";
import { shipCounts, CPUshipCounts } from "./ScoreBoard.js";

const startGameBtn = document.getElementById("startGame");
const autoPlaceShipsBtn = document.getElementById("autoplaceBtn");
const infoDisplay = document.getElementById("infodisplay");
const turnDisplay = document.getElementById("turndisplay");
const displayGrid = document.querySelector(".ships-display");
let allShipsPlaced = false;

const userGrid = document.querySelector("#chessboard-cell");
const computerGrid = document.querySelector("#opponent-board-cell");

const gameMode = "singlePlayer";
let isGameOver = false;
let currentPlayer = "user";
let shotFired = -1;

$(document).ready(function () {
  const userSquares = [];
  const computerSquares = [];
  const ships = document.querySelectorAll(".ship");

  //startGame
  startGameBtn.addEventListener("click", startSinglePlayer);

  // Roep de gameGrid-methode aan om het rooster te genereren
  gameboard.gameGrid(userGrid, userSquares);

  gameboard.gameGrid(computerGrid, computerSquares);

  function startSinglePlayer() {
    $("#game-setup").hide();
    $(".playground-container").css("display", "flex");
    generate("battleship");
    generate("cruiser");
    generate("carrier");
    generate("destroyer");
    generate("submarine");

    autoPlaceShipsBtn.addEventListener("click", () => {
      console.log("clicked");
      generateUserships("battleship");
      generateUserships("cruiser");
      generateUserships("carrier");
      generateUserships("destroyer");
      generateUserships("submarine");
      $(".ships-display").hide();
      autoPlaceShipsBtn.remove();
      playGameSingle();
    });
  }
  function generate(boatKey) {
    const boat = boats[boatKey];
    const width = 10; // Adjust this based on the width of your grid
    let randomDirection = Math.floor(Math.random() * 2); // 0 for horizontal, 1 for vertical
    let direction = randomDirection === 0 ? 1 : width; // 1 for horizontal, width for vertical
    let randomStart = Math.abs(
      Math.floor(Math.random() * computerSquares.length - boat.size * direction)
    );

    const isTaken = Array.from({ length: boat.size }, (_, index) =>
      computerSquares[randomStart + index * direction].classList.contains(
        "occupied"
      )
    ).some(Boolean);

    const isAtRightEdge = Array.from(
      { length: boat.size },
      (_, index) => (randomStart + index * direction) % width === width - 1
    ).some(Boolean);

    const isAtLeftEdge = Array.from(
      { length: boat.size },
      (_, index) => (randomStart + index * direction) % width === 0
    ).some(Boolean);

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge) {
      Array.from({ length: boat.size }, (_, index) =>
        computerSquares[randomStart + index * direction].classList.add(
          "occupied",
          boat.name
        )
      );
    } else {
      generate(boatKey);
    }
  }

  function generateUserships(boatKey) {
    const boat = boats[boatKey];
    const width = 10; // Pas dit aan op basis van de breedte van je rooster
    let randomDirection = Math.floor(Math.random() * 2); // 0 voor horizontaal, 1 voor verticaal
    let direction = randomDirection === 0 ? 1 : width; // 1 voor horizontaal, breedte voor verticaal
    let randomStart = Math.abs(
      Math.floor(Math.random() * userSquares.length - boat.size * direction)
    );

    const isTaken = Array.from({ length: boat.size }, (_, index) =>
      userSquares[randomStart + index * direction].classList.contains(
        "occupied"
      )
    ).some(Boolean);

    const isAtRightEdge = Array.from(
      { length: boat.size },
      (_, index) => (randomStart + index * direction) % width === width - 1
    ).some(Boolean);

    const isAtLeftEdge = Array.from(
      { length: boat.size },
      (_, index) => (randomStart + index * direction) % width === 0
    ).some(Boolean);

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge) {
      Array.from({ length: boat.size }, (_, index) =>
        userSquares[randomStart + index * direction].classList.add(
          "occupied",
          boat.name
        )
      );
    } else {
      generateUserships(boatKey); // Verander deze regel naar generateUserships
    }
  }

  function playGameSingle() {
    if (isGameOver) return;
    if (currentPlayer === "user") {
      turnDisplay.innerHTML = "Your Turn";
      computerSquares.forEach((square) =>
        square.addEventListener("click", function (e) {
          shotFired = square.dataset.id;
          revealSquare(square.classList);
          // console.log(square.classList);
          // console.log(shipCounts.destroyer.getCount());
          // console.log(shipCounts.submarine.getCount());
          // console.log(shipCounts.cruiser.getCount());
          // console.log(shipCounts.battleship.getCount());
          // console.log(shipCounts.carrier.getCount());
        })
      );
    }
    if (currentPlayer === "enemy") {
      turnDisplay.innerHTML = "Computer's Turn";
      setTimeout(enemyGo, 350);
    }
  }

  function revealSquare(classList) {
    const enemySquare = computerGrid.querySelector(
      `div[data-id='${shotFired}']`
    );

    const obj = Object.values(classList);

    if (!obj.includes("boom")) {
      if (obj.includes("Destroyer")) shipCounts.destroyer.increaseCount();
      if (obj.includes("Submarine")) shipCounts.submarine.increaseCount();
      if (obj.includes("Cruiser")) shipCounts.cruiser.increaseCount();
      if (obj.includes("Battleship")) shipCounts.battleship.increaseCount();
      if (obj.includes("Carrier")) shipCounts.carrier.increaseCount();
      checkForWins();
    }

    if (obj.includes("boom") || obj.includes("miss")) {
      return;
    } else {
      if (obj.includes("occupied")) {
        playSound("hit.wav");
        enemySquare.classList.add("boom");
      } else {
        enemySquare.classList.add("miss");
      }
    }
    currentPlayer = "enemy";
    if (gameMode === "singlePlayer") playGameSingle();
  }

  function enemyGo(square) {
    if (gameMode === "singlePlayer")
      square = Math.floor(Math.random() * userSquares.length);
    if (!userSquares[square].classList.contains("boom")) {
      if (userSquares[square].classList.contains("destroyer"))
        CPUshipCounts.CPUdestroyer.increaseCount();
      if (userSquares[square].classList.contains("submarine"))
        CPUshipCounts.CPUsubmarine.increaseCount();
      if (userSquares[square].classList.contains("cruiser"))
        CPUshipCounts.CPUcruiser.increaseCount();
      if (userSquares[square].classList.contains("battleship"))
        CPUshipCounts.CPUbattleship.increaseCount();
      if (userSquares[square].classList.contains("carrier"))
        CPUshipCounts.CPUcarrier.increaseCount();
      checkForWins();
    }
    if (
      userSquares[square].classList.contains("boom") ||
      userSquares[square].classList.contains("miss")
    ) {
      enemyGo();
    } else {
      if (userSquares[square].classList.contains("occupied")) {
        userSquares[square].classList.add("boom");
      } else {
        userSquares[square].classList.add("miss");
      }
    }
    currentPlayer = "user";
    turnDisplay.innerHTML = "Your Turn";
  }

  function checkForWins() {
    let enemy = "computer";
    if (shipCounts.destroyer.getCount() === 2) {
      setTimeout(function () {
        playSound("sunk.mp3");
      }, 2500);
      infoDisplay.innerHTML = `You sunk the ${enemy}'s destroyer`;
      shipCounts.destroyer.setCount(10);
    }
    if (shipCounts.submarine.getCount() === 3) {
      setTimeout(function () {
        playSound("sunk.mp3");
      }, 2500);
      infoDisplay.innerHTML = `You sunk the ${enemy}'s submarine`;
      shipCounts.submarine.setCount(10);
    }
    if (shipCounts.cruiser.getCount() === 3) {
      setTimeout(function () {
        playSound("sunk.mp3");
      }, 2500);
      infoDisplay.innerHTML = `You sunk the ${enemy}'s cruiser`;
      shipCounts.cruiser.setCount(10);
    }
    if (shipCounts.battleship.getCount() === 4) {
      setTimeout(function () {
        playSound("sunk.mp3");
      }, 2500);
      infoDisplay.innerHTML = `You sunk the ${enemy}'s battleship`;
      shipCounts.battleship.setCount(10);
    }
    if (shipCounts.carrier.getCount() === 5) {
      setTimeout(function () {
        playSound("sunk.mp3");
      }, 2500);
      infoDisplay.innerHTML = `You sunk the ${enemy}'s carrier`;
      shipCounts.carrier.setCount(10);
    }
    if (CPUshipCounts.CPUdestroyer.getCount() === 2) {
      infoDisplay.innerHTML = `${enemy} sunk your destroyer`;
      CPUshipCounts.CPUdestroyer.setCount(10);
    }
    if (CPUshipCounts.CPUsubmarine.getCount() === 3) {
      infoDisplay.innerHTML = `${enemy} sunk your submarine`;
      CPUshipCounts.CPUsubmarine.setCount(10);
    }
    if (CPUshipCounts.CPUcruiser.getCount() === 3) {
      infoDisplay.innerHTML = `${enemy} sunk your cruiser`;
      CPUshipCounts.CPUcruiser.setCount(10);
    }
    if (CPUshipCounts.CPUbattleship.getCount() === 4) {
      infoDisplay.innerHTML = `${enemy} sunk your battleship`;
      CPUshipCounts.CPUbattleship.setCount(10);
    }
    if (CPUshipCounts.CPUcarrier.getCount() === 5) {
      infoDisplay.innerHTML = `${enemy} sunk your carrier`;
      CPUshipCounts.CPUcarrier.setCount(10);
    }

    if (
      shipCounts.destroyer.getCount() +
        shipCounts.submarine.getCount() +
        shipCounts.cruiser.getCount() +
        shipCounts.battleship.getCount() +
        shipCounts.carrier.getCount() ===
      50
    ) {
      turnDisplay.remove();
      infoDisplay.innerHTML = "YOU WON";
      playSound("win.mp3");
      gameOver();
    }
    if (
      CPUshipCounts.CPUdestroyer.getCount() +
        CPUshipCounts.CPUsubmarine.getCount() +
        CPUshipCounts.CPUcruiser.getCount() +
        CPUshipCounts.CPUbattleship.getCount() +
        CPUshipCounts.CPUcarrier.getCount() ===
      50
    ) {
      turnDisplay.remove();
      infoDisplay.innerHTML = `${enemy.toUpperCase()} WON`;
      gameOver();
    }
  }

  function gameOver() {
    isGameOver = true;
    playAgain.style.display = "flex";
  }

  function playSound(soundName) {
    const audio = new Audio(`/client/public/assets/sounds/${soundName}`);
    audio.play();
  }

  // Loop door elke boot
  Object.keys(boats).forEach((boatKey) => {
    const boat = boats[boatKey];
    // Maak een div-container voor de boot
    const boatContainer = $("<div>", {
      class: `ship ${boatKey.toLowerCase()}-container`,
      draggable: true,
      "data-size": boat.size,
      "data-boat": boat.name
    });

    boatContainer.on("dragstart", function (event) {
      $(this).addClass("dragged");
      event.originalEvent.dataTransfer.setData("text/plain", boatKey);
    });

    // Loop door de grootte van de boot en voeg div-elementen toe aan de container
    for (let i = 0; i < boat.size; i++) {
      const boatSegment = $("<div>", {
        id: `${boatKey}-${i}`
      });

      // Voeg het div-element toe aan de container
      boatContainer.append(boatSegment);
    }

    // Voeg de bootcontainer toe aan het document (bijvoorbeeld aan het lichaam)
    $(".ships-display").append(boatContainer);
  });

  let currentDraggedBoat;
  //move around user ship
  userSquares.forEach(function (square) {
    $(square).on("dragstart", function (event) {
      currentDraggedBoat = $(this).data("boat");
      event.originalEvent.dataTransfer.setData(
        "text/plain",
        currentDraggedBoat
      );
    });
  });

  userSquares.forEach(function (square) {
    $(square).on("dragover", function (event) {
      event.preventDefault();
      // Your dragOver logic here
    });
  });

  userSquares.forEach(function (square) {
    $(square).on("dragenter", function (event) {
      event.preventDefault();
      // Your dragEnter logic here
    });
  });

  userSquares.forEach(function (square) {
    $(square).on("dragleave", function (event) {
      autoPlaceShipsBtn.style.display = "none";
    });
  });

  userSquares.forEach(function (square) {
    $(square).on("drop", function (event) {
      event.preventDefault();

      try {
        const boatKey = event.originalEvent.dataTransfer.getData("text/plain");
        const boat = boats[boatKey];

        const targetIndex = $(this).index(); // Index of the dropped element within the chessboard cell

        // Remove the "occupied" class only for the cells of the current boat
        const occupiedCells = $(".cell.occupied");
        // occupiedCells.removeClass("occupied");

        // Mark cells as occupied for the current boat
        for (let i = 0; i < boat.size; i++) {
          const cellIndex = targetIndex + i + 1; // Calculate the index of the cell within the grid
          const cell = $("#chessboard-cell .cell:nth-child(" + cellIndex + ")");

          // Add the "occupied" class to the cell
          cell.addClass(boat.name);
          cell.addClass("occupied");
        }

        console.log(
          `${boat.name} (size ${boat.size}) dropped at index ${targetIndex}`
        );
        // Verwijder de sleepbare boot
        $(`.ship.${boatKey.toLowerCase()}-container`).remove();
        console.log(userSquares);
        if (!displayGrid.querySelector(".ship")) allShipsPlaced = true;
        console.log(allShipsPlaced);
        if (allShipsPlaced === true) {
          autoPlaceShipsBtn.style.display = "none";
          playGameSingle();
        }
      } catch (e) {
        console.log(`Invalid drop operation: ${e.message}`);
      }
    });
  });
  userSquares.forEach(function (square) {
    $(square).on("dragend", function (event) {
      event.preventDefault();
      // Your dragEnd logic here
    });
  });
});

// Roep de gridTest-methode aan om de array op te halen
const testArray = gameboard.gridTest();
console.log(testArray);
console.log(boats);
console.log(computerSquares);
