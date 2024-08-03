import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Logo from "~/assets/logo/logo.png";
import { useSubscription, useMutation } from "@apollo/client";
import { GET_SPACE, UPDATE_MUTATION } from "~/graphql/spaces";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import { useUserId } from "@nhost/react";
export default function Space() {
  const { id }: any = useParams();
  const [link, setLink] = useState("");
  const [sec, setSec] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [previousUpdate, setPreviousUpdate] = useState(0);
  const userId = useUserId();

  const [update] = useMutation(UPDATE_MUTATION);

  const playerRef: any = useRef(null);
  const { loading, data, error } = useSubscription(GET_SPACE, {
    variables: {
      id,
    },
  });

  useEffect(() => {
    if (data?.spaces && data?.spaces?.length > 0) {
      if (data?.spaces?.[0]?.link !== link) {
        setLink(data?.spaces?.[0]?.link);
      }
      if (data?.spaces?.[0]?.sec !== sec) {
        setSec(data?.spaces?.[0]?.sec);
      }
      if (data?.spaces?.[0]?.user_id === userId) {
        setIsOwner(true);
      }
      if (!isOwner) {
        if (data?.spaces?.[0]?.pause) {
          setPlaying(false);
        } else {
          setPlaying(true);
        }
      }
      console.log("space", data?.spaces?.[0], playing);
    }
  }, [data]);

  const handleProgress = async (state: any) => {
    console.log("playing", state, playerRef);
    playerRef.current?.player?.handlePlay();
    if (!seeking) {
      if (isOwner) {
        const res: any = await update({
          variables: {
            id,
            data: {
              sec: state.played,
              pause: !playerRef?.current?.player?.isPlaying || false,
            },
          },
        });
      } else {
        const updatedSec = sec;
        let statePlayed = state.played * 100;
        statePlayed = Math.floor(statePlayed);
        let updatedSecc = updatedSec * 100;
        updatedSecc = Math.floor(updatedSecc);
        console.log("sec", statePlayed, updatedSecc);
        if (updatedSecc !== statePlayed) {
          setPreviousUpdate(updatedSec);
          playerRef.current.seekTo(updatedSec);
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-[600px] ">
        <div>
          <div className="flex justify-center w-full mt-[30px]">
            <img src={Logo} alt="" className="h-[100px]" />
          </div>
          <h1 className="text-white font-bold">Space:</h1>
          {/* <hr /> */}
          {data?.spaces?.[0]?.link ? (
            <div className="mt-2 w-[400px] relative">
              <div>
                <ReactPlayer
                  ref={playerRef}
                  url={link}
                  className="react-player"
                  playing={playing}
                  controls={isOwner}
                  onProgress={handleProgress}
                  width="100%"
                />
              </div>

              {!isOwner && (
                <div className="absolute z-[9999] h-[400px] w-full top-0 bg-[transparent]"></div>
              )}
            </div>
          ) : (
            <div>loading..</div>
          )}
        </div>
      </div>
    </div>
  );
}
