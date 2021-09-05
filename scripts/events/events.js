import { getItem } from '../common/storage.js';
import { openPopup, closePopup } from '../common/popup.js';
import { getStartOfWeek } from '../common/time.utils.js';
import { deleteEvent, getEvents, getEvent } from './gateway.js';

const removeEventsFromCalendar = () => {
  document.querySelectorAll('.event').forEach((e) => e.remove());
};

const weekElem = document.querySelector('.calendar__week');
const deleteEventBtn = document.querySelector('.delete-event-btn');

function handleEventClick(event) {
  openPopup(event.x, event.y);
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
  eventElem.style.minHeight = `${diffTime}px`;
  eventElem.style.top = `${startDate.getMinutes()}px`;
  const colorEvents = getItem('eventsColor');
  eventElem.style.backgroundColor = colorEvents;
  return eventElem;
};

export const renderEvents = () => {
  removeEventsFromCalendar();
  const displayedWeekStart = new Date(getItem('displayedWeekStart'));
  getEvents()
    .then((eventsArray) => {
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
    })
    .catch(() => alert('Internal Server Error'));
};

function onDeleteEvent(eventIdToDelete) {
  getEvent(eventIdToDelete)
    .then((eventData) => {
      return Math.abs(new Date(eventData.start) - new Date()) > 15 * 60 * 1000;
    })
    .then((deletingValidateValue) => {
      if (!deletingValidateValue)
        alert(
          'You cannot delete an event earlier than 15 minutes before the start'
        );

      deleteEvent(eventIdToDelete)
        .then((res) => {
          if (res.ok) {
            renderEvents();
          } else {
            throw new Error();
          }
        })
        .catch(() => alert('Internal Server Error'));
    })
    .finally(closePopup);
}

export function initDeleteEvents() {
  weekElem.addEventListener('click', (event) => {
    if (!event.target.closest('.event')) return;
    handleEventClick(event);
    deleteEventBtn.onclick = () =>
      onDeleteEvent(event.target.closest('.event').id);
  });
}
