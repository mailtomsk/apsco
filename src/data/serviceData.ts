export interface ServiceCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  price: number;
}

export interface SpecificService {
  id: string;
  name: string;
}

export const timeSlots = {
  morning: [
    { time: '06:30 AM', available: true },
    { time: '07:00 AM', available: true },
    { time: '07:30 AM', available: true },
    { time: '08:00 AM', available: true },
    { time: '08:30 AM', available: true },
    { time: '09:00 AM', available: true },
    { time: '09:30 AM', available: true },
    { time: '10:00 AM', available: false },
    { time: '10:30 AM', available: false },
    { time: '11:00 AM', available: false },
    { time: '11:30 AM', available: false },
  ],
  afternoon: [
    { time: '12:00 PM', available: false },
    { time: '12:30 PM', available: false },
    { time: '01:00 PM', available: false },
    { time: '01:30 PM', available: false },
    { time: '02:00 PM', available: true },
  ]
};

export const serviceCenters: ServiceCenter[] = [
  {
    id: "1",
    name: "CarZone Service Center (Ampang)",
    address: "Tambahan, Lot 1322, Kawasan Klang, Jln 11, Kampung Baru Ampang",
    city: "Ampang",
    state: "Selangor",
    postcode: "68000"
  },
  {
    id: "2",
    name: "CarZone Service Center (Petaling Jaya)",
    address: "2, Lorong 51 A/227C, Seksyen 51A",
    city: "Petaling Jaya",
    state: "Selangor",
    postcode: "46100"
  }
];

export const servicePackages: ServicePackage[] = [
  {
    id: "1",
    name: "Essential Service Package",
    description: "Semi-synthetic engine oil, Oil filter replacement, Windshield washer replacement, Oil pan washer replacement",
    estimatedTime: "2-3 hours",
    price: 279.00
  },
  {
    id: "2",
    name: "Premium Service Package",
    description: "Fully-synthetic engine oil, Oil filter replacement, Brake fluid top-up, Air filter cleaning, Multi-point inspection, Battery health check",
    estimatedTime: "4-5 hours",
    price: 399.00
  }
];

export const specificServices: SpecificService[] = [
  { id: "1", name: "20-Point Inspection" },
  { id: "2", name: "Brake System" },
  { id: "3", name: "Aircon System" },
  { id: "4", name: "Battery" },
  { id: "5", name: "Suspension" },
  { id: "6", name: "Tyre Services" },
  { id: "7", name: "General Service" },
  { id: "8", name: "Aircon Pollen Filter" },
  { id: "9", name: "Others" }
];

export const carBrands = [
  {
    id: "1",
    name: "Toyota",
    models: ["Camry", "Corolla", "RAV4", "Vios"]
  },
  {
    id: "2",
    name: "Honda",
    models: ["Civic", "Accord", "CR-V", "City"]
  },
  {
    id: "3",
    name: "BMW",
    models: ["3 Series", "5 Series", "X3", "X5"]
  }
];