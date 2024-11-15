import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WebcamCapture from "./cam";
import Back from "./back";

const Register = () => {
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const navigate = useNavigate();

  const handleCapture = (imageData) => {
    setCapturedImage(imageData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ready) {
      if (!name || !regNo || !email) {
        alert("Please complete all fields.");
        return;
      }
      setReady(true);
    } else {
      if (!name || !regNo || !email || !capturedImage) {
        alert("Please complete all fields and capture an image.");
        return;
      }
      try {
        // Send to AWS to store
        // {name: "", regNo: "", email: "", image: IMAGE}
        alert("Registered Successfully!");
        setName("");
        setRegNo("");
        setEmail("");
        setReady(false);
        setCapturedImage(null);
        window.location.reload();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Back />
      <h2 className="text-2xl font-semibold text-center">Register</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Registration Number"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {ready && !capturedImage ? (
          <WebcamCapture onCapture={handleCapture} />
        ) : (
          <></>
        )}
        {ready && capturedImage ? (
          capturedImage && (
            <div className="mt-4">
              <h3 className="text-lg font-medium">Captured Image:</h3>
              <img
                src={capturedImage}
                alt="Captured"
                className="mt-2 w-full rounded-md"
              />
            </div>
          )
        ) : (
          <></>
        )}
        <button
          type="submit"
          className="bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600"
        >
          {!ready ? "Take Picture" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Register;
