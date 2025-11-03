// utils/validation.js
export const preventNonNumeric = (e) => {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '.'];

  if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
    return;
  }

  if (allowedKeys.includes(e.key)) {
    if (e.key === '.' && e.target.value.includes('.')) {
      e.preventDefault();
    }
    return;
  }

  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};

export const preventSpecialChars = (e) => {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' '];

  if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
    return;
  }

  if (allowedKeys.includes(e.key)) {
    return;
  }

  if (!/^[a-zA-Z0-9.,!?\-'() ]$/.test(e.key)) {
    e.preventDefault();
  }
};

export const preventNonMedicalChars = (e) => {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' ', '-', '(', ')'];

  if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
    return;
  }

  if (allowedKeys.includes(e.key)) {
    return;
  }

  if (!/^[a-zA-Z0-9\-() ]$/.test(e.key)) {
    e.preventDefault();
  }
};

export const validateNumericPaste = (e) => {
  const pastedText = e.clipboardData.getData('text');
  if (!/^[\d.]*$/.test(pastedText)) {
    e.preventDefault();
    alert('Please paste only numbers');
  }
};

export const validateAlphanumericPaste = (e) => {
  const pastedText = e.clipboardData.getData('text');
  if (!/^[a-zA-Z0-9\s.,!?\-'()]*$/.test(pastedText)) {
    e.preventDefault();
    alert('Special characters are not allowed');
  }
};

export const validateMedicalNamePaste = (e) => {
  const pastedText = e.clipboardData.getData('text');
  if (!/^[a-zA-Z0-9\s\-()]*$/.test(pastedText)) {
    e.preventDefault();
    alert('Only letters, numbers, spaces, hyphens, and parentheses are allowed');
  }
};
