import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../../config/api';
import './upcomingEventsWidget.css';

const UpcomingEventsWidget = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            fetchUpcomingEvents();
        }
    }, [currentUser]);

    const fetchUpcomingEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/calendar/upcoming`, {
                params: {
                    parentId: currentUser.uid,
                    days: 7,
                    limit: 5
                },
                withCredentials: true
            });
            setUpcomingEvents(response.data);
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
        } finally {
            setLoading(false);
        }
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

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    if (loading) {
        return (
            <div className="upcoming-events-widget">
                <div className="widget-header">
                    <h3>Upcoming Events</h3>
                </div>
                <div className="widget-loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="upcoming-events-widget">
            <div className="widget-header">
                <h3>Upcoming Events</h3>
                <button
                    className="view-all-btn"
                    onClick={() => navigate('/calendar')}
                >
                    View All
                </button>
            </div>

            {upcomingEvents.length === 0 ? (
                <div className="no-upcoming-events">
                    <p>No upcoming events</p>
                    <button
                        className="add-event-btn"
                        onClick={() => navigate('/calendar')}
                    >
                        + Add Event
                    </button>
                </div>
            ) : (
                <div className="events-list">
                    {upcomingEvents.map(event => (
                        <div
                            key={event.event_id}
                            className="event-item"
                            onClick={() => navigate('/calendar')}
                        >
                            <div
                                className="event-indicator"
                                style={{ backgroundColor: getEventTypeColor(event.event_type) }}
                            ></div>
                            <div className="event-content">
                                <div className="event-title-row">
                                    <h4>{event.title}</h4>
                                    <span
                                        className="event-type"
                                        style={{ color: getEventTypeColor(event.event_type) }}
                                    >
                                        {getEventTypeLabel(event.event_type)}
                                    </span>
                                </div>
                                <div className="event-meta">
                                    <span className="event-date">{formatDate(event.event_date)}</span>
                                    {event.start_time && (
                                        <span className="event-time">
                                            {event.start_time.substring(0, 5)}
                                        </span>
                                    )}
                                    {event.baby_first_name && (
                                        <span className="event-child">
                                            {event.baby_first_name}
                                        </span>
                                    )}
                                </div>
                                {event.location && (
                                    <div className="event-location">
                                        {event.location}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpcomingEventsWidget;
