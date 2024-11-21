import { useState, useEffect, useRef } from "react";
import WebcamCapture from "./camScanner";
import Back from "./back";
import * as faceapi from "face-api.js";

const Attendance = () => {
  const [course, setCourse] = useState("");
  const [present, setPresent] = useState([]);
  const [ready, setReady] = useState(false);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setModelsLoaded] = useState(false);

  const matcher = useRef(null);

  async function getAllStudents() {
    const request = await fetch("https://aws-akshat.humblefool13.dev");
    const response = await request.json();
    const students = response.students;
    setStudents(students);
  }

  useEffect(() => {
    getAllStudents();
  }, []);

  useEffect(() => {
    trainModel();
  }, [students]);

  const loadModels = async () => {
    try {
      const MODEL_URL =
        "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      console.log("Models loaded");
      setModelsLoaded(true);
    } catch (err) {
      console.error("Error loading models:", err);
    }
  };

  function base64ToImage(base64String) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = base64String;
    });
  }

  async function createDescriptors(labelledDescriptor) {
    const descriptors = await Promise.all(
      students.map(async (student) => {
        if (student.image === "base64-string") return;
        const img = await base64ToImage(student.image);
        const result = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
        return result
          ? new faceapi.LabeledFaceDescriptors(student.name, [
              result.descriptor,
            ])
          : null;
      })
    );
    labelledDescriptor.push(...descriptors.filter(Boolean));
    console.log("Descriptors created!");
  }

  async function trainModel() {
    try {
      await loadModels();
      let labelledDescriptor = [];
      await createDescriptors(labelledDescriptor);
      const faceMatcher = new faceapi.FaceMatcher(labelledDescriptor);
      matcher.current = faceMatcher;
      console.log("Matcher initialized:", matcher.current);
    } catch (err) {
      console.error("Error training model:", err);
    }
  }

  function arrayToString(arr) {
    let newarr = arr.map((student) => {
      return `${student.name}_${student.regNo}`;
    });
    return newarr.join("-");
  }

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
        setIsLoading(true);
        const request = await fetch(
          "https://aws-akshat.humblefool13.dev/cors-proxy",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requestType: "attendance",
              data: {
                courseName: course,
                time: new Date().toISOString(),
                present: arrayToString(present),
              },
            }),
          }
        );
        if (request.status !== 200) throw new Error("Unable to upload!");
        alert("Attendance Saved Successfully!");
        setCourse("");
        setPresent([]);
        setReady(false);
        window.location.reload();
      } catch (e) {
        alert("Attendance Save Failed!");
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  function markPresent(student) {
    setPresent((prevPresent) => {
      const alreadyPresent = prevPresent.some(
        (s) => s.name === student.name && s.regNo === student.regNo
      );
      if (!alreadyPresent) {
        return [...prevPresent, student];
      }
      return prevPresent;
    });
  }

  function findRegNoByName(name) {
    const student = students.find((student) => student.name === name);
    return student.regNo;
  }

  async function handleFace(imageData) {
    if (!loaded) {
      console.error("Model not loaded yet!");
      return;
    }
    try {
      const img = await base64ToImage(imageData);
      const results = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (results.length > 0) {
        results.forEach((result) => {
          const bestResult = matcher.current.findBestMatch(result.descriptor);
          if (bestResult.label !== "unknown") {
            markPresent({
              name: bestResult.label,
              regNo: findRegNoByName(bestResult.label),
            });
          }
        });
      }
    } catch (e) {
      console.error("Error detecting faces:", e);
    }
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
          disabled={isLoading}
          className={`p-2 border border-gray-300 rounded-md focus:outline-none ${
            isLoading ? "bg-gray-200" : ""
          }`}
        />
        {ready ? (
          course && students.length ? (
            <WebcamCapture sendFace={handleFace} />
          ) : (
            <>Loading Students Data...</>
          )
        ) : (
          <></>
        )}
        <button
          type="submit"
          className={`${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white py-2 rounded-md font-semibold`}
          disabled={isLoading}
        >
          {isLoading
            ? "Submitting..."
            : !ready
            ? "Take Attendance"
            : "Submit Attendance"}
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
