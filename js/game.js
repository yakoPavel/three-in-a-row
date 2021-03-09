class Game {
  constructor(fieldSize = 10) {
    this.field = _getNewField(fieldSize);
    this.fieldSize = fieldSize;
  }

  click(row, column) {
    let score = 0;

    if (this.field[row][column]) {
      const fieldCopy = JSON.parse(JSON.stringify(this.field));
      const itemType = this.field[row][column];
      const burstCells = new CellCoordinates();
      fieldCopy[row][column] = 0;
      burstCells.add(row, column);

      const traverseSiblings = (siblingRow, siblingColumn) => {
        if (siblingRow > 0 && checkSiblings(siblingRow - 1, siblingColumn))
          traverseSiblings(siblingRow - 1, siblingColumn);
        if (siblingRow < this.field.length - 1 && checkSiblings(siblingRow + 1, siblingColumn))
          traverseSiblings(siblingRow + 1, siblingColumn);
        if (siblingColumn > 0 && checkSiblings(siblingRow, siblingColumn - 1))
          traverseSiblings(siblingRow, siblingColumn - 1);
        if (siblingColumn < this.field.length - 1 && checkSiblings(siblingRow, siblingColumn + 1))
          traverseSiblings(siblingRow, siblingColumn + 1);
      }

      const checkSiblings = (siblingRow, siblingColumn) => {
        if (fieldCopy[siblingRow][siblingColumn] === itemType) {
          score += 5;
          fieldCopy[siblingRow][siblingColumn] = 0;
          burstCells.add(siblingRow, siblingColumn);
          return true;
        }
        return false;
      }

      traverseSiblings(row, column);

      if (score > 0) {
        this.field = fieldCopy;
        this.shiftCells();
        return [score + 5, burstCells];
      }
    }

    return [0];
  }

  shiftCells() {
    for (let column = 0; column < this.field.length; column++) {
      let emptyIndexes = [];
      for (let row = this.field.length - 1; row >= 0; row--) {
        if (!this.field[row][column]) {
          emptyIndexes.push(row);
        } else if (emptyIndexes.length > 0) {
          this.field[emptyIndexes.shift()][column] = this.field[row][column];
          this.field[row][column] = 0;
          emptyIndexes.push(row);
        }
      }
    }
  }

  toString() {
    let result = "";
    for (let i = 0; i < this.field.length; i++) {
      if (i > 0) result += "\n";
      result += this.field[i].join(" ");
    }
    return result;
  }
}

class CellCoordinates {
  constructor() {
    this._coordinates = [];
  }

  add(row, column) {
    this._coordinates.push([row, column]);
  }

  has(row, column) {
    return this._coordinates.some(coordinate => coordinate[0] === row &&
      coordinate[1] === column);
  }
}

function _getNewField(fieldSize) {
  if (!fieldSize) throw new Error("The field size isn't specified");

  const field = [];
  for (let i = 0; i < fieldSize; i++) {
    field.push([]);
    for (let j = 0; j < fieldSize; j++) {
      field[i][j] = Math.trunc(Math.random() * 4 + 1);
    }
  }

  return field;
}

export {Game};
