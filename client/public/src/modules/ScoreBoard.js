class ShipCounts {
  constructor() {
    this.count = 0;
  }

  // Functie om het aantal van een bepaald type schip te verhogen
  increaseCount() {
    this.count++;
  }

  // Functie om het aantal van een bepaald type schip op te halen
  getCount() {
    return this.count;
  }
  setCount(value) {
    this.count = value;
  }
}

export const shipCounts = {
  carrier: new ShipCounts(),
  battleship: new ShipCounts(),
  cruiser: new ShipCounts(),
  submarine: new ShipCounts(),
  destroyer: new ShipCounts(),
  // CPU
  CPUcarrier: new ShipCounts(),
  CPUbattleship: new ShipCounts(),
  CPUcruiser: new ShipCounts(),
  CPUsubmarine: new ShipCounts(),
  CPUdestroyer: new ShipCounts()
};
