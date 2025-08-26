import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios  from 'axios';

const FaceDetection = ({ setSongs }) => {
  const videoRef = useRef(null);
  const [mood, setMood] = useState("sad");
  // const [detecting, setDetecting] = useState(false);
  const intervalRef = useRef(null);

  // ✅ Start video on mount
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("❌ Camera access denied:", err);
        alert("Please allow camera access.");
      }
    };

    startVideo();
  }, []);

  // ✅ Load models on mount (only once)
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      console.log("✅ Models loaded");
    };

    loadModels();
  }, []);

  // ✅ Mood detection function
  const detectMood = async () => {
    const result = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (result && result.expressions) {
      const expressions = result.expressions;
      const topMood = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0];
      setMood(topMood);
      console.log("🧠 Mood:", topMood);
    }
  };
axios.get(`http://localhost:3000/songs?mood=${mood}`)
.then(response=>{
  // console.log(response.data);
  setSongs(response.data.songs)
})
  

  // ✅ Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  
  }, []);

  return (<>
      <h2
       style={{ textAlign: "center", margin: "5vw" ,display:"flex",alignItems:"center",gap:"1rem"}}
      >🧠 Current Mood: {mood}</h2>
    <div style={{ textAlign: "center", margin: "5vw" ,marginTop:"-5vw",display:"flex",alignItems:"center",gap:"1rem"}}>
      <video
        ref={videoRef}
        width="320"
        height="200"
        autoPlay
        muted
        playsInline
        style={{ borderRadius: "10px", marginTop: "20px",objectFit: "cover" ,aspectRatio:"16/9"}}
        />
      <br />
      <button
        onClick={detectMood}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "1rem",
          cursor: "pointer",
          color:"black",
          borderRadius:"20px",
          outline:"none",
          border:"none",
        }}
        >
      Detect Mood
      </button>
    </div>
        </>
  );
};

export default FaceDetection;
