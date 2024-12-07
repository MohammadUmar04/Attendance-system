import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Client Attendance System
      </h1>
      <div className="space-y-4">
        <Link
          href="/admin"
          className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300"
        >
          Go to Admin Login
        </Link>
        <Link
          href="/userLogin"
          className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition duration-300"
        >
          Go to User Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
