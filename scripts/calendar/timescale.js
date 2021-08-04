import { createNumbersArray } from '../common/createNumbersArray.js';

export const renderTimescale = () => {
  const timeScaleElem = document.querySelector('.calendar__time-scale');
  timeScaleElem.innerHTML = createNumbersArray(0, 23)
    .map(
      (number) => `<div class="time-slot">
                <span class="time-slot__time">${number
                  .toString()
                  .padStart(2, '0')}:00
                </span>
              </div>`
    )
    .join('');
};
