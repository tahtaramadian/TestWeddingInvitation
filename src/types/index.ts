export interface Guest {
  id: string;
  name: string;
  slug: string;
  category: string;
  whatsapp: string;
  status: 'pending' | 'attending' | 'not_attending';
  guestsCount: number;
  openedAt?: string;
}

export interface RSVP {
  id: string;
  guestId: string;
  name: string;
  message: string;
  status: 'attending' | 'not_attending';
  guestsCount: number;
  createdAt: string;
}

export interface WeddingData {
  groom: {
    name: string;
    fullName: string;
    father: string;
    mother: string;
    image: string;
    instagram: string;
  };
  bride: {
    name: string;
    fullName: string;
    father: string;
    mother: string;
    image: string;
    instagram: string;
  };
  event: {
    date: string;
    akad: {
      time: string;
      location: string;
      address: string;
      mapsUrl: string;
    };
    resepsi: {
      time: string;
      location: string;
      address: string;
      mapsUrl: string;
    };
  };
  stories: {
    year: string;
    title: string;
    description: string;
  }[];
  gallery: string[];
}
