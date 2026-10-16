import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';

const EventCard = ({ event }) => {
    return (
        <article className="event-card group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_16px_45px_rgba(31,41,75,0.07)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(31,41,75,0.14)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20">
            <Link to={`/event/${event._id}`} className="event-card-image relative block overflow-hidden" aria-label={`View ${event.title}`}>
                {event.bannerImage ? (
                    <img src={event.bannerImage} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                ) : (
                    <div className="event-image-placeholder flex h-full items-end p-5">
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">Eventora experience</span>
                    </div>
                )}
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/35 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                    {event.status || 'Upcoming'}
                </span>
                <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg transition group-hover:-rotate-45 group-hover:bg-indigo-500 group-hover:text-white"><ArrowUpRight size={18} /></span>
            </Link>
            <div className="p-5 sm:p-6">
                <h3 className="line-clamp-1 text-xl font-bold tracking-tight text-slate-950 dark:text-white">{event.title}</h3>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-slate-500 dark:text-slate-400">{event.description}</p>
                <div className="my-5 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                    <span className="flex items-center gap-2.5">
                        <CalendarDays size={16} className="shrink-0 text-indigo-500" />
                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex min-w-0 items-center gap-2.5">
                        <MapPin size={16} className="shrink-0 text-teal-500" />
                        <span className="truncate">{event.location}</span>
                    </span>
                </div>
                <Link to={`/event/${event._id}`} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-indigo-400 dark:hover:text-slate-950">
                    Explore event <ArrowUpRight size={16} />
                </Link>
            </div>
        </article>
    );
};

export default EventCard;