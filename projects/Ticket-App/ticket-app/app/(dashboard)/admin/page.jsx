import { connectDB } from '@/app/lib/db';
import { Ticket } from '@/app/models/Ticket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTicket, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';

export default async function AdminPage() {
  await connectDB();
  
  const tickets = await Ticket.find();
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'done').length;
  
  const ticketsByCategory = tickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-white/60">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Users</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <FontAwesomeIcon icon={faTicket} className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Tickets</p>
              <p className="text-2xl font-bold">{totalTickets}</p>
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <FontAwesomeIcon icon={faCheckCircle} className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Resolved</p>
              <p className="text-2xl font-bold">{resolvedTickets}</p>
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <FontAwesomeIcon icon={faClock} className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Avg Response</p>
              <p className="text-2xl font-bold">2.4h</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass p-6">
          <h2 className="text-xl font-semibold mb-4">Tickets by Category</h2>
          <div className="space-y-3">
            {Object.entries(ticketsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span>{category || 'General'}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / totalTickets) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-white/60">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6">
          <h2 className="text-xl font-semibold mb-4">System Health</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>API Status</span>
                <span className="text-green-400">Operational</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="w-full bg-green-500 h-2 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Database</span>
                <span className="text-green-400">Connected</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="w-full bg-green-500 h-2 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Cache</span>
                <span className="text-yellow-400">Degraded</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="w-3/4 bg-yellow-500 h-2 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}