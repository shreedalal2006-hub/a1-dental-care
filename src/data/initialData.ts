import { Appointment, ClinicInfo, FAQItem, GalleryPhoto, ServiceItem } from '../types';
import { formatKolkataDateOnly, getKolkataDate } from '../utils/timeZone';

export const INITIAL_CLINIC_INFO: ClinicInfo = {
  name: 'A1 DENTAL CARE',
  doctorName: 'Dr. Akshata',
  doctorRole: 'Dental Surgeon',
  doctorBio: 'Dr. Akshata provides comprehensive, patient-centered dental care focused on gentle treatment, clear clinical communication, and lasting oral health. At A1 Dental Care, every consultation is doctor-led, ensuring unhurried attention and customized guidance tailored to each patient.',
  addressLine1: '2nd Floor, A1 DENTAL CARE, 331, Jamboti Road',
  addressLine2: 'Opposite Raghavendra Hotel, Piranwadi',
  area: 'Piranwadi',
  city: 'Belagavi',
  state: 'Karnataka',
  pincode: '590014',
  country: 'India',
  phone: '+916366925940',
  phoneDisplay: '+91 63669 25940',
  googleRating: 5.0,
  reviewCount: 32,
  morningHours: '10:00 AM – 2:00 PM',
  eveningHours: '4:00 PM – 9:00 PM',
  breakHours: '2:00 PM – 4:00 PM',
  workingDays: 'Monday – Sunday (All 7 Days)',
  slotDurationMinutes: 30,
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'General Dental Care',
    description: 'Comprehensive oral examinations, diagnostic assessments, and personalized dental health guidance.',
    durationMinutes: 30,
    category: 'Consultation & Diagnostics',
    isPlaceholder: true,
  },
  {
    id: 'srv-2',
    name: 'Preventive Dental Care',
    description: 'Routine check-ups, plaque prevention, and proactive care strategies to maintain lifelong oral wellness.',
    durationMinutes: 30,
    category: 'Preventive Care',
    isPlaceholder: true,
  },
  {
    id: 'srv-3',
    name: 'Restorative Dentistry',
    description: 'Careful restoration of damaged or decayed teeth with tooth-colored composite restorations and repairs.',
    durationMinutes: 45,
    category: 'Restorative Care',
    isPlaceholder: true,
  },
  {
    id: 'srv-4',
    name: 'Cosmetic Dentistry',
    description: 'Aesthetic smile assessments and tooth enhancements focused on natural harmony and patient confidence.',
    durationMinutes: 45,
    category: 'Aesthetic Dentistry',
    isPlaceholder: true,
  },
  {
    id: 'srv-5',
    name: 'Gum Care',
    description: 'Periodontal evaluation, specialized gum therapy, and care for bleeding or inflamed gum tissues.',
    durationMinutes: 30,
    category: 'Periodontics',
    isPlaceholder: true,
  },
  {
    id: 'srv-6',
    name: 'Root Canal Treatment',
    description: 'Endodontic therapy to alleviate dental toothache and preserve natural tooth structure with precision care.',
    durationMinutes: 60,
    category: 'Endodontics',
    isPlaceholder: true,
  },
  {
    id: 'srv-7',
    name: 'Dental Cleaning',
    description: 'Professional ultrasonic scaling and polishing to remove stubborn tartar and refresh oral hygiene.',
    durationMinutes: 30,
    category: 'Hygiene & Prophylaxis',
    isPlaceholder: true,
  },
  {
    id: 'srv-8',
    name: 'Tooth Replacement',
    description: 'Tailored solutions for missing teeth, including dental bridges, dentures, and replacement consultations.',
    durationMinutes: 45,
    category: 'Prosthodontics',
    isPlaceholder: true,
  },
  {
    id: 'srv-9',
    name: "Children's Dental Care",
    description: 'Gentle, friendly pediatric dental checkups designed to establish comfortable clinical habits early.',
    durationMinutes: 30,
    category: 'Pediatric Care',
    isPlaceholder: true,
  },
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I book an appointment?',
    answer: 'You can book directly through this website using the "Book Appointment" button by selecting your preferred service, date, and available time slot. You can also call us directly at +91 63669 25940 or message us on WhatsApp.',
    category: 'Booking',
  },
  {
    id: 'faq-2',
    question: 'What are the clinic timings?',
    answer: 'A1 Dental Care is open all 7 days of the week (Monday through Sunday) with two daily sessions: Morning from 10:00 AM to 2:00 PM, and Evening from 4:00 PM to 9:00 PM. The clinic is closed during the afternoon break between 2:00 PM and 4:00 PM.',
    category: 'Timings',
  },
  {
    id: 'faq-3',
    question: 'Where is A1 Dental Care located?',
    answer: 'We are situated on the 2nd Floor, 331 Jamboti Road, Opposite Raghavendra Hotel, in Piranwadi, Belagavi, Karnataka 590014. The building is easily accessible along the main Jamboti Road.',
    category: 'Location',
  },
  {
    id: 'faq-4',
    question: 'How can I contact the clinic?',
    answer: 'You can call our clinic line at +91 63669 25940 during clinic hours, message us on WhatsApp, or send an appointment request directly through the online scheduling tool.',
    category: 'Contact',
  },
  {
    id: 'faq-5',
    question: 'Do I need an appointment before visiting?',
    answer: 'While walk-in patients are welcomed when time permits, booking an appointment in advance is strongly recommended. Prior booking guarantees your dedicated time with Dr. Akshata and avoids waiting periods.',
    category: 'Appointments',
  },
  {
    id: 'faq-6',
    question: 'What should I bring to my first appointment?',
    answer: 'Please bring any relevant prior dental records or x-rays if available, a list of current medications you take, and a valid photo ID. Arriving 5 to 10 minutes prior to your scheduled slot helps ensure a smooth initial consultation.',
    category: 'First Visit',
  },
];

