import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Appointment, BlockedSlot, ClinicInfo, FAQItem, GalleryPhoto, ServiceItem } from '../types';
import {
  INITIAL_CLINIC_INFO,
  INITIAL_FAQS,
  INITIAL_GALLERY_PHOTOS,
  INITIAL_SERVICES,
  getInitialAppointments,
} from '../data/initialData';
import {
  checkSupabaseHealth,
  fetchAppointmentsFromSupabase,
  insertAppointmentToSupabase,
  updateAppointmentInSupabase,
  deleteAppointmentFromSupabase,
  supabase,
  SupabaseHealth,
  SUPABASE_PROJECT_ID,
} from '../lib/supabase';

interface BookingPrefill {
  serviceId?: string;
  serviceName?: string;
  date?: string;
  timeSlot?: string;
  patientName?: string;
  mobileNumber?: string;
  patientType?: 'new' | 'existing';
  notes?: string;
}

interface ClinicContextType {
  clinicInfo: ClinicInfo;
  services: ServiceItem[];
  appointments: Appointment[];
  blockedSlots: BlockedSlot[];
  faqs: FAQItem[];
  gallery: GalleryPhoto[];
  
  // Supabase Backend Integration
  supabaseStatus: SupabaseHealth;
  isFetchingDatabase: boolean;
  lastSyncedAt: Date | null;
  refreshSupabaseConnection: () => Promise<void>;
  syncAllToSupabase: () => Promise<{ success: boolean; syncedCount: number; error?: string }>;

  // Modals & UI states
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  bookingPrefill: BookingPrefill | null;
  openBookingWithPrefill: (prefill?: BookingPrefill) => void;
  closeBookingModal: () => void;
  
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;

  // Appointment operations
  bookAppointment: (data: Omit<Appointment, 'id' | 'referenceCode' | 'createdAt' | 'status'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status'], clinicNotes?: string) => void;
  editAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  rescheduleAppointment: (id: string, newDate: string, newTimeSlot: string) => void;
  cancelAppointment: (id: string, notes?: string) => void;
  addManualAppointment: (apt: Omit<Appointment, 'id' | 'referenceCode' | 'createdAt'>) => Appointment;
  
  // Availability check
  isSlotAvailable: (date: string, timeSlot: string, excludeAppointmentId?: string) => boolean;
  blockDateOrSlot: (date: string, timeSlot: string | undefined, reason: string) => void;
  unblockSlot: (id: string) => void;

  // Content editing
  updateClinicInfo: (info: Partial<ClinicInfo>) => void;
  updateService: (service: ServiceItem) => void;
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  deleteService: (id: string) => void;
  updateFAQ: (faq: FAQItem) => void;
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  deleteFAQ: (id: string) => void;
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  deleteGalleryPhoto: (id: string) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CLINIC_INFO: 'a1_dental_clinic_info_v1',
  SERVICES: 'a1_dental_services_v1',
  APPOINTMENTS: 'a1_dental_appointments_v1',
  BLOCKED_SLOTS: 'a1_dental_blocked_slots_v1',
  FAQS: 'a1_dental_faqs_v1',
  GALLERY: 'a1_dental_gallery_v1',
};

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Supabase status
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseHealth>({
    connected: false,
    tableExists: false,
    projectId: SUPABASE_PROJECT_ID,
  });

