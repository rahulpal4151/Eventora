import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/authContextValue';

const OrganizerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingApplication, setUpdatingApplication] = useState(null);

    const fetchDashboardData = async () => {
        setError('');
        setLoading(true);
        try {
            const [eventsResponse, applicationsResponse] = await Promise.all([
                axiosInstance.get('/events/my-events'),
                axiosInstance.get('/bookings/organizer-applications')
            ]);
            setEvents(eventsResponse.data.events || eventsResponse.data);
            setApplications(applicationsResponse.data.applications || []);
        } catch {
            setError('We could not load your organizer dashboard.');
            toast.error("Failed to load your dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(fetchDashboardData, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    const updateApplicationStatus = async (bookingId, status) => {
        setUpdatingApplication(bookingId);
        try {
            const response = await axiosInstance.put(`/bookings/${bookingId}/status`, { status });
            setApplications((currentApplications) => currentApplications.map((application) => (
                application._id === bookingId ? response.data.booking : application
            )));
            toast.success(`Application ${status.toLowerCase()} successfully`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update application");
        } finally {
            setUpdatingApplication(null);
        }
    };

    return (
        <main className="page-container">
            <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="eyebrow">Your creative hub</p>
                    <h1 className="page-title mt-3">Organizer dashboard</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Welcome back, {user?.name}</p>
                </div>
                <Link to="/organizer/create-event" className="button-primary w-full sm:w-auto">
                    + Create new event
                </Link>
            </div>

            {loading ? (
                <div className="surface-panel h-64 animate-pulse" />
            ) : error ? (
                <div className="empty-state">
                    <p className="mb-4 text-rose-600 dark:text-rose-300">{error}</p>
                    <button type="button" onClick={fetchDashboardData} className="button-primary">
                        Try again
                    </button>
                </div>
            ) : events.length === 0 ? (
                <div className="empty-state">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Your first event starts with an idea.</p>
                    <Link to="/organizer/create-event" className="button-primary mt-5">Create your first event</Link>
                </div>
            ) : (
                <div className="surface-panel overflow-x-auto">
                    <table className="dashboard-table min-w-[40rem] divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <section className="mt-12">
                <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="eyebrow">Community</p>
                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Participant applications</h2>
                        <p className="mt-1 text-slate-600 dark:text-slate-400">Review and respond to applications for your events.</p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">{applications.length} total</span>
                </div>

                {applications.length === 0 ? (
                    <div className="empty-state text-sm text-slate-500 dark:text-slate-400">
                        No participant applications yet.
                    </div>
                ) : (
                    <div className="surface-panel overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="dashboard-table min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {applications.map((application) => (
                                        <tr key={application._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="font-medium text-gray-900">{application.participantId?.name || 'Unknown participant'}</p>
                                                <p className="text-sm text-gray-500">{application.participantId?.email || ''}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{application.eventId?.title || 'Unknown event'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(application.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${application.status === 'Approved' ? 'bg-green-100 text-green-800' : application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {application.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {application.status === 'Pending' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateApplicationStatus(application._id, 'Approved')}
                                                            disabled={updatingApplication === application._id}
                                                            className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateApplicationStatus(application._id, 'Rejected')}
                                                            disabled={updatingApplication === application._id}
                                                            className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">Responded</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default OrganizerDashboard;