'use server';

import { summarizePatientNotes as summarizePatientNotesFlow, type SummarizePatientNotesInput, type SummarizePatientNotesOutput } from '@/ai/flows/summarize-patient-notes';
import { mockAppointments, mockDoctors, mockPatients, mockRooms } from './data';
import type { Appointment, Doctor, Patient, Room } from './types';

// AI Action
export async function handleSummarizeNotes(
  input: SummarizePatientNotesInput
): Promise<{ success: boolean; summary?: string; error?: string }> {
  try {
    const result: SummarizePatientNotesOutput = await summarizePatientNotesFlow(input);
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error("Error summarizing notes:", error);
    // Check if error is an instance of Error and has a message property
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to summarize notes: ${errorMessage}` };
  }
}

// Mock Data Mutation Actions (for demonstration purposes, these don't persist)

// Patient Actions
export async function addPatient(patient: Omit<Patient, 'id' | 'appointments' | 'avatarUrl'>): Promise<Patient> {
  console.log("Adding patient:", patient);
  const newPatient: Patient = { 
    ...patient, 
    id: `P${Math.floor(Math.random() * 900) + 100}`, // Generate random ID
    appointments: [],
    avatarUrl: `https://picsum.photos/seed/newpatient${Date.now()}/80/80`
  };
  mockPatients.push(newPatient); // This modification is in-memory and will reset
  return newPatient;
}

export async function updatePatient(patient: Patient): Promise<Patient | null> {
  console.log("Updating patient:", patient.id);
  const index = mockPatients.findIndex(p => p.id === patient.id);
  if (index !== -1) {
    mockPatients[index] = patient;
    return patient;
  }
  return null;
}

export async function deletePatient(patientId: string): Promise<boolean> {
  console.log("Deleting patient:", patientId);
  const index = mockPatients.findIndex(p => p.id === patientId);
  if (index !== -1) {
    mockPatients.splice(index, 1);
    return true;
  }
  return false;
}

// Doctor Actions
export async function addDoctor(doctor: Omit<Doctor, 'id' | 'schedule' | 'avatarUrl'>): Promise<Doctor> {
  console.log("Adding doctor:", doctor);
   const newDoctor: Doctor = { 
    ...doctor, 
    id: `D${Math.floor(Math.random() * 900) + 100}`,
    schedule: [],
    avatarUrl: `https://picsum.photos/seed/newdoctor${Date.now()}/80/80`
  };
  mockDoctors.push(newDoctor);
  return newDoctor;
}

export async function updateDoctor(doctor: Doctor): Promise<Doctor | null> {
  console.log("Updating doctor:", doctor.id);
  const index = mockDoctors.findIndex(d => d.id === doctor.id);
  if (index !== -1) {
    mockDoctors[index] = doctor;
    return doctor;
  }
  return null;
}

export async function deleteDoctor(doctorId: string): Promise<boolean> {
  console.log("Deleting doctor:", doctorId);
  const index = mockDoctors.findIndex(d => d.id === doctorId);
  if (index !== -1) {
    mockDoctors.splice(index, 1);
    return true;
  }
  return false;
}

// Appointment Actions
export async function addAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
  console.log("Adding appointment:", appointment);
  const newAppointment: Appointment = { ...appointment, id: `A${Math.floor(Math.random() * 900) + 100}` };
  mockAppointments.push(newAppointment);
  // Update patient and doctor schedules (simplified)
  const patient = mockPatients.find(p => p.id === appointment.patientId);
  if (patient) patient.appointments?.push(newAppointment);
  const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
  if (doctor) doctor.schedule?.push(newAppointment);
  return newAppointment;
}

export async function updateAppointment(appointment: Appointment): Promise<Appointment | null> {
  console.log("Updating appointment:", appointment.id);
  const index = mockAppointments.findIndex(a => a.id === appointment.id);
  if (index !== -1) {
    mockAppointments[index] = appointment;
    return appointment;
  }
  return null;
}

export async function deleteAppointment(appointmentId: string): Promise<boolean> {
  console.log("Deleting appointment:", appointmentId);
  const index = mockAppointments.findIndex(a => a.id === appointmentId);
  if (index !== -1) {
    mockAppointments.splice(index, 1);
    return true;
  }
  return false;
}

// Room flag update (example for modifying a room property, not full CRUD for rooms)
export async function updateRoomOccupancy(roomId: string, isOccupied: boolean, patientId?: string, patientName?: string): Promise<Room | null> {
  console.log(`Updating room ${roomId} occupancy to ${isOccupied}`);
  const room = mockRooms.find(r => r.id === roomId);
  if (room) {
    room.isOccupied = isOccupied;
    room.patientId = isOccupied ? patientId : undefined;
    room.patientName = isOccupied ? patientName : undefined;
    return room;
  }
  return null;
}
