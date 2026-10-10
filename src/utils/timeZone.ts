// Asia/Kolkata timezone utilities for A1 Dental Care

export interface ClinicStatus {
  isOpen: boolean;
  statusText: string;
  subText: string;
  currentIstTime: string;
  nextSessionText?: string;
}

/**
 * Returns current date and time in Asia/Kolkata timezone
 */
export function getKolkataDate(): Date {
  const now = new Date();
  // Format to Asia/Kolkata string, then parse
  const istString = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  return new Date(istString);
}

/**
 * Formats a Date object to YYYY-MM-DD in Asia/Kolkata
 */
export function formatKolkataDateOnly(date: Date = getKolkataDate()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns human-readable clinic open/closed status in IST
 * Working hours: 10:00 AM–2:00 PM and 4:00 PM–9:00 PM every day
 * Break: 2:00 PM–4:00 PM
 */
export function getLiveClinicStatus(): ClinicStatus {
  const ist = getKolkataDate();
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const currentIstTime = ist.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Morning session: 10:00 AM (600 min) to 2:00 PM (840 min)
  // Break: 2:00 PM (840 min) to 4:00 PM (960 min)
  // Evening session: 4:00 PM (960 min) to 9:00 PM (1260 min)

  if (totalMinutes >= 600 && totalMinutes < 840) {
    const closesInMinutes = 840 - totalMinutes;
    const hoursLeft = Math.floor(closesInMinutes / 60);
    const minsLeft = closesInMinutes % 60;
    const timeRemainingStr = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft}m`;
    return {
      isOpen: true,
      statusText: 'Open Now',
      subText: `Morning session until 2:00 PM (${timeRemainingStr} remaining)`,
      currentIstTime,
      nextSessionText: 'Break 2:00 PM – 4:00 PM',
    };
  }

  if (totalMinutes >= 840 && totalMinutes < 960) {
    const opensInMinutes = 960 - totalMinutes;
    return {
      isOpen: false,
      statusText: 'Closed — Opens at 4:00 PM',
      subText: `Afternoon break (${opensInMinutes}m until evening session)`,
      currentIstTime,
      nextSessionText: 'Evening session: 4:00 PM – 9:00 PM',
    };
  }

  if (totalMinutes >= 960 && totalMinutes < 1260) {
    const closesInMinutes = 1260 - totalMinutes;
    const hoursLeft = Math.floor(closesInMinutes / 60);
    const minsLeft = closesInMinutes % 60;
    const timeRemainingStr = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft}m`;
    return {
      isOpen: true,
      statusText: 'Open Now',
      subText: `Evening session until 9:00 PM (${timeRemainingStr} remaining)`,
      currentIstTime,
      nextSessionText: 'Closes at 9:00 PM',
    };
  }

  // Before 10:00 AM or after 9:00 PM
  return {
    isOpen: false,
    statusText: 'Closed — Opens at 10:00 AM',
    subText: 'Regular clinic hours: 10:00 AM–2:00 PM, 4:00 PM–9:00 PM',
    currentIstTime,
    nextSessionText: 'Next session starts tomorrow at 10:00 AM',
  };
}

/**
 * Standard appointment time slots
 * Excludes 2:00 PM – 4:00 PM break
 */
export const MORNING_SLOTS = [
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
];

export const EVENING_SLOTS = [
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
];

export const ALL_TIME_SLOTS = [...MORNING_SLOTS, ...EVENING_SLOTS];

/**
 * Parse a slot string like "10:30 AM" or "04:00 PM" into minutes from midnight
 */
export function slotToMinutes(slot: string): number {
  const match = slot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour * 60 + minute;
}

/**
 * Generate Google Calendar and ICS download parameters for confirmed appointment
 */
export function generateGoogleCalendarUrl(appointment: {
  referenceCode: string;
  patientName: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  address: string;
}): string {
  // Approximate appointment start time
  const [year, month, day] = appointment.date.split('-').map(Number);
  const minutesFromMidnight = slotToMinutes(appointment.timeSlot);
  const startHour = Math.floor(minutesFromMidnight / 60);
  const startMin = minutesFromMidnight % 60;

  // Format to YYYYMMDDTHHmmSS in UTC (IST is UTC+5:30)
  // For simplicity, generate Google Calendar link with IST time zone
  const pad = (n: number) => String(n).padStart(2, '0');
  const startStr = `${year}${pad(month)}${pad(day)}T${pad(startHour)}${pad(startMin)}00`;
  
  // 30 min duration
  const endMinutes = minutesFromMidnight + 30;
  const endHour = Math.floor(endMinutes / 60);
  const endMin = endMinutes % 60;
  const endStr = `${year}${pad(month)}${pad(day)}T${pad(endHour)}${pad(endMin)}00`;

  const title = encodeURIComponent(`Dental Appointment: ${appointment.serviceName} – A1 Dental Care`);
  const details = encodeURIComponent(
    `Appointment with Dr. Akshata (Dental Surgeon)\n` +
    `Patient: ${appointment.patientName}\n` +
    `Ref ID: ${appointment.referenceCode}\n` +
    `Service: ${appointment.serviceName}\n` +
    `Phone: +91 63669 25940\n\n` +
    `Please arrive 5-10 minutes before your slot.`
  );
  const location = encodeURIComponent(appointment.address);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&ctz=Asia/Kolkata&details=${details}&location=${location}`;
}

/**
 * Generate iCalendar (.ics) file data string for download
 */
export function generateIcsBlob(appointment: {
  referenceCode: string;
  patientName: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  address: string;
}): Blob {
  const [year, month, day] = appointment.date.split('-').map(Number);
  const minutesFromMidnight = slotToMinutes(appointment.timeSlot);
  const startHour = Math.floor(minutesFromMidnight / 60);
  const startMin = minutesFromMidnight % 60;
  const endMinutes = minutesFromMidnight + 30;
  const endHour = Math.floor(endMinutes / 60);
  const endMin = endMinutes % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const dtStart = `${year}${pad(month)}${pad(day)}T${pad(startHour)}${pad(startMin)}00`;
  const dtEnd = `${year}${pad(month)}${pad(day)}T${pad(endHour)}${pad(endMin)}00`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//A1 Dental Care Belagavi//Appointment Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${appointment.referenceCode}@a1dentalcare.in`,
    `DTSTAMP:${dtStart}Z`,
    `DTSTART;TZID=Asia/Kolkata:${dtStart}`,
    `DTEND;TZID=Asia/Kolkata:${dtEnd}`,
    `SUMMARY:A1 Dental Care Appointment - ${appointment.serviceName}`,
    `DESCRIPTION:Appointment with Dr. Akshata (Dental Surgeon). Patient: ${appointment.patientName}. Ref: ${appointment.referenceCode}. Phone: +91 63669 25940.`,
    `LOCATION:${appointment.address}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
}
