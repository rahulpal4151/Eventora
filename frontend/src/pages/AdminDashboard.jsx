import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

import { AuthContext } from '../context/authContextValue';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingEvent, setUpdatingEvent] = useState(null);

    const fetchAllEvents = async () => {
        setError('');
        try {
            const response = await axiosInstance.get('/admin/events');
            setEvents(response.data.events || response.data);
        } catch {
            setError('Failed to load platform events.');
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(fetchAllEvents, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    const updateEventStatus = async (eventId, newStatus) => {
        setUpdatingEvent(eventId);
        try {
            await axiosInstance.put(`/admin/event-status/${eventId}`, { status: newStatus });
            toast.success(`Event marked as ${newStatus}`);
            fetchAllEvents();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingEvent(null);
        }
    };

    return (
        <main className="page-container">
            <div className="mb-9">
                <p className="eyebrow">Platform overview</p>
                <h1 className="page-title mt-3">Admin control panel</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Welcome {user?.name}, manage pending events and review approved events here.</p>
            </div>

            {loading ? (
                <div className="surface-panel h-64 animate-pulse" />
            ) : error ? (
                <div className="empty-state">
                    <p className="mb-4 text-rose-600 dark:text-rose-300">{error}</p>
                    <button type="button" onClick={fetchAllEvents} className="button-primary">
                        Try again
                    </button>
                </div>
            ) : events.length === 0 ? (
                <div className="empty-state">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">No events found on the platform.</p>
                </div>
            ) : (
                <div className="surface-panel overflow-x-auto">
                    <table className="dashboard-table min-w-[40rem] divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {events.map((event) => (
                                <tr key={event._id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{event.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status === 'Approved' ? 'bg-green-100 text-green-800' : event.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {event.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        {event.status === 'Pending' && (
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => updateEventStatus(event._id, 'Approved')}
                                                    disabled={updatingEvent === event._id}
                                                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => updateEventStatus(event._id, 'Rejected')}
                                                    disabled={updatingEvent === event._id}
                                                    className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {event.status === 'Approved' && (
                                            <span className="text-green-700">Approved</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
};

export default AdminDashboard;