export const INITIAL_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'gal-1',
    title: 'Clinic Reception & Waiting Lounge',
    category: 'Reception Area',
    url: '/src/assets/images/clinic_reception_interior_1791205094970.jpg',
    isVerifiedClinicPhoto: true,
  },
  {
    id: 'gal-2',
    title: 'Pristine Treatment Operatory',
    category: 'Operatory & Chair',
    url: '/src/assets/images/clinic_treatment_operatory_1791205104565.jpg',
    isVerifiedClinicPhoto: true,
  },
  {
    id: 'gal-3',
    title: 'Consultation & Diagnostics Desk',
    category: 'Consultation Room',
    url: '/src/assets/images/dental_care_consultation_1791205115626.jpg',
    isVerifiedClinicPhoto: true,
  },
  {
    id: 'gal-4',
    title: 'Dr. Akshata — Dental Surgeon',
    category: 'Doctor Profile',
    url: '/src/assets/images/dr_akshata_portrait_1791205007587.jpg',
    isVerifiedClinicPhoto: true,
  },
];

export function getInitialAppointments(): Appointment[] {
  const today = formatKolkataDateOnly(getKolkataDate());
  
  // Create a tomorrow date string
  const tomorrowDate = getKolkataDate();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = formatKolkataDateOnly(tomorrowDate);

  return [
    {
      id: 'apt-seed-1',
      referenceCode: 'A1-4821',
      patientName: 'Ramesh Kulkarni',
      mobileNumber: '9845123456',
      email: 'ramesh.k@example.com',
      serviceId: 'srv-1',
      serviceName: 'General Dental Care',
      patientType: 'new',
      date: today,
      timeSlot: '11:00 AM',
      notes: 'Routine dental checkup and mild sensitivity in lower molar.',
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      clinicNotes: 'First visit. Reviewed medical history.',
    },
    {
      id: 'apt-seed-2',
      referenceCode: 'A1-9234',
      patientName: 'Pooja Patil',
      mobileNumber: '9740987654',
      email: 'pooja.p@example.com',
      serviceId: 'srv-7',
      serviceName: 'Dental Cleaning',
      patientType: 'existing',
      date: today,
      timeSlot: '05:30 PM',
      notes: 'Six-month routine scaling and checkup.',
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      clinicNotes: 'Follow-up appointment booked last month.',
    },
    {
      id: 'apt-seed-3',
      referenceCode: 'A1-6102',
      patientName: 'Sanjay Deshmukh',
      mobileNumber: '9481234567',
      email: 'sanjay.d@example.com',
      serviceId: 'srv-6',
      serviceName: 'Root Canal Treatment',
      patientType: 'new',
      date: tomorrow,
      timeSlot: '10:30 AM',
      notes: 'Consultation for molar pain.',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      clinicNotes: 'Awaiting phone confirmation from patient.',
    },
  ];
}
