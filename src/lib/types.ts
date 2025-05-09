
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  admissionDate: string; // YYYY-MM-DD
  urgency: 'High' | 'Medium' | 'Low';
  isFlagged: boolean;
  roomNumber?: string;
  diagnosis?: string;
  notes?: string;
  avatarUrl?: string;
  appointments?: Appointment[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
  schedule?: Appointment[];
}

export interface Room {
  id: string;
  roomNumber: string;
  isOccupied: boolean;
  patientId?: string;
  patientName?: string;
  properties: string[]; // e.g., ['ICU', 'Private', 'TV']
  imageUrl?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  dateTime: string; // ISO string
  type: string; // e.g., 'Consultation', 'Check-up', 'Surgery'
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}
