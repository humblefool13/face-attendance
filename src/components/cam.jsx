import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const WebcamCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
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
        setError("Failed to load face detection models.");
      }
    };
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error(err);
        setError("Could not access camera. Please check permissions.");
      }
    };
    loadModels();
    startVideo();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const detectFace = async () => {
      if (!modelsLoaded) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      video.addEventListener("loadeddata", () => {
        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
        faceapi.matchDimensions(canvas, displaySize);
        const interval = setInterval(async () => {
          const detections = await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions()
          );
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          if (detections.length > 0) {
            setFaceDetected(true);
          } else {
            setFaceDetected(false);
          }
        }, 200);
        return () => clearInterval(interval);
      });
    };
    detectFace();
  }, [modelsLoaded]);

  const captureImage = () => {
    if (faceDetected) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/png");
      onCapture(imageData);
    } else {
      alert(
        "No face detected. Please ensure your face is visible in the frame."
      );
    }
  };

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-md border border-gray-300"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
          <button
            onClick={captureImage}
            className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md ${
              faceDetected
                ? "bg-blue-500 text-white"
                : "bg-gray-400 text-gray-700"
            }`}
            disabled={!faceDetected}
          >
            {faceDetected ? "Capture" : "No Face Detected"}
          </button>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
