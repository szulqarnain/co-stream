import React, { useRef, useEffect } from "react";
import { useMutation, useSubscription } from "@apollo/client";
import {
  GET_SPACE_HANDSHAKE,
  INSERT_WATCHER,
  GET_SPACE,
} from "~/graphql/spaces";
import { useUserId } from "@nhost/react";
import { useParams } from "react-router-dom";

const Watch = () => {
  const { id }: any = useParams();
  const userId = useUserId();
  const [insert] = useMutation(INSERT_WATCHER);
  const { data } = useSubscription(GET_SPACE_HANDSHAKE, {
    variables: {
      space_id: id,
      for_user: "41fa8cb9-2c18-4874-b084-a0701a04fd60",
    },
  });

  
  // Listen for offer and handle when available
  useEffect(() => {
    if (data?.spaces_watcher?.length > 0 ) {
      data?.spaces_watcher.map((watcher:any)=>{
           const answer = watcher.handshake;
           if (answer && answer.candidate) {
                // This is an ICE candidate
                console.log("Received ICE candidate:", answer);
                try {
                  await remotePeerConnection.current.addIceCandidate(
                    new RTCIceCandidate(answer)
                  );
                } catch (error) {
                  console.error("Error adding received ICE candidate", error);
                }
            } else {
              console.error("Invalid answer or candidate received:", answer);
            }
      })
    }
  }, [data]);

  
  const { data: spaceData } = useSubscription(GET_SPACE, {
    variables: { id },
  });

  const remotePeerConnection: any = useRef(null);
  const videoRef: any = useRef(null);

  useEffect(() => {
    // Create remote peer connection
    remotePeerConnection.current = new RTCPeerConnection();

    // Handle ICE candidates received from Stream component
    remotePeerConnection.current.onicecandidate = async (event: any) => {
      if (event.candidate) {
        console.log("candidate received", event.candidate);
        // Send ICE candidate back to the signaling server
        let payload: any = {
          user_id: userId,
          handshake: event.candidate,
          space_id: id,
          for_user: "5d6ffb52-77e1-481d-820d-d586074bca5e", // For signaling purposes
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

  // Function to handle receiving the offer from Stream component
  const handleOffer = async (offer: any, for_user: any) => {
    console.log("offer.received", offer, for_user);
    if (offer && offer.sdp && offer.type === "offer") {
      await remotePeerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

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

  // Listen for offer and handle when available
  useEffect(() => {
    if (spaceData?.spaces?.length > 0 && spaceData.spaces[0].offer) {
      handleOffer(spaceData.spaces[0].offer, spaceData.spaces[0].user_id);
    }
  }, [spaceData]);

  return (
    <div>
      <video ref={videoRef} autoPlay controls />
    </div>
  );
};

export default Watch;
