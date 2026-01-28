import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { toast } from 'react-toastify';

const Appointment: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // TODO: Replace with useDoctor(docId) hook in Phase 3
  const doctor: any = null;
  const loading = false;

  const handleBookAppointment = async () => {
    if (!user) {
      toast.error('Please log in to book an appointment');
      navigate('/login');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }

    // TODO: Implement booking logic in Phase 3
    toast.info('Booking functionality will be implemented in Phase 3');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">Doctor not found</p>
        <button
          onClick={() => navigate('/doctors')}
          className="bg-primary text-white px-6 py-2 rounded-md"
        >
          Browse Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start gap-6 mb-8">
          <img
            src={doctor.profile_image_url || '/fallback-doctor.png'}
            alt="Doctor"
            className="w-32 h-32 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{doctor.full_name}</h1>
            <p className="text-gray-600 mb-1">{doctor.specialization}</p>
            <p className="text-gray-500 text-sm">{doctor.qualification}</p>
            <p className="text-gray-500 text-sm">{doctor.experience_years} years experience</p>
            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  doctor.is_available
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {doctor.is_available ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>

        {doctor.bio && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-gray-600">{doctor.bio}</p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Consultation Fee</h2>
          <p className="text-2xl font-bold text-primary">₹{doctor.consultation_fee}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Book Appointment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleBookAppointment}
          className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default Appointment;
