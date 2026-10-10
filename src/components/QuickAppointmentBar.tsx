import React, { useState } from 'react';
import { Calendar, User, Phone, CheckCircle, Clock, Database } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { formatKolkataDateOnly, getKolkataDate, MORNING_SLOTS, EVENING_SLOTS } from '../utils/timeZone';

export const QuickAppointmentBar: React.FC = () => {
  const { services, bookAppointment, openBookingWithPrefill } = useClinic();

  const todayStr = formatKolkataDateOnly(getKolkataDate());

  const [patientName, setPatientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || 'srv-1');
  const [preferredDate, setPreferredDate] = useState(todayStr);
  const [preferredSlot, setPreferredSlot] = useState(MORNING_SLOTS[0] || '10:00 AM');
  const [patientType, setPatientType] = useState<'new' | 'existing'>('new');
  const [message, setMessage] = useState('');

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate inputs
    const cleanName = patientName.trim();
    if (!cleanName || cleanName.length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMsg('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (!preferredDate) {
      setErrorMsg('Please select a preferred appointment date.');
      return;
    }

    const selectedService = services.find(s => s.id === serviceId);
    const serviceName = selectedService ? selectedService.name : 'General Dental Care';

    // Book appointment
    const newApt = bookAppointment({
      patientName: cleanName,
      mobileNumber: cleanMobile,
      serviceId,
      serviceName,
      patientType,
      date: preferredDate,
      timeSlot: preferredSlot,
      notes: message.trim() || undefined,
    });

    setSubmittedRef(newApt.referenceCode);
  };

  const handleReset = () => {
    setSubmittedRef(null);
    setPatientName('');
    setMobileNumber('');
    setMessage('');
  };

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 mb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200/90 p-5 sm:p-7 md:p-8">
        
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-700" />
              <span>Quick Appointment Request</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Request a dedicated consultation slot with Dr. Akshata in seconds.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium text-teal-800">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              10 AM–2 PM · 4 PM–9 PM
            </span>
            <span>·</span>
            <span>Zero Advance Fees</span>
          </div>
        </div>

        {submittedRef ? (
          <div className="py-8 px-4 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Appointment Request Received</h3>
              <p className="text-sm text-slate-600 mt-1">
                Thank you, <span className="font-semibold text-slate-900">{patientName}</span>. Your request has been logged under reference code:
              </p>
              <div className="my-3 py-2 px-4 bg-slate-50 border border-slate-200 rounded-md inline-block font-mono text-base font-bold text-teal-800 tracking-wide">
                {submittedRef}
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-teal-800 font-medium mb-1">
                <Database className="w-3.5 h-3.5 text-teal-700" />
                <span>Saved to Clinic Schedule & Supabase Backend</span>
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Our clinic team will confirm your slot via call/WhatsApp on{' '}
                <span className="font-semibold text-slate-800">{mobileNumber}</span>. Please arrive 5–10 minutes early.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Book Another Appointment
              </button>
              <button
                onClick={() => {
                  handleReset();
                  openBookingWithPrefill();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors"
              >
                Open Full Interactive Calendar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-md">
                {errorMsg}
              </div>
            )}

            {/* Grid of Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Field 1: Patient Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kulkarni"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/70 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-900"
                  />
                </div>
              </div>

              {/* Field 2: Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit phone number"
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/70 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-900"
                  />
                </div>
              </div>

              {/* Field 3: Preferred Service */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dental Service <span className="text-rose-500">*</span>
                </label>
                <select
                  value={serviceId}
                  onChange={e => setServiceId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50/70 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-900 cursor-pointer"
                >
                  {services.map(svc => (
                    <option key={svc.id} value={svc.id}>
                      {svc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 4: Preferred Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  min={todayStr}
                  required
                  value={preferredDate}
                  onChange={e => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50/70 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-900"
                />
              </div>

            </div>

            {/* Second row: Preferred Time, Patient Type, Optional Message */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pt-1">
              
              {/* Preferred Time Slot */}
              <div className="sm:col-span-4 lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={preferredSlot}
                  onChange={e => setPreferredSlot(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50/70 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-900"
                >
                  <optgroup label="Morning Session (10:00 AM – 02:00 PM)">
                    {MORNING_SLOTS.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Evening Session (04:00 PM – 09:00 PM)">
                    {EVENING_SLOTS.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Patient Type */}
              <div className="sm:col-span-3 lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Patient Status
                </label>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="quick_patient_type"
                      checked={patientType === 'new'}
                      onChange={() => setPatientType('new')}
                      className="text-teal-700 focus:ring-teal-600"
                    />
                    <span>New</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="quick_patient_type"
                      checked={patientType === 'existing'}
                      onChange={() => setPatientType('existing')}
                      className="text-teal-700 focus:ring-teal-600"
                    />
                    <span>Existing</span>
                  </label>
                </div>
              </div>

              {/* Optional Short Message */}
              <div className="sm:col-span-5 lg:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Optional Note <span className="text-slate-400 font-normal">(e.g. sensitivity, routine checkup)</span>
                </label>
                <input
                  type="text"
                  maxLength={120}
                  placeholder="Any specific dental concern..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50/70 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-900"
                />
              </div>

              {/* CTA Submit Button */}
              <div className="sm:col-span-12 lg:col-span-3">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 active:bg-teal-950 rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-teal-200" />
                  <span>Request Appointment</span>
                </button>
              </div>

            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <span>Your contact details are strictly kept private for appointment coordination.</span>
              <button
                type="button"
                onClick={() => openBookingWithPrefill({
                  patientName,
                  mobileNumber,
                  serviceId,
                  date: preferredDate,
                  patientType,
                  notes: message,
                })}
                className="text-teal-800 hover:text-teal-950 font-semibold underline underline-offset-2"
              >
                Or select specific time slots on full calendar →
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
