import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./assets/images/logo.svg";
import InputField from "./components/InputField";
import ButtonProps from "./components/ButtonProps";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";

function Login() {
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return (
    <div className="flex flex-col bg-grey-200">
      <div className="w-full lg:flex-row bg-white h-screen p-8 lg:p-0 flex flex-col justify-center items-center">
        <div className="hidden lg:flex w-full lg:w-full bg-login h-screen bg-cover bg-no-repeat"></div>
        <div className="bg-white w-full lg:p-10 lg:w-1/3 p-0 h-max">
          <img
            src={Logo}
            alt="EduClass Logo"
            className="w-40 pb-7 flex justify-center"
          />
          {isForgotPassword ? (
            <>
              {/* Forgot Password Form */}
              <div className="pb-4">
                <h5 className="text-h5 text-dark">Forgot Password</h5>
                <span className="text-sm text-gray-500">
                  Reset your password by entering your email
                </span>
              </div>
              <form
                id="forgotPasswordForm"
                action=""
                method="POST"
                className="flex flex-col gap-4"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="text-span text-dark font-medium"
                  >
                    Email
                  </label>
                  <InputField
                    type="email"
                    id="email"
                    placeholder="Enter your Email"
                    isRequired={true}
                  />
                </div>
                <div className="flex flex-row-reverse justify-between">
                  <ButtonProps
                    type="submit"
                    variant="primary"
                    size="large"
                    className="flex items-center"
                  >
                    Reset Password
                    <IoIosArrowRoundForward className="size-6" />
                  </ButtonProps>
                  <ButtonProps
                    type="button"
                    variant="secondary"
                    size="large"
                    className="flex items-center"
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
              <div className="pb-4">
                <h5 className="text-h5 text-dark">Sign In</h5>
                <span className="text-sm text-gray-500">
                  Access EduClass using your details
                </span>
              </div>
              <form
                id="loginForm"
                action=""
                method="POST"
                className="flex flex-col gap-4"
              >
                <div>
                  <div className="flex justify-start pb-2">
                    <label
                      htmlFor="email"
                      className="text-span text-dark font-medium"
                    >
                      Email
                    </label>
                  </div>
                  <InputField
                    type="email"
                    id="email"
                    placeholder="Enter your Email"
                    isRequired={true}
                  />
                </div>
                <div>
                  <div className="flex justify-between pb-2">
                    <label
                      htmlFor="password"
                      className="text-span text-dark font-medium"
                    >
                      Password
                    </label>
                    <button
                      className="text-span text-primary font-medium"
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
                  />
                </div>
                <Link to="/user/l/" className="w-full">
                  <ButtonProps
                    type="submit"
                    variant="primary"
                    size="large"
                    className="flex items-center w-full"
                  >
                    Login
                    <IoIosArrowRoundForward className="size-6" />
                  </ButtonProps>
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
