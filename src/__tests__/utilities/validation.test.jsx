import {
  preventNonNumeric,
  preventSpecialChars,
  preventNonMedicalChars,
  validateNumericPaste,
  validateAlphanumericPaste,
  validateMedicalNamePaste,
} from '../../utils/validation';

describe('Validation Utilities', () => {
  describe('preventNonNumeric', () => {
    test('allows numeric keys', () => {
      const event = { key: '5', preventDefault: jest.fn() };
      preventNonNumeric(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    test('allows decimal point on first occurrence', () => {
      const event = { key: '.', target: { value: '123' }, preventDefault: jest.fn() };
      preventNonNumeric(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    test('prevents second decimal point', () => {
      const event = { key: '.', target: { value: '12.3' }, preventDefault: jest.fn() };
      preventNonNumeric(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    test('allows navigation keys', () => {
      const navKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
      navKeys.forEach(key => {
        const event = { key, preventDefault: jest.fn() };
        preventNonNumeric(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    test('allows Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X', () => {
      const shortcuts = ['a', 'c', 'v', 'x'];
      shortcuts.forEach(key => {
        const event = { key, ctrlKey: true, preventDefault: jest.fn() };
        preventNonNumeric(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    test('allows Cmd+A, Cmd+C, Cmd+V, Cmd+X on Mac', () => {
      const shortcuts = ['a', 'c', 'v', 'x'];
      shortcuts.forEach(key => {
        const event = { key, metaKey: true, preventDefault: jest.fn() };
        preventNonNumeric(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    test('prevents alphabetic characters', () => {
      const event = { key: 'a', preventDefault: jest.fn() };
      preventNonNumeric(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    test('prevents special characters', () => {
      const specialChars = ['@', '#', '$', '%', '&', '*'];
      specialChars.forEach(key => {
        const event = { key, preventDefault: jest.fn() };
        preventNonNumeric(event);
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });
  });

  describe('preventSpecialChars', () => {
    test('allows alphanumeric characters', () => {
      const event = { key: 'a', preventDefault: jest.fn() };
      preventSpecialChars(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    test('allows numbers', () => {
      const event = { key: '5', preventDefault: jest.fn() };
      preventSpecialChars(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    test('allows basic punctuation', () => {
      const allowedChars = ['.', ',', '!', '?', '-', "'", '(', ')', ' '];
      allowedChars.forEach(key => {
        const event = { key, preventDefault: jest.fn() };
        preventSpecialChars(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    test('allows navigation keys', () => {
      const navKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
      navKeys.forEach(key => {
        const event = { key, preventDefault: jest.fn() };
        preventSpecialChars(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    test('allows keyboard shortcuts', () => {
      const shortcuts = ['a', 'c', 'v', 'x'];
      shortcuts.forEach(key => {
        const ctrlEvent = { key, ctrlKey: true, preventDefault: jest.fn() };
        preventSpecialChars(ctrlEvent);
        expect(ctrlEvent.preventDefault).not.toHaveBeenCalled();

        const metaEvent = { key, metaKey: true, preventDefault: jest.fn() };
        preventSpecialChars(metaEvent);
        expect(metaEvent.preventDefault).not.toHaveBeenCalled();
      });
    });

    test('prevents special characters', () => {
      const specialChars = ['@', '#', '$', '%', '^', '&', '*', '[', ']', '{', '}'];
      specialChars.forEach(key => {
        const event = { key, preventDefault: jest.fn() };
        preventSpecialChars(event);
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });
  });

  describe('preventNonMedicalChars', () => {
    test('allows alphanumeric characters', () => {
      const event = { key: 'A', preventDefault: jest.fn() };
      preventNonMedicalChars(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    test('allows numbers', () => {
      const event = { key: '5', preventDefault: jest.fn() };
      preventNonMedicalChars(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    test('allows hyphens and parentheses', () => {
      const allowedChars = ['-', '(', ')', ' '];
      allowedChars.forEach(key => {
        const event = { key, preventDefault: jest.fn() };
        preventNonMedicalChars(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    test('allows navigation keys', () => {
      const navKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
      navKeys.forEach(key => {
        const event = { key, preventDefault: jest.fn() };
        preventNonMedicalChars(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    test('allows keyboard shortcuts', () => {
      const shortcuts = ['a', 'c', 'v', 'x'];
      shortcuts.forEach(key => {
        const ctrlEvent = { key, ctrlKey: true, preventDefault: jest.fn() };
        preventNonMedicalChars(ctrlEvent);
        expect(ctrlEvent.preventDefault).not.toHaveBeenCalled();
      });
    });

    test('prevents special characters not allowed in medical names', () => {
      const specialChars = ['@', '#', '$', '%', '.', ',', '!', '?'];
      specialChars.forEach(key => {
        const event = { key, preventDefault: jest.fn() };
        preventNonMedicalChars(event);
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });
  });

  describe('validateNumericPaste', () => {
    beforeEach(() => {
      global.alert = jest.fn();
    });

    test('allows pasting valid numbers', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('12345') },
        preventDefault: jest.fn(),
      };
      validateNumericPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(global.alert).not.toHaveBeenCalled();
    });

    test('allows pasting decimal numbers', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('123.45') },
        preventDefault: jest.fn(),
      };
      validateNumericPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(global.alert).not.toHaveBeenCalled();
    });

    test('prevents pasting text with letters', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('12abc') },
        preventDefault: jest.fn(),
      };
      validateNumericPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('Please paste only numbers');
    });

    test('prevents pasting special characters', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('12@34') },
        preventDefault: jest.fn(),
      };
      validateNumericPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('Please paste only numbers');
    });

    test('allows empty paste', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('') },
        preventDefault: jest.fn(),
      };
      validateNumericPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(global.alert).not.toHaveBeenCalled();
    });
  });

  describe('validateAlphanumericPaste', () => {
    beforeEach(() => {
      global.alert = jest.fn();
    });

    test('allows pasting alphanumeric text', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('Hello World 123') },
        preventDefault: jest.fn(),
      };
      validateAlphanumericPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(global.alert).not.toHaveBeenCalled();
    });

    test('allows pasting text with allowed punctuation', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue("Hello, it's great! How are you?") },
        preventDefault: jest.fn(),
      };
      validateAlphanumericPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(global.alert).not.toHaveBeenCalled();
    });

    test('allows pasting text with hyphens and parentheses', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('Hello-World (test)') },
        preventDefault: jest.fn(),
      };
      validateAlphanumericPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(global.alert).not.toHaveBeenCalled();
    });

    test('prevents pasting text with special characters', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('Hello @World') },
        preventDefault: jest.fn(),
      };
      validateAlphanumericPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('Special characters are not allowed');
    });

    test('prevents pasting text with symbols', () => {
      const specialChars = ['@', '#', '$', '%', '^', '&', '*'];
      specialChars.forEach(char => {
        const event = {
          clipboardData: { getData: jest.fn().mockReturnValue(`Test${char}`) },
          preventDefault: jest.fn(),
        };
        validateAlphanumericPaste(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith('Special characters are not allowed');
      });
    });

    test('allows empty paste', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('') },
        preventDefault: jest.fn(),
      };
      validateAlphanumericPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(global.alert).not.toHaveBeenCalled();
    });
  });

  describe('validateMedicalNamePaste', () => {
    beforeEach(() => {
      global.alert = jest.fn();
    });

    test('allows pasting valid medical names', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('Tylenol') },
        preventDefault: jest.fn(),
      };
      validateMedicalNamePaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(global.alert).not.toHaveBeenCalled();
    });

    test('allows pasting medical names with numbers', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('Vitamin B12') },
        preventDefault: jest.fn(),
      };
      validateMedicalNamePaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(global.alert).not.toHaveBeenCalled();
    });

    test('allows pasting medical names with hyphens', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('Acetyl-L-Carnitine') },
        preventDefault: jest.fn(),
      };
      validateMedicalNamePaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(global.alert).not.toHaveBeenCalled();
    });

    test('allows pasting medical names with parentheses', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('Ibuprofen (Advil)') },
        preventDefault: jest.fn(),
      };
      validateMedicalNamePaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(global.alert).not.toHaveBeenCalled();
    });

    test('prevents pasting medical names with special characters', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('Medicine@100mg') },
        preventDefault: jest.fn(),
      };
      validateMedicalNamePaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('Only letters, numbers, spaces, hyphens, and parentheses are allowed');
    });

    test('prevents pasting medical names with punctuation', () => {
      const punctuation = ['.', ',', '!', '?', "'"];
      punctuation.forEach(char => {
        const event = {
          clipboardData: { getData: jest.fn().mockReturnValue(`Medicine${char}`) },
          preventDefault: jest.fn(),
        };
        validateMedicalNamePaste(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith('Only letters, numbers, spaces, hyphens, and parentheses are allowed');
      });
    });

    test('allows empty paste', () => {
      const event = {
        clipboardData: { getData: jest.fn().mockReturnValue('') },
        preventDefault: jest.fn(),
      };
      validateMedicalNamePaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(global.alert).not.toHaveBeenCalled();
    });
  });
});
