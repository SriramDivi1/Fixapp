import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const [loading, setLoading] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const updateUserProfileData = async () => {
        setLoading(true);
        try {
            const formData = new FormData()
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update profile')
        } finally {
            setLoading(false);
        }
    }

    return userData ? (
        <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

            {isEdit ? (
                <label htmlFor='image'>
                    <div className='inline-block relative cursor-pointer'>
                        <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="Profile" />
                        <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="Upload icon" />
                    </div>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden accept="image/*" disabled={loading} />
                </label>
            ) : (
                <img className='w-36 rounded' src={userData.image} alt="User profile" />
            )}

            {isEdit ? (
                <input 
                    className='bg-gray-50 text-3xl font-medium max-w-60' 
                    type="text"
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    value={userData.name}
                    aria-label="Full name"
                    disabled={loading}
                />
            ) : (
                <p className='font-medium text-3xl text-[#262626] mt-4'>{userData.name}</p>
            )}

            <hr className='bg-[#ADADAD] h-[1px] border-none' />

            <div>
                <p className='text-gray-600 underline mt-3'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
                    <p className='font-medium'>Email id:</p>
                    <p className='text-blue-500'>{userData.email}</p>

                    <p className='font-medium'>Phone:</p>
                    {isEdit ? (
                        <input 
                            className='bg-gray-50 max-w-52' 
                            type="tel"
                            onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                            value={userData.phone}
                            aria-label="Phone number"
                            pattern="[0-9]*"
                            disabled={loading}
                        />
                    ) : (
                        <p className='text-blue-500'>{userData.phone}</p>
                    )}

                    <p className='font-medium'>Address:</p>
                    {isEdit ? (
                        <p>
                            <input 
                                className='bg-gray-50' 
                                type="text"
                                onChange={(e) => setUserData(prev => ({
                                    ...prev,
                                    address: { ...(prev.address || {}), line1: e.target.value }
                                }))}
                                value={userData.address?.line1 || ''}
                                aria-label="Address line 1"
                                placeholder="Street address"
                                disabled={loading}
                            />
                            <br />
                            <input 
                                className='bg-gray-50' 
                                type="text"
                                onChange={(e) => setUserData(prev => ({
                                    ...prev,
                                    address: { ...(prev.address || {}), line2: e.target.value }
                                }))}
                                value={userData.address?.line2 || ''}
                                aria-label="Address line 2"
                                placeholder="City, State, ZIP"
                                disabled={loading}
                            />
                        </p>
                    ) : (
                        <p className='text-gray-500'>{userData.address?.line1} <br /> {userData.address?.line2}</p>
                    )}
                </div>
            </div>

            <div>
                <p className='text-[#797979] underline mt-3'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
                    <p className='font-medium'>Gender:</p>
                    {isEdit ? (
                        <select 
                            className='max-w-20 bg-gray-50'
                            onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                            value={userData.gender}
                            aria-label="Gender"
                            disabled={loading}
                        >
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    ) : (
                        <p className='text-gray-500'>{userData.gender}</p>
                    )}

                    <p className='font-medium'>Birthday:</p>
                    {isEdit ? (
                        <input 
                            className='max-w-28 bg-gray-50' 
                            type='date'
                            onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                            value={userData.dob}
                            aria-label="Date of birth"
                            disabled={loading}
                        />
                    ) : (
                        <p className='text-gray-500'>{userData.dob}</p>
                    )}
                </div>
            </div>

            <div className='mt-10'>
                {isEdit ? (
                    <button 
                        onClick={updateUserProfileData} 
                        className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save information'}
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsEdit(true)} 
                        className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    ) : null
}

export default MyProfile
