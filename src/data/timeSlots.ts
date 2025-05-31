export interface TimeSlot {
  time: string;
  available: boolean;
}
interface FullTimeSlot {
  time: string;
  available: boolean;
}
// export const timeSlots = {
//   morning: [
//     { time: "06:30 AM", available: true },
//     { time: "07:00 AM", available: true },
//     { time: "07:30 AM", available: true },
//     { time: "08:00 AM", available: true },
//     { time: "08:30 AM", available: true },
//     { time: "09:00 AM", available: true },
//     { time: "09:30 AM", available: true },
//     { time: "10:00 AM", available: true },
//     { time: "10:30 AM", available: true },
//     { time: "11:00 AM", available: true },
//     { time: "11:30 AM", available: true }
//   ],
//   afternoon: [
//     { time: "12:00 PM", available: true },
//     { time: "12:30 PM", available: true },
//     { time: "01:00 PM", available: true },
//     { time: "01:30 PM", available: true },
//     { time: "02:00 PM", available: true },
//     { time: "02:30 PM", available: true },
//     { time: "03:00 PM", available: true }
//   ],
//   evening: [
//     { time: "03:30 PM", available: true },
//     { time: "04:00 PM", available: true },
//     { time: "04:30 PM", available: true },
//     { time: "05:00 PM", available: true },
//     { time: "05:30 PM", available: true }
//   ]
// } as const; 

// export const fullTimeSlots = {
//   times: [
//     { time: "06:30 AM", available: true },
//     { time: "07:00 AM", available: true },
//     { time: "07:30 AM", available: true },
//     { time: "08:00 AM", available: true },
//     { time: "08:30 AM", available: true },
//     { time: "09:00 AM", available: true },
//     { time: "09:30 AM", available: true },
//     { time: "10:00 AM", available: true },
//     { time: "10:30 AM", available: true },
//     { time: "11:00 AM", available: true },
//     { time: "11:30 AM", available: true },
//     { time: "12:00 PM", available: true },
//     { time: "12:30 PM", available: true },
//     { time: "01:00 PM", available: true },
//     { time: "01:30 PM", available: true },
//     { time: "02:00 PM", available: true },
//     { time: "02:30 PM", available: true },
//     { time: "03:00 PM", available: true },
//     { time: "03:30 PM", available: true },
//     { time: "04:00 PM", available: true },
//     { time: "04:30 PM", available: true },
//     { time: "05:00 PM", available: true },
//     { time: "05:30 PM", available: true },
//   ]
// } as const; 