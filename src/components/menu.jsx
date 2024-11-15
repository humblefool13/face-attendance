import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center font-sans text-lg space-y-4">
      <Link to="/register" className="w-full">
        <button className="bg-blue-600 text-white py-3 rounded-xl w-full hover:bg-blue-700 transition duration-300 shadow-md">
          Register Student
        </button>
      </Link>
      <Link to="/attendance" className="w-full">
        <button className="bg-blue-600 text-white py-3 rounded-xl w-full hover:bg-blue-700 transition duration-300 shadow-md">
          Take Attendance
        </button>
      </Link>
      <Link to="/view" className="w-full">
        <button className="bg-blue-600 text-white py-3 rounded-xl w-full hover:bg-blue-700 transition duration-300 shadow-md">
          View Attendance
        </button>
      </Link>
    </div>
  );
};

export default Menu;
