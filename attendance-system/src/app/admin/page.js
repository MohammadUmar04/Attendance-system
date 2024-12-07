"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import { firestore } from "../Firebase/database";

const Admin = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const adminCredentials = {
    email: "umar@gmail.com",
    password: "123456",
  };

  const handleLogin = () => {
    if (email === adminCredentials.email && password === adminCredentials.password) {
      setIsAdmin(true);
      setError("");
    } else {
      setError("Invalid email or password.");
    }
  };

  useEffect(() => {
    if (isAdmin) {
      const fetchRecords = async () => {
        try {
          const querySnapshot = await getDocs(collection(firestore, "attendance"));
          const records = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAttendanceRecords(records);
        } catch (error) {
          console.error("Error fetching attendance records: ", error);
        }
      };

      fetchRecords();
    }
  }, [isAdmin]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(firestore, "attendance", id));
          setAttendanceRecords((prevRecords) =>
            prevRecords.filter((record) => record.id !== id)
          );
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting document: ", error);
          Swal.fire("Error!", "Failed to delete the record. Please try again.", "error");
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white p-4">
      {!isAdmin ? (
        <div className="w-full max-w-md bg-white text-black shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white shadow-md transition-transform transform hover:scale-105"
          >
            Login
          </button>
          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
        </div>
      ) : (
        <div className="w-full max-w-6xl bg-white text-black shadow-lg rounded-lg p-6 overflow-x-auto">
          <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">
            Admin Attendance Dashboard
          </h1>
          {attendanceRecords.length > 0 ? (
            <table className="table-auto w-full border-collapse bg-white text-left">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-100 transition-colors">
                    <td className="py-3 px-4">{record.name}</td>
                    <td className="py-3 px-4">{record.email}</td>
                    <td className="py-3 px-4">{record.attendance}</td>
                    <td className="py-3 px-4">
                      {new Date(record.timestamp.toDate()).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition-transform transform hover:scale-105"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600 mt-6">No attendance records found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
