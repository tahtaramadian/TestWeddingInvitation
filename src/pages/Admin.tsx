import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Send, CheckCircle, XCircle, Clock, Trash2, Plus, ExternalLink } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  whatsapp: string;
  category: string;
  status: 'pending' | 'attending' | 'not_attending';
  opened: boolean;
}

export default function Admin() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newName, setNewName] = useState('');
  const [newWA, setNewWA] = useState('');
  const [newCat, setNewCat] = useState('Keluarga');

  useEffect(() => {
    const saved = localStorage.getItem('wedding_guests');
    if (saved) {
      setGuests(JSON.parse(saved));
    } else {
      const initial: Guest[] = [
        { id: '1', name: 'Bpk. Ridwan Kamil', whatsapp: '628123456789', category: 'VIP', status: 'pending', opened: false },
        { id: '2', name: 'Teh Desy Ratnasari', whatsapp: '628987654321', category: 'Keluarga', status: 'attending', opened: true },
      ];
      setGuests(initial);
      localStorage.setItem('wedding_guests', JSON.stringify(initial));
    }
  }, []);

  const saveGuests = (updated: Guest[]) => {
    setGuests(updated);
    localStorage.setItem('wedding_guests', JSON.stringify(updated));
  };

  const addGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newWA) return;
    const newGuest: Guest = {
      id: Date.now().toString(),
      name: newName,
      whatsapp: newWA,
      category: newCat,
      status: 'pending',
      opened: false
    };
    saveGuests([...guests, newGuest]);
    setNewName('');
    setNewWA('');
  };

  const deleteGuest = (id: string) => {
    saveGuests(guests.filter(g => g.id !== id));
  };

  const generateLink = (name: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?to=${encodeURIComponent(name)}`;
  };

  const sendWhatsApp = (guest: Guest) => {
    const link = generateLink(guest.name);
    const message = `Sampurasun ${guest.name},\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nSilakan buka undangan digital kami pada link di bawah ini:\n${link}\n\nMerupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\n\nHatur nuhun.`;
    window.open(`https://wa.me/${guest.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-wood">Admin Dashboard</h1>
            <p className="text-gray-500">Manajemen Tamu Undangan Pernikahan Tahta & Sipah</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <Users className="text-brand-gold" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Total Tamu</p>
                <p className="text-xl font-bold text-brand-wood">{guests.length}</p>
              </div>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <CheckCircle className="text-green-500" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Hadir</p>
                <p className="text-xl font-bold text-brand-wood">{guests.filter(g => g.status === 'attending').length}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Guest Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-brand-wood mb-6 flex items-center gap-2">
                <Plus size={20} className="text-brand-gold" /> Tambah Tamu
              </h2>
              <form onSubmit={addGuest} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-1">Nama Tamu</label>
                  <input 
                    required 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none" 
                    placeholder="Contoh: Bpk. Jajang"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-1">WhatsApp (62...)</label>
                  <input 
                    required 
                    value={newWA}
                    onChange={(e) => setNewWA(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none" 
                    placeholder="62812345678"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-1">Kategori</label>
                  <select 
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                  >
                    <option>Keluarga</option>
                    <option>Teman Kantor</option>
                    <option>Sahabat</option>
                    <option>VIP</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-3 bg-brand-gold text-white rounded-xl font-bold hover:bg-brand-wood transition-all">
                  Simpan Tamu
                </button>
              </form>
            </div>
          </div>

          {/* Guest List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Nama & Kategori</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Dibuka</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {guests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-brand-wood">{guest.name}</p>
                          <p className="text-xs text-gray-400">{guest.category} • {guest.whatsapp}</p>
                        </td>
                        <td className="px-6 py-4">
                          {guest.status === 'attending' ? (
                            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">Hadir</span>
                          ) : guest.status === 'not_attending' ? (
                            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">Tidak Hadir</span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs font-bold">Pending</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {guest.opened ? (
                            <CheckCircle size={18} className="text-green-500" />
                          ) : (
                            <Clock size={18} className="text-gray-300" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => sendWhatsApp(guest)}
                            className="p-2 text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors"
                            title="Kirim WhatsApp"
                          >
                            <Send size={18} />
                          </button>
                          <button 
                            onClick={() => window.open(generateLink(guest.name), '_blank')}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Buka Link"
                          >
                            <ExternalLink size={18} />
                          </button>
                          <button 
                            onClick={() => deleteGuest(guest.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {guests.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                  Belum ada tamu yang ditambahkan.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
