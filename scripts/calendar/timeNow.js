import { getItem } from '../common/storage.js';
import { getStartOfWeek } from '../common/time.utils.js';

const isDisplayedWeekNotPresent = () =>
  getItem('displayedWeekStart').getTime() !=
  getStartOfWeek(new Date()).getTime();

export const displayTimeNow = () => {
  if (isDisplayedWeekNotPresent()) return;
  const nowTimeSlot = document
    .querySelector(`.calendar__day[data-day="${new Date().getDate()}"]`)
    .querySelector(
      `.calendar__time-slot[data-time="${new Date().getHours()}"]`
    );
  nowTimeSlot.innerHTML = `<span class="calendar__line-now" style="top:${new Date().getMinutes()}px;"></span>`;
};

export const displayDayNow = () => {
  if (isDisplayedWeekNotPresent()) return;
  const nowDay = document.querySelector(
    `.calendar__day-label[data-day="${new Date().getDate().toString()}"]`
  );
  nowDay.classList.add('today');
};
