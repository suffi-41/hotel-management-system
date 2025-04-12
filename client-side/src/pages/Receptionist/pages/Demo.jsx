// App.jsx
import { useState, useEffect } from 'react';
import { FiCalendar, FiUser, FiHome, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Demo = () => {
  const [rooms, setRooms] = useState([
    { id: 1, number: '101', type: 'Standard', price: 100, status: 'available' },
    { id: 2, number: '102', type: 'Deluxe', price: 150, status: 'available' },
    { id: 3, number: '201', type: 'Suite', price: 250, status: 'booked' },
  ]);

  const [bookings, setBookings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    guestName: '',
    checkIn: '',
    checkOut: '',
    contact: ''
  });

  useEffect(() => {
    // Load saved bookings from localStorage
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
  }, []);

  const handleBooking = () => {
    const newBooking = {
      id: Date.now(),
      roomNumber: selectedRoom.number,
      ...formData,
      status: 'confirmed'
    };

    setBookings([...bookings, newBooking]);
    localStorage.setItem('bookings', JSON.stringify([...bookings, newBooking]));
    
    // Update room status
    setRooms(rooms.map(room => 
      room.id === selectedRoom.id ? { ...room, status: 'booked' } : room
    ));

    setShowBookingForm(false);
    setFormData({ guestName: '', checkIn: '', checkOut: '', contact: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <FiHome className="text-blue-500" /> Hotel Room Booking System
      </h1>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {rooms.map(room => (
          <motion.div 
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Room {room.number}</h3>
                <p className="text-gray-600">{room.type}</p>
                <p className="text-blue-600 font-semibold">${room.price}/night</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                room.status === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {room.status}
              </span>
            </div>
            
            {room.status === 'available' && (
              <button
                onClick={() => {
                  setSelectedRoom(room);
                  setShowBookingForm(true);
                }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <FiCalendar /> Book Now
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiUser /> Book Room {selectedRoom?.number}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Guest Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.guestName}
                  onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Check-In</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block mb-1">Check-Out</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Contact Info</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleBooking}
                  className="btn-primary flex-1"
                >
                  Confirm Booking
                </button>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FiCheckCircle /> Current Bookings
        </h2>
        
        <div className="space-y-2">
          {bookings.map(booking => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b pb-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{booking.guestName}</h4>
                  <p className="text-sm text-gray-600">
                    Room {booking.roomNumber} • {booking.checkIn} to {booking.checkOut}
                  </p>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {booking.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Demo;

