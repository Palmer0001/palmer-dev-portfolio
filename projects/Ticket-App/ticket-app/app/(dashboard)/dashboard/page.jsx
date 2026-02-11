import { connectDB } from '@/app/lib/db';
import { Ticket } from '@/app/models/Ticket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicket,
  faClock,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

export default async function Dashboard() {
  await connectDB();

  const tickets = await Ticket.find().lean();

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in progress').length;
  const resolvedTickets = tickets.filter(
    t => t.status === 'resolved' || t.status === 'done'
  ).length;

  const stats = [
    {
      title: 'Total Tickets',
      value: totalTickets,
      icon: faTicket,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Open Issues',
      value: openTickets,
      icon: faExclamationTriangle,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'In Progress',
      value: inProgressTickets,
      icon: faClock,
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Resolved',
      value: resolvedTickets,
      icon: faCheckCircle,
      color: 'from-green-500 to-green-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-white/60">Welcome back! Here's your ticket overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="glass p-6 relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                <FontAwesomeIcon icon={stat.icon} className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs text-white/40">
              Updated just now
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