  // Clinic Info
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLINIC_INFO);
      return saved ? JSON.parse(saved) : INITIAL_CLINIC_INFO;
    } catch {
      return INITIAL_CLINIC_INFO;
    }
  });

  // Services
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : getInitialAppointments();
    } catch {
      return getInitialAppointments();
    }
  });

  // Blocked Slots / Holidays
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED_SLOTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
      return saved ? JSON.parse(saved) : INITIAL_FAQS;
    } catch {
      return INITIAL_FAQS;
    }
  });

  // Gallery
  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return saved ? JSON.parse(saved) : INITIAL_GALLERY_PHOTOS;
    } catch {
      return INITIAL_GALLERY_PHOTOS;
    }
  });

  // UI state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState<BookingPrefill | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Database fetch state
  const [isFetchingDatabase, setIsFetchingDatabase] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Check Supabase connection and hydrate appointments
  const refreshSupabaseConnection = useCallback(async () => {
    setIsFetchingDatabase(true);
    const health = await checkSupabaseHealth();
    setSupabaseStatus(health);

    if (health.tableExists) {
      const { appointments: remoteApts, error } = await fetchAppointmentsFromSupabase();
      if (!error && remoteApts) {
        if (remoteApts.length > 0) {
          setAppointments(prev => {
            // Keep remote appointments and any non-seed local appointments that haven't synced
            const localOnly = prev.filter(l => !l.id.startsWith('apt-seed-') && !remoteApts.some(r => r.id === l.id || r.referenceCode === l.referenceCode));
            return [...remoteApts, ...localOnly];
          });
        }
        setLastSyncedAt(new Date());
      }
    }
    setIsFetchingDatabase(false);
  }, []);

  useEffect(() => {
    refreshSupabaseConnection();
  }, [refreshSupabaseConnection]);

  // Real-time listener for database changes across devices/tabs
  useEffect(() => {
    const channel = supabase
      .channel('realtime-appointments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => {
          refreshSupabaseConnection();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshSupabaseConnection]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLINIC_INFO, JSON.stringify(clinicInfo));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [clinicInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOCKED_SLOTS, JSON.stringify(blockedSlots));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [blockedSlots]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [gallery]);

  const openBookingWithPrefill = (prefill?: BookingPrefill) => {
    setBookingPrefill(prefill || null);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setBookingPrefill(null);
  };

  const isSlotAvailable = (date: string, timeSlot: string, excludeAppointmentId?: string): boolean => {
    // Check if entire date is blocked
    const dateBlocked = blockedSlots.some(b => b.date === date && !b.timeSlot);
    if (dateBlocked) return false;

    // Check if specific slot is blocked
    const slotBlocked = blockedSlots.some(b => b.date === date && b.timeSlot === timeSlot);
    if (slotBlocked) return false;

    // Check if appointment is already active at this date & slot
    const booked = appointments.some(
      a =>
        a.date === date &&
        a.timeSlot === timeSlot &&
        a.status !== 'Cancelled' &&
        a.id !== excludeAppointmentId
    );

    return !booked;
  };

  const generateRefCode = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `A1-${random}`;
  };

  const bookAppointment = (data: Omit<Appointment, 'id' | 'referenceCode' | 'createdAt' | 'status'>): Appointment => {
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      referenceCode: generateRefCode(),
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };

    setAppointments(prev => [newApt, ...prev]);

    // Asynchronously save to Supabase
    insertAppointmentToSupabase(newApt).then(res => {
      if (!res.success) {
        console.info('Supabase insert status:', res.error);
      }
    });

    return newApt;
  };

  const addManualAppointment = (data: Omit<Appointment, 'id' | 'referenceCode' | 'createdAt'>): Appointment => {
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      referenceCode: generateRefCode(),
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [newApt, ...prev]);

    // Asynchronously save to Supabase
    insertAppointmentToSupabase(newApt).then(res => {
      if (!res.success) {
        console.info('Supabase manual insert status:', res.error);
      }
    });

    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status'], clinicNotes?: string) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === id) {
          return {
            ...apt,
            status,
            clinicNotes: clinicNotes !== undefined ? clinicNotes : apt.clinicNotes,
          };
        }
        return apt;
      })
    );

    updateAppointmentInSupabase(id, { status, clinicNotes });
  };

  const rescheduleAppointment = (id: string, newDate: string, newTimeSlot: string) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === id) {
          return {
            ...apt,
            date: newDate,
            timeSlot: newTimeSlot,
            status: 'Confirmed',
          };
        }
        return apt;
      })
    );

    updateAppointmentInSupabase(id, { date: newDate, timeSlot: newTimeSlot, status: 'Confirmed' });
  };

  const cancelAppointment = (id: string, notes?: string) => {
    let updatedClinicNotes: string | undefined;

    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === id) {
          updatedClinicNotes = notes ? `${apt.clinicNotes ? apt.clinicNotes + ' | ' : ''}Cancellation note: ${notes}` : apt.clinicNotes;
          return {
            ...apt,
            status: 'Cancelled',
            clinicNotes: updatedClinicNotes,
          };
        }
        return apt;
      })
    );

    updateAppointmentInSupabase(id, { status: 'Cancelled', clinicNotes: updatedClinicNotes });
  };

  const editAppointment = async (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, ...updates } : apt))
    );
    await updateAppointmentInSupabase(id, updates);
  };

  const deleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    await deleteAppointmentFromSupabase(id);
  };

  const syncAllToSupabase = async (): Promise<{ success: boolean; syncedCount: number; error?: string }> => {
    const health = await checkSupabaseHealth();
    setSupabaseStatus(health);

    if (!health.tableExists) {
      return {
        success: false,
        syncedCount: 0,
        error: health.error || "Table 'appointments' does not exist yet in Supabase.",
      };
    }

    let synced = 0;
    for (const apt of appointments) {
      const res = await insertAppointmentToSupabase(apt);
      if (res.success) synced++;
    }

    return { success: true, syncedCount: synced };
  };

  const blockDateOrSlot = (date: string, timeSlot: string | undefined, reason: string) => {
    const newBlock: BlockedSlot = {
      id: `block-${Date.now()}`,
      date,
      timeSlot,
      reason,
    };
    setBlockedSlots(prev => [...prev, newBlock]);
  };

  const unblockSlot = (id: string) => {
    setBlockedSlots(prev => prev.filter(b => b.id !== id));
  };

  const updateClinicInfo = (info: Partial<ClinicInfo>) => {
    setClinicInfo(prev => ({ ...prev, ...info }));
  };

  const updateService = (updated: ServiceItem) => {
    setServices(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  };

  const addService = (data: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...data,
      id: `srv-${Date.now()}`,
    };
    setServices(prev => [...prev, newService]);
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const updateFAQ = (updated: FAQItem) => {
    setFaqs(prev => prev.map(f => (f.id === updated.id ? updated : f)));
  };

  const addFAQ = (data: Omit<FAQItem, 'id'>) => {
    const newFAQ: FAQItem = {
      ...data,
      id: `faq-${Date.now()}`,
    };
    setFaqs(prev => [...prev, newFAQ]);
  };

  const deleteFAQ = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  const addGalleryPhoto = (data: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto: GalleryPhoto = {
      ...data,
      id: `gal-${Date.now()}`,
    };
    setGallery(prev => [...prev, newPhoto]);
  };

  const deleteGalleryPhoto = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  return (
    <ClinicContext.Provider
      value={{
        clinicInfo,
        services,
        appointments,
        blockedSlots,
        faqs,
        gallery,
        supabaseStatus,
        isFetchingDatabase,
        lastSyncedAt,
        refreshSupabaseConnection,
        syncAllToSupabase,
        isBookingModalOpen,
        setIsBookingModalOpen,
        bookingPrefill,
        openBookingWithPrefill,
        closeBookingModal,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        bookAppointment,
        updateAppointmentStatus,
        editAppointment,
        deleteAppointment,
        rescheduleAppointment,
        cancelAppointment,
        addManualAppointment,
        isSlotAvailable,
        blockDateOrSlot,
        unblockSlot,
        updateClinicInfo,
        updateService,
        addService,
        deleteService,
        updateFAQ,
        addFAQ,
        deleteFAQ,
        addGalleryPhoto,
        deleteGalleryPhoto,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
