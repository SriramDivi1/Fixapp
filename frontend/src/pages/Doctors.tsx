import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Doctor } from '../types/database';

// TODO: Replace with useDoctors hook in Phase 3
// For now, using sample data
const SAMPLE_DOCTORS: Doctor[] = [];

type Speciality = 'General physician' | 'Gynecologist' | 'Dermatologist' | 'Pediatricians' | 'Neurologist' | 'Gastroenterologist';

const SPECIALITIES: Speciality[] = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist',
];

const Doctors: React.FC = () => {
  const { speciality } = useParams<{ speciality?: string }>();
  const [filterDoc, setFilterDoc] = useState<Doctor[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  // TODO: In Phase 3, replace with useDoctors() hook
  const doctors = SAMPLE_DOCTORS;

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.specialization === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const handleSpecialityClick = (spec: Speciality) => {
    if (speciality === spec) {
      navigate('/doctors');
    } else {
      navigate(`/doctors/${spec}`);
    }
  };

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? 'bg-primary text-white' : ''
          }`}
        >
          Filters
        </button>

        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {SPECIALITIES.map((spec) => (
            <p
              key={spec}
              onClick={() => handleSpecialityClick(spec)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === spec ? 'bg-[#E2E5FF] text-black' : ''
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.map((item, index) => (
            <div
              onClick={() => {
                navigate(`/appointment/${item.id}`);
                scrollTo(0, 0);
              }}
              className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
              key={index}
            >
              <img className='bg-[#EAEFFF]' src={item.profile_image_url || '/fallback-doctor.png'} alt="" />
              <div className='p-4'>
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    item.is_available ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  <p
                    className={`w-2 h-2 rounded-full ${
                      item.is_available ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  ></p>
                  <p>{item.is_available ? 'Available' : 'Not Available'}</p>
                </div>
                <p className='text-[#262626] text-lg font-medium'>{item.full_name}</p>
                <p className='text-[#5C5C5C] text-sm'>{item.specialization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
