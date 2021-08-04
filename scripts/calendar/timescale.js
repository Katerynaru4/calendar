import { createNumbersArray } from '../common/createNumbersArray.js';

// ф-ция должна генерировать разметку для боковой шкалы времени (24 часа)
// полученную разметку вставьте на страницу с помощью innerHTML в .calendar__time-scale

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
