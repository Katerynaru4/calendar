import { getItem } from '../common/storage.js';
import { renderEvents } from './events.js';
import { getDateTime } from '../common/time.utils.js';
import { closeModal, openModal } from '../common/modal.js';

const eventFormElem = document.querySelector('.event-form');
const closeEventFormBtn = document.querySelector('.create-event__close-btn');
const errorElem = document.querySelector('.event-form__time-error');

function clearEventForm() {
  errorElem.textContent = '';
  document.querySelectorAll('.event-form__field').forEach((el) => {
    el.value = '';
  });
}

function onCloseEventForm() {
  closeModal();
  clearEventForm();
}

const isTimeGapCorrect = (start, end) =>
  start < end ? undefined : 'Start time should be less then end time.';

const isTimeGapWithinSixHours = (start, end) =>
  end - start < 21600000
    ? undefined
    : 'Event should last for less then 6 hours.';

const toValidate = (start, end) => {
  return [isTimeGapCorrect(start, end), isTimeGapWithinSixHours(start, end)]
    .filter((el) => el)
    .map((el) => {
      errorElem.textContent = el;
      return el;
    });
};

function onCreateEvent(event) {
  event.preventDefault();

  const formData = [...new FormData(eventFormElem)].reduce(
    (acc, [field, value]) => ({ ...acc, [field]: value }),
    {}
  );

  const errorMessages = toValidate(
    getDateTime(formData.date, formData.startTime),
    getDateTime(formData.date, formData.endTime)
  );

  if (errorMessages.length !== 0) return;

  const eventToAdd = {
    id: Math.random(),
    title: formData.title,
    description: formData.description,
    start: new Date(`${formData.date}T${formData.startTime}`),
    end: new Date(`${formData.date}T${formData.endTime}`),
  };

  getItem('events').push(eventToAdd);
  closeModal();
  renderEvents();
}

export function initEventForm() {
  eventFormElem.addEventListener('submit', onCreateEvent);
  closeEventFormBtn.addEventListener('click', onCloseEventForm);
}

const openModalBySlot = (event) => {
  if (event.target.className !== 'calendar__time-slot') return;

  const hours = `${event.target.dataset.time.toString().padStart(2, '0')}:00`;
  const date = `${event.target
    .closest('.calendar__day')
    .dataset.day.padStart(2, '0')}`;
  const month = getItem('displayedWeekStart').getMonth() + 1;
  const year = getItem('displayedWeekStart').getFullYear();

  openModal(new Date(`${year} ${month} ${date} ${hours}`));
};

const weekElem = document.querySelector('.calendar__week');
weekElem.addEventListener('click', openModalBySlot);
