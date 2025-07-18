import React, { useRef, useState, useEffect } from "react";
import { useMutation, useSubscription } from "@apollo/client";
import {
  GET_SPACE_HANDSHAKE,
  INSERT_WATCHER,
  GET_SPACE,
} from "~/graphql/spaces";
import { useUserId } from "@nhost/react";
import { useParams } from "react-router-dom";

const Watch = ({ for__user }: any) => {
  const { id }: any = useParams();
  const userId = useUserId();
  const [insert] = useMutation(INSERT_WATCHER);
  const [space, setSpace] = useState<any>(null);
  const { data, error } = useSubscription(GET_SPACE_HANDSHAKE, {
    variables: {
      space_id: id,
      for_user: userId,
    },
  });

  // Ref to store ICE candidates queue
  const iceCandidateQueue = useRef<any[]>([]);

  // Track if remote description is set
  const [remoteDescriptionSet, setRemoteDescriptionSet] = useState(false);

  const remotePeerConnection: any = useRef(null);
  const videoRef: any = useRef(null);

  // Function to handle receiving the offer from Stream component
  const handleOffer = async (offer: any, for_user: any) => {
    console.log("offer.received", offer, for_user);
    if (offer && offer.sdp && offer.type === "offer") {
      await remotePeerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      setRemoteDescriptionSet(true);

      // Apply any ICE candidates in the queue
      while (iceCandidateQueue.current.length > 0) {
        const candidate = iceCandidateQueue.current.shift();
        await remotePeerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }

      // Create an answer and set it locally
      const answer = await remotePeerConnection.current.createAnswer();
      await remotePeerConnection.current.setLocalDescription(answer);

      // Send answer back to Stream component via the signaling server
      await insert({
        variables: {
          data: [
            { user_id: userId, handshake: answer, space_id: id, for_user },
          ],
        },
      });
      console.log("answer.sent", answer);
    } else {
      console.error("Invalid offer received:", offer);
    }
  };

  // Function to handle ICE candidates
  const updateCandidate = async (answer: any) => {
    try {
      if (remoteDescriptionSet) {
        await remotePeerConnection.current.addIceCandidate(
          new RTCIceCandidate(answer)
        );
      } else {
        // Queue the ICE candidate until the remote description is set
        iceCandidateQueue.current.push(answer);
      }
    } catch (error) {
      console.error("Error adding received ICE candidate", error);
    }
  };

  useEffect(() => {
    if (data?.spaces_watcher?.length > 0) {
      data?.spaces_watcher.map((watcher: any) => {
        const answer = watcher.handshake;
        console.log("answer");
        if (answer && answer.candidate) {
          // This is an ICE candidate
          console.log("Received ICE candidate:", answer);
          updateCandidate(answer);
        } else {
          console.error("Invalid answer or candidate received:", answer);
        }
      });
    }
  }, [data]);

  useEffect(() => {
    // Create remote peer connection
    remotePeerConnection.current = new RTCPeerConnection();

    // Handle ICE candidates received from Stream component
    remotePeerConnection.current.onicecandidate = async (event: any) => {
      if (event.candidate) {
        console.log("candidate created", event.candidate);
        // Send ICE candidate back to the signaling server
        let payload: any = {
          user_id: userId,
          handshake: event.candidate,
          space_id: id,
          for_user: for__user, // For signaling purposes
        };

        await insert({
          variables: {
            data: [payload],
          },
        });

        console.log("candidate send", event.candidate);
      }
    };

    // Handle remote track event to display the remote stream
    remotePeerConnection.current.ontrack = (event: any) => {
      const [remoteStream] = event.streams;
      videoRef.current.srcObject = remoteStream;
    };

    return () => {
      remotePeerConnection.current.close();
    };
  }, []);

  const { data: spaceData } = useSubscription(GET_SPACE, {
    variables: { id },
  });

  useEffect(() => {
    if (spaceData?.spaces?.length > 0 && spaceData.spaces[0].offer) {
      setSpace(spaceData.spaces[0].user_id);
      handleOffer(spaceData.spaces[0].offer, spaceData.spaces[0].user_id);
    }
  }, [spaceData]);

  return (
    <div className="flex justify-center items-center flex-col pt-10">
      <video ref={videoRef} autoPlay controls className="w-[550px]" />
    </div>
  );
};

export default Watch;
