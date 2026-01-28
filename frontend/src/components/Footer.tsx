import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer: React.FC = () => {
  return (
    <div className="px-6 md:px-10">
      <div className="grid md:grid-cols-[3fr_1fr_1fr] gap-12 my-10 mt-24 text-sm items-start">
        {/* Left Section */}
        <div className="flex items-start gap-4">
          <img className="w-28 mt-1" src={assets.logo} alt="Appointy Logo" />
          <p className="text-gray-600 leading-6 md:max-w-[75%]">
            <strong>Appointy – Effortless Healthcare Scheduling</strong> <br />
            Patients can instantly book appointments with trusted doctors—from routine check-ups to specialist care—in just a few clicks. Our smart reminders keep appointments on track, while real-time updates ensure seamless coordination. Designed for modern healthcare, we save time for both patients and providers.
          </p>
        </div>

        {/* Middle Section */}
        <div>
          <p className="text-lg font-semibold mb-4">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-primary transition-colors" aria-label="Go to home page">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary transition-colors" aria-label="Go to about page">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors" aria-label="Go to contact page">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-primary transition-colors" aria-label="View privacy policy">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className="text-lg font-semibold mb-4">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+91-90000-90000</li>
            <li>customersupport@appointy.in</li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <hr className="border-gray-300" />
      <p className="py-4 text-sm text-center text-gray-600">
        © 2025 appointy.in — All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
