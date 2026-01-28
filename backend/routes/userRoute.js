import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';
import { validateUserRegistration, validateUserLogin, validateProfileUpdate, validateAppointmentBooking } from '../middlewares/validation.js';

const userRouter = express.Router();

userRouter.post("/register", validateUserRegistration, registerUser)
userRouter.post("/login", validateUserLogin, loginUser)
userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, validateProfileUpdate, updateProfile)
userRouter.post("/book-appointment", authUser, validateAppointmentBooking, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
userRouter.post("/payment-razorpay", authUser, paymentRazorpay)
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay)


 




export default userRouter;