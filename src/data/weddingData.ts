import { WeddingData } from '../types';

export const weddingData: WeddingData = {
  groom: {
    name: "Tahta",
    fullName: "Tahta Ramadian S.Kom",
    father: "Bpk. Sukarna",
    mother: "Ibu Siti Robiah",
    image: "/images/groom.jpg",
    instagram: "@tahtarmadian"
  },
  bride: {
    name: "Sipah",
    fullName: "Sipah Pauziah",
    father: "Bpk. H Oding Wasdi Sanjaya",
    mother: "Ibu HJ Anah Karnah",
    image: "/images/bride.jpg",
    instagram: "@sipahp126"
  },
  event: {
    date: "2026-06-06T08:00:00",
    akad: {
      time: "08:00 - 10:00 WIB",
      location: "Masjid Jami Al Istiqomah",
      address: "Kiarapayung, Kec. Rancah, Kabupaten Ciamis, Jawa Barat 46387",
      mapsUrl: "https://maps.app.goo.gl/ExqWySoFXyR4ySTVA"
    },
    resepsi: {
      time: "11:00 - 16:00 WIB",
      location: "Istana H. Oding",
      address: "Kiarapayung, Kec. Rancah, Kabupaten Ciamis, Jawa Barat 46387",
      mapsUrl: "https://maps.app.goo.gl/nvoag5PYNyqiYayp6"
    }
  },
  stories: [
    {
      year: "2022",
      title: "Pertemuan Pertama",
      description: "Bertemu di sebuah acara kebudayaan Sunda di Bandung, berawal dari ketertarikan yang sama terhadap angklung."
    },
    {
      year: "2024",
      title: "Khittbah",
      description: "Setelah dua tahun saling mengenal, keluarga besar kami sepakat untuk melangkah ke jenjang yang lebih serius."
    },
    {
      year: "2026",
      title: "Pernikahan",
      description: "Hari bersejarah di mana kami mengikat janji suci di hadapan Allah SWT dan keluarga tercinta."
    }
  ],
  gallery: [
    "/images/hero.jpg",
    "/images/background-priangan.jpg",
    "/images/bride.jpg",
    "/images/groom.jpg",
    "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg",
    "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg"
  ]
};
