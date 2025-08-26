

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const FaceDetection = ({ setSongs }) => {
  const videoRef = useRef(null);
  const [mood, setMood] = useState("Not detected");
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Please allow camera access.");
      }
    };
    startVideo();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  const detectMood = async () => {
    setLoading(true);
    const result = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (result && result.expressions) {
      const expressions = result.expressions;
      const topMood = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0];
      setMood(topMood);

      try {
        const response = await axios.get(`http://localhost:3000/songs?mood=${topMood}`);
        setSongs(response.data.songs);
      } catch (err) {
        // handle error
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    
    <div className="flex flex-col items-center justify-center min-h-[40vh] py-5 ">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        🧠 Current Mood: <span className="font-mono text-blue-400 capitalize">{mood}</span>
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-8 p-4 md:p-8">
        <video
          ref={videoRef}
          width="320"
          height="240"
          autoPlay
          muted
          playsInline
          className="rounded-lg object-cover aspect-video  transform scaleX(-1)"
        />
        <button
          onClick={detectMood}
          disabled={loading}
          className="mt-6 md:mt-0 inline-block h-12 px-6 bg-blue-500 text-white rounded-full font-semibold shadow-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Detecting...
            </span>
          ) : (
            "Detect Mood"
          )}
        </button>
      </div>
    </div>
  );
};

export default FaceDetection;