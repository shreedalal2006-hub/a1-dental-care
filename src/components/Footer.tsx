import React, { useState } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  Calendar,
  Shield,
  MessageCircle,
  ExternalLink,
  X,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const Footer: React.FC = () => {
  const { clinicInfo, openBookingWithPrefill, setIsAdminOpen } = useClinic();
  const [activePolicyModal, setActivePolicyModal] = useState<'privacy' | 'terms' | 'cancellation' | null>(null);

  const getWhatsAppDirectUrl = () => {
    const text = encodeURIComponent(
      `Hello A1 Dental Care! I have an inquiry for Dr. Akshata at the clinic in Piranwadi, Belagavi.`
    );
    return `https://wa.me/916366925940?text=${text}`;
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 lg:pb-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Doctor Credentials (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">
                A1 DENTAL CARE
              </span>
              <span className="text-xl">🦷</span>
            </div>

            <p className="text-sm font-semibold text-teal-400">
              Dr. Akshata | Dental Surgeon
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Providing personalized, doctor-led dental care in Piranwadi, Belagavi.
              Gentle clinical treatments, transparent patient guidance, and comfortable scheduling.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`tel:${clinicInfo.phone}`}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>Call Clinic</span>
              </a>

              <a
                href={getWhatsAppDirectUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => openBookingWithPrefill()}
                className="px-3 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Slot</span>
              </button>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">About Dr. Akshata</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">Why Choose Us</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">Clinic Gallery</a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-white transition-colors">FAQs</a>
              </li>
              <li>
                <a href="#location" className="hover:text-white transition-colors">Location & Timings</a>
              </li>
            </ul>
          </div>

          {/* Timings (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Hours</span>
            </h4>
            <div className="text-xs text-slate-300 space-y-2">
              <div>
                <p className="font-semibold text-white">Monday – Sunday</p>
                <p className="text-slate-400 text-[11px]">Open All 7 Days</p>
              </div>
              <div className="pt-1">
                <p className="font-mono text-teal-300 font-semibold">10:00 AM – 02:00 PM</p>
                <p className="text-slate-400 text-[11px]">Morning Session</p>
              </div>
              <div>
                <p className="font-mono text-teal-300 font-semibold">04:00 PM – 09:00 PM</p>
                <p className="text-slate-400 text-[11px]">Evening Session</p>
              </div>
              <div className="pt-1 text-[11px] text-amber-300/80">
                Break: 2:00 PM – 4:00 PM
              </div>
            </div>
          </div>

          {/* Physical Address (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Clinic Address</span>
            </h4>
            <address className="not-italic text-xs text-slate-300 space-y-1 leading-relaxed">
              <p className="font-semibold text-white">A1 DENTAL CARE</p>
              <p>2nd Floor, 331, Jamboti Road,</p>
              <p>Opposite Raghavendra Hotel, Piranwadi,</p>
              <p>Belagavi, Karnataka 590014, India</p>
              <p className="pt-1 text-teal-300 font-semibold font-mono">
                Phone: {clinicInfo.phoneDisplay}
              </p>
            </address>

            <div className="pt-1">
              <a
                href="https://www.google.com/maps/search/?api=1&query=A1+DENTAL+CARE+331+Jamboti+Road+Opposite+Raghavendra+Hotel+Piranwadi+Belagavi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 hover:underline"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal Policies, Admin Link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} A1 DENTAL CARE · All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => setActivePolicyModal('privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => setActivePolicyModal('terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              onClick={() => setActivePolicyModal('cancellation')}
              className="hover:text-slate-300 transition-colors"
            >
              Appointment & Cancellation Policy
            </button>
            <span>·</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-teal-400 text-slate-400 flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </button>
          </div>
        </div>

      </div>

      {/* Policy Modal */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setActivePolicyModal(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 rounded"
              aria-label="Close policy"
            >
              <X className="w-5 h-5" />
            </button>

            {activePolicyModal === 'privacy' && (
              <div className="space-y-3 text-xs leading-relaxed">
                <h3 className="text-base font-bold text-slate-900">Privacy Policy</h3>
                <p>
                  At A1 Dental Care, we take patient confidentiality and personal privacy seriously.
                  Contact details collected through this website (such as patient name, mobile number, and appointment notes)
                  are solely used for scheduling, reminding, and coordinating dental visits with Dr. Akshata.
                </p>
                <p>
                  We never sell, rent, or share patient information with third parties. No sensitive medical diagnoses or records
                  are collected in the initial booking form.
                </p>
                <p>
                  For any privacy questions or requests to update your registered contact details, please call the clinic directly at +91 63669 25940.
                </p>
              </div>
            )}

            {activePolicyModal === 'terms' && (
              <div className="space-y-3 text-xs leading-relaxed">
                <h3 className="text-base font-bold text-slate-900">Terms of Service</h3>
                <p>
                  This website facilitates online appointment scheduling for A1 Dental Care located in Piranwadi, Belagavi.
                  Requesting an appointment online reserves a dedicated consultation slot subject to clinic confirmation.
                </p>
                <p>
                  Information provided on this website is for general informational and scheduling purposes and does not constitute
                  a formal medical prescription. Actual diagnostic evaluation is performed in person by Dr. Akshata.
                </p>
              </div>
            )}

            {activePolicyModal === 'cancellation' && (
              <div className="space-y-3 text-xs leading-relaxed">
                <h3 className="text-base font-bold text-slate-900">Appointment & Cancellation Policy</h3>
                <p>
                  <strong>Zero Advance Fees:</strong> A1 Dental Care does not charge advance cancellation fees for online appointments.
                </p>
                <p>
                  <strong>Notice of Rescheduling:</strong> If you need to reschedule or cancel your visit, please inform us at least
                  2 hours in advance by calling +91 63669 25940 or messaging on WhatsApp. This allows us to offer the slot to other patients in need.
                </p>
                <p>
                  <strong>Arrival:</strong> Please arrive 5 to 10 minutes prior to your scheduled slot to ensure a relaxed and unhurried consultation.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
