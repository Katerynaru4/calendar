import { getItem, setItem } from '../common/storage.js';
import { openPopup, closePopup } from '../common/popup.js';
import { getStartOfWeek } from '../common/time.utils.js';
import { renderWeek } from '../calendar/calendar.js';

const weekElem = document.querySelector('.calendar__week');
const deleteEventBtn = document.querySelector('.delete-event-btn');

function handleEventClick(event) {
  if (event.target.closest('.event')) {
    openPopup(event.x, event.y);
    setItem('eventIdToDelete', event.target.closest('.event').id);
  }
}

function toInsertTime(start, end) {
  return `
  ${start.getHours().toString().padStart(2, '0')}:${start
    .getMinutes()
    .toString()
    .padStart(2, '0')}-${end.getHours().toString().padStart(2, '0')}:${end
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

const createEventElement = (event) => {
  const eventElem = document.createElement('div');
  eventElem.classList.add('event');
  eventElem.setAttribute('id', event.id);

  const eventTitleElem = document.createElement('div');
  eventTitleElem.classList.add('event__title');
  eventTitleElem.textContent = event.title;

  const eventTimeElem = document.createElement('div');
  eventTimeElem.classList.add('event__time');
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  eventTimeElem.textContent = toInsertTime(startDate, endDate);

  eventElem.appendChild(eventTitleElem);
  eventElem.appendChild(eventTimeElem);

  const diffTime = (endDate - startDate) / (1000 * 60);
  eventElem.style.height = `${diffTime}px`;
  eventElem.style.top = `${startDate.getMinutes()}px`;
  return eventElem;
};

export const renderEvents = () => {
  const eventsArray = getItem('events');
  const displayedWeekStart = new Date(getItem('displayedWeekStart'));

  eventsArray
    .filter(
      (event) =>
        getStartOfWeek(event.end).getDate() === displayedWeekStart.getDate()
    )
    .forEach((event) => {
      const selectedTimeSlotElem = document
        .querySelector(
          `.calendar__day[data-day="${new Date(event.start).getDate()}"]`
        )
        .querySelector(
          `.calendar__time-slot[data-time="${new Date(
            event.start
          ).getHours()}"]`
        );
      selectedTimeSlotElem.appendChild(createEventElement(event));
    });
};

export const removeEventsFromCalendar = () => {
  document.querySelectorAll('.event').forEach((e) => e.remove());
};

const isTimeToDelete = (eventStartDate) =>
  Math.abs(eventStartDate - new Date()) > 15 * 60 * 1000;

function onDeleteEvent() {
  const filteredEventsArray = getItem('events').filter((event) => {
    const eventStartDate = new Date(event.start);
    if (
      event.id === +getItem('eventIdToDelete') &&
      isTimeToDelete(eventStartDate)
    ) {
      return false;
    }
    return true;
  });

  removeEventsFromCalendar();
  setItem('events', filteredEventsArray);
  setItem('eventIdToDelete', null);
  closePopup();
  renderEvents();
}

export function initDeleteEvents() {
  deleteEventBtn.addEventListener('click', onDeleteEvent);
  weekElem.addEventListener('click', handleEventClick);
}
