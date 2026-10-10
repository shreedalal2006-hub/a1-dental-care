import React, { useState } from 'react';
import {
  X,
  Lock,
  Calendar,
  Clock,
  User,
  Phone,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Download,
  Shield,
  MessageSquare,
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Database,
  Server,
  Copy,
  ExternalLink,
  Eye,
  Maximize2,
  Minimize2,
  Mail,
  Save,
  AlertCircle,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { Appointment, ServiceItem, FAQItem } from '../types';
import {
  formatKolkataDateOnly,
  getKolkataDate,
  MORNING_SLOTS,
  EVENING_SLOTS,
  ALL_TIME_SLOTS,
} from '../utils/timeZone';
import { SUPABASE_SQL_SCHEMA, SUPABASE_PROJECT_ID, SUPABASE_URL } from '../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    appointments,
    services,
    blockedSlots,
    clinicInfo,
    faqs,
    gallery,
    supabaseStatus,
    isFetchingDatabase,
    lastSyncedAt,
    refreshSupabaseConnection,
    syncAllToSupabase,
    updateAppointmentStatus,
    editAppointment,
    deleteAppointment,
    rescheduleAppointment,
    cancelAppointment,
    addManualAppointment,
    blockDateOrSlot,
    unblockSlot,
    updateClinicInfo,
    updateService,
    addService,
    deleteService,
    updateFAQ,
    addFAQ,
    deleteFAQ,
  } = useClinic();

  // Authentication state
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab: 'overview' | 'appointments' | 'calendar' | 'availability' | 'content' | 'manual' | 'supabase'
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'calendar' | 'availability' | 'content' | 'manual' | 'supabase'>('overview');

  // Supabase UI state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'upcoming' | 'past'>('all');
  const [isMaximized, setIsMaximized] = useState(false);

  // View Details Modal State
  const [viewApt, setViewApt] = useState<Appointment | null>(null);

  // Edit Appointment Modal State
  const [editApt, setEditApt] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState<{
    patientName: string;
    mobileNumber: string;
    email: string;
    serviceId: string;
    date: string;
    timeSlot: string;
    patientType: 'new' | 'existing';
    status: Appointment['status'];
    notes: string;
    clinicNotes: string;
  }>({
    patientName: '',
    mobileNumber: '',
    email: '',
    serviceId: '',
    date: '',
    timeSlot: '',
    patientType: 'new',
    status: 'Pending',
    notes: '',
    clinicNotes: '',
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editFeedback, setEditFeedback] = useState<string | null>(null);

  // Cancel with Reason Modal State
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState('');

  // Delete Confirm State
  const [deleteConfirmApt, setDeleteConfirmApt] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reschedule Modal State
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [newRescheduleSlot, setNewRescheduleSlot] = useState(MORNING_SLOTS[0]);

  // Notes Modal State
  const [notesApt, setNotesApt] = useState<Appointment | null>(null);
  const [clinicNotesInput, setClinicNotesInput] = useState('');

  // Manual Booking Form State
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualServiceId, setManualServiceId] = useState(services[0]?.id || '');
  const [manualDate, setManualDate] = useState(formatKolkataDateOnly(getKolkataDate()));
  const [manualSlot, setManualSlot] = useState(MORNING_SLOTS[0]);
  const [manualType, setManualType] = useState<'new' | 'existing'>('new');
  const [manualNotes, setManualNotes] = useState('');
  const [manualSuccessMsg, setManualSuccessMsg] = useState('');

  // Availability state
  const [blockDate, setBlockDate] = useState(formatKolkataDateOnly(getKolkataDate()));
  const [blockSlot, setBlockSlot] = useState('');
  const [blockReason, setBlockReason] = useState('Clinic Holiday / Special Leave');

  // Content edit states
  const [bioInput, setBioInput] = useState(clinicInfo.doctorBio);
  const [bioSaved, setBioSaved] = useState(false);

  // New Service State
  const [newSvcName, setNewSvcName] = useState('');
  const [newSvcDesc, setNewSvcDesc] = useState('');
  const [newSvcDuration, setNewSvcDuration] = useState(30);
  const [newSvcCategory, setNewSvcCategory] = useState('General');

  // Calendar View mode
  const [calendarViewMode, setCalendarViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(formatKolkataDateOnly(getKolkataDate()));

  if (!isAdminOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: a1care or 1234
    if (pinInput.trim() === 'a1care' || pinInput.trim() === '1234') {
      setIsAdminAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect PIN. (Default clinic PIN: a1care)');
    }
  };

  const handleDemoUnlock = () => {
    setIsAdminAuthenticated(true);
    setAuthError('');
  };

  const todayStr = formatKolkataDateOnly(getKolkataDate());

  // Statistics
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const pendingRequests = appointments.filter(a => a.status === 'Pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'Confirmed');
  const completedAppointments = appointments.filter(a => a.status === 'Completed');
  const cancelledAppointments = appointments.filter(a => a.status === 'Cancelled');

  // Filtered Appointments List
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.mobileNumber.includes(searchTerm) ||
      apt.referenceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.notes && apt.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' ? true : apt.status === statusFilter;

    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      if (dateFilter === 'today') return apt.date === todayStr;
      if (dateFilter === 'tomorrow') {
        const tomorrow = new Date(getKolkataDate());
        tomorrow.setDate(tomorrow.getDate() + 1);
        return apt.date === formatKolkataDateOnly(tomorrow);
      }
      if (dateFilter === 'upcoming') return apt.date >= todayStr;
      if (dateFilter === 'past') return apt.date < todayStr;
      return true;
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleOpenEdit = (apt: Appointment) => {
    setEditApt(apt);
    setEditForm({
      patientName: apt.patientName,
      mobileNumber: apt.mobileNumber,
      email: apt.email || '',
      serviceId: apt.serviceId,
      date: apt.date,
      timeSlot: apt.timeSlot,
      patientType: apt.patientType,
      status: apt.status,
      notes: apt.notes || '',
      clinicNotes: apt.clinicNotes || '',
    });
    setEditFeedback(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editApt) return;
    setEditSaving(true);
    setEditFeedback(null);

    const chosenService = services.find(s => s.id === editForm.serviceId);
    const serviceName = chosenService ? chosenService.name : editApt.serviceName;

    await editAppointment(editApt.id, {
      patientName: editForm.patientName.trim(),
      mobileNumber: editForm.mobileNumber.replace(/\D/g, ''),
      email: editForm.email.trim() || undefined,
      serviceId: editForm.serviceId,
      serviceName,
      date: editForm.date,
      timeSlot: editForm.timeSlot,
      patientType: editForm.patientType,
      status: editForm.status,
      notes: editForm.notes.trim() || undefined,
      clinicNotes: editForm.clinicNotes.trim() || undefined,
    });

    setEditSaving(false);
    setEditFeedback('Updated successfully in Supabase database!');
    setTimeout(() => {
      setEditFeedback(null);
      setEditApt(null);
    }, 1200);
  };

  const handleOpenCancel = (apt: Appointment) => {
    setCancelModalApt(apt);
    setCancelReasonInput('');
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalApt) return;
    await cancelAppointment(cancelModalApt.id, cancelReasonInput.trim() || undefined);
    setCancelModalApt(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmApt) return;
    setIsDeleting(true);
    await deleteAppointment(deleteConfirmApt.id);
    setIsDeleting(false);
    setDeleteConfirmApt(null);
  };

  const handleSaveBio = () => {
    updateClinicInfo({ doctorBio: bioInput });
    setBioSaved(true);
    setTimeout(() => setBioSaved(false), 2500);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSvcName.trim()) return;
    addService({
      name: newSvcName.trim(),
      description: newSvcDesc.trim() || 'Custom dental treatment tailored to individual clinical requirements.',
      durationMinutes: newSvcDuration,
      category: newSvcCategory.trim() || 'General Care',
    });
    setNewSvcName('');
    setNewSvcDesc('');
  };

  const handleAddManualAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || manualPhone.replace(/\D/g, '').length < 10) {
      alert('Please provide patient name and a valid 10-digit phone number.');
      return;
    }
    const chosenService = services.find(s => s.id === manualServiceId) || services[0];
    const newApt = addManualAppointment({
      patientName: manualName.trim(),
      mobileNumber: manualPhone.replace(/\D/g, ''),
      serviceId: manualServiceId,
      serviceName: chosenService ? chosenService.name : 'General Dental Care',
      patientType: manualType,
      date: manualDate,
      timeSlot: manualSlot,
      notes: manualNotes.trim() || undefined,
      status: 'Confirmed',
      clinicNotes: 'Direct booking added by clinic reception staff.',
    });

    setManualSuccessMsg(`Appointment booked: ${newApt.referenceCode} for ${newApt.patientName}`);
    setManualName('');
    setManualPhone('');
    setManualNotes('');
    setTimeout(() => setManualSuccessMsg(''), 4000);
  };

  const handleExportCSV = () => {
    const headers = ['Ref Code', 'Patient Name', 'Mobile', 'Email', 'Service', 'Date', 'Time Slot', 'Type', 'Status', 'Notes', 'Clinic Notes'];
    const rows = appointments.map(a => [
      a.referenceCode,
      `"${a.patientName.replace(/"/g, '""')}"`,
      a.mobileNumber,
      a.email || '',
      `"${a.serviceName.replace(/"/g, '""')}"`,
      a.date,
      a.timeSlot,
      a.patientType,
      a.status,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
      `"${(a.clinicNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `A1_Dental_Care_Appointments_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendWhatsAppReminder = (apt: Appointment) => {
    const text = encodeURIComponent(
      `Hello ${apt.patientName},\n\n` +
      `This is a reminder regarding your appointment with Dr. Akshata at A1 Dental Care, Belagavi.\n\n` +
      `*Reference:* ${apt.referenceCode}\n` +
      `*Service:* ${apt.serviceName}\n` +
      `*Date:* ${apt.date}\n` +
      `*Time:* ${apt.timeSlot}\n` +
      `*Location:* 2nd Floor, 331 Jamboti Road, Opp. Raghavendra Hotel, Piranwadi\n\n` +
      `Please reply YES to confirm or let us know if you need to reschedule. Thank you!`
    );
    window.open(`https://wa.me/91${apt.mobileNumber}?text=${text}`, '_blank');
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isMaximized ? 'p-0' : 'p-2 sm:p-4'} bg-slate-950/80 backdrop-blur-xs overflow-y-auto`}>
      <div className={`relative w-full ${isMaximized ? 'h-full max-w-none rounded-none' : 'max-w-6xl max-h-[94vh] rounded-2xl my-3'} bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all`}>
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center font-bold text-white text-xs">
              A1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">A1 Dental Care — Admin Panel</h3>
                <span className="text-[11px] bg-teal-900/80 text-teal-200 px-2 py-0.5 rounded border border-teal-700">
                  Dr. Akshata · Dental Surgeon
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Database className="w-3 h-3" />
                  <span>Supabase: {SUPABASE_PROJECT_ID}</span>
                </span>
                <span>·</span>
                <span>Piranwadi, Belagavi</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <>
                {/* Real-time Fetch from Database button */}
                <button
                  onClick={async () => {
                    await refreshSupabaseConnection();
                  }}
                  disabled={isFetchingDatabase}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                  title="Retrieve and refresh latest bookings from Supabase database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isFetchingDatabase ? 'animate-spin' : ''}`} />
                  <span>{isFetchingDatabase ? 'Fetching...' : 'Fetch from DB'}</span>
                  {lastSyncedAt && (
                    <span className="hidden md:inline text-[10px] text-slate-400 font-mono ml-1">
                      ({lastSyncedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors hidden sm:inline-flex"
                  title={isMaximized ? 'Restore View' : 'Maximize Window'}
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsAdminAuthenticated(false)}
                  className="px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                >
                  Lock
                </button>
              </>
            )}

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              aria-label="Close admin dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-5">
            <div className="w-14 h-14 bg-teal-50 text-teal-800 rounded-full flex items-center justify-center mx-auto border border-teal-100">
              <Shield className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900">Clinic Administration Login</h4>
              <p className="text-xs text-slate-500 mt-1">
                Enter your staff passkey to manage bookings, schedule slots, and practice content.
              </p>
            </div>

            {authError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter clinic PIN (default: a1care)"
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors"
              >
                Access Clinic Portal
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Default clinic key: <strong>a1care</strong></span>
              <button
                type="button"
                onClick={handleDemoUnlock}
                className="text-teal-800 font-semibold hover:underline"
              >
                Quick Demo Unlock →
              </button>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD INTERFACE */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Admin Tabs */}
            <div className="bg-slate-100/80 px-6 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-600">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-teal-800 text-teal-900 font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                Dashboard Overview
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'appointments'
                    ? 'border-teal-800 text-teal-900 font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <span>All Appointments</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                  {appointments.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'calendar'
                    ? 'border-teal-800 text-teal-900 font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                Calendar Schedule
              </button>

              <button
                onClick={() => setActiveTab('manual')}
                className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'manual'
                    ? 'border-teal-800 text-teal-900 font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Booking (Walk-in/Phone)</span>
              </button>

              <button
                onClick={() => setActiveTab('availability')}
                className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'availability'
                    ? 'border-teal-800 text-teal-900 font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                Block Slots / Holidays
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'content'
                    ? 'border-teal-800 text-teal-900 font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                Content & Services
              </button>

              <button
                onClick={() => setActiveTab('supabase')}
                className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'supabase'
                    ? 'border-teal-800 text-teal-900 font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Backend</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    supabaseStatus.tableExists
                      ? 'bg-emerald-500'
                      : supabaseStatus.connected
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  title={
                    supabaseStatus.tableExists
                      ? 'Supabase Connected & Table Active'
                      : 'Supabase Connected · Setup Needed'
                  }
                />
              </button>
            </div>

            {/* Tab Contents Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#FAFAF8]">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">

                  {/* Supabase Connection Status Banner */}
                  <div
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      supabaseStatus.tableExists
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/70 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          supabaseStatus.tableExists ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 font-bold">
                          <span>Supabase Backend: {SUPABASE_PROJECT_ID}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide font-extrabold ${
                              supabaseStatus.tableExists
                                ? 'bg-emerald-200 text-emerald-900'
                                : 'bg-amber-200 text-amber-900'
                            }`}
                          >
                            {supabaseStatus.tableExists ? 'Live & Auto-Syncing' : 'Connected · Table Setup Needed'}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-80 mt-0.5">
                          {supabaseStatus.tableExists
                            ? 'Appointments submitted on the website are automatically saved directly into your Supabase database.'
                            : 'Connected to Supabase! To save new appointments directly in PostgreSQL, run the SQL schema in your Supabase SQL editor.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                      <button
                        onClick={() => setActiveTab('supabase')}
                        className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors shadow-2xs ${
                          supabaseStatus.tableExists
                            ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                            : 'bg-amber-700 text-white hover:bg-amber-800'
                        }`}
                      >
                        {supabaseStatus.tableExists ? 'Manage Database' : 'View SQL Schema →'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Top Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <p className="text-xs text-slate-500 font-medium">Today's Patients</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{todayAppointments.length}</p>
                      <p className="text-[11px] text-teal-800 font-semibold mt-0.5">Date: {todayStr}</p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <p className="text-xs text-slate-500 font-medium">Pending Requests</p>
                      <p className="text-2xl font-bold text-amber-600 mt-1 font-mono">{pendingRequests.length}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Requires confirmation</p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <p className="text-xs text-slate-500 font-medium">Confirmed</p>
                      <p className="text-2xl font-bold text-emerald-700 mt-1 font-mono">{confirmedAppointments.length}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Ready for treatment</p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <p className="text-xs text-slate-500 font-medium">Total Appointments</p>
                      <p className="text-2xl font-bold text-slate-800 mt-1 font-mono">{appointments.length}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">In database</p>
                    </div>
                  </div>

                  {/* Today's Appointments Schedule */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-700" />
                          <span>Today's Consultation Schedule ({todayStr})</span>
                        </h4>
                        <p className="text-xs text-slate-500">
                          10:00 AM–2:00 PM & 4:00 PM–9:00 PM sessions
                        </p>
                      </div>

                      <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>

                    {todayAppointments.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">
                        No appointments currently scheduled for today. New requests will appear here automatically.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                              <th className="pb-2">Time Slot</th>
                              <th className="pb-2">Patient</th>
                              <th className="pb-2">Contact</th>
                              <th className="pb-2">Service</th>
                              <th className="pb-2">Status</th>
                              <th className="pb-2 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {todayAppointments.map(apt => (
                              <tr key={apt.id} className="hover:bg-slate-50">
                                <td className="py-2.5 font-bold font-mono text-teal-900">{apt.timeSlot}</td>
                                <td className="py-2.5 font-semibold text-slate-900">
                                  {apt.patientName}
                                  <span className="block text-[10px] text-slate-400 font-mono">{apt.referenceCode}</span>
                                </td>
                                <td className="py-2.5 text-slate-600">{apt.mobileNumber}</td>
                                <td className="py-2.5 text-slate-700">{apt.serviceName}</td>
                                <td className="py-2.5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    apt.status === 'Confirmed'
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : apt.status === 'Pending'
                                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                      : apt.status === 'Completed'
                                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {apt.status}
                                  </span>
                                </td>
                                <td className="py-2.5 text-right space-x-1 whitespace-nowrap">
                                  {/* View Details */}
                                  <button
                                    onClick={() => setViewApt(apt)}
                                    className="p-1 text-slate-600 hover:text-teal-900 hover:bg-slate-100 rounded"
                                    title="View Full Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* Edit Booking */}
                                  <button
                                    onClick={() => handleOpenEdit(apt)}
                                    className="p-1 text-slate-700 hover:text-teal-900 hover:bg-slate-100 rounded"
                                    title="Edit Appointment"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>

                                  {/* Confirm Button */}
                                  {apt.status === 'Pending' && (
                                    <button
                                      onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                                      className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                                      title="Confirm"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}

                                  {/* WhatsApp Reminder */}
                                  <button
                                    onClick={() => sendWhatsAppReminder(apt)}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                    title="WhatsApp Reminder"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </button>

                                  {/* Mark Completed */}
                                  {apt.status !== 'Completed' && (
                                    <button
                                      onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                                      className="p-1 text-blue-700 hover:bg-blue-50 rounded"
                                      title="Mark Completed"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                  )}

                                  {/* Cancel Appointment */}
                                  {apt.status !== 'Cancelled' && (
                                    <button
                                      onClick={() => handleOpenCancel(apt)}
                                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                      title="Cancel Appointment"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ALL APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  
                  {/* Search and Filters Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search by name, phone, code..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500 font-medium">Status:</span>
                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800"
                      >
                        <option value="All">All Statuses ({appointments.length})</option>
                        <option value="Pending">Pending ({pendingRequests.length})</option>
                        <option value="Confirmed">Confirmed ({confirmedAppointments.length})</option>
                        <option value="Completed">Completed ({completedAppointments.length})</option>
                        <option value="Cancelled">Cancelled ({cancelledAppointments.length})</option>
                        <option value="No-show">No-show</option>
                      </select>

                      <button
                        onClick={handleExportCSV}
                        className="ml-auto sm:ml-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>

                  </div>

                  {/* Appointments Table */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-3">Ref ID</th>
                            <th className="p-3">Patient Name</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Service</th>
                            <th className="p-3">Date & Slot</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Notes</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredAppointments.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-6 text-center text-slate-500">
                                No appointments found matching your search criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredAppointments.map(apt => (
                              <tr key={apt.id} className="hover:bg-slate-50/80">
                                <td className="p-3 font-mono font-bold text-teal-900">{apt.referenceCode}</td>
                                <td className="p-3">
                                  <div className="font-semibold text-slate-900">{apt.patientName}</div>
                                  <span className="text-[10px] text-slate-400 capitalize">{apt.patientType} patient</span>
                                </td>
                                <td className="p-3">
                                  <div>{apt.mobileNumber}</div>
                                  {apt.email && <div className="text-[10px] text-slate-400">{apt.email}</div>}
                                </td>
                                <td className="p-3 font-medium text-slate-700">{apt.serviceName}</td>
                                <td className="p-3">
                                  <div className="font-semibold">{apt.date}</div>
                                  <div className="text-teal-800 font-mono">{apt.timeSlot}</div>
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    apt.status === 'Confirmed'
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : apt.status === 'Pending'
                                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                      : apt.status === 'Completed'
                                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                      : apt.status === 'Cancelled'
                                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {apt.status}
                                  </span>
                                </td>
                                <td className="p-3 max-w-[160px]">
                                  {apt.notes && (
                                    <p className="text-[11px] text-slate-600 truncate" title={apt.notes}>
                                      Patient: {apt.notes}
                                    </p>
                                  )}
                                  {apt.clinicNotes && (
                                    <p className="text-[10px] text-teal-900 font-medium truncate" title={apt.clinicNotes}>
                                      Clinic: {apt.clinicNotes}
                                    </p>
                                  )}
                                </td>
                                <td className="p-3 text-right space-x-1 whitespace-nowrap">
                                  {/* View Details Button */}
                                  <button
                                    onClick={() => setViewApt(apt)}
                                    className="p-1.5 text-slate-600 hover:text-teal-900 hover:bg-slate-100 rounded transition-colors"
                                    title="View Full Booking Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* Edit Booking Button */}
                                  <button
                                    onClick={() => handleOpenEdit(apt)}
                                    className="p-1.5 text-slate-700 hover:text-teal-900 hover:bg-slate-100 rounded transition-colors"
                                    title="Edit Patient & Appointment Details"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>

                                  {/* Confirm Button */}
                                  {apt.status === 'Pending' && (
                                    <button
                                      onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                                      className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                                      title="Confirm Booking"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}

                                  {/* Reschedule Button */}
                                  <button
                                    onClick={() => {
                                      setRescheduleApt(apt);
                                      setNewRescheduleDate(apt.date);
                                      setNewRescheduleSlot(apt.timeSlot);
                                    }}
                                    className="p-1.5 text-teal-800 hover:bg-teal-50 rounded transition-colors"
                                    title="Reschedule Appointment"
                                  >
                                    <Calendar className="w-4 h-4" />
                                  </button>

                                  {/* WhatsApp Reminder */}
                                  <button
                                    onClick={() => sendWhatsAppReminder(apt)}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                    title="Send WhatsApp Reminder"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </button>

                                  {/* Clinic Notes Button */}
                                  <button
                                    onClick={() => {
                                      setNotesApt(apt);
                                      setClinicNotesInput(apt.clinicNotes || '');
                                    }}
                                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                    title="Add/Edit Clinic Notes"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </button>

                                  {/* Mark Completed */}
                                  {apt.status !== 'Completed' && (
                                    <button
                                      onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                                      className="p-1.5 text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                      title="Mark Completed"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                  )}

                                  {/* Cancel Appointment */}
                                  {apt.status !== 'Cancelled' && (
                                    <button
                                      onClick={() => handleOpenCancel(apt)}
                                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                      title="Cancel Appointment"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  )}

                                  {/* Delete Record */}
                                  <button
                                    onClick={() => setDeleteConfirmApt(apt)}
                                    className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                                    title="Delete from Database"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: CALENDAR VIEW (Day, Week, Month) */}
              {activeTab === 'calendar' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-800" />
                      <h4 className="text-sm font-bold text-slate-900">Clinic Calendar View</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                        <button
                          onClick={() => setCalendarViewMode('day')}
                          className={`px-3 py-1 rounded-md transition-colors ${
                            calendarViewMode === 'day' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                          }`}
                        >
                          Day
                        </button>
                        <button
                          onClick={() => setCalendarViewMode('week')}
                          className={`px-3 py-1 rounded-md transition-colors ${
                            calendarViewMode === 'week' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                          }`}
                        >
                          Week
                        </button>
                        <button
                          onClick={() => setCalendarViewMode('month')}
                          className={`px-3 py-1 rounded-md transition-colors ${
                            calendarViewMode === 'month' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                          }`}
                        >
                          Month
                        </button>
                      </div>

                      <input
                        type="date"
                        value={selectedCalendarDate}
                        onChange={e => setSelectedCalendarDate(e.target.value)}
                        className="px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white"
                      />
                    </div>
                  </div>

                  {/* Day View Timeline */}
                  {calendarViewMode === 'day' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                      <p className="text-xs font-semibold text-slate-500">
                        Schedule for: <span className="text-slate-900 font-bold">{selectedCalendarDate}</span>
                      </p>

                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                        {ALL_TIME_SLOTS.map(slot => {
                          const slotApts = appointments.filter(
                            a => a.date === selectedCalendarDate && a.timeSlot === slot && a.status !== 'Cancelled'
                          );
                          const isBlocked = blockedSlots.some(b => b.date === selectedCalendarDate && (b.timeSlot === slot || !b.timeSlot));

                          return (
                            <div key={slot} className="p-3 flex items-start gap-4 hover:bg-slate-50/60">
                              <span className="w-20 font-mono text-xs font-bold text-slate-700 mt-1">
                                {slot}
                              </span>

                              <div className="flex-1">
                                {isBlocked ? (
                                  <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-800 text-xs font-medium">
                                    Slot Blocked by Clinic
                                  </div>
                                ) : slotApts.length > 0 ? (
                                  <div className="space-y-1.5">
                                    {slotApts.map(apt => (
                                      <div
                                        key={apt.id}
                                        className="p-2.5 rounded-lg bg-teal-50/80 border border-teal-200 flex items-center justify-between"
                                      >
                                        <div>
                                          <p className="text-xs font-bold text-teal-950">
                                            {apt.patientName} ({apt.serviceName})
                                          </p>
                                          <p className="text-[11px] text-teal-800">
                                            Ph: {apt.mobileNumber} · Ref: {apt.referenceCode} · Status: {apt.status}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => sendWhatsAppReminder(apt)}
                                          className="px-2 py-1 bg-white text-emerald-800 border border-emerald-200 rounded text-[11px] font-semibold flex items-center gap-1"
                                        >
                                          <MessageSquare className="w-3 h-3" />
                                          WhatsApp
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400 italic">Available slot</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Week / Month View Summary */}
                  {(calendarViewMode === 'week' || calendarViewMode === 'month') && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 text-center space-y-3">
                      <Calendar className="w-8 h-8 text-teal-700 mx-auto" />
                      <h4 className="text-sm font-bold text-slate-900">
                        {calendarViewMode === 'week' ? '7-Day Rolling Roster' : 'Monthly Overview'}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Showing total booked appointments across the selected period. Total active appointments: {appointments.filter(a => a.status !== 'Cancelled').length}.
                      </p>
                      <div className="pt-2 flex justify-center gap-2">
                        <button
                          onClick={() => setCalendarViewMode('day')}
                          className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-md"
                        >
                          Switch to Detailed Day Slot View
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: MANUAL BOOKING (Walk-ins & Phone Requests) */}
              {activeTab === 'manual' && (
                <div className="max-w-2xl bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-teal-700" />
                      <span>Create Manual Appointment</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Quickly register walk-in patients or telephone callers directly into the schedule.
                    </p>
                  </div>

                  {manualSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-md">
                      {manualSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleAddManualAppointment} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Patient Name *</label>
                        <input
                          type="text"
                          required
                          value={manualName}
                          onChange={e => setManualName(e.target.value)}
                          placeholder="e.g. Suresh Pujari"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={manualPhone}
                          onChange={e => setManualPhone(e.target.value)}
                          placeholder="10-digit number"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Service *</label>
                        <select
                          value={manualServiceId}
                          onChange={e => setManualServiceId(e.target.value)}
                          className="w-full px-2.5 py-2 border border-slate-300 rounded-md text-slate-900 bg-white"
                        >
                          {services.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                        <input
                          type="date"
                          required
                          value={manualDate}
                          onChange={e => setManualDate(e.target.value)}
                          className="w-full px-2.5 py-2 border border-slate-300 rounded-md text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Time Slot *</label>
                        <select
                          value={manualSlot}
                          onChange={e => setManualSlot(e.target.value)}
                          className="w-full px-2.5 py-2 border border-slate-300 rounded-md text-slate-900 bg-white"
                        >
                          <optgroup label="Morning (10:00 AM – 2:00 PM)">
                            {MORNING_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </optgroup>
                          <optgroup label="Evening (4:00 PM – 9:00 PM)">
                            {EVENING_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Internal Notes</label>
                      <input
                        type="text"
                        placeholder="e.g. Phone booking, patient reports sharp pain in upper left tooth"
                        value={manualNotes}
                        onChange={e => setManualNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors"
                    >
                      Save & Confirm Appointment
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: AVAILABILITY & BLOCKING */}
              {activeTab === 'availability' && (
                <div className="space-y-6">
                  
                  {/* Block a Date or Slot Form */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Ban className="w-4 h-4 text-rose-600" />
                      <span>Block Unavailable Date or Individual Slot</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Target Date</label>
                        <input
                          type="date"
                          value={blockDate}
                          onChange={e => setBlockDate(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Time Slot (Optional)</label>
                        <select
                          value={blockSlot}
                          onChange={e => setBlockSlot(e.target.value)}
                          className="w-full px-2.5 py-2 border border-slate-300 rounded-md bg-white"
                        >
                          <option value="">Block Entire Day (All Hours)</option>
                          <optgroup label="Morning Slots">
                            {MORNING_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </optgroup>
                          <optgroup label="Evening Slots">
                            {EVENING_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Reason</label>
                        <input
                          type="text"
                          value={blockReason}
                          onChange={e => setBlockReason(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        blockDateOrSlot(blockDate, blockSlot || undefined, blockReason);
                        alert(`Blocked: ${blockDate} ${blockSlot ? `(${blockSlot})` : '(Full Day)'}`);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-md transition-colors"
                    >
                      Block Slot / Date
                    </button>
                  </div>

                  {/* List of currently blocked slots */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-sm font-bold text-slate-900">Current Blocked Rules</h4>
                    {blockedSlots.length === 0 ? (
                      <p className="text-xs text-slate-500">No dates or slots currently blocked.</p>
                    ) : (
                      <div className="divide-y divide-slate-100 text-xs">
                        {blockedSlots.map(b => (
                          <div key={b.id} className="py-2.5 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-800">{b.date}</span>
                              <span className="text-slate-500 ml-2">
                                {b.timeSlot ? `Slot: ${b.timeSlot}` : 'Full Day Blocked'} · {b.reason}
                              </span>
                            </div>
                            <button
                              onClick={() => unblockSlot(b.id)}
                              className="text-xs text-rose-600 hover:underline font-semibold"
                            >
                              Remove Block
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 6: CONTENT & SERVICES MANAGEMENT */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  
                  {/* Doctor Bio Editor */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">Dr. Akshata — Practitioner Biography</h4>
                      {bioSaved && (
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Saved!
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      Edit the practitioner description displayed on the website.
                    </p>
                    <textarea
                      rows={3}
                      value={bioInput}
                      onChange={e => setBioInput(e.target.value)}
                      className="w-full p-3 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-700 text-slate-900 leading-relaxed"
                    />
                    <button
                      onClick={handleSaveBio}
                      className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors"
                    >
                      Update Doctor Biography
                    </button>
                  </div>

                  {/* Services Manager */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">Manage Practice Services</h4>
                    <p className="text-xs text-slate-500">
                      As requested, all service cards are fully editable placeholders that you can update with verified treatments.
                    </p>

                    {/* Add New Service Form */}
                    <form onSubmit={handleAddService} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                      <p className="font-bold text-slate-800">Add New Dental Treatment</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Service Name (e.g. Dental Crown)"
                          value={newSvcName}
                          onChange={e => setNewSvcName(e.target.value)}
                          className="px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                        />
                        <input
                          type="text"
                          placeholder="Category (e.g. Prosthodontics)"
                          value={newSvcCategory}
                          onChange={e => setNewSvcCategory(e.target.value)}
                          className="px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                        />
                        <input
                          type="number"
                          min={15}
                          max={120}
                          value={newSvcDuration}
                          onChange={e => setNewSvcDuration(Number(e.target.value))}
                          placeholder="Duration (minutes)"
                          className="px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Short 1-2 sentence description"
                        value={newSvcDesc}
                        onChange={e => setNewSvcDesc(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-teal-800 text-white rounded text-xs font-semibold"
                      >
                        + Add Service
                      </button>
                    </form>

                    {/* Existing Services List */}
                    <div className="divide-y divide-slate-100 text-xs">
                      {services.map(s => (
                        <div key={s.id} className="py-2.5 flex items-center justify-between gap-3">
                          <div>
                            <span className="font-bold text-slate-900">{s.name}</span>
                            <span className="text-slate-400 ml-2">({s.durationMinutes} mins · {s.category})</span>
                            <p className="text-[11px] text-slate-500 mt-0.5">{s.description}</p>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm(`Remove service "${s.name}"?`)) {
                                deleteService(s.id);
                              }
                            }}
                            className="text-rose-600 hover:text-rose-800 p-1"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 7: SUPABASE BACKEND INTEGRATION */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  
                  {/* Connection Details Card */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Database className="w-5 h-5 text-teal-700" />
                          <span>Supabase PostgreSQL Backend</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Stores online and manual appointment requests in your cloud database.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            setIsSyncing(true);
                            setSyncFeedback(null);
                            await refreshSupabaseConnection();
                            setIsSyncing(false);
                            setSyncFeedback('Connection status refreshed.');
                            setTimeout(() => setSyncFeedback(null), 3500);
                          }}
                          disabled={isSyncing}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>Refresh Connection</span>
                        </button>

                        <button
                          onClick={async () => {
                            setIsSyncing(true);
                            setSyncFeedback(null);
                            const res = await syncAllToSupabase();
                            setIsSyncing(false);
                            if (res.success) {
                              setSyncFeedback(`Successfully synced ${res.syncedCount} appointments to Supabase!`);
                            } else {
                              setSyncFeedback(`Sync note: ${res.error || 'Check database table setup'}`);
                            }
                            setTimeout(() => setSyncFeedback(null), 6000);
                          }}
                          disabled={isSyncing}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Server className="w-3.5 h-3.5" />
                          <span>Sync Appointments Now</span>
                        </button>
                      </div>
                    </div>

                    {syncFeedback && (
                      <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold rounded-md">
                        {syncFeedback}
                      </div>
                    )}

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                        <span className="text-slate-400 font-medium">Supabase Project ID</span>
                        <p className="font-mono font-bold text-slate-900 mt-1">{SUPABASE_PROJECT_ID}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                        <span className="text-slate-400 font-medium">Endpoint URL</span>
                        <p className="font-mono text-slate-800 mt-1 truncate" title={SUPABASE_URL}>
                          {SUPABASE_URL}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                        <span className="text-slate-400 font-medium">Table Status</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              supabaseStatus.tableExists
                                ? 'bg-emerald-600'
                                : supabaseStatus.connected
                                ? 'bg-amber-600'
                                : 'bg-rose-600'
                            }`}
                          />
                          <span className="font-bold text-slate-900">
                            {supabaseStatus.tableExists
                              ? 'Active & Syncing (public.appointments)'
                              : 'Connected · Table Setup Required'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Setup & SQL Schema Helper Card */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Supabase SQL Schema & Row Level Security Setup
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Run this query once in your Supabase SQL Editor to initialize the appointments table with security policies.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                            setCopiedSql(true);
                            setTimeout(() => setCopiedSql(false), 3000);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedSql ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-700" />
                              <span className="text-emerald-700 font-bold">Copied to Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copy SQL Query</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>Open Supabase SQL Editor</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 text-slate-100 text-xs">
                      <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>schema.sql</span>
                        <span>PostgreSQL / Supabase</span>
                      </div>
                      <pre className="p-4 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-72">
                        {SUPABASE_SQL_SCHEMA}
                      </pre>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-slate-800">Quick 3-Step Setup Instructions:</p>
                      <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                        <li>Click <strong>Copy SQL Query</strong> or <strong>Open Supabase SQL Editor</strong> above.</li>
                        <li>Paste the query into the SQL Editor in your Supabase dashboard and click <strong>Run</strong>.</li>
                        <li>Click <strong>Refresh Connection</strong> above — your website will immediately start saving all patient bookings into your Supabase database!</li>
                      </ol>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Reschedule Appointment</h4>
            <p className="text-xs text-slate-500">
              Patient: <span className="font-bold text-slate-800">{rescheduleApt.patientName}</span>
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block font-semibold mb-1">New Date</label>
                <input
                  type="date"
                  min={todayStr}
                  value={newRescheduleDate}
                  onChange={e => setNewRescheduleDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">New Time Slot</label>
                <select
                  value={newRescheduleSlot}
                  onChange={e => setNewRescheduleSlot(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <optgroup label="Morning">
                    {MORNING_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                  <optgroup label="Evening">
                    {EVENING_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setRescheduleApt(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rescheduleAppointment(rescheduleApt.id, newRescheduleDate, newRescheduleSlot);
                  setRescheduleApt(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-800 rounded"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal Clinic Notes Modal */}
      {notesApt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Clinic Internal Notes</h4>
            <p className="text-xs text-slate-500">
              Patient: <span className="font-bold text-slate-800">{notesApt.patientName}</span> ({notesApt.referenceCode})
            </p>

            <textarea
              rows={3}
              value={clinicNotesInput}
              onChange={e => setClinicNotesInput(e.target.value)}
              placeholder="e.g. Checked medical history; prescribed mouthwash; follow-up in 2 weeks"
              className="w-full p-2 text-xs border border-slate-300 rounded"
            />

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setNotesApt(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateAppointmentStatus(notesApt.id, notesApt.status, clinicNotesInput);
                  setNotesApt(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-800 rounded"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Appointment Details Modal */}
      {viewApt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                    {viewApt.referenceCode}
                  </span>
                  <h4 className="text-sm font-bold">Appointment Details</h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Stored in Supabase PostgreSQL (Table: public.appointments)
                </p>
              </div>
              <button
                onClick={() => setViewApt(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Patient Profile Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-base font-bold text-slate-900">{viewApt.patientName}</h5>
                    <span className="text-[11px] text-slate-500 capitalize">{viewApt.patientType} Patient</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    viewApt.status === 'Confirmed'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : viewApt.status === 'Pending'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : viewApt.status === 'Completed'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : viewApt.status === 'Cancelled'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {viewApt.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-teal-700" />
                    <span className="font-semibold">{viewApt.mobileNumber}</span>
                    <a
                      href={`tel:${viewApt.mobileNumber}`}
                      className="ml-auto text-[10px] text-teal-800 font-bold hover:underline"
                    >
                      Call
                    </a>
                  </div>
                  {viewApt.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-teal-700" />
                      <span className="truncate">{viewApt.email}</span>
                      <a
                        href={`mailto:${viewApt.email}`}
                        className="ml-auto text-[10px] text-teal-800 font-bold hover:underline"
                      >
                        Email
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Consultation Details */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Requested Treatment:</span>
                  <span className="font-bold text-slate-900">{viewApt.serviceName}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="font-bold text-slate-900">{viewApt.date}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Time Slot:</span>
                  <span className="font-bold text-teal-900 font-mono text-sm">{viewApt.timeSlot}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Attending Doctor:</span>
                  <span className="font-semibold text-slate-800">Dr. Akshata (Dental Surgeon)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Booking Created:</span>
                  <span className="font-mono text-slate-600">
                    {new Date(viewApt.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </span>
                </div>
              </div>

              {/* Patient Notes */}
              {viewApt.notes && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-0.5">Patient Notes / Concern:</span>
                  <p className="text-slate-600 leading-relaxed">{viewApt.notes}</p>
                </div>
              )}

              {/* Clinic Notes */}
              <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-200">
                <span className="font-bold text-teal-950 block mb-0.5">Clinic Internal Notes:</span>
                <p className="text-teal-900 leading-relaxed">
                  {viewApt.clinicNotes || 'No internal clinical notes recorded yet.'}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const apt = viewApt;
                    setViewApt(null);
                    handleOpenEdit(apt);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {viewApt.status === 'Pending' && (
                  <button
                    onClick={() => {
                      updateAppointmentStatus(viewApt.id, 'Confirmed');
                      setViewApt(prev => prev ? { ...prev, status: 'Confirmed' } : null);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Confirm</span>
                  </button>
                )}

                <button
                  onClick={() => sendWhatsAppReminder(viewApt)}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {viewApt.status !== 'Cancelled' && (
                  <button
                    onClick={() => {
                      const apt = viewApt;
                      setViewApt(null);
                      handleOpenCancel(apt);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                )}

                <button
                  onClick={() => setViewApt(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {editApt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Edit className="w-4 h-4 text-teal-400" />
                  <span>Edit Appointment: {editApt.referenceCode}</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Updates will sync directly to Supabase table public.appointments
                </p>
              </div>
              <button
                onClick={() => setEditApt(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              {editFeedback && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold rounded-md">
                  {editFeedback}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.patientName}
                    onChange={e => setEditForm(prev => ({ ...prev, patientName: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number (10 digits) *</label>
                  <input
                    type="tel"
                    required
                    value={editForm.mobileNumber}
                    onChange={e => setEditForm(prev => ({ ...prev, mobileNumber: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="patient@example.com"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Type</label>
                  <select
                    value={editForm.patientType}
                    onChange={e => setEditForm(prev => ({ ...prev, patientType: e.target.value as 'new' | 'existing' }))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="new">New Patient</option>
                    <option value="existing">Existing / Follow-up Patient</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dental Treatment / Service *</label>
                <select
                  value={editForm.serviceId}
                  onChange={e => setEditForm(prev => ({ ...prev, serviceId: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-teal-700"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.durationMinutes} mins · {s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    value={editForm.date}
                    onChange={e => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot *</label>
                  <select
                    value={editForm.timeSlot}
                    onChange={e => setEditForm(prev => ({ ...prev, timeSlot: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-teal-700"
                  >
                    <optgroup label="Morning Session (10 AM – 2 PM)">
                      {MORNING_SLOTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Evening Session (4 PM – 9 PM)">
                      {EVENING_SLOTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appointment Status</label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value as Appointment['status'] }))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white font-semibold"
                >
                  <option value="Pending">Pending (Awaiting Clinic Review)</option>
                  <option value="Confirmed">Confirmed (Slot Reserved)</option>
                  <option value="Completed">Completed (Treatment Done)</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="No-show">No-show</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient Notes / Concern</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={e => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Patient complaint or request notes"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinic / Doctor Internal Notes</label>
                <textarea
                  rows={2}
                  value={editForm.clinicNotes}
                  onChange={e => setEditForm(prev => ({ ...prev, clinicNotes: e.target.value }))}
                  placeholder="Doctor observations, clinical follow-ups, internal reminders"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-700 bg-teal-50/30"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditApt(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editSaving ? 'Saving to Database...' : 'Save Changes in Supabase'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 flex-shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Cancel Appointment</h4>
                <p className="text-xs text-slate-500">
                  {cancelModalApt.referenceCode} · {cancelModalApt.patientName}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-200">
              <p><strong>Scheduled:</strong> {cancelModalApt.date} at {cancelModalApt.timeSlot}</p>
              <p><strong>Service:</strong> {cancelModalApt.serviceName}</p>
              <p><strong>Contact:</strong> {cancelModalApt.mobileNumber}</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Reason for Cancellation (Optional)
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Patient requested cancellation via phone / Doctor unavailable"
                value={cancelReasonInput}
                onChange={e => setCancelReasonInput(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <p className="text-[11px] text-slate-400">
                This will update the appointment status to <strong>Cancelled</strong> in your Supabase database and record the reason in clinic notes.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelModalApt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirm Cancellation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Record Confirmation Modal */}
      {deleteConfirmApt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Delete Record</h4>
                <p className="text-xs text-slate-500">
                  {deleteConfirmApt.referenceCode} · {deleteConfirmApt.patientName}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete this appointment from your Supabase database? This action cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmApt(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Deleting...' : 'Delete from Supabase'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
