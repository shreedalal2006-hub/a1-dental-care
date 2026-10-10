import React from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const MobileStickyBar: React.FC = () => {
  const { clinicInfo, openBookingWithPrefill } = useClinic();

  const getWhatsAppDirectUrl = () => {
    const text = encodeURIComponent(
      `Hello A1 Dental Care! I would like to inquire about an appointment with Dr. Akshata in Piranwadi, Belagavi.`
    );
    return `https://wa.me/916366925940?text=${text}`;
  };

  return (
    <aside
      aria-label="Quick contact and booking"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 shadow-lg"
    >
      <div className="max-w-md mx-auto grid grid-cols-12 gap-2 items-center">
        
        {/* Call Button */}
        <a
          href={`tel:${clinicInfo.phone}`}
          className="col-span-3 min-h-[44px] flex flex-col items-center justify-center py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition-colors active:scale-95"
          aria-label="Call clinic directly"
        >
          <Phone className="w-4 h-4 text-teal-800 mb-0.5" />
          <span>Call</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={getWhatsAppDirectUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-3 min-h-[44px] flex flex-col items-center justify-center py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 text-emerald-900 text-[11px] font-semibold transition-colors active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-emerald-700 mb-0.5" />
          <span>WhatsApp</span>
        </a>

        {/* Book Appointment CTA */}
        <button
          onClick={() => openBookingWithPrefill()}
          className="col-span-6 min-h-[44px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          aria-label="Book appointment online"
        >
          <Calendar className="w-4 h-4 text-teal-200 flex-shrink-0" />
          <span className="truncate">Book Appointment</span>
        </button>

      </div>
    </aside>
  );
};
