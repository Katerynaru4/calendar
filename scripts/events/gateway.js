const baseUrl = 'https://61166547d98aef0017fe29cd.mockapi.io/events';

export const getEvents = () => {
  return fetch(baseUrl).then((response) => response.json());
};
export const getEvent = (id) => {
  return fetch(`${baseUrl}/${id}`).then((response) => response.json());
};
export const createEvent = (eventData) => {
  return fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(eventData),
  });
};

export const deleteEvent = (id) => {
  return fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
  });
};
