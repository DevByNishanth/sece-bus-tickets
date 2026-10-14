import React from 'react';
import { ShieldCheck, Timer, CreditCard, PhoneCall } from 'lucide-react';

export default function TrustGuarantees() {
  const guarantees = [
    {
      icon: ShieldCheck,
      title: '100% Verified Buses',
      description: 'Strict safety, sanitized cabin & driver audit'
    },
    {
      icon: Timer,
      title: 'On-Time Guarantee',
      description: 'Up to 25% refund on delayed bus departure'
    },
    {
      icon: CreditCard,
      title: 'Instant Refunds',
      description: 'Automatic instant reversal to original payment'
    },
    {
      icon: PhoneCall,
      title: '24/7 Priority Support',
      description: 'Dedicated live assistance via phone or chat'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 divide-y sm:divide-y-0 divide-slate-100">
        {guarantees.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-start gap-3.5 ${
                idx > 0 ? 'pt-4 sm:pt-0 sm:pl-4 lg:pl-6 sm:border-l border-slate-100' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#E7F5F2] text-[#0A6A69] flex items-center justify-center shrink-0">
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
