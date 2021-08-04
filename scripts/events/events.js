import { getItem, setItem } from '../common/storage.js';
import { openPopup, closePopup } from '../common/popup.js';
import { getStartOfWeek } from '../common/time.utils.js';

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
  eventTimeElem.textContent = toInsertTime(event.start, event.end);

  eventElem.appendChild(eventTitleElem);
  eventElem.appendChild(eventTimeElem);

  const diffTime = (event.end - event.start) / (1000 * 60);
  eventElem.style.height = `${diffTime}px`;
  eventElem.style.top = `${event.start.getMinutes()}px`;
  return eventElem;
};

export const renderEvents = () => {
  const eventsArray = getItem('events');
  const displayedWeekStart = getItem('displayedWeekStart');

  eventsArray.forEach((event) => {
    const selectedTimeSlotElem = document.querySelector(
      `.calendar__time-slot[data-time="${event.start.getHours()}"]`
    );
    selectedTimeSlotElem.innerHTML = '';
  });

  eventsArray
    .filter(
      (event) =>
        getStartOfWeek(event.end).getDate() === displayedWeekStart.getDate()
    )
    .forEach((event) => {
      const selectedTimeSlotElem = document
        .querySelector(`.calendar__day[data-day="${event.start.getDate()}"]`)
        .querySelector(
          `.calendar__time-slot[data-time="${event.start.getHours()}"]`
        );
      selectedTimeSlotElem.appendChild(createEventElement(event));
    });
};

function removeEventsFromCalendar() {
  setItem('events', null);
  renderEvents();
}

const isTimeToDelete = (id) =>
  getItem('events').find((event) => event.id === id).start - new Date() <
  15 * 60 * 1000;

function onDeleteEvent() {
  const filteredEventsArray = getItem('events').filter((event) => {
    if (event.id === +getItem('eventIdToDelete') && isTimeToDelete(event.id)) {
      const selectedTimeSlotElem = document
        .querySelector(`.calendar__day[data-day="${event.start.getDate()}"]`)
        .querySelector(
          `.calendar__time-slot[data-time="${event.start.getHours()}"]`
        );
      selectedTimeSlotElem.innerHTML = '';
    }
    return event.id !== +getItem('eventIdToDelete');
  });
  setItem('events', filteredEventsArray);
  closePopup();
  renderEvents();
}

deleteEventBtn.addEventListener('click', onDeleteEvent);
weekElem.addEventListener('click', handleEventClick);
