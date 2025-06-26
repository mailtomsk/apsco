export interface ServiceCenter {
  id: string;
  name: string;
  address: string;
  state: string;
  area: string;
  thumbnail: string;
  rating: number;
  total_reviews: number;
  working_weekdays: string,
  working_saturday: string,
  working_sunday: string,
  status: 'active' | 'inactive';
  working_weekdays_start?: string;
  working_weekdays_end?: string;
  working_saturday_start?: string;
  working_saturday_end?: string;
  working_sunday_start?: string;
  working_sunday_end?: string;
}

const defaultImage = '/images/service-centers/kl-sentral.jpg';

export const serviceCenters: ServiceCenter[] = [
  {
    id: 'SC001',
    name: 'CarZone KLCC',
    address: '123 Jalan Sultan, Kuala Lumpur',
    state: 'Kuala Lumpur',
    area: 'City Center',
    thumbnail: defaultImage,
    rating: 4.8,
    total_reviews: 256,
    working_weekdays: '8:00 AM - 6:00 PM',
    working_saturday: '9:00 AM - 3:00 PM',
    working_sunday: 'Closed',
    status: 'active'
  },
  {
    id: 'SC002',
    name: 'CarZone Bukit Bintang',
    address: '45 Jalan Bukit Bintang, Kuala Lumpur',
    state: 'Kuala Lumpur',
    area: 'Bukit Bintang',
    thumbnail: defaultImage,
    rating: 4.6,
    total_reviews: 189,
    working_weekdays: '8:00 AM - 6:00 PM',
    working_saturday: '9:00 AM - 4:00 PM',
    working_sunday: 'Closed',
    status: 'active'
  },
  {
    id: 'SC003',
    name: 'CarZone KL Sentral',
    address: '78 Jalan Stesen Sentral, Kuala Lumpur',
    state: 'Kuala Lumpur',
    area: 'KL Sentral',
    thumbnail: defaultImage,
    rating: 4.7,
    total_reviews: 215,
    working_weekdays: '7:30 AM - 7:00 PM',
    working_saturday: '8:00 AM - 5:00 PM',
    working_sunday: '9:00 AM - 2:00 PM',
    status: 'active'
  }
]; 