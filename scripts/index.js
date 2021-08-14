import { renderTimescale } from './calendar/timescale.js';
import { renderWeek } from './calendar/calendar.js';
import { renderHeader } from './calendar/header.js';
import { initNavigation } from './header/navigation.js';
import { setItem, getItem } from './common/storage.js';
import { displayTimeNow } from './calendar/timeNow.js';
import { getStartOfWeek, getDisplayedMonth } from './common/time.utils.js';
import { initEventForm } from './events/createEvent.js';
import { renderEvents } from './events/events.js';
import { initDeleteEvents } from './events/events.js';
import { removeEventsFromCalendar } from './events/events.js';

document.addEventListener('DOMContentLoaded', () => {
  renderTimescale();
  setItem(
    'displayedWeekStart',
    getItem('displayedWeekStart') || getStartOfWeek(new Date())
  );

  setItem('events', getItem('events') || []);
  renderWeek();
  renderHeader();
  initNavigation();
  initEventForm();
  renderEvents();
  initDeleteEvents();

  displayTimeNow();
});

const displayedMonthElem = document.querySelector(
  '.navigation__displayed-month'
);

function renderCurrentMonth() {
  displayedMonthElem.textContent = getDisplayedMonth(
    getItem('displayedWeekStart')
  );
}
const onStorageChange = (e) => {
  if (e.key === 'events') {
    removeEventsFromCalendar();
    renderEvents();
  }

  if (e.key === 'displayedWeekStart') {
    renderCurrentMonth();
    renderWeek();
    renderHeader();
    renderEvents();
  }
};

window.addEventListener('storage', onStorageChange);
