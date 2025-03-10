import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./assets/images/logo.svg";
import InputField from "./components/InputField";
import ButtonProps from "./components/ButtonProps";
import LECTURER_URLS from "./user/l/url";
import STUDENT_URLS from "./user/s/url";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";


function Login() {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [userType, setUserType] = useState<"lecturer" | "student">("lecturer");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-grey-200 animate-fadeIn"> {/* Added animation */}
      <div className="w-full lg:flex-row bg-white h-screen p-8 lg:p-0 flex flex-col justify-center items-center animate-slideInUp"> {/* Added animation */}
        <div className="hidden lg:flex w-full lg:w-full bg-login h-screen bg-cover bg-no-repeat animate-fadeIn"></div> {/* Added animation */}
        <div className="bg-white w-full lg:p-10 lg:w-1/3 p-0 h-max animate-slideInRight"> {/* Added animation */}
          <img
            src={Logo}
            alt="EduClass Logo"
            className="w-40 pb-7 flex justify-center animate-slideInUp" style={{animationDelay: "0.2s"}} /> {/* Added animation */}
          {isForgotPassword ? (
            <>
              {/* Forgot Password Form */}
              <div className="pb-4 animate-fadeIn"> {/* Added animation */}
                <h5 className="text-h5 text-dark animate-slideInUp">Forgot Password</h5>
                <span className="text-sm text-gray-500 animate-slideInUp">
                  Reset your password by entering your email
                </span>
              </div>
              <form
                id="forgotPasswordForm"
                action=""
                method="POST"
                className="flex flex-col gap-4 animate-fadeIn" style={{animationDelay: "0.4s"}}
              >
                <div className="animate-fadeIn" style={{animationDelay: "0.5s"}}> {/* Added animation */}
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
                    className="animate-slideInUp" style={{animationDelay: "0.6s"}}
                  />
                </div>
                <div className="flex flex-row-reverse justify-between animate-fadeIn" style={{animationDelay: "0.7s"}}> {/* Added animation */}
                  <ButtonProps
                    type="submit"
                    variant="primary"
                    size="large"
                    className="flex items-center animate-slideInUp" style={{animationDelay: "0.8s"}}
                  >
                    Reset Password
                    <IoIosArrowRoundForward className="size-6" />
                  </ButtonProps>
                  <ButtonProps
                    type="button"
                    variant="secondary"
                    size="large"
                    className="flex items-center animate-slideInUp" style={{animationDelay: "0.9s"}}
                    onClick={() => setIsForgotPassword(false)}
                  >
                    <IoIosArrowRoundBack className="size-6" />
                    Login
                  </ButtonProps>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Login Form */}
              <div className="pb-4 animate-fadeIn"> {/* Added animation */}
                <h5 className="text-h5 text-dark animate-slideInUp">Sign In</h5>
                <span className="text-sm text-gray-500 animate-slideInUp">
                  Access EduClass using your details
                </span>
              </div>
              <div className="mb-4 animate-fadeIn"> {/* Added animation */}
                <label className="text-span text-dark font-medium mb-2 block animate-slideInUp">I am a:</label>
                <div className="flex items-center justify-between bg-slate-100 rounded-full p-1 w-64 mt-2 animate-fadeIn" style={{animationDelay: "0.3s"}}> {/* Added animation */}
                  <button
                    type="button"
                    onClick={() => setUserType("lecturer")}
                    className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-200 ${
                      userType === "lecturer"
                        ? "bg-primary text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-200"
                    } animate-slideInUp`} style={{animationDelay: "0.4s"}}
                  >
                    Lecturer
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("student")}
                    className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-200 ${
                      userType === "student"
                        ? "bg-primary text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-200"
                    } animate-slideInUp`} style={{animationDelay: "0.5s"}}
                  >
                    Student
                  </button>
                </div>
              </div>
              <form
                id="loginForm"
                action=""
                method="POST"
                className="flex flex-col gap-4 animate-fadeIn" style={{animationDelay: "0.6s"}}
                onSubmit={(e) => {
                  e.preventDefault();
                  // Redirect based on user type
                  if (userType === "lecturer") {
                    navigate(LECTURER_URLS.DASHBOARD);
                  } else {
                    navigate(STUDENT_URLS.DASHBOARD);
                  }
                }}
              >
                <div className="animate-fadeIn" style={{animationDelay: "0.7s"}}> {/* Added animation */}
                  <div className="flex justify-start pb-2 animate-slideInUp"> {/* Added animation */}
                    <label
                      htmlFor="email"
                      className="text-span text-dark font-medium animate-slideInUp"
                    >
                      Email
                    </label>
                  </div>
                  <InputField
                    type="email"
                    id="email"
                    placeholder="Enter your Email"
                    isRequired={true}
                    className="animate-slideInUp" style={{animationDelay: "0.8s"}}
                  />
                </div>
                <div className="animate-fadeIn" style={{animationDelay: "0.9s"}}> {/* Added animation */}
                  <div className="flex justify-between pb-2 animate-slideInUp"> {/* Added animation */}
                    <label
                      htmlFor="password"
                      className="text-span text-dark font-medium animate-slideInUp"
                    >
                      Password
                    </label>
                    <button
                      className="text-span text-primary font-medium animate-slideInUp" style={{animationDelay: "1s"}}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsForgotPassword(true);
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <InputField
                    type="password"
                    id="password"
                    placeholder="Enter your Password"
                    isRequired={true}
                    className="animate-slideInUp" style={{animationDelay: "1.1s"}}
                  />
                </div>
                <ButtonProps
                  type="submit"
                  variant="primary"
                  size="large"
                  className="flex items-center w-full animate-slideInUp" style={{animationDelay: "1.2s"}}
                >
                  Login
                  <IoIosArrowRoundForward className="size-6" />
                </ButtonProps>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;