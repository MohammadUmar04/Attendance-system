"use client";
import React, { useState, useRef } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/auth";
import { writeData } from "../Firebase/realtime"; // Import the writeData function
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { getStorage, ref as storageRef, uploadString } from "firebase/storage"; // Firebase Storage import

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false); // Camera status
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const router = useRouter();

  // Start Camera
  const startCamera = async () => {
    if (isCameraStarted) return; // Prevent starting camera multiple times
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraStarted(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      Swal.fire("Error", "Unable to access the camera. Please check your permissions.", "error");
    }
  };

  // Capture Photo
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
    console.log("Captured Image:", imageData); // Log captured image data for debugging
  };

  // Upload image to Firebase Storage
  const uploadImage = async (imageData, userId) => {
    const storage = getStorage();
    const imageRef = storageRef(storage, `profileImages/${userId}`);
    try {
      await uploadString(imageRef, imageData, "data_url");
      console.log("Image uploaded successfully!");
      return `profileImages/${userId}`;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire("Passwords do not match.");
      return;
    }

    if (!capturedImage) {
      Swal.fire("Please capture a photo before proceeding.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload the profile photo if captured
      let profileImagePath = await uploadImage(capturedImage, user.uid); // Upload to Firebase Storage

      // Save user data to Firebase Realtime Database
      const userData = {
        email: user.email,
        profilePhoto: profileImagePath, // Store image path
      };

      await writeData(`users/${user.uid}`, userData); // Write to database

      Swal.fire("Signup Successful!", "You can now log in.");
      router.push("/Usersurface");
    } catch (error) {
      let errorMessage = "Signup Failed";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "The email address is already in use.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "The email address is not valid.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "The password is too weak.";
      }
      Swal.fire(errorMessage, error.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-950">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-center text-2xl font-bold mb-4">Signup</h2>
        <video ref={videoRef} autoPlay className="w-full rounded-lg mb-4" />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <button onClick={startCamera} className="bg-blue-500 text-white px-4 py-2 rounded mb-2">
          Start Camera
        </button>
        <button onClick={capturePhoto} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
          Capture Photo
        </button>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="block w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="block w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className="block w-full p-2 border rounded mb-4"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
