import { getItem, setItem } from '../common/storage.js';
import { renderWeek } from '../calendar/calendar.js';
import { renderHeader } from '../calendar/header.js';
import { getStartOfWeek, getDisplayedMonth } from '../common/time.utils.js';

const navElem = document.querySelector('.navigation');
const displayedMonthElem = document.querySelector(
  '.navigation__displayed-month'
);

export const renderCurrentMonth = () => {
  displayedMonthElem.textContent = getDisplayedMonth(
    getItem('displayedWeekStart')
  );
};

const onChangeWeek = (event) => {
  if (
    !event.target.parentElement.dataset.direction &&
    !event.target.dataset.direction
  )
    return;

  let changedDate;
  const currentDate = new Date(getItem('displayedWeekStart'));

  if (event.target.closest('[data-direction=next]')) {
    changedDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
  }
  if (event.target.closest('[data-direction=prev]')) {
    changedDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
  }
  if (event.target.dataset.direction === 'today') {
    changedDate = getStartOfWeek(new Date());
  }
  setItem('displayedWeekStart', changedDate);
  renderHeader();
  renderWeek();
  renderCurrentMonth();
};

export const initNavigation = () => {
  renderCurrentMonth();
  navElem.addEventListener('click', onChangeWeek);
};
