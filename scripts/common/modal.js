const modalElem = document.querySelector('.modal');

function processTimeToInsert(defaultDate) {
  let hours = defaultDate.getHours();
  let minutes = defaultDate.getMinutes();

  if (minutes % 15 !== 0) {
    minutes = Math.round(minutes / 10) * 15;
  }
  if (minutes > 45) {
    hours += 1;
    minutes = 0;
  }
  let startMinutes = minutes.toString().padStart(2, '0');
  let endMinutes = (minutes + 15).toString().padStart(2, '0');

  const startHours = hours.toString().padStart(2, '0');
  let endHours = hours.toString().padStart(2, '0');

  if (minutes === 45) {
    startMinutes = minutes.toString().padStart(2, '0');
    endMinutes = (0).toString().padStart(2, '0');
    endHours = (hours + 1).toString().padStart(2, '0');
  }

  return [startMinutes, endMinutes, startHours, endHours];
}

export const openModal = (defaultDate) => {
  const dateInputElem = document.querySelector('.event-form__date');
  const month = (defaultDate.getMonth() + 1).toString().padStart(2, '0');
  const date = defaultDate.getDate().toString().padStart(2, '0');
  dateInputElem.value = `${defaultDate.getFullYear()}-${month}-${date}`;

  const timeStartElem = document.querySelector(
    '.event-form__time[name="startTime"]'
  );
  const timeEndElem = document.querySelector(
    '.event-form__time[name="endTime"]'
  );

  const [startMinutes, endMinutes, startHours, endHours] =
    processTimeToInsert(defaultDate);

  timeStartElem.value = `${startHours}:${startMinutes}`;
  timeEndElem.value = `${endHours}:${endMinutes}`;

  modalElem.style.display = 'flex';
};

export const closeModal = () => {
  modalElem.style.display = 'none';
};
