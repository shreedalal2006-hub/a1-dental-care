import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  ExternalLink,
  AlertCircle,
  MapPin,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import {
  MORNING_SLOTS,
  EVENING_SLOTS,
  formatKolkataDateOnly,
  getKolkataDate,
  generateGoogleCalendarUrl,
  generateIcsBlob,
  slotToMinutes,
} from '../utils/timeZone';
import { Appointment } from '../types';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    bookingPrefill,
    services,
    clinicInfo,
    bookAppointment,
    isSlotAvailable,
  } = useClinic();

  // Step 1 to 7
  // 1: Service
  // 2: Date
  // 3: Time Slot
  // 4: Patient Details
  // 5: Review
  // 6: (Processing)
  // 7: Confirmed Result
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [patientType, setPatientType] = useState<'new' | 'existing'>('new');
  const [notes, setNotes] = useState<string>('');

  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset or apply prefill when opened
  useEffect(() => {
    if (isBookingModalOpen) {
      if (bookingPrefill) {
        if (bookingPrefill.serviceId) setSelectedServiceId(bookingPrefill.serviceId);
        if (bookingPrefill.date) setSelectedDate(bookingPrefill.date);
        if (bookingPrefill.timeSlot) setSelectedSlot(bookingPrefill.timeSlot);
        if (bookingPrefill.patientName) setPatientName(bookingPrefill.patientName);
        if (bookingPrefill.mobileNumber) setMobileNumber(bookingPrefill.mobileNumber);
        if (bookingPrefill.patientType) setPatientType(bookingPrefill.patientType);
        if (bookingPrefill.notes) setNotes(bookingPrefill.notes);

        // If service and date are prefilled, jump to step 3 (slots)
        if (bookingPrefill.serviceId && bookingPrefill.date) {
          setCurrentStep(3);
        } else if (bookingPrefill.serviceId) {
          setCurrentStep(2);
        } else {
          setCurrentStep(1);
        }
      } else {
        const today = formatKolkataDateOnly(getKolkataDate());
        setSelectedDate(today);
        setSelectedServiceId(services[0]?.id || '');
        setCurrentStep(1);
      }
      setConfirmedAppointment(null);
      setValidationError(null);
    }
  }, [isBookingModalOpen, bookingPrefill, services]);

  if (!isBookingModalOpen) return null;

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  // Helper to generate the next 14 bookable dates in IST
  const getUpcomingDates = () => {
    const list: { dateStr: string; displayDay: string; displayDate: string; isToday: boolean }[] = [];
    const base = getKolkataDate();
    const todayStr = formatKolkataDateOnly(base);

    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const str = formatKolkataDateOnly(d);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      list.push({
        dateStr: str,
        displayDay: dayName,
        displayDate: monthDay,
        isToday: str === todayStr,
      });
    }
    return list;
  };

  const upcomingDates = getUpcomingDates();

  // Validate step navigation
  const goToNextStep = () => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!selectedServiceId) {
        setValidationError('Please select a service.');
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!selectedDate) {
        setValidationError('Please choose an appointment date.');
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!selectedSlot) {
        setValidationError('Please select an available time slot.');
        return;
      }
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      const cleanName = patientName.trim();
      const cleanMobile = mobileNumber.replace(/\D/g, '');

      if (!cleanName || cleanName.length < 2) {
        setValidationError('Please enter a valid full name.');
        return;
      }
      if (cleanMobile.length < 10) {
        setValidationError('Please enter a 10-digit mobile number for appointment confirmation.');
        return;
      }
      setCurrentStep(5); // Review step
      return;
    }

    if (currentStep === 5) {
      // Confirm Booking
      handleFinalConfirm();
    }
  };

  const goToPrevStep = () => {
    setValidationError(null);
    if (currentStep > 1 && currentStep <= 5) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinalConfirm = () => {
    try {
      const newApt = bookAppointment({
        patientName: patientName.trim(),
        mobileNumber: mobileNumber.replace(/\D/g, ''),
        email: email.trim() || undefined,
        serviceId: selectedServiceId,
        serviceName: selectedService ? selectedService.name : 'General Dental Care',
        patientType,
        date: selectedDate,
        timeSlot: selectedSlot,
        notes: notes.trim() || undefined,
      });

      setConfirmedAppointment(newApt);
      setCurrentStep(7); // Confirmation screen
    } catch {
      setValidationError('Failed to schedule appointment. Please try again or call the clinic directly.');
    }
  };

  const handleDownloadIcs = () => {
    if (!confirmedAppointment) return;
    const blob = generateIcsBlob({
      referenceCode: confirmedAppointment.referenceCode,
      patientName: confirmedAppointment.patientName,
      serviceName: confirmedAppointment.serviceName,
      date: confirmedAppointment.date,
      timeSlot: confirmedAppointment.timeSlot,
      address: `${clinicInfo.addressLine1}, ${clinicInfo.addressLine2}, ${clinicInfo.city}`,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `A1_Dental_Care_${confirmedAppointment.referenceCode}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getWhatsAppBookingShareUrl = (apt: Appointment) => {
    const text = encodeURIComponent(
      `Hello A1 Dental Care! I have booked an appointment.\n\n` +
      `*Ref Code:* ${apt.referenceCode}\n` +
      `*Patient:* ${apt.patientName}\n` +
      `*Phone:* ${apt.mobileNumber}\n` +
      `*Service:* ${apt.serviceName}\n` +
      `*Date:* ${apt.date}\n` +
      `*Time:* ${apt.timeSlot}\n\n` +
      `Looking forward to visiting Dr. Akshata in Piranwadi!`
    );
    return `https://wa.me/916366925940?text=${text}`;
  };

  // Helper to check if a slot is in the past for today's date
  const isPastSlot = (slot: string, date: string) => {
    const ist = getKolkataDate();
    const todayStr = formatKolkataDateOnly(ist);
    if (date !== todayStr) return false;
    const currentMins = ist.getHours() * 60 + ist.getMinutes();
    const slotMins = slotToMinutes(slot);
    return slotMins <= currentMins + 15; // 15 min buffer
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="bg-[#FAFAF8] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">A1 DENTAL CARE</span>
              <span className="text-sm">🦷</span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-semibold text-teal-800">Appointment System</span>
            </div>
            <p className="text-xs text-slate-500">
              Dr. Akshata · 2nd Floor, Jamboti Road, Piranwadi
            </p>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Step Progress Indicator (Steps 1 to 5) */}
        {currentStep <= 5 && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className={currentStep >= 1 ? 'text-teal-900 font-bold' : ''}>1. Service</span>
              <span className="text-slate-300">/</span>
              <span className={currentStep >= 2 ? 'text-teal-900 font-bold' : ''}>2. Date</span>
              <span className="text-slate-300">/</span>
              <span className={currentStep >= 3 ? 'text-teal-900 font-bold' : ''}>3. Time Slot</span>
              <span className="text-slate-300">/</span>
              <span className={currentStep >= 4 ? 'text-teal-900 font-bold' : ''}>4. Your Details</span>
              <span className="text-slate-300">/</span>
              <span className={currentStep >= 5 ? 'text-teal-900 font-bold' : ''}>5. Review</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {validationError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: Select Service */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 1: Select Dental Service</h3>
                <p className="text-xs text-slate-500">
                  Select the care or consultation needed with Dr. Akshata.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {services.map(svc => {
                  const isSelected = selectedServiceId === svc.id;
                  return (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedServiceId(svc.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-700 bg-teal-50/70 shadow-xs ring-1 ring-teal-700'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-bold text-slate-900">{svc.name}</h4>
                        <span className="text-[10px] font-mono font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {svc.durationMinutes}m
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{svc.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Select Date */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 2: Choose Appointment Date</h3>
                <p className="text-xs text-slate-500">
                  Clinic is open all 7 days (Monday through Sunday) in Asia/Kolkata timezone.
                </p>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select from upcoming dates:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {upcomingDates.map(item => {
                    const isSelected = selectedDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        onClick={() => setSelectedDate(item.dateStr)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-800 text-white border-teal-800 shadow-sm'
                            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        <span className={`block text-[11px] font-medium ${isSelected ? 'text-teal-200' : 'text-slate-500'}`}>
                          {item.displayDay}
                        </span>
                        <span className="block text-sm font-bold mt-0.5">
                          {item.displayDate}
                        </span>
                        {item.isToday && (
                          <span className={`block text-[9px] font-bold mt-0.5 ${isSelected ? 'text-teal-100' : 'text-teal-800'}`}>
                            Today
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Or pick a custom date:
                </label>
                <input
                  type="date"
                  min={formatKolkataDateOnly(getKolkataDate())}
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Display Available Time Slots */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 3: Select Time Slot</h3>
                <p className="text-xs text-slate-500">
                  Showing available consultation slots for <span className="font-semibold text-slate-800">{selectedDate}</span>.
                </p>
              </div>

              {/* Morning Session */}
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-700" />
                    Morning Session (10:00 AM – 02:00 PM)
                  </span>
                  <span className="text-[11px] text-slate-400">30 min intervals</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MORNING_SLOTS.map(slot => {
                    const available = isSlotAvailable(selectedDate, slot);
                    const past = isPastSlot(slot, selectedDate);
                    const canSelect = available && !past;
                    const isSelected = selectedSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={!canSelect}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                          isSelected
                            ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                            : canSelect
                            ? 'bg-white hover:bg-teal-50/70 border-slate-200 text-slate-800 cursor-pointer'
                            : 'bg-slate-100/80 border-slate-200/60 text-slate-400 cursor-not-allowed line-through'
                        }`}
                      >
                        {slot}
                        {!canSelect && (
                          <span className="block text-[9px] font-normal no-underline">
                            {past ? 'Past' : 'Booked'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Break Warning as per prompt rule: 2:00 PM - 4:00 PM */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Clinic Break (2:00 PM – 4:00 PM):</strong> Dr. Akshata does not conduct consultations during afternoon sterilization.
                </span>
              </div>

              {/* Evening Session */}
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-700" />
                    Evening Session (04:00 PM – 09:00 PM)
                  </span>
                  <span className="text-[11px] text-slate-400">30 min intervals</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EVENING_SLOTS.map(slot => {
                    const available = isSlotAvailable(selectedDate, slot);
                    const past = isPastSlot(slot, selectedDate);
                    const canSelect = available && !past;
                    const isSelected = selectedSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={!canSelect}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                          isSelected
                            ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                            : canSelect
                            ? 'bg-white hover:bg-teal-50/70 border-slate-200 text-slate-800 cursor-pointer'
                            : 'bg-slate-100/80 border-slate-200/60 text-slate-400 cursor-not-allowed line-through'
                        }`}
                      >
                        {slot}
                        {!canSelect && (
                          <span className="block text-[9px] font-normal no-underline">
                            {past ? 'Past' : 'Booked'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Patient Details */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 4: Patient Details</h3>
                <p className="text-xs text-slate-500">
                  We only collect essential information required to coordinate your appointment.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kulkarni"
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/60 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>
                </div>

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
                      placeholder="10-digit mobile number"
                      value={mobileNumber}
                      onChange={e => setMobileNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/60 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    We will send your booking confirmation and reminders to this number.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/60 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Are you a new or existing patient at A1 Dental Care?
                  </label>
                  <div className="flex items-center gap-6 text-xs font-medium text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="patientTypeModal"
                        checked={patientType === 'new'}
                        onChange={() => setPatientType('new')}
                        className="text-teal-700 focus:ring-teal-600"
                      />
                      <span>First-time Patient</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="patientTypeModal"
                        checked={patientType === 'existing'}
                        onChange={() => setPatientType('existing')}
                        className="text-teal-700 focus:ring-teal-600"
                      />
                      <span>Existing / Returning Patient</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Optional Short Note / Reason for Visit
                  </label>
                  <textarea
                    rows={2}
                    maxLength={150}
                    placeholder="e.g. Mild pain in lower jaw, routine cleaning, or sensitivity"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50/60 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review Appointment */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 5: Review Appointment Details</h3>
                <p className="text-xs text-slate-500">
                  Please confirm the details below before booking.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/90 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-500">Service:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedService?.name}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-500">Attending Surgeon:</span>
                  <span className="font-bold text-teal-800">Dr. Akshata (Dental Surgeon)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-500">Appointment Date:</span>
                  <span className="font-bold text-slate-900">{selectedDate}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-500">Time Slot:</span>
                  <span className="font-bold text-teal-800 text-sm">{selectedSlot}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-500">Patient Name:</span>
                  <span className="font-bold text-slate-900">{patientName} ({patientType})</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-500">Mobile Number:</span>
                  <span className="font-bold text-slate-900">{mobileNumber}</span>
                </div>
                {email && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-500">Email:</span>
                    <span className="text-slate-800">{email}</span>
                  </div>
                )}
                {notes && (
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-slate-500">Note:</span>
                    <span className="text-slate-700 italic max-w-[280px] text-right">{notes}</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Clinic Policy:</strong> No advance booking fees are required. You can reschedule or cancel at any time.
                </span>
              </div>
            </div>
          )}

          {/* STEP 7: Confirmation Screen */}
          {currentStep === 7 && confirmedAppointment && (
            <div className="py-4 space-y-6">
              
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Appointment Confirmed!
                </h3>
                <p className="text-sm text-slate-600">
                  Your appointment request has been successfully registered with A1 Dental Care.
                </p>
                <div className="inline-block py-1.5 px-4 bg-slate-100 border border-slate-300 rounded-md font-mono text-sm font-bold text-teal-900 mt-2">
                  Booking Reference: {confirmedAppointment.referenceCode}
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-teal-800 font-medium pt-1">
                  <Database className="w-3.5 h-3.5 text-teal-700" />
                  <span>Saved to Clinic Schedule & Supabase Database</span>
                </div>
              </div>

              {/* Summary Details Card */}
              <div className="bg-[#FAFAF8] rounded-xl p-5 border border-slate-200 text-xs space-y-2.5">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Doctor:</span>
                  <span className="font-bold text-slate-900">Dr. Akshata (Dental Surgeon)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-semibold text-slate-900">{confirmedAppointment.serviceName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Scheduled Date & Time:</span>
                  <span className="font-bold text-teal-900 text-sm">
                    {confirmedAppointment.date} · {confirmedAppointment.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-semibold text-slate-800">{confirmedAppointment.patientName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Clinic Address:</span>
                  <span className="font-medium text-slate-800 text-right max-w-[280px]">
                    2nd Floor, 331 Jamboti Road, Opp. Raghavendra Hotel, Piranwadi, Belagavi
                  </span>
                </div>
              </div>

              {/* Action Buttons: Google Calendar, .ICS download, WhatsApp notification */}
              <div className="space-y-3 pt-1">
                <p className="text-xs font-bold text-slate-700">Add to your calendar or notify clinic:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Google Calendar Link */}
                  <a
                    href={generateGoogleCalendarUrl({
                      referenceCode: confirmedAppointment.referenceCode,
                      patientName: confirmedAppointment.patientName,
                      serviceName: confirmedAppointment.serviceName,
                      date: confirmedAppointment.date,
                      timeSlot: confirmedAppointment.timeSlot,
                      address: `${clinicInfo.addressLine1}, ${clinicInfo.addressLine2}, ${clinicInfo.city}`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-teal-700" />
                    <span>Google Calendar</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  {/* ICS Download */}
                  <button
                    onClick={handleDownloadIcs}
                    className="p-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-700" />
                    <span>Download .ICS</span>
                  </button>

                  {/* WhatsApp Pre-fill */}
                  <a
                    href={getWhatsAppBookingShareUrl(confirmedAppointment)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Send to WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center">
                <button
                  onClick={closeBookingModal}
                  className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Close & Return to Website
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls (Steps 1 to 5) */}
        {currentStep <= 5 && (
          <div className="bg-[#FAFAF8] px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-md transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToNextStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 active:bg-teal-950 rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 cursor-pointer"
              >
                <span>{currentStep === 5 ? 'Confirm & Book Appointment' : 'Next Step'}</span>
                {currentStep < 5 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
