import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import EventCard from '../components/EventCard';
import toast from 'react-hot-toast';
import { ArrowDown, ArrowRight, BarChart3, CalendarCheck, CalendarDays, ShieldCheck, Sparkles, Users } from 'lucide-react';

const platformFeatures = [
    {
        title: 'Discover With Confidence',
        description: 'Find well-organized hackathons and events that are worth your time.',
        icon: ShieldCheck,
        iconClass: 'text-cyan-500',
    },
    {
        title: 'One Place, Every Event',
        description: 'Browse event details, dates, and booking information without the busywork.',
        icon: CalendarCheck,
        iconClass: 'text-emerald-500',
    },
    {
        title: 'Built for Participation',
        description: 'Book your spot quickly and keep track of the events you are joining.',
        icon: Users,
        iconClass: 'text-violet-500',
    },
    {
        title: 'Make Every Event Count',
        description: 'Organizers get a simple way to reach participants and manage registrations.',
        icon: BarChart3,
        iconClass: 'text-orange-500',
    },
];

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEvents = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await axiosInstance.get('/events/all-events');
            setEvents(response.data.events || response.data);
        } catch (error) {
            setError('We could not load events right now.');
            toast.error("Failed to load events");
            console.error("Fetch events error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(fetchEvents, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <main className="page-container">
            <section className="hero-panel relative isolate overflow-hidden rounded-[2rem] px-6 py-12 text-white shadow-2xl shadow-indigo-950/15 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
                <div className="hero-orb hero-orb-one" aria-hidden="true" />
                <div className="hero-orb hero-orb-two" aria-hidden="true" />
                <div className="relative z-10 max-w-3xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-indigo-100 backdrop-blur">
                        <Sparkles size={14} /> YOUR NEXT BIG MOMENT STARTS HERE
                    </span>
                    <h1 className="mt-7 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                        Find your people. <span className="hero-highlight">Make it happen.</span>
                    </h1>
                    <p className="mt-6 max-w-xl text-base leading-7 text-indigo-100/85 sm:text-lg sm:leading-8">
                        Discover brilliant hackathons and events, meet ambitious people, and turn your next idea into something real.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a href="#events" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50">
                            Explore events <ArrowDown size={17} />
                        </a>
                        <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
                            Host an event <ArrowRight size={17} />
                        </Link>
                    </div>
                    <div className="mt-10 flex items-center gap-3 text-sm text-indigo-100/80">
                        <span className="flex -space-x-2" aria-hidden="true">
                            <span className="h-8 w-8 rounded-full border-2 border-[#171a39] bg-gradient-to-br from-cyan-300 to-blue-500" />
                            <span className="h-8 w-8 rounded-full border-2 border-[#171a39] bg-gradient-to-br from-fuchsia-300 to-violet-500" />
                            <span className="h-8 w-8 rounded-full border-2 border-[#171a39] bg-gradient-to-br from-amber-200 to-rose-400" />
                        </span>
                        <span>Built for people who make things happen</span>
                    </div>
                </div>
                <div className="hero-calendar-card" aria-hidden="true">
                    <div className="flex items-center justify-between">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200"><CalendarDays size={21} /></span>
                        <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">Your next chapter</span>
                    </div>
                    <div className="mt-8 h-2 w-2/3 rounded-full bg-white/80" />
                    <div className="mt-3 h-2 w-1/2 rounded-full bg-white/25" />
                    <div className="mt-7 grid grid-cols-3 gap-2">
                        {[0, 1, 2, 3, 4, 5].map((day) => <span key={day} className={`h-9 rounded-xl ${day === 2 ? 'bg-indigo-400 shadow-lg shadow-indigo-500/40' : 'bg-white/10'}`} />)}
                    </div>
                    <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                        <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500" />
                        <span className="h-2 w-2/3 rounded-full bg-white/45" />
                    </div>
                </div>
                <div className="hero-grid" aria-hidden="true" />
            </section>

            <section id="events" className="scroll-mt-28 pt-16 sm:pt-20" aria-labelledby="events-heading">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="eyebrow">Find your next experience</p>
                        <h2 id="events-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Events worth showing up for</h2>
                        <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">From new ideas to new connections, find the event that moves you forward.</p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Open to discover
                    </span>
                </div>
            {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="surface-panel h-[25rem] animate-pulse"><div className="h-48 rounded-t-3xl bg-slate-200 dark:bg-slate-800" /><div className="space-y-4 p-6"><div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-3 rounded bg-slate-100 dark:bg-slate-800" /><div className="h-3 w-4/5 rounded bg-slate-100 dark:bg-slate-800" /></div></div>)}</div>
            ) : error ? (
                <div className="empty-state">
                    <p className="mb-4 text-lg text-rose-600 dark:text-rose-300">{error}</p>
                    <button type="button" onClick={fetchEvents} className="button-primary">
                        Try again
                    </button>
                </div>
            ) : events.length === 0 ? (
                <div className="empty-state">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300"><CalendarDays /></span>
                    <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">The next big thing is on its way</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">There are no events to show just yet. Check back soon.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            )}
            </section>

            <section className="mt-20 border-t border-slate-200/80 pt-16 dark:border-slate-800/80 sm:mt-24 sm:pt-20" aria-labelledby="platform-features-heading">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">Why Eventora</p>
                    <h2 id="platform-features-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                        Built for better events
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
                        Everything you need to discover, join, and run memorable hackathons in one focused experience.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {platformFeatures.map(({ title, description, icon: Icon, iconClass }) => (
                        <article key={title} className="group min-h-64 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(15,23,42,0.1)] dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none dark:hover:border-slate-700">
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 ${iconClass} transition-transform duration-300 group-hover:scale-105 dark:bg-slate-800`}>
                                <Icon size={30} strokeWidth={2.2} />
                            </div>
                            <h3 className="mt-7 text-xl font-bold leading-tight text-slate-950 dark:text-white">{title}</h3>
                            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">{description}</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Home;