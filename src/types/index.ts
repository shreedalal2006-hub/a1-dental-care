export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  category: string;
  isPlaceholder?: boolean;
}

export interface Appointment {
  id: string;
  referenceCode: string;
  patientName: string;
  mobileNumber: string;
  email?: string;
  serviceId: string;
  serviceName: string;
  patientType: 'new' | 'existing';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';
  createdAt: string;
  clinicNotes?: string;
}

export interface BlockedSlot {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlot?: string; // empty means whole day
  reason: string;
}

export interface ClinicInfo {
  name: string;
  doctorName: string;
  doctorRole: string;
  doctorBio: string;
  addressLine1: string;
  addressLine2: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  phoneDisplay: string;
  googleRating: number;
  reviewCount: number;
  morningHours: string;
  eveningHours: string;
  breakHours: string;
  workingDays: string;
  slotDurationMinutes: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  url: string;
  isVerifiedClinicPhoto: boolean;
}
