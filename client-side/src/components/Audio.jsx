import React, { useRef, useState } from "react";
import audio_1 from "../assets/notification/notification_1.mp3";
import audio_2 from "../assets/notification/notification_2.mp3";
import audio_3 from "../assets/notification/notification_3.mp3";
import audio_4 from "../assets/notification/notification_4.mp3";
import audio_5 from "../assets/notification/notification_5.mp3";


const audioList = [audio_1, audio_2, audio_3, audio_4, audio_5];

function Audio() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      {audioList.map((item, index) => {
        return <audio key={index} ref={audioRef} src={item} />;
      })}
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
}
