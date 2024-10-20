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
  const [update] = useMutation(UPDATE_MUTATION);
  const [insert] = useMutation(INSERT_WATCHER);
  const localPeerConnections = useRef(new Map());

  // Subscribe to answers
  const { data } = useSubscription(GET_SPACE_HANDSHAKE, {
    variables: {
      space_id: id,
      for_user: userId,
    },
  });

  const findOffer = (user_id: any, data: any) => {
    return data.some(
      (singleData: any) =>
        singleData.user_id === user_id && singleData.reason === "offer"
    );
  };

  const findICE = (user_id: any, data: any) => {
    return data.some(
      (singleData: any) =>
        singleData.user_id === user_id && singleData.reason === "ice"
    );
  };

  // Handle the received answer from Watch component
  useEffect(() => {
    if (data?.spaces_watcher.length > 0) {
      data.spaces_watcher.forEach((watcher: any) => {
        if (
          watcher.reason === "req_offer" &&
          !findOffer(watcher.user_id, data.spaces_watcher)
        ) {
          sendStreamOffer(watcher.user_id);
        }
        if (
          watcher.reason === "answer" &&
          !findICE(watcher.user_id, data.spaces_watcher)
        ) {
          handleReceivedAnswer(watcher.data, watcher.user_id);
        }
        if (watcher.reason === "ice") {
          handleReceivedIceCandidate(watcher.data, watcher.user_id);
        }
      });
    }
  }, [data]);

  const sendStreamOffer = async (remoteUserId: any) => {
    const peerConnection = createPeerConnection(remoteUserId);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    await insert({
      variables: {
        data: [
          {
            user_id: userId,
            data: offer,
            space_id: id,
            for_user: remoteUserId,
            reason: "offer",
          },
        ],
      },
    });

    console.log("Offer sent to user:", remoteUserId, offer);
  };

  const startStreaming = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    videoRef.current.srcObject = stream;

    stream.getTracks().forEach((track) => {
      localPeerConnections.current.forEach((pc) => {
        pc.addTrack(track, stream);
      });
    });
  };

  const createPeerConnection = (remoteUserId: any) => {
    console.log(`Creating peer connection for remote user: ${remoteUserId}`);
    const localPeerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    localPeerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log("New ICE candidate generated:", event.candidate);
        // await insert({
        //   variables: {
        //     data: [
        //       {
        //         user_id: userId,
        //         data: event.candidate,
        //         space_id: id,
        //         reason: "ice",
        //         for_user: remoteUserId,
        //       },
        //     ],
        //   },
        // });
        console.log("Candidate sent for user:", remoteUserId, event.candidate);
      }
    };

    localPeerConnection.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state for ${remoteUserId}:`,
        localPeerConnection.iceConnectionState
      );
      // setConnectionState(localPeerConnection.iceConnectionState);
    };

    localPeerConnection.onconnectionstatechange = () => {
      console.log(
        `Connection state for ${remoteUserId}:`,
        localPeerConnection.connectionState
      );
    };

    // Store this connection
    localPeerConnections.current.set(remoteUserId, localPeerConnection);

    return localPeerConnection;
  };

  // Handle the received answer from the Watch component
  const handleReceivedAnswer = async (answer: any, remoteUserId: any) => {
    const peerConnection = localPeerConnections.current.get(remoteUserId);

    if (!peerConnection) {
      console.log("Creating a new peer connection for user:", remoteUserId);
      createPeerConnection(remoteUserId);
    }

    if (answer && answer.sdp && answer.type) {
      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        console.log("Remote description set for user:", remoteUserId);
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    }
  };

  // Handle received ICE candidates

  // Update handleReceivedIceCandidate function
  const handleReceivedIceCandidate = async (
    candidate: any,
    remoteUserId: any
  ) => {
    const peerConnection = localPeerConnections.current.get(remoteUserId);

    if (peerConnection && candidate) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("ICE candidate added for user:", remoteUserId);
      } catch (error) {
        console.error("Error adding received ICE candidate:", error);
      }
    }
  };
  const Check = () => {
    console.log(
      localPeerConnections.current.values().next().value?.iceConnectionState
    );
  };
  return (
    <div className="gap-10 flex justify-center items-center flex-col pt-10">
      <button
        onClick={startStreaming}
        className="py-4 border border-1 border-[white] text-white rounded-lg px-4 mb-4 sm:mb-[40px]"
      >
        Start Streaming
      </button>
      <button onClick={() => Check()}>check</button>
      <video ref={videoRef} autoPlay controls className="w-[550px]" />
    </div>
  );
};

export default Stream;
