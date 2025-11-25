// middleware/validation.js
const validateNumeric = (value, fieldName, min = null, max = null) => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: `${fieldName} is required` };
  }

  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, message: `${fieldName} must be a valid number` };
  }

  if (min !== null && num < min) {
    return { valid: false, message: `${fieldName} must be at least ${min}` };
  }

  if (max !== null && num > max) {
    return { valid: false, message: `${fieldName} must not exceed ${max}` };
  }

  return { valid: true, value: num };
};

const validateAlphanumericText = (value, fieldName, maxLength = 500, required = true) => {
  // Convert to string if it's a number
  const stringValue = typeof value === 'number' ? value.toString() : value;

  if (!stringValue || stringValue.trim() === '') {
    if (required) {
      return { valid: false, message: `${fieldName} is required` };
    }
    return { valid: true, value: '' };
  }

  const trimmed = stringValue.trim();

  if (trimmed.length > maxLength) {
    return { valid: false, message: `${fieldName} must not exceed ${maxLength} characters` };
  }

  const alphanumericRegex = /^[a-zA-Z0-9\s.,!?\-'()]+$/;

  if (!alphanumericRegex.test(trimmed)) {
    return { valid: false, message: `${fieldName} can only contain letters, numbers, spaces, and basic punctuation (.,!?-'())` };
  }

  return { valid: true, value: trimmed };
};

const validateMedicalName = (value, fieldName, maxLength = 200, required = true) => {
  if (!value || value.trim() === '') {
    if (required) {
      return { valid: false, message: `${fieldName} is required` };
    }
    return { valid: true, value: '' };
  }

  const trimmed = value.trim();

  if (trimmed.length > maxLength) {
    return { valid: false, message: `${fieldName} must not exceed ${maxLength} characters` };
  }

  const medicalNameRegex = /^[a-zA-Z0-9\s\-()]+$/;

  if (!medicalNameRegex.test(trimmed)) {
    return { valid: false, message: `${fieldName} can only contain letters, numbers, spaces, hyphens, and parentheses` };
  }

  return { valid: true, value: trimmed };
};

const validateNotes = (value, fieldName, maxLength = 1000, required = false) => {
  if (!value || value.trim() === '') {
    if (required) {
      return { valid: false, message: `${fieldName} is required` };
    }
    return { valid: true, value: '' };
  }

  const trimmed = value.trim();

  if (trimmed.length > maxLength) {
    return { valid: false, message: `${fieldName} must not exceed ${maxLength} characters` };
  }

  const notesRegex = /^[a-zA-Z0-9\s.,!?\-'():;"\n\r]+$/;

  if (!notesRegex.test(trimmed)) {
    return { valid: false, message: `${fieldName} contains invalid characters` };
  }

  return { valid: true, value: trimmed };
};

const validateGrowthData = (req, res, next) => {
  const errors = [];

  if (req.body.weight !== undefined && req.body.weight !== null && req.body.weight !== '') {
    const weightValidation = validateNumeric(req.body.weight, 'Weight', 0, 500);
    if (!weightValidation.valid) {
      errors.push(weightValidation.message);
    } else {
      req.body.weight = weightValidation.value;
    }
  }

  if (req.body.height !== undefined && req.body.height !== null && req.body.height !== '') {
    const heightValidation = validateNumeric(req.body.height, 'Height', 0, 100);
    if (!heightValidation.valid) {
      errors.push(heightValidation.message);
    } else {
      req.body.height = heightValidation.value;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateSleepData = (req, res, next) => {
  const errors = [];

  if (req.body.sleep_duration !== undefined && req.body.sleep_duration !== null && req.body.sleep_duration !== '') {
    const durationValidation = validateNumeric(req.body.sleep_duration, 'Sleep Duration', 0, 24);
    if (!durationValidation.valid) {
      errors.push(durationValidation.message);
    } else {
      req.body.sleep_duration = durationValidation.value;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateFeedingData = (req, res, next) => {
  const errors = [];

  if (req.body.amount !== undefined && req.body.amount !== '') {
    const amountValidation = validateNumeric(req.body.amount, 'Amount', 0, 100);
    if (!amountValidation.valid) {
      errors.push(amountValidation.message);
    } else {
      req.body.amount = amountValidation.value;
    }
  }

  if (req.body.notes) {
    const notesValidation = validateNotes(req.body.notes, 'Notes', 1000, false);
    if (!notesValidation.valid) {
      errors.push(notesValidation.message);
    } else {
      req.body.notes = notesValidation.value;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateMedicationData = (req, res, next) => {
  const errors = [];

  if (req.body.medication_name) {
    const nameValidation = validateMedicalName(req.body.medication_name, 'Medication Name', 200, true);
    if (!nameValidation.valid) {
      errors.push(nameValidation.message);
    } else {
      req.body.medication_name = nameValidation.value;
    }
  }

  if (req.body.dosage) {
    const dosageValidation = validateAlphanumericText(req.body.dosage, 'Dosage', 100, true);
    if (!dosageValidation.valid) {
      errors.push(dosageValidation.message);
    } else {
      req.body.dosage = dosageValidation.value;
    }
  }

  if (req.body.symptoms) {
    const symptomsValidation = validateAlphanumericText(req.body.symptoms, 'Symptoms', 500, false);
    if (!symptomsValidation.valid) {
      errors.push(symptomsValidation.message);
    } else {
      req.body.symptoms = symptomsValidation.value;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateAllergyData = (req, res, next) => {
  const errors = [];

  if (req.body.allergy_name) {
    const nameValidation = validateMedicalName(req.body.allergy_name, 'Allergy Name', 200, true);
    if (!nameValidation.valid) {
      errors.push(nameValidation.message);
    } else {
      req.body.allergy_name = nameValidation.value;
    }
  }

  if (req.body.notes) {
    const notesValidation = validateNotes(req.body.notes, 'Notes', 1000, false);
    if (!notesValidation.valid) {
      errors.push(notesValidation.message);
    } else {
      req.body.notes = notesValidation.value;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateVaccinationData = (req, res, next) => {
  const errors = [];

  if (req.body.vaccination_name) {
    const nameValidation = validateMedicalName(req.body.vaccination_name, 'Vaccine Name', 200, true);
    if (!nameValidation.valid) {
      errors.push(nameValidation.message);
    } else {
      req.body.vaccination_name = nameValidation.value;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateSickDayData = (req, res, next) => {
  const errors = [];

  if (req.body.meds_taken) {
    const medsValidation = validateAlphanumericText(req.body.meds_taken, 'Sickness/Symptoms', 500, false);
    if (!medsValidation.valid) {
      errors.push(medsValidation.message);
    } else {
      req.body.meds_taken = medsValidation.value;
    }
  }

  if (req.body.temp !== undefined && req.body.temp !== '') {
    const tempValidation = validateNumeric(req.body.temp, 'Temperature', 90, 110);
    if (!tempValidation.valid) {
      errors.push(tempValidation.message);
    } else {
      req.body.temp = tempValidation.value;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateObservationData = (req, res, next) => {
  const errors = [];

  if (req.body.notes && req.body.notes !== '') {
    const notesValidation = validateNotes(req.body.notes, 'Notes', 2000, false);
    if (!notesValidation.valid) {
      errors.push(notesValidation.message);
    } else {
      req.body.notes = notesValidation.value;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateTaskData = (req, res, next) => {
  const errors = [];

  if (req.body.task_title) {
    const titleValidation = validateAlphanumericText(req.body.task_title, 'Task Title', 200, true);
    if (!titleValidation.valid) {
      errors.push(titleValidation.message);
    } else {
      req.body.task_title = titleValidation.value;
    }
  }

  if (req.body.task_description) {
    const descValidation = validateNotes(req.body.task_description, 'Task Description', 2000, false);
    if (!descValidation.valid) {
      errors.push(descValidation.message);
    } else {
      req.body.task_description = descValidation.value;
    }
  }

  if (req.body.babysitter_notes) {
    const notesValidation = validateNotes(req.body.babysitter_notes, 'Babysitter Notes', 2000, false);
    if (!notesValidation.valid) {
      errors.push(notesValidation.message);
    } else {
      req.body.babysitter_notes = notesValidation.value;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateEventData = (req, res, next) => {
  const errors = [];
  const validEventTypes = ['doctor_appointment', 'vaccination', 'reminder', 'medication_reminder', 'general_appointment', 'childcare', 'other'];

  if (req.body.title) {
    const titleValidation = validateAlphanumericText(req.body.title, 'Event Title', 200, true);
    if (!titleValidation.valid) {
      errors.push(titleValidation.message);
    } else {
      req.body.title = titleValidation.value;
    }
  }

  if (req.body.eventType && !validEventTypes.includes(req.body.eventType)) {
    errors.push(`Event type must be one of: ${validEventTypes.join(', ')}`);
  }

  if (req.body.description) {
    const descValidation = validateNotes(req.body.description, 'Event Description', 2000, false);
    if (!descValidation.valid) {
      errors.push(descValidation.message);
    } else {
      req.body.description = descValidation.value;
    }
  }

  if (req.body.location) {
    const locationValidation = validateAlphanumericText(req.body.location, 'Location', 255, false);
    if (!locationValidation.valid) {
      errors.push(locationValidation.message);
    } else {
      req.body.location = locationValidation.value;
    }
  }

  if (req.body.doctorName) {
    const doctorValidation = validateMedicalName(req.body.doctorName, 'Doctor Name', 100, false);
    if (!doctorValidation.valid) {
      errors.push(doctorValidation.message);
    } else {
      req.body.doctorName = doctorValidation.value;
    }
  }

  if (req.body.notes) {
    const notesValidation = validateNotes(req.body.notes, 'Notes', 2000, false);
    if (!notesValidation.valid) {
      errors.push(notesValidation.message);
    } else {
      req.body.notes = notesValidation.value;
    }
  }

  if (req.body.reminderTime !== undefined && req.body.reminderTime !== '') {
    const reminderValidation = validateNumeric(req.body.reminderTime, 'Reminder Time', 0, 168);
    if (!reminderValidation.valid) {
      errors.push(reminderValidation.message);
    } else {
      req.body.reminderTime = reminderValidation.value;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

module.exports = {
  validateGrowthData,
  validateSleepData,
  validateFeedingData,
  validateMedicationData,
  validateAllergyData,
  validateVaccinationData,
  validateSickDayData,
  validateObservationData,
  validateTaskData,
  validateEventData,
  validateNumeric,
  validateAlphanumericText,
  validateMedicalName,
  validateNotes
};
