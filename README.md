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

- Provides information about **Appointy’s vision** and mission.
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
   cd appointy
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
appointy/
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

## 🔒 Security Best Practices

### Production Deployment Checklist

1. **Environment Variables**: Never commit `.env` files. Use the `.env.example` as a template.
   - Set `NODE_ENV=production` in production
   - Use strong, unique values for `JWT_SECRET` (at least 32 characters)
   - Configure `FRONTEND_URL` to match your production domain

2. **Rate Limiting**: The application includes rate limiting for authentication endpoints (5 attempts per 15 minutes) and general API endpoints (100 requests per 15 minutes).

3. **File Upload Security**: File uploads are restricted to:
   - Image files only (JPEG, PNG, WebP, GIF)
   - Maximum file size: 5MB
   - Files are renamed with unique identifiers to prevent path traversal

4. **JWT Tokens**: All tokens expire after 7 days. Implement token refresh logic if needed.

5. **CORS Configuration**: Update `FRONTEND_URL` environment variable to match your frontend domain to prevent unauthorized cross-origin requests.

6. **Database Security**: Ensure MongoDB/Supabase connection strings use SSL and strong passwords.

7. **Logging**: The application uses environment-aware logging. In production, sensitive error details are not exposed to clients.

### Vulnerability Reporting

If you discover a security vulnerability, please email security@fixapp.com (or create a private security advisory on GitHub) instead of creating a public issue.

## 🌟 Acknowledgements

- Thanks to the developers and contributors of MongoDB, Express.js, React.js, Node.js, Stripe, and Razorpay for their fantastic tools and libraries.

---
