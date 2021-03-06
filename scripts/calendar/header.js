import { getItem } from '../common/storage.js';
import { generateWeekRange } from '../common/time.utils.js';
import { openModal } from '../common/modal.js';
import { displayDayNow } from '../calendar/timeNow.js';
import { daysOfWeek } from '../common/time.utils.js';

export const renderHeader = () => {
  const calendarHeaderElem = document.querySelector('.calendar__header');
  calendarHeaderElem.innerHTML = generateWeekRange(
    getItem('displayedWeekStart')
  )
    .map(
      (
        el
      ) => `<div class="calendar__day-label day-label"  data-day="${el.getDate()}">
              <span class="day-label__day-name">${
                daysOfWeek[el.getDay()]
              }</span>
              <span class="day-label__day-number">${el.getDate()}</span>
                </div>`
    )
    .join('');
  displayDayNow();
};

const createEventBtn = document.querySelector('.create-event-btn');
createEventBtn.addEventListener('click', () => openModal(new Date()));
