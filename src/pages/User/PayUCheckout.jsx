import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, CheckCircle2, Lock, CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';

export default function PayUCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalAmount = 891.45, passengers = [], selectedSeats = ['L06'], bus } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const txnId = 'TXN_PAYU_' + Math.floor(100000000 + Math.random() * 900000000);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Booking Confirmed!
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Payment of <span className="font-bold text-slate-800">₹{totalAmount}</span> processed successfully via PayU Gateway.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction ID</span>
              <span className="font-mono font-bold text-slate-700">{txnId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Selected Berths</span>
              <span className="font-bold text-teal-700">{selectedSeats.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Operator</span>
              <span className="font-semibold text-slate-800">{bus?.operatorName || 'Sri Kumaran Travels'}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/buses')}
              className="w-full py-3 rounded-xl bg-[#0F766E] hover:bg-[#0D6962] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Back to Bus Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans">
      {/* PayU Header */}
      <header className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-[#5CB85C] text-white font-black text-sm px-2.5 py-1 rounded-md tracking-wider">
                Pay<span className="text-[#204D74]">U</span>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Checkout Gateway
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Secure Encryption</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Payment Method Selection */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Select Payment Method
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Choose how you want to pay for your BusGo ticket
            </p>
          </div>

          {/* Payment Tabs */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'upi', label: 'UPI / QR', icon: Smartphone },
              { id: 'card', label: 'Card', icon: CreditCard },
              { id: 'netbanking', label: 'NetBanking', icon: Building2 },
              { id: 'wallet', label: 'Wallets', icon: Wallet }
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0F766E] bg-teal-50/50 text-[#0F766E] font-bold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px]">{method.label}</span>
                </button>
              );
            })}
          </div>

          {/* UPI Form */}
          {paymentMethod === 'upi' && (
            <div className="space-y-4 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                Virtual Payment Address (UPI ID)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="username@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-teal-600"
                />
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-[#0F766E] text-white font-bold text-xs sm:text-sm hover:bg-[#0D6962] disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? 'Verifying...' : 'Verify & Pay'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Popular apps: Google Pay, PhonePe, Paytm, CRED
              </p>
            </div>
          )}

          {/* Cards Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expiry MM/YY</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="•••"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Netbanking / Wallet fallback placeholder */}
          {(paymentMethod === 'netbanking' || paymentMethod === 'wallet') && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <p className="font-semibold">Select your Bank or Wallet to proceed</p>
              <div className="grid grid-cols-2 gap-2 text-center font-bold text-[11px]">
                <div className="p-2.5 rounded-xl border border-slate-200 bg-white">HDFC Bank</div>
                <div className="p-2.5 rounded-xl border border-slate-200 bg-white">State Bank of India</div>
                <div className="p-2.5 rounded-xl border border-slate-200 bg-white">ICICI Bank</div>
                <div className="p-2.5 rounded-xl border border-slate-200 bg-white">Axis Bank</div>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-[#0F766E] hover:bg-[#0D6962] text-white font-extrabold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? 'Connecting to PayU...' : `Pay ₹${totalAmount}`}
            </button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              MERCHANT
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              BusGo Travel Network Pvt. Ltd.
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              {txnId}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Selected Seats</span>
              <span className="font-bold text-slate-900">{selectedSeats.join(', ')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Journey</span>
              <span className="font-semibold text-slate-900">Chennai → Coimbatore</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Operator</span>
              <span className="font-semibold text-slate-900">{bus?.operatorName || 'Sri Kumaran Travels'}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-800">Amount Due</span>
              <span className="text-xl font-black text-slate-900">₹{totalAmount}</span>
            </div>
          </div>

          {/* API Endpoint Note Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 leading-relaxed font-medium">
            <span className="font-bold">⚡ PayU Integration Ready:</span>
            <p className="mt-0.5 text-amber-800">
              This checkout screen is configured and ready to connect to your PayU Merchant API credentials (Merchant Key, Salt, and Hash generation endpoint) once provided.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
