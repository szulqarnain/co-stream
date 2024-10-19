import { useUserId } from "@nhost/react";
import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useSubscription } from "@apollo/client";
import {
  GET_SPACE_HANDSHAKE,
  INSERT_WATCHER,
  UPDATE_MUTATION,
} from "~/graphql/spaces";

const Stream = () => {
  const { id }: any = useParams();
  const userId = useUserId();
  const videoRef: any = useRef(null);
  const localPeerConnection: any = useRef(null);
  const [update] = useMutation(UPDATE_MUTATION);
  const [insert] = useMutation(INSERT_WATCHER);

  // Subscribe to answers
  const { data } = useSubscription(GET_SPACE_HANDSHAKE, {
    variables: {
      space_id: id,
      for_user: userId,
    },
  });

  // Handle the received answer from Watch component
  useEffect(() => {
    if (data?.spaces_watcher.length > 0) {
      data?.spaces_watcher.forEach((watcher: any) => {
        console.log("answer.received", watcher?.handshake);
        if (watcher.handshake) handleReceivedAnswer(watcher?.handshake);
      });
    }
  }, [data]);

  useEffect(() => {
    // Create local peer connection
    localPeerConnection.current = new RTCPeerConnection();

    // Handle ICE candidates
    localPeerConnection.current.onicecandidate = async (event: any) => {
      if (event.candidate) {
        console.log("candidate create", event.candidate);
        let payload: any = {
          user_id: userId,
          handshake: event.candidate,
          space_id: id,
          for_user: "41fa8cb9-2c18-4874-b084-a0701a04fd60",
        };

        await insert({
          variables: {
            data: [payload],
          },
        });
        console.log("candidate sent", event.candidate);
      }
    };

    return () => {
      localPeerConnection.current.close();
    };
  }, []);

  const startStreaming = async () => {
    // Get local media stream (screen or webcam)
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    // Display local stream
    videoRef.current.srcObject = stream;

    // Add local stream tracks to peer connection
    stream.getTracks().forEach((track) => {
      localPeerConnection.current.addTrack(track, stream);
    });

    // Create and set offer
    const offer = await localPeerConnection.current.createOffer();
    await localPeerConnection.current.setLocalDescription(offer);

    // Send offer to the server
    await update({
      variables: {
        data: { offer },
        id,
      },
    });

    console.log("offer.sent", offer);
  };

  // Handle the received answer from the Watch component
  const handleReceivedAnswer = async (answer: any) => {
    if (answer && answer.sdp && answer.type) {
      // This is an SDP answer
      console.log("Received valid SDP answer:", answer);
      await localPeerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    } else if (answer && answer.candidate) {
      // This is an ICE candidate
      console.log("Received ICE candidate:", answer);
      try {
        await localPeerConnection.current.addIceCandidate(
          new RTCIceCandidate(answer)
        );
      } catch (error) {
        console.error("Error adding received ICE candidate", error);
      }
    } else {
      console.error("Invalid answer or candidate received:", answer);
    }
  };

  return (
    <div>
      <button onClick={startStreaming}>Start Streaming</button>
      <video ref={videoRef} autoPlay controls />
    </div>
  );
};

export default Stream;
