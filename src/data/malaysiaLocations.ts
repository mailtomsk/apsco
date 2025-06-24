export interface State {
  id: number | null | undefined;
  name: string;
}

export interface Area {
  id?: number | null;
  name: string;
  state: {
    name: string;
  }
}
export interface carBrand {
  id: number | null | undefined;
  name: string;
}

export interface carModel {
  id: number | null | undefined;
  name: string;
  carBrand: {
    name: string;
  }
}


export const states: State[] = [
  { id: 1, name: 'Kuala Lumpur' },
  { id: 1, name: 'Selangor' },
  { id: 1, name: 'Penang' },
  { id: 1, name: 'Johor' }
];

export const areas: Area[] = [
  { name: 'City Center', state: { name: 'Kuala Lumpur' } },
  // { name: 'Petaling Jaya', state: 'Selangor' },
  // { name: 'Shah Alam', state: 'Selangor' },
  // { name: 'Subang Jaya', state: 'Selangor' },
  // { name: 'Georgetown', state: 'Penang' },
  // { name: 'Johor Bahru', state: 'Johor' }
]; 