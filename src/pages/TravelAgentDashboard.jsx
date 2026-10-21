import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bus,
  Compass,
  Calendar,
  Ticket,
  Users,
  CreditCard,
  TrendingUp,
  FileText,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  LogOut,
  MapPin,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AgentProfileModal from '../components/AgentProfileModal';

export default function TravelAgentDashboard() {
  const { user, agentProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to decode JWT payload safely
  const token = localStorage.getItem('exte_key');
  let tokenStatus = '';
  try {
    if (token) {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(decodeURIComponent(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
        tokenStatus = payload?.status ?? payload?.approvalStatus ?? payload?.agentStatus ?? '';
      }
    }
  } catch {
    tokenStatus = '';
  }

  const isApproved =
    String(tokenStatus || user?.status || user?.approvalStatus || user?.agentStatus || '')
      .trim()
      .toLowerCase() === 'approved';

  // Check if first-time login
  const isFirstTime = Boolean(
    location.state?.showFirstTimeModal ||
      user?.firsttimelogin ||
      user?.firstTimeLogin ||
      user?.isFirstTimeLogin ||
      user?.firstLogin
  );

  // If first-time login, or if not first-time but status is still pending/unapproved, show the modal
  const initialShowModal = Boolean(isFirstTime || !isApproved);

  const [isModalOpen, setIsModalOpen] = useState(initialShowModal);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName =
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ||
    user?.name ||
    'Travel Partner';

  const stats = [
    {
      title: 'Active Fleet Buses',
      value: '24',
      change: '+3 this month',
      icon: Bus,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      title: 'Monthly Bookings',
      value: '1,428',
      change: '+18.4% vs last mo',
      icon: Ticket,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Agent Revenue',
      value: '₹3,45,200',
      change: '+12% margin',
      icon: CreditCard,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Commission Earned',
      value: '₹41,400',
      change: 'Next payout in 3 days',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
  ];

  const recentBookings = [
    {
      id: 'TKT-99214',
      passenger: 'Kavitha S.',
      route: 'Bengaluru → Coimbatore',
      time: 'Today, 21:30',
      busType: 'AC Sleeper 2+1',
      seats: 'U4, U5',
      amount: '₹1,980',
      status: 'Confirmed',
    },
    {
      id: 'TKT-99213',
      passenger: 'Arun Prakash',
      route: 'Chennai → Madurai',
      time: 'Tomorrow, 22:00',
      busType: 'Scania Multi-Axle',
      seats: 'L12',
      amount: '₹850',
      status: 'Confirmed',
    },
    {
      id: 'TKT-99212',
      passenger: 'Sanjay Mehra',
      route: 'Salem → Hyderabad',
      time: '24 Oct, 19:45',
      busType: 'Volvo AC Semi-Sleeper',
      seats: 'L03, L04',
      amount: '₹2,300',
      status: 'Completed',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* ── Top Header ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <Bus size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 tracking-tight">
                  SECE BUS PARTNER
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-100 text-teal-800 uppercase tracking-wider">
                  Agent Portal
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {agentProfile?.agencyName || 'Agency Dashboard'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(!agentProfile?.agencyName || user?.firsttimelogin) && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold hover:bg-teal-100 transition"
              >
                <Building2 size={14} /> Complete Agency Profile
              </button>
            )}

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800">{displayName}</p>
                <p className="text-[11px] text-slate-400">{user?.email}</p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* ── First-Time Modal on top of Dashboard ── */}
      <AgentProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
        isFirstTime={isFirstTime}
        initialEmail={location.state?.email || user?.email || ''}
        initialPhone={user?.phone || ''}
      />
    </div>
  );
}
