import type { Patient, Doctor, Room, Appointment } from './types';

export const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'Alice Wonderland',
    dateOfBirth: '1990-05-15',
    admissionDate: '2024-07-01',
    urgency: 'High',
    isFlagged: true,
    roomNumber: '101A',
    diagnosis: 'Acute Appendicitis',
    notes: 'Patient presented with severe abdominal pain. History of mild asthma. Needs urgent surgical consultation.',
    avatarUrl: 'https://picsum.photos/seed/alice/80/80',
    appointments: []
  },
  {
    id: 'P002',
    name: 'Bob The Builder',
    dateOfBirth: '1985-08-20',
    admissionDate: '2024-07-02',
    urgency: 'Medium',
    isFlagged: false,
    roomNumber: '102B',
    diagnosis: 'Common Cold',
    notes: 'Mild fever and cough. Prescribed rest and fluids.',
    avatarUrl: 'https://picsum.photos/seed/bob/80/80',
    appointments: []
  },
  {
    id: 'P003',
    name: 'Charlie Brown',
    dateOfBirth: '2005-01-10',
    admissionDate: '2024-06-28',
    urgency: 'Low',
    isFlagged: false,
    roomNumber: '103C',
    diagnosis: 'Routine Checkup',
    notes: 'Annual physical examination. All vitals normal.',
    avatarUrl: 'https://picsum.photos/seed/charlie/80/80',
    appointments: []
  },
  {
    id: 'P004',
    name: 'Diana Prince',
    dateOfBirth: '1978-11-03',
    admissionDate: '2024-07-03',
    urgency: 'High',
    isFlagged: true,
    roomNumber: '201A (ICU)',
    diagnosis: 'Cardiac Arrhythmia',
    notes: 'Patient experienced sudden palpitations. ECG shows irregularities. Monitoring in ICU.',
    avatarUrl: 'https://picsum.photos/seed/diana/80/80',
    appointments: []
  },
  {
    id: 'P005',
    name: 'Edward Scissorhands',
    dateOfBirth: '1992-03-25',
    admissionDate: '2024-07-04',
    urgency: 'Medium',
    isFlagged: false,
    diagnosis: 'Minor Lacerations',
    notes: 'Small cuts on hands. Cleaned and dressed. Tetanus shot administered.',
    avatarUrl: 'https://picsum.photos/seed/edward/80/80',
    appointments: []
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: 'D001',
    name: 'Dr. Eleanor Rigby',
    specialty: 'Cardiology',
    avatarUrl: 'https://picsum.photos/seed/drrigby/80/80',
    schedule: []
  },
  {
    id: 'D002',
    name: 'Dr. Gregory House',
    specialty: 'Diagnostics',
    avatarUrl: 'https://picsum.photos/seed/drhouse/80/80',
    schedule: []
  },
  {
    id: 'D003',
    name: 'Dr. Meredith Grey',
    specialty: 'General Surgery',
    avatarUrl: 'https://picsum.photos/seed/drgrey/80/80',
    schedule: []
  },
  {
    id: 'D004',
    name: 'Dr. John Watson',
    specialty: 'General Practice',
    avatarUrl: 'https://picsum.photos/seed/drwatson/80/80',
    schedule: []
  },
];

export const mockRooms: Room[] = [
  {
    id: 'R101A',
    roomNumber: '101A',
    isOccupied: true,
    patientId: 'P001',
    patientName: 'Alice Wonderland',
    properties: ['Private', ' ऑक्सीजन'],
    imageUrl: 'https://picsum.photos/seed/room101A/400/300',
  },
  {
    id: 'R102B',
    roomNumber: '102B',
    isOccupied: true,
    patientId: 'P002',
    patientName: 'Bob The Builder',
    properties: ['Semi-Private', ' टीवी'],
    imageUrl: 'https://picsum.photos/seed/room102B/400/300',
  },
  {
    id: 'R103C',
    roomNumber: '103C',
    isOccupied: true,
    patientId: 'P003',
    patientName: 'Charlie Brown',
    properties: ['Ward', ' खिड़की'],
    imageUrl: 'https://picsum.photos/seed/room103C/400/300',
  },
  {
    id: 'R201A',
    roomNumber: '201A (ICU)',
    isOccupied: true,
    patientId: 'P004',
    patientName: 'Diana Prince',
    properties: ['ICU', ' वेंटीलेटर', ' मॉनिटर'],
    imageUrl: 'https://picsum.photos/seed/room201A/400/300',
  },
  {
    id: 'R202B',
    roomNumber: '202B',
    isOccupied: false,
    properties: ['Private', ' बालकनी'],
    imageUrl: 'https://picsum.photos/seed/room202B/400/300',
  },
  {
    id: 'R203C',
    roomNumber: '203C (Isolation)',
    isOccupied: false,
    properties: ['Isolation', ' Negative Pressure'],
    imageUrl: 'https://picsum.photos/seed/room203C/400/300',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'A001',
    patientId: 'P001',
    patientName: 'Alice Wonderland',
    doctorId: 'D003',
    doctorName: 'Dr. Meredith Grey',
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    type: 'Surgical Consultation',
    status: 'Scheduled',
    notes: 'Pre-surgery assessment for appendectomy.',
  },
  {
    id: 'A002',
    patientId: 'P002',
    patientName: 'Bob The Builder',
    doctorId: 'D004',
    doctorName: 'Dr. John Watson',
    dateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    type: 'Follow-up',
    status: 'Completed',
    notes: 'Patient recovering well. Symptoms subsided.',
  },
  {
    id: 'A003',
    patientId: 'P003',
    patientName: 'Charlie Brown',
    doctorId: 'D004',
    doctorName: 'Dr. John Watson',
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    type: 'Routine Checkup',
    status: 'Scheduled',
  },
  {
    id: 'A004',
    patientId: 'P004',
    patientName: 'Diana Prince',
    doctorId: 'D001',
    doctorName: 'Dr. Eleanor Rigby',
    dateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    type: 'Cardiology Review',
    status: 'Scheduled',
    notes: 'Review ECG results and adjust medication if needed.',
  },
  {
    id: 'A005',
    patientId: 'P001', // Alice's past appointment
    patientName: 'Alice Wonderland',
    doctorId: 'D004',
    doctorName: 'Dr. John Watson',
    dateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    type: 'Initial Consultation',
    status: 'Completed',
    notes: 'Initial check for abdominal pain.',
  },
  {
    id: 'A006',
    patientId: 'P005', // Edward's appointment
    patientName: 'Edward Scissorhands',
    doctorId: 'D003',
    doctorName: 'Dr. Meredith Grey',
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    type: 'Wound Care',
    status: 'Scheduled',
    notes: 'Check healing of lacerations.',
  },
];

// Populate patient and doctor schedules
mockPatients.forEach(p => {
  p.appointments = mockAppointments.filter(app => app.patientId === p.id);
});

mockDoctors.forEach(d => {
  d.schedule = mockAppointments.filter(app => app.doctorId === d.id);
});
