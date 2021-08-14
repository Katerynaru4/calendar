import { renderTimescale } from './calendar/timescale.js';
import { renderWeek } from './calendar/calendar.js';
import { renderHeader } from './calendar/header.js';
import { initNavigation, renderCurrentMonth } from './header/navigation.js';
import { setItem, getItem } from './common/storage.js';
import { displayTimeNow } from './calendar/timeNow.js';
import { getStartOfWeek, getDisplayedMonth } from './common/time.utils.js';
import { initEventForm } from './events/createEvent.js';
import { renderEvents } from './events/events.js';
import { initDeleteEvents } from './events/events.js';
import { initSettings } from './settings/settings.js';

document.addEventListener('DOMContentLoaded', () => {
  renderTimescale();
  setItem(
    'displayedWeekStart',
    getItem('displayedWeekStart') || getStartOfWeek(new Date())
  );
  setItem('eventsColor', getItem('eventsColor') || 'blue');
  setItem('events', getItem('events') || []);
  initSettings();
  renderWeek();
  renderHeader();
  initNavigation();
  initEventForm();
  renderEvents();
  initDeleteEvents();
  displayTimeNow();
});

const onStorageChange = (e) => {
  if (e.key === 'events' || e.key === 'eventsColor') {
    renderEvents();
  }

  if (e.key === 'displayedWeekStart') {
    renderCurrentMonth();
    renderHeader();
    renderWeek();
  }
};

window.addEventListener('storage', onStorageChange);
