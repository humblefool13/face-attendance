import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const WebcamCapture = ({ sendFace }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
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
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
            const imageData = canvas.toDataURL("image/png");
            sendFace(imageData);
          }
        }, 200);
        return () => clearInterval(interval);
      });
    };
    detectFace();
  }, [modelsLoaded]);

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
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
