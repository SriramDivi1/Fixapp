# Fixapp - Advanced Healthcare Appointment Platform

**Fixapp** is a modern, full-stack healthcare platform designed to revolutionize medical appointment booking and management. It provides three distinct user experiences: **Patient**, **Doctor**, and **Admin**, each with role-specific features. The platform integrates secure payment processing, real-time updates, and comprehensive healthcare management tools. Built with modern technologies and best practices, Fixapp delivers a seamless, secure experience for all healthcare stakeholders.

## 🛠️ Tech Stack

- **Frontend**: React.js 19+ with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js with TypeScript
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Authentication**: Supabase Auth with JWT + Row Level Security
- **Payment Processing**: Razorpay with enhanced security
- **State Management**: Zustand with persistence
- **Caching**: Redis for performance optimization
- **Real-time**: Supabase real-time subscriptions
- **File Storage**: Supabase Storage (replacing Cloudinary)
- **API**: Type-safe APIs with Zod validation
- **Testing**: Vitest + Playwright
- **Deployment**: Docker containers with health checks

## � Enhanced Features

### 1. Advanced Three-Level Authentication & Authorization

- **Patient Portal**: 
  - Secure registration and authentication with email verification
  - Comprehensive appointment management with real-time updates
  - Multiple payment options (Razorpay, digital wallets)
  - Advanced profile management with medical history
  - Appointment reminders and notifications
  - Telemedicine integration ready

- **Doctor Dashboard**:
  - Real-time appointment notifications and updates
  - Advanced analytics: earnings, patient demographics, appointment trends
  - Flexible schedule management with availability slots
  - Patient communication tools and medical notes
  - Performance metrics and patient feedback
  - Integration with medical record systems

- **Admin Control Center**:
  - Comprehensive system analytics and reporting
  - Advanced doctor onboarding with document verification
  - Real-time monitoring of platform activity
  - Revenue tracking and financial analytics
  - User management with role-based permissions
  - System health monitoring and alerting

## 🏠 Home Page

- Features a user-friendly layout where users can:
  - **Search for doctors** based on specialties.
  - **View top doctors** and their profiles.
  - Explore additional sections: About Us, Delivery Information, Privacy Policy, and Get in Touch.
- **Footer** includes navigation links: Home, About Us, Delivery Info, Privacy Policy, Contact Us.

## 🩺 All Doctors Page

- Lists all available doctors.
- Users can **filter doctors by specialty**.
- Clicking on a doctor's profile redirects to the **Doctor Appointment Page**.

## 📄 About Page

- Provides information about **Fixapp’s vision** and mission.
- **Why Choose Us** section highlights:
  - **Efficiency**: Streamlined appointment process.
  - **Convenience**: Online booking and payment.
  - **Personalization**: Tailored experience based on user preferences.
- Footer section with additional links.

## 📞 Contact Page

- Contains **office address** and contact details.
- Section to explore job opportunities.
- Footer navigation links.

## 📅 Doctor Appointment Page

- Displays detailed information about the selected doctor:
  - **Profile picture, qualification, experience**, and a brief description.
  - **Appointment booking form**: Choose date, time, and payment method.
  - Online payment options: **Cash, Stripe, or Razorpay**.
  - **Related doctors** section at the bottom.
- Users need to **create an account or log in** before booking an appointment.

## 👤 User Profile

- Accessible after login.
- Users can view and edit their profile:
  - **Upload profile picture**.
  - Update **name, email, address, gender, and birthday**.
- View list of upcoming and past appointments.
- **Logout** option available.

## 🗄️ Admin Panel

- **Dashboard**:
  - Displays statistics: **Number of doctors**, **appointments**, **patients**, and **latest bookings**.
  - Option to **cancel bookings** if needed.
- **Add Doctor**:
  - Form to add a new doctor profile (image, specialty, email, password, degree, address, experience, fees, description).
- **Doctor List**:
  - View all registered doctors with options to edit or delete profiles.
- **Appointments**:
  - List of all appointments including patient name, age, date, time, doctor name, fees.
  - Admin actions: **Cancel** or **Mark as Completed**.

## 🩺 Doctor Dashboard

- **Earnings Overview**:
  - Total earnings from completed appointments.
- **Appointments List**:
  - View detailed list of patient appointments (name, age, date, time, payment mode, status).
  - Actions: **Mark appointment as completed** or **Cancel appointment**.
- **Profile Management**:
  - Doctors can update their **profile information**, including description, fees, address, and availability status.

## 💳 Payment Integration

- Supports multiple payment methods:
  - **Cash Payment**
  - **Razorpay Integration**
- Ensures a secure and smooth payment experience for users.

## 🌐 Project Setup

To set up and run this project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SriramDivi1/Fixapp.git
   cd Fixapp
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   cd client
   npm install
   ```

3. **Environment Variables**:
   - Create a `.env` file in the root directory and add the following:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     STRIPE_API_KEY=your_stripe_api_key
     RAZORPAY_API_KEY=your_razorpay_api_key
     ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```

## 📦 Folder Structure

```plaintext
Fixapp/
├── client/          # Frontend (React.js)
├── server/          # Backend (Node.js, Express.js)
├── models/          # MongoDB Schemas
├── controllers/     # API Controllers
├── routes/          # API Routes
├── middleware/      # Authentication and Error Handling
├── config/          # Configuration Files
├── utils/           # Utility Functions
├── public/          # Static Files
└── .env             # Environment Variables
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, fork the repository, and open pull requests.


## 🌟 Acknowledgements

- Thanks to the developers and contributors of MongoDB, Express.js, React.js, Node.js, Stripe, and Razorpay for their fantastic tools and libraries.

---
