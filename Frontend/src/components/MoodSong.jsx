import React, { useState } from "react";
import "./Moodsongs.css";


const MoodSong = () => {
  const [Songs, setSongs] = useState([
    {
      title: "test_title",
      artist: "test_artist",
      url: "test_url",
    },
    {
      title: "test_title",
      artist: "test_artist",
      url: "test_url",
    },
    {
      title: "test_title",
      artist: "test_artist",
      url: "test_url",
    },
  ]);
  return (
    <div className="mood-songs">
      <h2>Recomended song</h2>
      {Songs.map((song, index) => (
        <div className="song-item" key={index}>
          <div className="title">
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
          </div>
          <div className="play-pause-btn">
            <i class="ri-pause-line"></i>
            <i class="ri-play-circle-fill"></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoodSong;
