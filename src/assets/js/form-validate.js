/* eslint-disable no-useless-escape */
import inputmask from 'inputmask';

/*классы валидации
  form-input--mail - проверка на формат почты
  form-input--required - проверка на заполненность
  form-input--phone - проверка на соответствие формату российского телефона + маска
  form-input--letters-only - проверка на отсутствие цифр и специальных символов
  form-input--digits-only - проверка на наличие исключительно цифр
  form-input--agree - проверка на активированный чекбокс
  form-input--password - проверка пароля
  form-input--repeat-password - проверка повторения пароля

   */

//создание спана с ошибкой при условии его отсутствия
const createErrorBox = (el, errorMessage) => {
  const newErrorBox = document.createElement('span');
  newErrorBox.classList.add('form-input__error-text');
  newErrorBox.textContent = errorMessage;
  return newErrorBox;
};

//отрисовка ошибок - удачи для коробок с инпутами
const displayStatus = (inputBox, successStatus) => {
  if (successStatus) {
    inputBox.classList.remove('form-input--error');
    inputBox.classList.add('form-input--success');
  } else {
    inputBox.classList.add('form-input--error');
    inputBox.classList.remove('form-input--success');
  }
};

/* добавление окошка ошибки полю, не прошедшему валидацию
текст ошибки из соответствующего дата атрибута dataField или по умолчанию */
const addError = (el, dataField) => {
  const inputBox = el.closest('.form-input');
  const errorBox = inputBox.querySelector('.form-input__error-text');
  const errorMessage = el.getAttribute(dataField)
    ? el.getAttribute(dataField)
    : 'Поле некорректно';
  if (errorBox) {
    errorBox.textContent = errorMessage;
  } else {
    inputBox.append(createErrorBox(el, errorMessage));
  }
};

