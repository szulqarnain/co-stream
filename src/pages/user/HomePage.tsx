import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
// import "./App.css";
// import { database } from "./lib/firebase";
import { off, onValue, ref, set, update } from "firebase/database"; // Import database functions
import { useChannel } from "ably/react";
function HomePage() {
  const [updatedSec, setUpdateSec] = useState<any>(0);
  const { channel } = useChannel("realtime", (message) => {
    console.log("chUpdate", message.data.sec);
    setUpdateSec(message.data.sec || 0);
  });

  const videoUrl = "https://youtu.be/4yjkg8GxvBA";
  const playerRef: any = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);

  //   const playbackRef = ref(database, "playback");

  useEffect(() => {
    // Listen for playback changes
    const callback = (snapshot: any) => {
      const playbackData = snapshot.val();
      if (playbackData) {
        const { playing, played } = playbackData;
        setPlaying(playing);
        if (!seeking) {
          playerRef.current.seekTo(played / 1000); // Convert milliseconds to seconds
        }
      }
    };
    // onValue(playbackRef, callback);

    // Cleanup the listener when the component unmounts
    // return () => off(playbackRef, "value", callback);
  }, [seeking]);

  const handlePlayPause = () => {
    setPlaying(!playing);
    // set(playbackRef, {
    //   playing: !playing,
    //   played: played,
    // });
  };

  const handleProgress = (state: any) => {
    if (!seeking) {
      // Multiply by 100 to shift two decimal places to the left
      let statePlayed = state.played * 100;
      statePlayed = Math.floor(statePlayed);
      let updatedSecc = updatedSec * 100;
      updatedSecc = Math.floor(updatedSecc);

      console.log("sec", statePlayed, updatedSecc);
      if (updatedSecc !== statePlayed) {
        playerRef.current.seekTo(updatedSec); // Convert milliseconds to seconds
      }
      // footballChannel.publish("seconds", { sec: state.played });
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: any) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: any) => {
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(e.target.value) / 1000); // Convert milliseconds to seconds
    // update(playbackRef, {
    //   played: parseFloat(e.target.value),
    // });
  };

  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline text-red-600">
        {/* URL: {videoUrl} */}
      </h1>
      <div className="flex h-[100vh]">
        <div>
          <div className="player-wrapper h-[400px] w-[800px] ">
            <h1>video play</h1>
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              className="react-player"
              playing={playing}
              controls={true}
              onProgress={handleProgress}
              width="100%"
              height="100%"
            />
          </div>
        </div>
        <div className=" justify-center h-[500px] w-full flex items-center ">
          <button
            onClick={handlePlayPause}
            className="text-white bg-[black] p-4 m-4 rounded-lg"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <input
            type="range"
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
