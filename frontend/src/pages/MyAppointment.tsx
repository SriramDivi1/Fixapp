import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRealtimeAppointments } from '../hooks/useRealtimeAppointments';

const MyAppointment: React.FC = () => {
  const { profile, user, loading } = useAuth();

  // Enable real-time updates for appointments
  useRealtimeAppointments(user?.id);

  // TODO: Replace with useAppointments hook in Phase 3
  const appointments: any[] = [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Please log in to view your appointments</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">My Appointments</h1>

      {appointments.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">You don't have any appointments yet</p>
          <button
            onClick={() => window.location.href = '/doctors'}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Browse Doctors
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {appointments.map((appointment, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={appointment.doctor?.profile_image_url || '/fallback-doctor.png'}
                    alt="Doctor"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{appointment.doctor?.full_name}</h3>
                    <p className="text-gray-600 text-sm">{appointment.doctor?.specialization}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                      {appointment.appointment_time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointment;
