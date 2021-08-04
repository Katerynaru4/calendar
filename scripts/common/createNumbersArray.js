export const createNumbersArray = (from, to) =>
  new Array(to - from + 1).fill().map((el, index) => from + index);
