// src/App.js
import React, { useState } from "react";
import FaceDetection from './components/FaceDetection';
import MoodSong from "./components/MoodSong";

function App() {
   const [Songs, setSongs] = useState([
 
  ]);
  return (
    <div className="min-h-screen bg-gray-900">
      <FaceDetection setSongs={setSongs} />
      <MoodSong Songs={Songs} />
    </div>
  );
}

export default App;
