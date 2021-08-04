import { getItem } from '../common/storage.js';
import { generateWeekRange } from '../common/time.utils.js';
import { renderEvents } from '../events/events.js';
import { createNumbersArray } from '../common/createNumbersArray.js';
import { displayTimeNow } from './timeNow.js';

const generateDay = () =>
  createNumbersArray(0, 23)
    .map(
      (number) =>
        `<div class="calendar__time-slot" data-time="${number}"></div>`
    )
    .join('');

export const renderWeek = () => {
  const calendarWeekElem = document.querySelector('.calendar__week');
  const generatedDay = generateDay();
  calendarWeekElem.innerHTML = generateWeekRange(getItem('displayedWeekStart'))
    .map(
      (el) =>
        `<div class="calendar__day" data-day="${el.getDate()}">
           ${generatedDay}
        </div>`
    )
    .join('');
  renderEvents();
  displayTimeNow();
  setInterval(displayTimeNow, 60000);
};
