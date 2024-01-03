class Boat {
  constructor(name, size, orientation, svg) {
    this.name = name;
    this.size = size;
    this.orientation = orientation;
    this.svg = svg;
  }
}

const boats = {
  carrier: new Boat(
    "Carrier",
    5,
    "vertical",
    "./assets/images/boats/Boat Size=5 (Aircraft Carrier).svg"
  ),
  battleship: new Boat(
    "Battleship",
    4,
    "horizontal",
    "./assets/images/boats/Boat Size=4 (Battleship).svg"
  ),
  cruiser: new Boat(
    "Cruiser",
    3,
    "horizontal",
    "./assets/images/boats/Boat Size=3 (Submarine).svg"
  ),
  submarine: new Boat(
    "Submarine",
    3,
    "horizontal",
    "./assets/images/boats/Boat Size=3 (Submarine).svg"
  ),
  destroyer: new Boat(
    "Destroyer",
    2,
    "horizontal",
    "./assets/images/boats/Boat Size=2 (Cruiser).svg"
  )
};

export default boats;
