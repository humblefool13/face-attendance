import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Back from "./back";

const View = () => {
  const [attendances, setAttendances] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const navigate = useNavigate();

  async function getAllAttendances() {
    // Query AWS and fetch all attendance data
    // setAttendances(data);
    // [{courseName: "Math 101", time: Timestamp, present: [{name: "John Doe", regNo: "1234"}, {...}]}]
  }

  useEffect(() => {
    getAllAttendances();
  }, []);

  const handleCourseClick = (attendance) => {
    setSelectedAttendance(attendance);
  };

  const handleBackClick = () => {
    setSelectedAttendance(null);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Back />
      <h2 className="text-2xl font-semibold text-center">
        {selectedAttendance ? "Course Attendance" : "View Attendance"}
      </h2>
      {!selectedAttendance ? (
        <div className="w-full max-w-md">
          <ul className="space-y-4">
            {attendances.length ? (
              attendances.map((attendance, index) => (
                <li
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleCourseClick(attendance)}
                >
                  <h3 className="text-l font-semibold">
                    {attendance.courseName}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(attendance.time.seconds * 1000).toLocaleString()}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">No records</p>
            )}
          </ul>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <button
            onClick={handleBackClick}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back to Attendance List
          </button>

          <h3 className="text-xl font-semibold">Present Students</h3>
          <ul className="space-y-2 mt-4">
            {selectedAttendance.present.length > 0 ? (
              selectedAttendance.present.map((student, index) => (
                <li key={index} className="p-3 bg-white rounded-lg shadow-md">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-gray-500">{student.regNo}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-500">
                No students marked present for this course.
              </p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default View;