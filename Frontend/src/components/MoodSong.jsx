import React, { useRef, useState, useEffect } from "react";

const MoodSong = ({ Songs }) => {
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const audioRefs = useRef([]);

  // Use a single state object for all song-related data for better performance and management.
  const [songData, setSongData] = useState({});

  useEffect(() => {
    // This effect ensures audio elements are correctly referenced and
    // state is initialized whenever the 'songs' prop changes.
    audioRefs.current = Songs.map((_, i) => audioRefs.current[i] || new Audio());
    Songs.forEach((song, i) => {
      if (audioRefs.current[i].src !== song.audio) {
        audioRefs.current[i].src = song.audio;
      }
    });

    // Clean up function to pause and reset audio when the component unmounts.
    return () => {
      audioRefs.current.forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, [Songs]);

  const handlePlayPause = (index) => {
    const audio = audioRefs.current[index];

    // If a song is already playing and it's the same song, pause it.
    if (currentPlaying === index) {
      audio.pause();
      setCurrentPlaying(null);
    } else {
      // Pause any other currently playing song.
      if (currentPlaying !== null && audioRefs.current[currentPlaying]) {
        audioRefs.current[currentPlaying].pause();
      }
      
      // Update state to start the spinner.
      setSongData(prev => ({
        ...prev,
        [index]: { ...prev[index], isLoading: true }
      }));
      
      // Play the new song and update the state.
      audio.play().then(() => {
        setCurrentPlaying(index);
        setSongData(prev => ({
          ...prev,
          [index]: { ...prev[index], isLoading: false }
        }));
      }).catch(error => {
        console.error("Error playing audio:", error);
        setSongData(prev => ({
          ...prev,
          [index]: { ...prev[index], isLoading: false }
        }));
      });
    }
  };

  const handleLoadedData = (index) => {
    const audio = audioRefs.current[index];
    setSongData(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        duration: audio.duration,
        volume: audio.volume,
        currentTime: 0,
        isLoading: false
      }
    }));
  };

  const handleTimeUpdate = (index) => {
    const audio = audioRefs.current[index];
    setSongData(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        currentTime: audio.currentTime
      }
    }));
  };

  const handleSeek = (index, value) => {
    const audio = audioRefs.current[index];
    audio.currentTime = value;
    setSongData(prev => ({
      ...prev,
      [index]: { ...prev[index], currentTime: value }
    }));
  };

  const handleVolumeChange = (index, value) => {
    const audio = audioRefs.current[index];
    audio.volume = value;
    setSongData(prev => ({
      ...prev,
      [index]: { ...prev[index], volume: value }
    }));
  };
  
  // Helper function to format time in mm:ss format.
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-3xl shadow-2xl font-sans text-gray-200 border border-gray-700">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-teal-400">🎵 Your Playlist</h2>
      <div className="space-y-6">
        {Songs.map((song, index) => (
          <div
            className={`p-6 rounded-2xl shadow-lg transition-all duration-300 transform border-2 border-gray-700
            ${currentPlaying === index ? "bg-gray-800 scale-105 border-teal-500" : "bg-gray-800 hover:scale-105 hover:bg-gray-700"}`}
            key={index}
          >
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0 w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-3xl font-bold text-gray-900 shadow-md">
                {song.title[0]}
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-teal-400">{song.title}</h3>
                <p className="text-gray-400 font-medium mt-1">{song.artist}</p>
              </div>
              <button
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-3xl transition-colors duration-300
                ${currentPlaying === index ? "bg-red-500 text-white" : "bg-teal-500 text-gray-900 hover:bg-teal-400"}`}
                onClick={() => handlePlayPause(index)}
              >
                {songData[index]?.isLoading && currentPlaying === index ? (
                  <svg className="animate-spin h-6 w-6 text-gray-900" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : currentPlaying === index ? (
                  <i className="ri-pause-fill"></i>
                ) : (
                  <i className="ri-play-fill"></i>
                )}
              </button>
            </div>
            {currentPlaying === index && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-mono text-gray-400 w-12 text-right">{formatTime(songData[index]?.currentTime || 0)}</span>
                  <input
                    type="range"
                    min={0}
                    max={songData[index]?.duration || 0}
                    value={songData[index]?.currentTime || 0}
                    onChange={(e) => handleSeek(index, Number(e.target.value))}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm accent-teal-500"
                  />
                  <span className="text-sm font-mono text-gray-400 w-12 text-left">{formatTime(songData[index]?.duration || 0)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-volume-down-line text-gray-400"></i>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={songData[index]?.volume ?? 1}
                    onChange={(e) => handleVolumeChange(index, Number(e.target.value))}
                    className="w-32 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <i className="ri-volume-up-line text-gray-400"></i>
                </div>
              </div>
            )}
            <audio
              ref={(el) => (audioRefs.current[index] = el)}
              onLoadedData={() => handleLoadedData(index)}
              onTimeUpdate={() => handleTimeUpdate(index)}
              onEnded={() => setCurrentPlaying(null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodSong;