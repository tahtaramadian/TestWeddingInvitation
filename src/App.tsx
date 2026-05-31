import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Pause, Play, Heart, Calendar, MapPin, Gift, MessageCircle, Clock, Users, ChevronRight, Send, Camera } from 'lucide-react';
import { weddingData } from './data/weddingData';
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import confetti from 'canvas-confetti';
import type { RSVP } from './types/index';
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycby4_FkG6ePryyLV6R8U2xTEGVjrBQ6RIj_l-cMdPbW6OPXl2t1AiemWeqZPXs6hDZFuFw/exec';


// --- Components ---

const Opening = ({ onOpen, guestName }: { onOpen: () => void, guestName: string }) => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, y: -100 }}
    transition={{ duration: 1 }}
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-cream overflow-hidden"
  >
    <div className="absolute inset-0 megamendung-bg" />
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative z-10 text-center px-4"
    >
      <img src="/images/Wayang.png" alt="Saung" className="w-48 h-48 mx-auto mb-8 rounded-full border-4 border-brand-gold shadow-xl" />
      <h2 className="text-brand-wood text-xl uppercase tracking-widest mb-4">The Wedding of</h2>
      <h1 className="font-accent text-6xl md:text-8xl text-brand-gold mb-6">{weddingData.groom.name} & {weddingData.bride.name}</h1>
      
      <div className="mb-12">
        <p className="text-brand-wood/70 italic mb-2">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
        <h3 className="text-2xl font-serif text-brand-wood font-bold">{guestName || 'Tamu Undangan'}</h3>
      </div>

      <button 
        onClick={onOpen}
        className="px-8 py-3 bg-brand-gold text-white rounded-full font-serif text-lg shadow-lg hover:bg-brand-wood transition-colors flex items-center gap-2 mx-auto"
      >
        <Send size={18} /> Buka Undangan
      </button>
    </motion.div>
    
    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-gold/20 to-transparent" />
  </motion.div>
);

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(targetDate);
      
      setTimeLeft({
        days: Math.max(0, differenceInDays(target, now)),
        hours: Math.max(0, differenceInHours(target, now) % 24),
        minutes: Math.max(0, differenceInMinutes(target, now) % 60),
        seconds: Math.max(0, differenceInSeconds(target, now) % 60)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="bg-white/80 backdrop-blur p-3 rounded-xl border border-brand-gold/30 shadow-sm text-center">
          <div className="text-2xl md:text-3xl font-bold text-brand-gold">{value}</div>
          <div className="text-[10px] uppercase tracking-widest text-brand-wood/60">{unit}</div>
        </div>
      ))}
    </div>
  );
};

const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center mb-12">
    {subtitle && <p className="text-brand-gold font-accent text-2xl mb-2">{subtitle}</p>}
    <h2 className="text-4xl md:text-5xl font-serif text-brand-wood relative inline-block">
      {title}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-brand-gold" />
    </h2>
  </div>
);

type RSVPFormProps = {
  onSubmitSuccess: (rsvp: RSVP) => void;
};
const RSVPForm = ({ onSubmitSuccess }: RSVPFormProps) => {
  const [status, setStatus] = useState<
    'pending' | 'attending' | 'not_attending'
  >('pending');

  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (status === 'pending') {
    alert('Silakan pilih konfirmasi kehadiran');
    return;
  }

  const newRSVP: RSVP = {
    id: crypto.randomUUID(),
    guestId: '',
    name,
    message,
    status,
    guestsCount,
    createdAt: new Date().toISOString(),
  };

  try {
    await fetch(GOOGLE_SCRIPT_URL,
  {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newRSVP),
  }
);

onSubmitSuccess(newRSVP);

    setSubmitted(true);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#8B4513', '#F5F5DC'],
    });

  } catch (error) {
    console.error(error);
    alert('Gagal mengirim RSVP');
  }
};
  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-white/80 rounded-2xl border-2 border-brand-gold"
      >
        <Heart className="mx-auto text-brand-gold mb-4" size={48} fill="currentColor" />
        <h3 className="text-2xl font-serif mb-2 text-brand-wood">Hatur Nuhun!</h3>
        <p className="text-brand-wood/70 text-sm">Konfirmasi kehadiran Anda telah kami terima.</p>
      </motion.div>
    );
  }
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/50 backdrop-blur-md p-8 rounded-3xl border border-brand-gold/20 shadow-xl">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-brand-wood">Nama Lengkap</label>
        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-brand-gold/30 focus:ring-2 focus:ring-brand-gold outline-none" placeholder="Masukkan nama Anda" value={name} onChange ={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-brand-wood">Konfirmasi Kehadiran</label>
        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => setStatus('attending')}
            className={`py-3 rounded-xl border transition-all ${status === 'attending' ? 'bg-brand-gold text-white border-brand-gold shadow-md' : 'bg-white text-brand-wood border-brand-gold/30'}`}>
            Hadir
          </button>
          <button 
            type="button"
            onClick={() => setStatus('not_attending')}
            className={`py-3 rounded-xl border transition-all ${status === 'not_attending' ? 'bg-brand-gold text-white border-brand-gold shadow-md' : 'bg-white text-brand-wood border-brand-gold/30'}`}
          >
            Tidak Hadir
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-brand-wood">Jumlah Tamu</label>
        <select className="w-full px-4 py-3 rounded-xl border border-brand-gold/30 focus:ring-2 focus:ring-brand-gold outline-none" value={guestsCount} onChange={(e) => setGuestsCount(Number(e.target.value))}>
          <option value= {1}>1 Orang</option>
          <option value ={2}>2 Orang</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-brand-wood"  >Pesan / Ucapan</label>
        <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-brand-gold/30 focus:ring-2 focus:ring-brand-gold outline-none" placeholder="Berikan ucapan selamat & doa untuk mempelai" value ={message} onChange = {(e) => setMessage(e.target.value)}/>
      </div>
      <button type="submit" className="w-full py-4 bg-brand-gold text-white rounded-xl font-bold shadow-lg hover:bg-brand-wood transition-all active:scale-95">
        Kirim Konfirmasi
      </button>
    </form>
  );
};

// --- Main App Component ---

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [guestName, setGuestName] = useState('');

   // RSVP STATE
  const [rsvps, setRsvps] = useState<RSVP[]>([]);

 
 
  // TAMBAH RSVP
  const handleAddRSVP = (rsvp: RSVP) => {
    setRsvps((prev) => [rsvp, ...prev]);
  };

  const guest = {
  id: crypto.randomUUID(),
  name: guestName || 'Guest',
};


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);  
    setGuestName(params.get('to') || '');

  }, []);

  const handleOpen = async () => {
  setIsOpen(true);

  try {
    if (audioRef.current) {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  } catch (err) {
    console.error('Audio play failed:', err);
  }
};

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

    const fetchGuests = async () => {
  try {

    const res = await fetch(GOOGLE_SCRIPT_URL);

    const data = await res.json();

    setRsvps(data);

  } catch (error) {

    console.error('Fetch guest error:', error);

  }
};
  useEffect(() => {
    fetchGuests();
  }, []);




  

  return (
    <div className="relative min-h-screen">
    <audio ref={audioRef}loop preload="auto" src="/music/Kacapi_Suling_sunda.mp3" onPlay={() => console.log('Audio started')}onError={(e) => console.log('Audio error', e)}/>
      
      <AnimatePresence>
        {!isOpen && <Opening onOpen={handleOpen} guestName={guestName} />}
      </AnimatePresence>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          {/* Music Control */}
          <button 
            onClick={toggleMusic}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-brand-gold text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce"
          >
            {isPlaying ? <Music size={24} className="animate-spin-slow" /> : <Pause size={24} />}
          </button>

          {/* Hero Section */}
          <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
            <div className="absolute inset-0 scale-110">
              <img src="/images/hero.jpg" alt="Hero" className="w-full h-full object-cover filter brightness-50" />
            </div>
            <div className="relative z-10 text-white">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="uppercase tracking-[0.3em] mb-4 text-sm md:text-base"
              >
                The Wedding Celebration of
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-accent text-7xl md:text-9xl mb-8 text-brand-gold"
              >
                {weddingData.groom.name} & {weddingData.bride.name}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Countdown targetDate={weddingData.event.date} />
              </motion.div>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
              <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
            </div>
          </section>

          {/* Quotes Section */}
          <section className="py-24 px-6 bg-white relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <img src="/images/pattern-megamendung.png" className="w-24 opacity-20" alt="pattern" />
              </div>
              <p className="text-lg md:text-xl text-brand-wood leading-relaxed italic">
                "Ar-Rum: 21 - Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
              </p>
              <div className="mt-8 flex justify-center rotate-180">
                <img src="/images/pattern-megamendung.png" className="w-24 opacity-20" alt="pattern" />
              </div>
            </div>
          </section>

          {/* Profile Section */}
          <section className="py-24 px-6 bg-brand-cream relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full megamendung-bg opacity-5" />
            <div className="max-w-5xl mx-auto relative z-10">
              <SectionTitle title="Mempelai" subtitle="Sampurasun" />
              
              <div className="grid md:grid-cols-2 gap-16 items-center">
                {/* Groom */}
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-center"
                >
                  <div className="relative inline-block mb-8">
                    <div className="absolute -inset-4 border-2 border-brand-gold rounded-full animate-pulse" />
                    <img src={weddingData.groom.image} alt="Groom" className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-8 border-white shadow-2xl" />
                  </div>
                  <h3 className="text-3xl font-serif text-brand-wood mb-2">{weddingData.groom.fullName}</h3>
                  <p className="text-brand-wood/70 mb-4">Putra dari:</p>
                  <p className="font-semibold text-brand-wood">{weddingData.groom.father}</p>
                  <p className="text-brand-wood">& {weddingData.groom.mother}</p>
                  <a href={`https://instagram.com/${weddingData.groom.instagram.replace('@','')}`} className="inline-flex items-center gap-2 mt-6 text-brand-gold hover:text-brand-wood transition-colors">
                    <MessageCircle size={20} /> {weddingData.groom.instagram}
                  </a>
                </motion.div>

                {/* Bride */}
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-center"
                >
                  <div className="relative inline-block mb-8">
                    <div className="absolute -inset-4 border-2 border-brand-gold rounded-full animate-pulse" />
                    <img src={weddingData.bride.image} alt="Bride" className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-8 border-white shadow-2xl" />
                  </div>
                  <h3 className="text-3xl font-serif text-brand-wood mb-2">{weddingData.bride.fullName}</h3>
                  <p className="text-brand-wood/70 mb-4">Putri dari:</p>
                  <p className="font-semibold text-brand-wood">{weddingData.bride.father}</p>
                  <p className="text-brand-wood">& {weddingData.bride.mother}</p>
                  <a href={`https://instagram.com/${weddingData.bride.instagram.replace('@','')}`} className="inline-flex items-center gap-2 mt-6 text-brand-gold hover:text-brand-wood transition-colors">
                    <MessageCircle size={20} /> {weddingData.bride.instagram}
                  </a>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Event Section */}
          <section className="py-24 px-6 bg-white relative">
             <div className="max-w-6xl mx-auto">
                <SectionTitle title="Runtuyan Acara" subtitle="Waktos & Tempat" />
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Akad */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="p-10 rounded-[3rem] bg-brand-cream border-2 border-brand-gold/20 text-center relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-bl-full transition-all group-hover:scale-150" />
                    <Heart className="mx-auto text-brand-gold mb-6" size={48} />
                    <h3 className="text-3xl font-serif text-brand-wood mb-4">Akad Nikah</h3>
                    <div className="space-y-4 text-brand-wood/80">
                      <div className="flex items-center justify-center gap-3">
                        <Calendar size={20} className="text-brand-gold" />
                        <p className="font-semibold">{format(new Date(weddingData.event.date), 'EEEE, dd MMMM yyyy')}</p>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <Clock size={20} className="text-brand-gold" />
                        <p>{weddingData.event.akad.time}</p>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <MapPin size={20} className="text-brand-gold" />
                        <div className="text-center">
                          <p className="font-bold">{weddingData.event.akad.location}</p>
                          <p className="text-sm">{weddingData.event.akad.address}</p>
                        </div>
                      </div>
                    </div>
                  <button onClick={() => window.open(weddingData.event.akad.mapsUrl, "_blank")}
                  className="mt-10 px-8 py-3 bg-brand-wood text-white rounded-full hover:bg-brand-gold transition-all shadow-lg">
                   Lihat Lokasi
                   </button>
                  </motion.div>

                  {/* Resepsi */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-10 rounded-[3rem] bg-brand-wood text-white text-center relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full transition-all group-hover:scale-150" />
                    <Users className="mx-auto text-brand-gold mb-6" size={48} />
                    <h3 className="text-3xl font-serif mb-4">Resepsi</h3>
                    <div className="space-y-4 text-white/80">
                      <div className="flex items-center justify-center gap-3">
                        <Calendar size={20} className="text-brand-gold" />
                        <p className="font-semibold">{format(new Date(weddingData.event.date), 'EEEE, dd MMMM yyyy')}</p>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <Clock size={20} className="text-brand-gold" />
                        <p>{weddingData.event.resepsi.time}</p>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <MapPin size={20} className="text-brand-gold" />
                        <div className="text-center">
                          <p className="font-bold text-white">{weddingData.event.resepsi.location}</p>
                          <p className="text-sm">{weddingData.event.resepsi.address}</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => window.open(weddingData.event.akad.mapsUrl, "_blank")}
                    className="mt-10 px-8 py-3 bg-brand-gold text-white rounded-full hover:bg-white hover:text-brand-wood transition-all shadow-lg">
                      Lihat Lokasi
                    </button>
                  </motion.div>
                </div>
             </div>
          </section>

          {/* Love Story Section */}
          <section className="py-24 px-6 bg-brand-cream relative">
            <div className="max-w-4xl mx-auto">
              <SectionTitle title="Lalampahan Cinta" subtitle="Love Story" />
              
              <div className="space-y-12">
                {weddingData.stories.map((story, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className={`flex flex-col md:flex-row gap-8 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="w-24 h-24 flex-shrink-0 bg-brand-gold text-white rounded-full flex items-center justify-center text-xl font-bold border-4 border-white shadow-xl">
                      {story.year}
                    </div>
                    <div className={`flex-1 bg-white p-8 rounded-3xl shadow-sm border border-brand-gold/10 relative ${idx % 2 === 0 ? 'text-left' : 'text-right'}`}>
                       <h4 className="text-2xl font-serif text-brand-wood mb-2">{story.title}</h4>
                       <p className="text-brand-wood/70">{story.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Gallery Section */}
          <section className="py-24 px-6 bg-white overflow-hidden">
             <div className="max-w-7xl mx-auto">
                <SectionTitle title="Galeri" subtitle="Momen Indah" />
                
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                  {weddingData.gallery.map((img, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative group rounded-2xl overflow-hidden shadow-lg"
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-brand-wood/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="text-white" size={32} />
                      </div>
                    </motion.div>
                  ))}
                </div>
             </div>
          </section>

          {/* RSVP & Guest Book Section */}
          <section className="py-24 px-6 bg-brand-cream relative">
            <div className="absolute inset-0 opacity-10">
              <img src="/images/background-priangan.jpg" className="w-full h-full object-cover grayscale" alt="bg" />
            </div>
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="grid md:grid-cols-2 gap-16">
                <div>
                  <SectionTitle title="RSVP" subtitle="Konfirmasi Kehadiran" />
                <RSVPForm onSubmitSuccess={handleAddRSVP} />
                </div>
                <div>
                  <SectionTitle title="Buku Tamu" subtitle="Doa & Harapan" />
                  <div className="bg-white/50 backdrop-blur-md p-8 rounded-3xl border border-brand-gold/20 shadow-xl max-h-[600px] overflow-y-auto space-y-6">
                    {/* Mock Guest Comments */}
                   {rsvps.map((rsvp) => (
                  <div
    key={rsvp.id}
    className="border-b border-brand-gold/10 pb-6 last:border-0"
  >
    <div className="flex items-center gap-3 mb-2">

      <div className="w-10 h-10 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold font-bold">
        {rsvp.name.charAt(0).toUpperCase()}
      </div>

      <div>
        <h5 className="font-bold text-brand-wood">
          {rsvp.name}
        </h5>

        <p className="text-[10px] text-brand-wood/50">
          {new Date(rsvp.createdAt).toLocaleString()}
        </p>
      </div>

    </div>

    <p className="text-brand-wood/80 italic">
      "{rsvp.message}"
    </p>

    <div className="mt-2 text-xs text-brand-gold">
      {rsvp.status === 'attending'
        ? `Akan hadir (${rsvp.guestsCount} orang)`
        : 'Tidak hadir'}
    </div>
  </div>
))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Digital Gift Section */}
          <section className="py-24 px-6 bg-white">
            <div className="max-w-3xl mx-auto text-center">
              <SectionTitle title="Tanda Kasih" subtitle="Digital Gift" />
              <p className="text-brand-wood/70 mb-12">Doa restu Anda merupakan kado terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih, Anda dapat melalui:</p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-8 rounded-3xl bg-brand-cream border border-brand-gold/20 flex flex-col items-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" alt="BCA" className="h-8 mb-6" />
                  <p className="font-bold text-xl text-brand-wood">7285181046</p>
                  <p className="text-brand-wood/60 mb-4">a.n Tahta Ramadian</p>
                  <button onClick={()=>{navigator.clipboard.writeText("7285181046");
                    alert("Nomor rekening berhasil disalin");
                  }}
                  className="px-6 py-2 bg-brand-gold text-white rounded-full text-sm hover:bg-brand-wood transition-all">Salin Rekening</button>
                </div>
                <div className="p-8 rounded-3xl bg-brand-cream border border-brand-gold/20 flex flex-col items-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" alt="BCA" className="h-8 mb-6" />
                  <p className="font-bold text-xl text-brand-wood">5520608798</p>
                  <p className="text-brand-wood/60 mb-4">a.n Sipah Pauziah</p>
                  <button onClick={()=>{navigator.clipboard.writeText("5520608798");
                    alert("Nomor rekening berhasil disalin");
                  }}
                  className="px-6 py-2 bg-brand-gold text-white rounded-full text-sm hover:bg-brand-wood transition-all">Salin Rekening</button>
                </div>
                <div className="p-10 rounded-3xl bg-brand-cream border border-brand-gold/20 flex flex-col items-center">
                  <div className="h-8 mb-6 flex items-center gap-2">
                    <Gift className="text-brand-gold" />
                    <span className="font-bold text-brand-wood">Kirim Hadiah</span>
                  </div>
                  <p className="font-bold text-brand-wood">Jl. Jendral Sudirman No. 123</p>
                  <p className="text-brand-wood/60 mb-4">Bandung, Jawa Barat</p>
                  <button onClick={()=>{navigator.clipboard.writeText("Jl. Jendral Sudirman No. 123 Bandung, Jawa Barat");
                  alert("Alamat telah berhasil disalin");
                  }}
                  className="px-6 py-2 bg-brand-gold text-white rounded-full text-sm hover:bg-brand-wood transition-all">Salin Alamat</button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-16 px-6 bg-brand-wood text-white text-center">
            <h2 className="font-accent text-5xl mb-6 text-brand-gold">{weddingData.groom.name} & {weddingData.bride.name}</h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.</p>
            <div className="flex justify-center gap-6 mb-12">
               <div className="w-12 h-12 border border-brand-gold/50 rounded-full flex items-center justify-center text-brand-gold">
                 <Heart size={20} />
               </div>
            </div>
            <p className="text-xs tracking-widest text-white/40 uppercase">Made with Love & Sundanese Pride</p>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
