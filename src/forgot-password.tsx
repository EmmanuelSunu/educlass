
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./assets/images/logo.svg";
import InputField from "./components/InputField";
import ButtonProps from "./components/ButtonProps";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // When backend is ready, this would be an actual API call
    }, 1500);
  };

  return (
    <div className="flex flex-col bg-grey-200 animate-fadeIn">
      <div className="w-full lg:flex-row bg-white h-screen p-8 lg:p-0 flex flex-col justify-center items-center animate-slideInUp">
        <div className="hidden lg:flex w-full lg:w-full bg-login h-screen bg-cover bg-no-repeat animate-fadeIn"></div>
        <div className="bg-white w-full lg:p-10 lg:w-1/3 p-0 h-max animate-slideInRight">
          <img
            src={Logo}
            alt="EduClass Logo"
            className="w-40 pb-7 flex justify-center animate-slideInUp"
            style={{ animationDelay: "0.2s" }}
          />
          
          {!isSubmitted ? (
            <>
              <div className="pb-4 animate-fadeIn">
                <h5 className="text-h5 text-dark animate-slideInUp">Forgot Password</h5>
                <span className="text-sm text-gray-500 animate-slideInUp">
                  Reset your password by entering your email
                </span>
              </div>
              
              {error && (
                <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-md animate-fadeIn">
                  {error}
                </div>
              )}
              
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 animate-fadeIn"
              >
                <div className="animate-fadeIn">
                  <label
                    htmlFor="email"
                    className="text-span text-dark font-medium animate-slideInUp"
                  >
                    Email
                  </label>
                  <InputField
                    type="email"
                    id="email"
                    placeholder="Enter your Email"
                    isRequired={true}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="animate-slideInUp"
                  />
                </div>
                
                <div className="flex flex-row-reverse justify-between animate-fadeIn">
                  <ButtonProps
                    type="submit"
                    variant="primary"
                    size="large"
                    className="flex items-center animate-slideInUp"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Reset Password"}
                    <IoIosArrowRoundForward className="size-6" />
                  </ButtonProps>
                  
                  <ButtonProps
                    type="button"
                    variant="secondary"
                    size="large"
                    className="flex items-center animate-slideInUp"
                    onClick={() => navigate("/")}
                    disabled={isLoading}
                  >
                    <IoIosArrowRoundBack className="size-6" />
                    Back to Login
                  </ButtonProps>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center p-6 animate-fadeIn">
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h5 className="text-h5 text-green-700 mb-2">Email Sent!</h5>
                <p className="text-slate-600">
                  If an account exists with email <strong>{email}</strong>, 
                  you will receive password reset instructions shortly.
                </p>
              </div>
              
              <ButtonProps
                type="button"
                variant="secondary"
                size="large"
                className="w-full animate-slideInUp"
                onClick={() => navigate("/")}
              >
                <IoIosArrowRoundBack className="size-5 mr-2" />
                Return to Login
              </ButtonProps>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
