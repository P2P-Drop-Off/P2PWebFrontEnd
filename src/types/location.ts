// src/types/location.ts
export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phoneNumber?: string;
  hours?: {
    [key: string]: string;
  };
}
