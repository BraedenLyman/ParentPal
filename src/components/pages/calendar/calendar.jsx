import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useBabyData } from '../../../hooks/useBabyData';
import axios from 'axios';
import API_URL from '../../../config/api';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@heroui/react';
import CustomSelect from "../../custom-select/CustomSelect";
import './calendar.css';
import Navbar from '../nav-bar/navbar';

export default function Calendar() {
    const { currentUser } = useAuth();
    const { babyData: babies } = useBabyData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('month');
    const [filterType, setFilterType] = useState('all');
    const [formData, setFormData] = useState({
        babyId: '',
        eventType: 'doctor_appointment',
        title: '',
        description: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        location: '',
        doctorName: '',
        reminderEnabled: true,
        reminderTime: 24,
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const eventTypeOptions = [
        { value: 'doctor_appointment', label: 'Doctor Appointment' },
        { value: 'vaccination', label: 'Vaccination' },
        { value: 'reminder', label: 'Reminder' },
        { value: 'medication_reminder', label: 'Medication Reminder' },
        { value: 'general_appointment', label: 'General Appointment' },
        { value: 'childcare', label: 'Childcare' },
        { value: 'other', label: 'Other' },
    ];

    const babyOptions = (babies || []).map((baby) => ({
        value: baby.baby_id,
        label: `${baby.first_name} ${baby.last_name}`,
    }));

    useEffect(() => {
        if (currentUser) {
            fetchEvents();
        }
    }, [currentUser, currentDate, view, filterType]);

    useEffect(() => {
        if (selectedEvent) {
            setFormData({
                babyId: selectedEvent.baby_id || '',
                eventType: selectedEvent.event_type || 'doctor_appointment',
                title: selectedEvent.title || '',
                description: selectedEvent.description || '',
                eventDate: selectedEvent.event_date || '',
                startTime: selectedEvent.start_time ? selectedEvent.start_time.substring(0, 5) : '',
                endTime: selectedEvent.end_time ? selectedEvent.end_time.substring(0, 5) : '',
                location: selectedEvent.location || '',
                doctorName: selectedEvent.doctor_name || '',
                reminderEnabled: selectedEvent.reminder_enabled !== false,
                reminderTime: selectedEvent.reminder_time || 24,
                notes: selectedEvent.notes || ''
            });
        } else if (selectedDate) {
            setFormData({
                babyId: '',
                eventType: 'doctor_appointment',
                title: '',
                description: '',
                eventDate: selectedDate.toISOString().split('T')[0],
                startTime: '',
                endTime: '',
                location: '',
                doctorName: '',
                reminderEnabled: true,
                reminderTime: 24,
                notes: ''
            });
        }
    }, [selectedEvent, selectedDate]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const startDate = getStartDate();
            const endDate = getEndDate();

            const response = await axios.get(`${API_URL}/api/calendar/events`, {
                params: {
                    parentId: currentUser.uid,
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0],
                    eventType: filterType === 'all' ? undefined : filterType
                },
                withCredentials: true
            });

            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStartDate = () => {
        if (view === 'month') {
            return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        } else if (view === 'week') {
            const day = currentDate.getDay();
            const diff = currentDate.getDate() - day;
            return new Date(currentDate.setDate(diff));
        }
        return currentDate;
    };

    const getEndDate = () => {
        if (view === 'month') {
            return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        } else if (view === 'week') {
            const day = currentDate.getDay();
            const diff = currentDate.getDate() - day + 6;
            return new Date(currentDate.setDate(diff));
        }
        return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    };

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const getEventsForDate = (date) => {
        if (!date) return [];
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => {
            const eventDate = typeof event.event_date === 'string'
                ? event.event_date.split('T')[0]
                : new Date(event.event_date).toISOString().split('T')[0];
            return eventDate === dateStr;
        });
    };

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectChange = (name, option) => {
        setFormData(prev => ({
            ...prev,
            [name]: option ? option.value : ''
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Event title is required';
        }

        if (!formData.eventDate) {
            newErrors.eventDate = 'Event date is required';
        }

        if (formData.startTime && formData.endTime) {
            if (formData.startTime >= formData.endTime) {
                newErrors.endTime = 'End time must be after start time';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setFormLoading(true);

        try {
            const payload = {
                parentId: currentUser.uid,
                babyId: formData.babyId || null,
                eventType: formData.eventType,
                title: formData.title,
                description: formData.description || null,
                eventDate: formData.eventDate,
                startTime: formData.startTime || null,
                endTime: formData.endTime || null,
                location: formData.location || null,
                doctorName: formData.doctorName || null,
                reminderEnabled: formData.reminderEnabled,
                reminderTime: parseInt(formData.reminderTime),
                notes: formData.notes || null
            };

            if (selectedEvent) {
                await axios.put(
                    `${API_URL}/api/calendar/events/${selectedEvent.event_id}`,
                    payload,
                    { withCredentials: true }
                );
            } else {
                await axios.post(
                    `${API_URL}/api/calendar/events`,
                    payload,
                    { withCredentials: true }
                );
            }

            setShowEventModal(false);
            setSelectedEvent(null);
            fetchEvents();
        } catch (error) {
            console.error('Error saving event:', error);
            setErrors({ submit: error.response?.data?.error || 'Failed to save event' });
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent) return;

        setFormLoading(true);

        try {
            await axios.delete(
                `${API_URL}/api/calendar/events/${selectedEvent.event_id}`,
                {
                    params: { parentId: currentUser.uid },
                    withCredentials: true
                }
            );
            setIsDeleteModalOpen(false);
            setShowEventModal(false);
            setSelectedEvent(null);
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            setErrors({ submit: error.response?.data?.error || 'Failed to delete event' });
        } finally {
            setFormLoading(false);
        }
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setSelectedEvent(null);
        setShowEventModal(true);
    };

    const handleEventClick = (event, e) => {
        e.stopPropagation();
        setSelectedEvent(event);
        setShowEventModal(true);
    };

    const formatMonthYear = () => {
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const getEventTypeColor = (eventType) => {
        const colors = {
            doctor_appointment: '#3b82f6',
            vaccination: '#10b981',
            reminder: '#f59e0b',
            medication_reminder: '#ef4444',
            general_appointment: '#8b5cf6',
            childcare: '#ec4899',
            other: '#6b7280'
        };
        return colors[eventType] || '#6b7280';
    };

    const getEventTypeLabel = (eventType) => {
        const labels = {
            doctor_appointment: 'Doctor',
            vaccination: 'Vaccine',
            reminder: 'Reminder',
            medication_reminder: 'Medication',
            general_appointment: 'Appointment',
            childcare: 'Childcare',
            other: 'Other'
        };
        return labels[eventType] || eventType;
    };

    const renderMonthView = () => {
        const days = getDaysInMonth();
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div className="calendar-grid">
                <div className="calendar-header-row">
                    {weekDays.map(day => (
                        <div key={day} className="calendar-header-cell">{day}</div>
                    ))}
                </div>
                <div className="calendar-body">
                    {days.map((date, index) => {
                        const dayEvents = date ? getEventsForDate(date) : [];
                        return (
                            <div
                                key={index}
                                className={`calendar-cell ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''}`}
                                onClick={() => date && handleDateClick(date)}
                            >
                                {date && (
                                    <>
                                        <div className="calendar-date">{date.getDate()}</div>
                                        <div className="calendar-events">
                                            {dayEvents.slice(0, 3).map(event => (
                                                <div
                                                    key={event.event_id}
                                                    className="calendar-event"
                                                    style={{ backgroundColor: getEventTypeColor(event.event_type) }}
                                                    onClick={(e) => handleEventClick(event, e)}
                                                >
                                                    <span className="event-time">
                                                        {event.start_time ? event.start_time.substring(0, 5) : ''}
                                                    </span>
                                                    <span className="event-title">{event.title}</span>
                                                </div>
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <div className="calendar-event-more">
                                                    +{dayEvents.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                <Navbar />
            
            </div>
        );
    };

    const renderListView = () => {
        const sortedEvents = [...events].sort((a, b) => {
            if (a.event_date !== b.event_date) {
                return new Date(a.event_date) - new Date(b.event_date);
            }
            if (a.start_time && b.start_time) {
                return a.start_time.localeCompare(b.start_time);
            }
            return 0;
        });

        return (
            <div className="list-view">
                {sortedEvents.length === 0 ? (
                    <div className="no-events">No events found</div>
                ) : (
                    sortedEvents.map(event => (
                        <div
                            key={event.event_id}
                            className="list-event-item"
                            onClick={() => handleEventClick(event, { stopPropagation: () => {} })}
                        >
                            <div
                                className="event-type-indicator"
                                style={{ backgroundColor: getEventTypeColor(event.event_type) }}
                            ></div>
                            <div className="event-details">
                                <div className="event-header">
                                    <h3>{event.title}</h3>
                                    <span className="event-type-badge">
                                        {getEventTypeLabel(event.event_type)}
                                    </span>
                                </div>
                                <div className="event-info">
                                    <span className="event-date">
                                        {new Date(event.event_date).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    {event.start_time && (
                                        <span className="event-time">
                                            {event.start_time.substring(0, 5)}
                                            {event.end_time && ` - ${event.end_time.substring(0, 5)}`}
                                        </span>
                                    )}
                                    {event.baby_first_name && (
                                        <span className="event-baby">
                                            {event.baby_first_name} {event.baby_last_name}
                                        </span>
                                    )}
                                </div>
                                {event.location && (
                                    <div className="event-location">{event.location}</div>
                                )}
                                {event.description && (
                                    <div className="event-description">{event.description}</div>
                                )}
                            </div>
                        </div>
                    ))
                )}

                 <Navbar/>
            </div>
        );
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <h1>Calendar & Appointments</h1>
                <div className="calendar-controls">
                    <div className="view-controls">
                        <button
                            className={view === 'month' ? 'active' : ''}
                            onClick={() => setView('month')}
                        >
                            Month
                        </button>
                        <button
                            className={view === 'list' ? 'active' : ''}
                            onClick={() => setView('list')}
                        >
                            List
                        </button>
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Events</option>
                        <option value="doctor_appointment">Doctor Appointments</option>
                        <option value="vaccination">Vaccinations</option>
                        <option value="reminder">Reminders</option>
                        <option value="medication_reminder">Medication Reminders</option>
                        <option value="general_appointment">General Appointments</option>
                        <option value="childcare">Childcare</option>
                        <option value="other">Other</option>
                    </select>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            setSelectedDate(new Date());
                            setSelectedEvent(null);
                            setShowEventModal(true);
                        }}
                    >
                        + New Event
                    </button>
                </div>
            </div>

            {view === 'month' && (
                <div className="calendar-navigation">
                    <button onClick={handlePreviousMonth}>&lt; Previous</button>
                    <h2>{formatMonthYear()}</h2>
                    <button onClick={handleNextMonth}>Next &gt;</button>
                </div>
            )}

            {loading ? (
                <div className="loading">Loading events...</div>
            ) : (
                <>
                    {view === 'month' && renderMonthView()}
                    {view === 'list' && renderListView()}
                </>
            )}

            <Modal
                isOpen={showEventModal}
                onOpenChange={(open) => {
                    setShowEventModal(open);
                    if (!open) {
                        setSelectedEvent(null);
                        setSelectedDate(null);
                        setErrors({});
                    }
                }}
                size="2xl"
                scrollBehavior="inside"
            >
                <ModalContent>
                    {(onClose) => (
                        <form id="event-form" onSubmit={handleSubmit}>
                            <ModalHeader>
                                {selectedEvent ? 'Edit Event' : 'New Event'}
                            </ModalHeader>
                            <ModalBody>
                                {errors.submit && (
                                    <div style={{
                                        padding: '12px',
                                        background: '#fee2e2',
                                        border: '1px solid #fca5a5',
                                        borderRadius: '8px',
                                        color: '#991b1b',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '16px'
                                    }}>
                                        {errors.submit}
                                    </div>
                                )}

                                <Input
                                    label="Event Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Dr. Smith Checkup"
                                    maxLength={200}
                                    isRequired
                                    variant="bordered"
                                    isInvalid={!!errors.title}
                                    errorMessage={errors.title}
                                />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                            Event Type*
                                        </label>
                                        <CustomSelect
                                            options={eventTypeOptions}
                                            value={eventTypeOptions.find(opt => opt.value === formData.eventType) || null}
                                            onChange={(option) => handleSelectChange('eventType', option)}
                                            placeholder="Select an event type"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                            Child (Optional)
                                        </label>
                                        <CustomSelect
                                            options={[{ value: '', label: 'Not specific to a child' }, ...babyOptions]}
                                            value={[{ value: '', label: 'Not specific to a child' }, ...babyOptions].find(opt => opt.value === formData.babyId) || null}
                                            onChange={(option) => handleSelectChange('babyId', option)}
                                            placeholder="Select a child"
                                        />
                                    </div>
                                </div>

                                <Input
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Additional details about the event"
                                    variant="bordered"
                                />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                    <Input
                                        label="Date"
                                        type="date"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                        isRequired
                                        variant="bordered"
                                        isInvalid={!!errors.eventDate}
                                        errorMessage={errors.eventDate}
                                    />

                                    <Input
                                        label="Start Time"
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        variant="bordered"
                                    />

                                    <Input
                                        label="End Time"
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        variant="bordered"
                                        isInvalid={!!errors.endTime}
                                        errorMessage={errors.endTime}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <Input
                                        label="Location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g., 123 Main St, Pediatric Clinic"
                                        maxLength={255}
                                        variant="bordered"
                                    />

                                    <Input
                                        label="Doctor Name"
                                        name="doctorName"
                                        value={formData.doctorName}
                                        onChange={handleChange}
                                        placeholder="e.g., Dr. Smith"
                                        maxLength={100}
                                        variant="bordered"
                                    />
                                </div>

                                <div style={{ marginTop: '8px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            name="reminderEnabled"
                                            checked={formData.reminderEnabled}
                                            onChange={handleChange}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Enable reminder</span>
                                    </label>
                                </div>

                                {formData.reminderEnabled && (
                                    <Input
                                        label="Remind me (hours before event)"
                                        type="number"
                                        name="reminderTime"
                                        value={formData.reminderTime}
                                        onChange={handleChange}
                                        min="1"
                                        max="168"
                                        variant="bordered"
                                    />
                                )}

                                <Input
                                    label="Notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Any additional notes or observations"
                                    maxLength={2000}
                                    variant="bordered"
                                />
                            </ModalBody>
                            <ModalFooter>
                                {selectedEvent && (
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={() => setIsDeleteModalOpen(true)}
                                        isDisabled={formLoading}
                                    >
                                        Delete
                                    </Button>
                                )}
                                <Button
                                    variant="light"
                                    onPress={onClose}
                                    isDisabled={formLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    type="submit"
                                    isDisabled={formLoading}
                                    isLoading={formLoading}
                                >
                                    {formLoading ? 'Saving...' : 'Save Event'}
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                size="sm"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Delete Event</ModalHeader>
                            <ModalBody>
                                <p>Are you sure you want to delete this event? This action cannot be undone.</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant="light"
                                    onPress={onClose}
                                    isDisabled={formLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={handleDelete}
                                    isDisabled={formLoading}
                                    isLoading={formLoading}
                                >
                                    {formLoading ? 'Deleting...' : 'Delete'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};
