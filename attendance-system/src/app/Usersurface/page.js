"use client";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../Firebase/database";
import Swal from "sweetalert2";

const Usersurface = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attendance: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.attendance) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill out all fields before submitting!",
      });
      return;
    }

    try {
      await addDoc(collection(firestore, "attendance"), {
        name: formData.name,
        email: formData.email,
        attendance: formData.attendance,
        timestamp: new Date(),
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Attendance recorded successfully!",
      });
      setFormData({ name: "", email: "", attendance: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "An error occurred while submitting the attendance. Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-300 p-6">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Attendance Marking
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Attendance Status:
            </label>
            <select
              name="attendance"
              value={formData.attendance}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 text-white font-semibold bg-indigo-600 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-transform duration-300 ease-in-out"
          >
            Submit Attendance
          </button>
        </form>
      </div>
    </div>
  );
};

export default Usersurface;
