import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bus,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Search,
  AlertCircle,
  Bookmark
} from 'lucide-react';
import BookingNavbar from '../../components/User/BookingNavbar';
import { fetchMyBookings } from '../../services/busService';

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMyBookings();
      if (res.success && Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      setError(err.message || 'Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <BookingNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Bus Bookings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Review your upcoming journeys, confirmed tickets, and transaction receipts.
            </p>
          </div>

          <button
            type="button"
            onClick={loadBookings}
            className="self-start sm:self-auto px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded-full w-1/4" />
                <div className="h-6 bg-slate-100 rounded-full w-1/2" />
                <div className="h-10 bg-slate-50 rounded-2xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error Notice */}
        {!loading && error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadBookings}
              className="font-bold underline text-amber-800 hover:text-amber-950 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && bookings.length === 0 && !error && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 text-[#0F766E] flex items-center justify-center mx-auto">
              <Bookmark className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                No Bookings Found Yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
                You haven't reserved any tickets yet. Explore active bus routes and plan your next journey!
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/buses')}
              className="px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D6962] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Search Available Buses
            </button>
          </div>
        )}

        {/* Bookings List */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const status = (booking.status || 'CONFIRMED').toUpperCase();
              const isConfirmed = status === 'CONFIRMED' || status === 'SUCCESS';

              return (
                <div
                  key={booking._id || booking.bookingNumber}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-teal-300 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-lg">
                        {booking.bookingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <span className="text-sm font-black text-slate-900">
                      ₹{booking.totalAmount || booking.fareBreakdown?.totalPayable || 0}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900">
                        {booking.busName || 'Luxury Sleeper Bus'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <span>{booking.source || booking.boardingPoint?.city || 'Origin'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
                        <span>{booking.destination || booking.droppingPoint?.city || 'Destination'}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Seats: <span className="font-bold text-slate-700">{(booking.seats || []).join(', ') || 'N/A'}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/booking/payment-result?bookingId=${booking._id || booking.bookingId}&status=${
                            isConfirmed ? 'success' : 'pending'
                          }`
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-teal-50 border border-teal-200 text-[#0F766E] hover:bg-teal-100 text-xs font-bold transition-all shadow-2xs self-start sm:self-auto cursor-pointer flex items-center gap-1"
                    >
                      <span>View Receipt & Ticket</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

