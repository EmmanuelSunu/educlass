
import React, { useState } from "react";
import DashboardLayout from "../layout";
import { FiUser, FiBell, FiLock, FiSave } from "react-icons/fi";

function StudentSettings() {
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@university.edu",
    phone: "+1 555-123-4567",
    studentId: "ST-202405",
    department: "Computer Science",
    yearOfStudy: "Year 2",
    emailNotifications: true,
    appNotifications: true,
    reminderNotifications: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement save functionality for personal information
    alert("Personal information updated successfully!");
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement save functionality for notifications
    alert("Notification preferences updated successfully!");
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password change functionality
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    alert("Password updated successfully!");
  };

  return (
    <DashboardLayout
      title="Settings"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b overflow-x-auto">
          <button
            className={`px-6 py-3 font-medium flex items-center whitespace-nowrap ${
              activeTab === "personal"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            <FiUser className="mr-2" /> Personal Information
          </button>
          <button
            className={`px-6 py-3 font-medium flex items-center whitespace-nowrap ${
              activeTab === "notifications"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <FiBell className="mr-2" /> Notifications
          </button>
          <button
            className={`px-6 py-3 font-medium flex items-center whitespace-nowrap ${
              activeTab === "security"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => setActiveTab("security")}
          >
            <FiLock className="mr-2" /> Password & Security
          </button>
        </div>

        <div className="p-6">
          {activeTab === "personal" && (
            <form onSubmit={handleSavePersonal}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-gray-100"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Study
                  </label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({...formData, yearOfStudy: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="Year 1">Year 1</option>
                    <option value="Year 2">Year 2</option>
                    <option value="Year 3">Year 3</option>
                    <option value="Year 4">Year 4</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FiSave className="mr-2" /> Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === "notifications" && (
            <form onSubmit={handleSaveNotifications}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div>
                    <h3 className="font-medium text-gray-800">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div>
                    <h3 className="font-medium text-gray-800">App Notifications</h3>
                    <p className="text-sm text-gray-500">Get notifications within the app</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="appNotifications"
                      checked={formData.appNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div>
                    <h3 className="font-medium text-gray-800">Exam Reminders</h3>
                    <p className="text-sm text-gray-500">Get reminded about upcoming exams</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="reminderNotifications"
                      checked={formData.reminderNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FiSave className="mr-2" /> Save Preferences
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handleSaveSecurity}>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="mt-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Password Requirements</h3>
                  <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                    <li>At least 8 characters long</li>
                    <li>Contains at least one uppercase letter</li>
                    <li>Contains at least one number</li>
                    <li>Contains at least one special character</li>
                  </ul>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h3 className="font-medium text-yellow-800 flex items-center">
                    <FiLock className="mr-2" /> Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Enhance your account security by enabling two-factor authentication. 
                    Contact your administrator to set up this feature.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FiSave className="mr-2" /> Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentSettings;
