import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./assets/images/logo.svg";
import InputField from "./components/InputField";
import ButtonProps from "./components/ButtonProps";
import { useAuth } from "./data/auth/context";
import { IoIosArrowRoundForward } from "react-icons/io";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);
      
      // Redirect based on user role
      if (formData.email.includes("admin")) {
        navigate("/admin");
      } else if (formData.email.includes("lecturer")) {
        navigate("/user/l/dashboard");
      } else {
        navigate("/user/s/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  return (
    <div className="flex flex-col bg-grey-200 animate-fadeIn">
      {" "}
      {/* Added animation */}
      <div className="w-full lg:flex-row bg-white h-screen p-8 lg:p-0 flex flex-col justify-center items-center animate-slideInUp">
        {" "}
        {/* Added animation */}
        <div className="hidden lg:flex w-full lg:w-full bg-login h-screen bg-cover bg-no-repeat animate-fadeIn"></div>{" "}
        {/* Added animation */}
        <div className="bg-white w-full lg:p-10 lg:w-1/3 p-0 h-max animate-slideInRight">
          {" "}
          {/* Added animation */}
          <img
            src={Logo}
            alt="EduClass Logo"
            className="w-40 pb-7 flex justify-center animate-slideInUp"
            style={{ animationDelay: "0.2s" }}
          />{" "}
          {/* Added animation */}
          {/* Login Form */}
          <div className="pb-4 animate-fadeIn">
            {" "}
            {/* Added animation */}
            <h5 className="text-h5 text-dark animate-slideInUp">Sign In</h5>
            <span className="text-sm text-gray-500 animate-slideInUp">
              Access EduClass using your details
            </span>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
            <div className="animate-fadeIn" style={{ animationDelay: "0.5s" }}>
              <label htmlFor="email" className="text-span text-dark font-medium animate-slideInUp">
                Email
              </label>
              <InputField
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your Email"
                isRequired={true}
                className="animate-slideInUp"
                style={{ animationDelay: "0.6s" }}
              />
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: "0.6s" }}>
              <label htmlFor="password" className="text-span text-dark font-medium animate-slideInUp">
                Password
              </label>
              <InputField
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your Password"
                isRequired={true}
                className="animate-slideInUp"
                style={{ animationDelay: "0.7s" }}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm animate-fadeIn" style={{ animationDelay: "0.8s" }}>
                {error}
              </div>
            )}
            <div className="flex flex-row-reverse justify-between animate-fadeIn" style={{ animationDelay: "0.7s" }}>
              <ButtonProps
                type="submit"
                variant="primary"
                size="large"
                className="flex items-center animate-slideInUp"
                style={{ animationDelay: "0.8s" }}
              >
                Sign In
                <IoIosArrowRoundForward className="size-6" />
              </ButtonProps>
            </div>
          </form>
          {/* Dummy Users Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 animate-fadeIn" style={{ animationDelay: "0.9s" }}>
            <p className="font-medium mb-2">Dummy Users for Testing:</p>
            <ul className="space-y-1">
              <li>Admin: admin@educlass.com / password123</li>
              <li>Lecturer: lecturer@educlass.com / password123</li>
              <li>Student: student@educlass.com / password123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
