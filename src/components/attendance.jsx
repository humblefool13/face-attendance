import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WebcamCapture from "./camScanner";
import Back from "./back";

const Attendance = () => {
  const [course, setCourse] = useState("");
  const [present, setPresent] = useState([]);
  const [ready, setReady] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ready) {
      if (!course) {
        alert("Please enter the course name.");
        return;
      }
      setReady(true);
    } else {
      try {
        // Send present to AWS
        // [{},{},{},{name: "", regNo:""}]
        // for storage/notifications
        alert("Attendance Saved Successfully!");
        setCourse("");
        setPresent([]);
        setReady(false);
        window.location.reload();
      } catch (e) {
        console.log(e);
      }
    }
  };

  function markPresent(student) {
    setPresent([...present, student]);
  }

  async function handleFace(imageData) {
    // Send to AWS for rekognition
    // Return {name: "", regNo: ""}
    // markPresent(student)
  }

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Back />
      <h2 className="text-2xl font-semibold text-center">Take Attendance</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Course Name"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {ready ? <WebcamCapture sendFace={handleFace} /> : <></>}
        <button
          type="submit"
          className="bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600"
        >
          {!ready ? "Take Attendance" : "Submit Attendance"}
        </button>
      </form>
      {ready ? (
        <>
          <h3 className="text-xl font-semibold text-center text-gray-800">
            {present.length === 0
              ? "Marked as Present"
              : `Marked as Present (${present.length})`}
          </h3>
          <div className="w-full max-w-md mt-4 bg-white rounded-md shadow-md p-4">
            {present.length === 0 ? (
              <p className="text-center text-gray-500">
                No students marked yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {present.map((student, index) => {
                  return (
                    <li
                      key={index}
                      className="flex justify-between items-center text-gray-700"
                    >
                      <span>{`${student.name} - ${student.regNo}`}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Attendance;
