import { getItem } from '../common/storage.js';
import { renderEvents } from './events.js';
import { getDateTime } from '../common/time.utils.js';
import { closeModal, openModal } from '../common/modal.js';
import { createEvent } from '../events/gateway.js';

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
    title: formData.title,
    description: formData.description,
    start: new Date(`${formData.date}T${formData.startTime}`),
    end: new Date(`${formData.date}T${formData.endTime}`),
  };

  createEvent(eventToAdd)
    .then((res) => {
      if (res.ok) {
        renderEvents();
      } else {
        throw new Error();
      }
    })
    .catch(() => alert('Internal Server Error'))
    .finally(() => onCloseEventForm());
}

export function initEventForm() {
  eventFormElem.addEventListener('submit', onCreateEvent);
  closeEventFormBtn.addEventListener('click', onCloseEventForm);
}

const openModalBySlot = (event) => {
  if (event.target.className !== 'calendar__time-slot') return;

  const weekStartDate = new Date(getItem('displayedWeekStart'));

  const hours = `${event.target.dataset.time.toString().padStart(2, '0')}:00`;
  const date = `${event.target
    .closest('.calendar__day')
    .dataset.day.padStart(2, '0')}`;
  let year = weekStartDate.getFullYear();
  let month = weekStartDate.getMonth() + 1;
  // изменение времени для правильного заполнения даты события
  if (date < weekStartDate.getDate()) {
    month += 1;
    if (month > 12) {
      month %= 12;
      year += 1;
    }
  }
  openModal(new Date(`${year} ${month} ${date} ${hours}`));
};

const weekElem = document.querySelector('.calendar__week');
weekElem.addEventListener('click', openModalBySlot);
