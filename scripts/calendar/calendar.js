import { getItem } from '../common/storage.js';
import { generateWeekRange } from '../common/time.utils.js';
import { renderEvents } from '../events/events.js';
import { createNumbersArray } from '../common/createNumbersArray.js';
import { displayTimeNow } from './timeNow.js';

// функция должна сгенерировать и вернуть разметку дня в виде строки
// разметка состоит из 24 часовых временных слотов (.calendar__time-slot)
const generateDay = () =>
  createNumbersArray(0, 23)
    .map(
      (number) =>
        `<div class="calendar__time-slot" data-time="${number}"></div>`
    )
    .join('');

// разметка недели состоит из 7 дней (.calendar__day) отображаемой недели
// массив дней, которые нужно отобразить, считаем ф-цией generateWeekRange на основе displayedWeekStart из storage
// каждый день должен содержать в дата атрибуте порядковый номер дня в месяце
// после того, как отрисовали всю сетку для отображаемой недели, нужно отобразить события этой недели с помощью renderEvents

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
