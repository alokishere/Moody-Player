// src/App.js
import React from "react";
import FaceDetection from './components/FaceDetection';
import MoodSong from "./components/MoodSong";

function App() {
  return (
    <div className="App">
      <FaceDetection />
      <MoodSong/>
    </div>
  );
}

export default App;
