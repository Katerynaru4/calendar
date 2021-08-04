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

function removeEventsFromCalendar() {
  setItem('events', null);
  renderEvents();
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
  eventTimeElem.textContent = `${event.start
    .getHours()
    .toString()
    .padStart(2, '0')}:${event.start
    .getMinutes()
    .toString()
    .padStart(2, '0')} - 
  ${event.end.getHours().toString().padStart(2, '0')}:${event.end
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  eventElem.appendChild(eventTitleElem);
  eventElem.appendChild(eventTimeElem);

  const diffTime = (event.end - event.start) / (1000 * 60);
  eventElem.style.height = `${diffTime}px`;
  eventElem.style.top = `${event.start.getMinutes()}px`;
  return eventElem;
};

// ф-ция создает DOM элемент события
// событие должно позиционироваться абсолютно внутри нужной ячейки времени внутри дня
// нужно добавить id события в дата атрибут
// здесь для создания DOM элемента события используйте document.createElement

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
    .map((event) => {
      const selectedTimeSlotElem = document
        .querySelector(`.calendar__day[data-day="${event.start.getDate()}"]`)
        .querySelector(
          `.calendar__time-slot[data-time="${event.start.getHours()}"]`
        );

      selectedTimeSlotElem.appendChild(createEventElement(event));
    });
};

const isTimeToDelete = (id) =>
  getItem('events').find((event) => event.id === id).start - new Date() <
  15 * 60 * 1000;
// достаем из storage все события и дату понедельника отображаемой недели
// фильтруем события, оставляем только те, что входят в текущую неделю
// создаем для них DOM элементы с помощью createEventElement
// для каждого события находим на странице временную ячейку (.calendar__time-slot)
// и вставляем туда событие
// каждый день и временная ячейка должно содержать дата атрибуты, по которым можно будет найти нужную временную ячейку для события
// не забудьте удалить с календаря старые события перед добавлением новых
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

// достаем из storage массив событий и eventIdToDelete
// удаляем из массива нужное событие и записываем в storage новый массив
// закрыть попап
// перерисовать события на странице в соответствии с новым списком событий в storage (renderEvents)

deleteEventBtn.addEventListener('click', onDeleteEvent);
weekElem.addEventListener('click', handleEventClick);
