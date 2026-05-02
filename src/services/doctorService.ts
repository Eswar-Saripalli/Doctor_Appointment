import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';

export interface Doctor {
  uid: string;
  name: string;
  specialty: string;
  bio: string;
  location: string;
  rating: number;
  reviewCount: number;
  photoURL: string;
  availability?: {
    [key: string]: string[]; // '2026-05-02': ['09:00', '10:00']
  };
}

const COLLECTION_NAME = 'doctors';

const MOCK_DOCTORS: Doctor[] = [
  {
    uid: 'doctor_1',
    name: 'Dr. Sarah Chen',
    specialty: 'Cardiologist',
    bio: 'Specializing in heart health with over 15 years of experience in clinical cardiology.',
    location: 'Central Heart Institute, Downtown',
    rating: 4.9,
    reviewCount: 124,
    photoURL: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    uid: 'doctor_2',
    name: 'Dr. Marcus Miller',
    specialty: 'Pediatrician',
    bio: 'Compassionate care for children and adolescents. Expert in developmental health.',
    location: 'KinderCare Pediatric Center',
    rating: 4.8,
    reviewCount: 89,
    photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    uid: 'doctor_3',
    name: 'Dr. Elena Rodriguez',
    specialty: 'Dermatologist',
    bio: 'Expert in clinical and aesthetic dermatology, focusing on skin cancer prevention.',
    location: 'DermaPro Skin Clinic',
    rating: 4.9,
    reviewCount: 156,
    photoURL: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    uid: 'doctor_4',
    name: 'Dr. James Wilson',
    specialty: 'Neurologist',
    bio: 'Specializing in neurodegenerative disorders and sleep studies.',
    location: 'Modern Neurology & Brain Health',
    rating: 4.7,
    reviewCount: 210,
    photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200',
  }
];

export const doctorService = {
  async getAllDoctors(): Promise<Doctor[]> {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      if (snapshot.empty) {
        return MOCK_DOCTORS;
      }
      return snapshot.docs.map(doc => doc.data() as Doctor);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      return [];
    }
  },

  async seedDoctors() {
    // Note: This usually fails if not the actual doctor UID, but for demo it's fine if rules allow it
    // Or we just show mock data in the UI if DB is empty instead of seeding (safer)
  }
};
