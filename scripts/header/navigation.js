import { getItem, setItem } from '../common/storage.js';
import { renderWeek } from '../calendar/calendar.js';
import { renderHeader } from '../calendar/header.js';
import { getStartOfWeek, getDisplayedMonth } from '../common/time.utils.js';

const navElem = document.querySelector('.navigation');
const displayedMonthElem = document.querySelector(
  '.navigation__displayed-month'
);

function renderCurrentMonth() {
  displayedMonthElem.textContent = getDisplayedMonth(
    getItem('displayedWeekStart')
  );
}
// отрисовать месяц, к которому относиться текущая неделя (getDisplayedMonth)
// вставить в .navigation__displayed-month

const onChangeWeek = (event) => {
  if (
    !event.target.parentElement.dataset.direction &&
    !event.target.dataset.direction
  )
    return;
    
  let changedDate;
  const currentDate = getItem('displayedWeekStart');

  if (event.target.closest('[data-direction=next]')) {
    changedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 7
    );
  }
  if (event.target.closest('[data-direction=prev]')) {
    changedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 7
    );
  }

  if (event.target.dataset.direction === 'today') {
    changedDate = getStartOfWeek(new Date());
  }
  setItem('displayedWeekStart', changedDate);
  renderHeader();
  renderWeek();
  renderCurrentMonth();
};
// при переключении недели обновите displayedWeekStart в storage
// и перерисуйте все необходимые элементы страницы (renderHeader, renderWeek, renderCurrentMonth)

export const initNavigation = () => {
  renderCurrentMonth();
  navElem.addEventListener('click', onChangeWeek);
};
