
import React, { useState } from "react";
import { FiUser, FiBell, FiLock } from "react-icons/fi";
import DashboardLayout from "../layout";

function Settings() {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+123456789",
    department: "Computer Science",
    
    // Notification Preferences
    emailNotifications: true,
    examCreationNotification: true,
    examSubmissionNotification: true,
    examGradingNotification: true,
    
    // Password and Security
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

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving personal information:", {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      department: formData.department
    });
    alert("Personal information updated successfully!");
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving notification preferences:", {
      emailNotifications: formData.emailNotifications,
      examCreationNotification: formData.examCreationNotification,
      examSubmissionNotification: formData.examSubmissionNotification,
      examGradingNotification: formData.examGradingNotification
    });
    alert("Notification preferences updated successfully!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    
    console.log("Changing password");
    alert("Password changed successfully!");
    
    // Reset password fields
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (
    <DashboardLayout
      title="Settings"
      showAddHeadbarButton={false}
      buttonTitle=""
    >
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium flex items-center ${
              activeTab === "personal"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            <FiUser className="mr-2" /> Personal Information
          </button>
          <button
            className={`px-6 py-3 font-medium flex items-center ${
              activeTab === "notifications"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <FiBell className="mr-2" /> Notifications
          </button>
          <button
            className={`px-6 py-3 font-medium flex items-center ${
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
            <form onSubmit={handleSavePersonalInfo}>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === "notifications" && (
            <form onSubmit={handleSaveNotifications}>
              <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                    Enable email notifications
                  </label>
                </div>
                
                <div className="ml-6 space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="examCreationNotification"
                      name="examCreationNotification"
                      checked={formData.examCreationNotification}
                      onChange={handleInputChange}
                      disabled={!formData.emailNotifications}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="examCreationNotification" className="ml-2 block text-sm text-gray-700">
                      Exam creation notifications
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="examSubmissionNotification"
                      name="examSubmissionNotification"
                      checked={formData.examSubmissionNotification}
                      onChange={handleInputChange}
                      disabled={!formData.emailNotifications}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="examSubmissionNotification" className="ml-2 block text-sm text-gray-700">
                      Student submission notifications
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="examGradingNotification"
                      name="examGradingNotification"
                      checked={formData.examGradingNotification}
                      onChange={handleInputChange}
                      disabled={!formData.emailNotifications}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="examGradingNotification" className="ml-2 block text-sm text-gray-700">
                      Grading complete notifications
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  disabled={!formData.emailNotifications}
                >
                  Save Preferences
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handleChangePassword}>
              <h2 className="text-xl font-semibold mb-4">Password & Security</h2>
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                >
                  Change Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
