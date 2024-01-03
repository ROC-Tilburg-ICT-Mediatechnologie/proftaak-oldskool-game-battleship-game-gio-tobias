const createGameboard = () => {
  let gridArray = [];
  const width = 10;

  const gameGrid = (grid, squares) => {
    for (let i = 0; i < width ** 2; i++) {
      const square = document.createElement("div");
      square.dataset.id = i;
      square.classList.add("cell");
      grid.appendChild(square);
      squares.push(square);
    }
  };

  const gridTest = () => {
    for (let i = 1; i < width * width; i++) {
      gridArray.push(i);
    }
    return gridArray;
  };

  return {
    gameGrid,
    gridTest
  };
};

const gameboard = createGameboard();

const testArray = gameboard.gridTest();

export { gameboard };