//функции валидации
const VALIDATE_FUNCTIONS = {
  formatValidate: function (el, format) {
    if (format.test(el.value) === false) {
      addError(el, 'data-format');
      return false;
    } else {
      return true;
    }
  },
  mailValidate: function (el) {
    const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    return VALIDATE_FUNCTIONS.formatValidate(el, reg);
  },
  checkRange: function (el, minSymbols = 0, maxSymbols = 50) {
    if (el.getAttribute('data-max')) {
      const maxSymbolsData = el.getAttribute('data-max');
      if (maxSymbolsData <= 200) maxSymbols = maxSymbolsData;
    }
    if (el.getAttribute('data-min')) {
      minSymbols = el.getAttribute('data-min');
    }
    if (el.value.length > maxSymbols || el.value.length < minSymbols) {
      addError(el, 'data-range');
      return false;
    } else {
      return true;
    }
  },
  requiredValidate: function (el) {
    return VALIDATE_FUNCTIONS.checkRange(el, 1, 100);
  },
  simpleInputValidate: function (el) {
    return VALIDATE_FUNCTIONS.checkRange(el, 0, 40);
  },
  textareaValidate: function (el) {
    return VALIDATE_FUNCTIONS.checkRange(el, 0, 300);
  },
  phoneValidate: function (el) {
    if (!el.inputmask.isComplete()) {
      addError(el, 'data-format');
      return false;
    }
    return true;
  },
  lettersOnlyValidate: function (el) {
    const reg = /^(?!.*[!@#$%^&(),.+=/\][{}?><":;|1234567890])/;
    if (!VALIDATE_FUNCTIONS.checkRange(el)) return false;
    return VALIDATE_FUNCTIONS.formatValidate(el, reg);
  },
  digitsOnlyValidate: function (el) {
    const reg = /^\d*$/;
    if (!VALIDATE_FUNCTIONS.checkRange(el)) return false;
    return VALIDATE_FUNCTIONS.formatValidate(el, reg);
  },
  agreeValidate: function (el) {
    return el.checked;
  },
  passwordFormat: function (el) {
    const reg =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*()\]{}\\\-\[,'"/_;.+=:]).{8,}$/;
    return VALIDATE_FUNCTIONS.formatValidate(el, reg);
  },
  getSecondValueOfPassword: function (el) {
    let classToCompare = '';
    if (el.closest('.form-input').classList.contains('form-input--password')) {
      classToCompare = 'repeat-password';
    } else if (
      el
        .closest('.form-input')
        .classList.contains('form-input--repeat-password')
    ) {
      classToCompare = 'password';
    }
    const passBoxToCompare = el
      .closest('.form-input')
      .parentElement.querySelector(`.form-input--${classToCompare}`);
    if (passBoxToCompare) {
      const passInputToCompare = passBoxToCompare.querySelector('input');
      return [passBoxToCompare, passInputToCompare];
    }
    return [null, null];
  },
  passwordEqualValidate: function (el) {
    const [passBoxToCompare, passInputToCompare] =
      VALIDATE_FUNCTIONS.getSecondValueOfPassword(el);
    if (passBoxToCompare === null) {
      if (!VALIDATE_FUNCTIONS.passwordFormat(el)) {
        addError(el, 'data-format');
        return false;
      }
      return true;
    }
    const passwordValueToCompare = passInputToCompare.value;
    const firstPassFormatStatus = VALIDATE_FUNCTIONS.passwordFormat(el);
    const secondPassFormatStatus =
      VALIDATE_FUNCTIONS.passwordFormat(passInputToCompare);

    if (firstPassFormatStatus && secondPassFormatStatus) {
      if (el.value === passwordValueToCompare) {
        displayStatus(passBoxToCompare, true);
        return true;
      }
      addError(el, 'data-nonequal');
      addError(passInputToCompare, 'data-nonequal');
      displayStatus(passBoxToCompare, false);
      return false;
    }
    if (!firstPassFormatStatus || !secondPassFormatStatus) {
      if (el.value === passwordValueToCompare) {
        addError(el, 'data-format');
        addError(passInputToCompare, 'data-format');
        displayStatus(passBoxToCompare, false);
        return false;
      }
      if (!secondPassFormatStatus && firstPassFormatStatus) {
        addError(passInputToCompare, 'data-nonequal');
        displayStatus(passBoxToCompare, false);
        return true;
      }
      if (!firstPassFormatStatus && secondPassFormatStatus) {
        addError(el, 'data-format');
        return false;
      }
      return false;
    }
  },
};

//связь классов и обработчиков
const VALIDATE_CLASSES = {
  'form-input--mail': VALIDATE_FUNCTIONS.mailValidate,
  'form-input--required': VALIDATE_FUNCTIONS.requiredValidate,
  'form-input--phone': VALIDATE_FUNCTIONS.phoneValidate,
  'form-input--letters-only': VALIDATE_FUNCTIONS.lettersOnlyValidate,
  'form-input--digits-only': VALIDATE_FUNCTIONS.digitsOnlyValidate,
  'form-input--agree': VALIDATE_FUNCTIONS.agreeValidate,
  'form-input--password': VALIDATE_FUNCTIONS.passwordEqualValidate,
  'form-input--repeat-password': VALIDATE_FUNCTIONS.passwordEqualValidate,
};

//функции обработчиков
const focusField = (inputBox, inputField, validateFunc) => {
  inputField.addEventListener('change', () => {
    const successStatus = validateFunc(inputField);
    displayStatus(inputBox, successStatus);
  });
};

//добавление обработчиков на валидируемые поля
const addInputHandlers = (form) => {
  const formInputBoxes = form.querySelectorAll('.form-input');
  if (formInputBoxes.length) {
    formInputBoxes.forEach((inputBox) => {
      let simpleField = 1;
      for (const className in VALIDATE_CLASSES) {
        if (inputBox.classList.contains(className)) {
          simpleField = 0;
          const inputField = inputBox.querySelector('input');
          if (inputField) {
            focusField(inputBox, inputField, VALIDATE_CLASSES[className]);
          }
        }
      }
      if (simpleField) {
        const inputField = inputBox.querySelector('input');
        const textAreaField = inputBox.querySelector('textarea');
        if (inputField) {
          focusField(
            inputBox,
            inputField,
            VALIDATE_FUNCTIONS.simpleInputValidate
          );
        } else if (textAreaField) {
          focusField(
            inputBox,
            textAreaField,
            VALIDATE_FUNCTIONS.textareaValidate
          );
        }
      }
    });
  }
};

// clean form
// const cleanForm = (form) => {
//   const formInputs = form.querySelectorAll('input');
//   Array.prototype.forEach.call(formInputs, (el) => {
//     if (el.classList.contains('form-agree')) el.checked = false;
//     else el.value = '';
//   });
// };

//функция проверки формы
const checkThisForm = (form) => {
  //добавление обработчиков на инпут с валидацией поля
  const clickEvent = new Event('change');
  const inputBoxes = form.querySelectorAll('.form-input');
  if (inputBoxes.length) {
    inputBoxes.forEach((inputBox) => {
      let simpleField = 1;
      for (const className in VALIDATE_CLASSES) {
        if (inputBox.classList.contains(className)) {
          simpleField = 0;
          //если поле input содержит специфический класс валидации, вызываем событие инпут
          const inputField = inputBox.querySelector('input');
          if (inputField) inputField.dispatchEvent(clickEvent);
        }
      }
      if (simpleField) {
        const inputField = inputBox.querySelector('input');
        const textAreaField = inputBox.querySelector('textarea');
        if (inputField) inputField.dispatchEvent(clickEvent);
        else if (textAreaField) textAreaField.dispatchEvent(clickEvent);
      }
    });
  }
  return !form.querySelector('.form-input--error');
};

const telInputInit = (telInput) => {
  const trigger = telInput.querySelector('.tel-input__choice');
  const currentBox = telInput.querySelector('.tel-input__current');
  const choiceList = telInput.querySelector('.tel-input__list');
  const telItems = telInput.querySelectorAll('.tel-input__item');
  const input = telInput.querySelector('input');
  if (trigger && choiceList && telItems.length && currentBox) {
    const currentItem = currentBox.querySelector('.tel-input__item');
    inputmask({
      mask: `${currentItem.getAttribute(
        'data-prefix'
      )} ${currentItem.getAttribute('data-mask')}`,
    }).mask(input);

    const clickOutList = (evt) => {
      if (
        !evt.target.classList.contains('tel-input__list') &&
        !evt.target.closest('.tel-input__list')
      ) {
        choiceList.classList.remove('tel-input__list--open');
        document.removeEventListener('click', clickOutList);
      }
    };

    telItems.forEach((telListItem) => {
      telListItem.addEventListener('click', () => {
        if (!telListItem.closest('.tel-input__current')) {
          const curEl = currentBox.querySelector('.tel-input__item');
          currentBox.append(telListItem);
          choiceList.append(curEl);
          input.value = '';
          inputmask({
            mask: `${telListItem.getAttribute(
              'data-prefix'
            )} ${telListItem.getAttribute('data-mask')}`,
          }).mask(input);
        }
      });
    });

    trigger.addEventListener('click', (evt) => {
      evt.stopPropagation();
      if (choiceList.classList.contains('tel-input__list--open')) {
        choiceList.classList.remove('tel-input__list--open');
        document.removeEventListener('click', clickOutList);
      } else {
        choiceList.classList.add('tel-input__list--open');
        document.addEventListener('click', clickOutList);
      }
    });
  }
};

//добавление маски для телефонов
const addInputMask = (form) => {
  const telFields = form.querySelectorAll('.form-input--phone');
  if (telFields.length) {
    telFields.forEach((el) => {
      const specificField = el.querySelector('.tel-input');
      if (specificField) {
        telInputInit(specificField);
      } else {
        const input = el.querySelector('input');
        inputmask('+7 (999) 999-99-99').mask(input);
      }
    });
  }
};

const initEyeButton = (form) => {
  const passwordEyes = form.querySelectorAll('.password-eye');
  if (passwordEyes.length) {
    passwordEyes.forEach((passwordEye) => {
      const pasInput = passwordEye.previousElementSibling;
      if (pasInput) {
        passwordEye.addEventListener('click', () => {
          if (pasInput.type === 'password') {
            pasInput.type = 'text';
          } else {
            pasInput.type = 'password';
          }
        });
      }
    });
  }
};

const initPrompts = (form) => {
  const prompts = form.querySelectorAll('.prompt');
  if (prompts.length) {
    const clickOutPrompt = (evt) => {
      if (
        !evt.target.classList.contains('prompt') &&
        !evt.target.closest('.prompt')
      ) {
        prompts.forEach((prompt) => {
          prompt.classList.remove('prompt--open');
        });
        document.removeEventListener('click', clickOutPrompt);
      }
    };
    prompts.forEach((prompt) => {
      const pasInput = prompt.previousElementSibling;
      if (pasInput) {
        prompt.addEventListener('click', (evt) => {
          evt.stopPropagation();
          if (prompt.classList.contains('prompt--open')) {
            prompt.classList.remove('prompt--open');
            document.removeEventListener('click', clickOutPrompt);
          } else {
            prompt.classList.add('prompt--open');
            document.addEventListener('click', clickOutPrompt);
          }
        });
      }
    });
  }
};

//инициализация формы
const formInit = (form) => {
  const thisForm = form;
  addInputMask(thisForm);
  addInputHandlers(thisForm);
  initEyeButton(form);
  initPrompts(form);
};

const formInitValidation = (form) => {
  const thisForm = form;
  addInputMask(thisForm);
  addInputHandlers(thisForm);
  initEyeButton(form);
  initPrompts(form);
  form.addEventListener('submit', (evt) => {
    if (checkThisForm(thisForm)) {
      thisForm.classList.remove('form--has-errors');
    } else {
      evt.preventDefault();
      thisForm.classList.add('form--has-errors');
    }
  });
};

export { formInit, checkThisForm, formInitValidation };
