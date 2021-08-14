import { getItem, setItem } from '../common/storage.js';

const settingsBtnElem = document.querySelector('.settings-open-btn');
const pageElem = document.querySelector('.page');
const bodyElem = document.querySelector('body');

const onChangeColor = (value) => {
  setItem('eventsColor', value);
};

const createCloseSettingsBtn = () => {
  const closeSettingsBtn = document.createElement('button');
  closeSettingsBtn.classList.add('settings__close-button');
  closeSettingsBtn.classList.add('button');
  closeSettingsBtn.setAttribute('type', 'submit');
  closeSettingsBtn.textContent = 'Close';
  return closeSettingsBtn;
};

const createTitleSettingElem = () => {
  const titleSettingsElem = document.createElement('h1');
  titleSettingsElem.classList.add('settings__title');
  titleSettingsElem.textContent = "Choose calendar's color";
  return titleSettingsElem;
};
const createinputColorElem = () => {
  const inputColorElem = document.createElement('input');
  inputColorElem.setAttribute('type', 'color');
  inputColorElem.setAttribute('value', getItem('eventsColor') || '#0000FF');
  inputColorElem.classList.add('settings__input-color');
  return inputColorElem;
};

const createSettingsForm = () => {
  const blockSettingsElem = document.createElement('form');
  blockSettingsElem.classList.add('settings');

  const closeSettingsBtn = createCloseSettingsBtn();
  const titleSettingsElem = createTitleSettingElem();
  const inputColorElem = createinputColorElem();

  inputColorElem.addEventListener('change', () =>
    onChangeColor(inputColorElem.value)
  );

  blockSettingsElem.append(titleSettingsElem, inputColorElem, closeSettingsBtn);

  return blockSettingsElem;
};

const renderSettings = () => {
  pageElem.style.display = 'none';
  bodyElem.append(createSettingsForm());
};

export const initSettings = () => {
  settingsBtnElem.addEventListener('click', renderSettings);
};
