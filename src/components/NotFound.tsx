
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";
import Logo from "../assets/images/logo.svg";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectTimer, setRedirectTimer] = useState(5);
  
  // Determine user type from URL
  const userType = location.pathname.includes("/user/l") 
    ? "l" 
    : location.pathname.includes("/user/s") 
      ? "s" 
      : "";
  
  // Set dashboard URL based on user type
  const dashboardUrl = userType ? `/user/${userType}/dashboard` : "/";
  
  useEffect(() => {
    // Countdown timer for auto-redirect
    const timer = setInterval(() => {
      setRedirectTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(dashboardUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [dashboardUrl, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <img src={Logo} alt="Logo" className="w-28 mb-8" />
      
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <p className="text-sm text-gray-500 mb-6">
          Redirecting to dashboard in {redirectTimer} seconds...
        </p>
        
        <button
          onClick={() => navigate(dashboardUrl)}
          className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-primary/90"
        >
          <RiArrowLeftLine className="mr-2" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
