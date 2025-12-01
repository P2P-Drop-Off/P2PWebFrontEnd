// src/functions/locationService.ts
import { Location } from '../types/location';

// Simulated API call to fetch locations
export const fetchLocations = async (): Promise<Location[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return dummy data based on the locations in the file
  return [
    {
      id: '1',
      name: 'Salvation Army',
      address: '23820 Mercury Rd, Lake Forest, CA 92630',
      lat: 33.6500,
      lng: -117.6900,
      phoneNumber: '(949) 231-5432',
      hours: {
        Monday: '9:00 AM - 5:00 PM',
        Tuesday: '9:00 AM - 5:00 PM',
        Wednesday: '9:00 AM - 5:00 PM',
        Thursday: '9:00 AM - 5:00 PM',
        Friday: '9:00 AM - 5:00 PM',
        Saturday: '9:00 AM - 3:00 PM',
        Sunday: 'Closed'
      }
    },
    {
      id: '2',
      name: 'Salvation Army',
      address: '2126 Harbor Blvd, Costa Mesa, CA 92627',
      lat: 33.6400,
      lng: -117.9200,
      phoneNumber: '(714) 532-4646',
      hours: {
        Monday: '9:00 AM - 5:00 PM',
        Tuesday: '9:00 AM - 5:00 PM',
        Wednesday: '9:00 AM - 5:00 PM',
        Thursday: '9:00 AM - 5:00 PM',
        Friday: '9:00 AM - 5:00 PM',
        Saturday: '9:00 AM - 3:00 PM',
        Sunday: 'Closed'
      }
    },
    {
      id: '3',
      name: 'Savers',
      address: '23641 Moulton Pkwy, Laguna Hills, CA 92653',
      lat: 33.6000,
      lng: -117.7000,
      phoneNumber: '(949) 231-5432',
      hours: {
        Monday: '9:00 AM - 5:00 PM',
        Tuesday: '9:00 AM - 5:00 PM',
        Wednesday: '9:00 AM - 5:00 PM',
        Thursday: '9:00 AM - 5:00 PM',
        Friday: '9:00 AM - 5:00 PM',
        Saturday: '9:00 AM - 3:00 PM',
        Sunday: 'Closed'
      }
    },
    {
      id: '4',
      name: "Peter's Exchange",
      address: '19148 Jamboree Rd, Irvine, CA 92612',
      lat: 33.6846,
      lng: -117.8265,
      phoneNumber: '(949) 231-5432',
      hours: {
        Monday: '9:00 AM - 5:00 PM',
        Tuesday: '9:00 AM - 5:00 PM',
        Wednesday: '9:00 AM - 5:00 PM',
        Thursday: '9:00 AM - 5:00 PM',
        Friday: '9:00 AM - 5:00 PM',
        Saturday: '9:00 AM - 3:00 PM',
        Sunday: 'Closed'
      }
    }
  ];
};
