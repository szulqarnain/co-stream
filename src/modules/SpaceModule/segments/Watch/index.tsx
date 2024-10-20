import React, { useRef, useEffect, useState } from "react";
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
  const [spaceDetail, setSpaceDetail] = useState<any>(null);
  const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]);

  const { data: spaceData } = useSubscription(GET_SPACE, {
    variables: { id },
  });

  const remotePeerConnection: any = useRef(null);
  const videoRef: any = useRef(null);

  useEffect(() => {
    if (spaceDetail) {
      remotePeerConnection.current = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });

      remotePeerConnection.current.onicecandidate = async (event: any) => {
        if (event.candidate) {
          console.log("ice", event.candidate);
          //   await insert({
          //     variables: {
          //       data: [
          //         {
          //           user_id: userId,
          //           data: event.candidate,
          //           space_id: id,
          //           reason: "ice",
          //           for_user: spaceDetail.user_id,
          //         },
          //       ],
          //     },
          //   });
          //   console.log("Candidate sent:", event.candidate);
        }
      };

      remotePeerConnection.current.oniceconnectionstatechange = () => {
        console.log(
          "ICE connection state:",
          remotePeerConnection.current.iceConnectionState
        );
        // setConnectionState(remotePeerConnection.current.iceConnectionState);
      };

      remotePeerConnection.current.onconnectionstatechange = () => {
        console.log(
          "Connection state:",
          remotePeerConnection.current.connectionState
        );
      };

      remotePeerConnection.current.ontrack = (event: any) => {
        videoRef.current.srcObject = event.streams[0];
      };

      return () => {
        remotePeerConnection.current.close();
      };
    }
  }, [spaceDetail]);

  const sendOfferAnswer = async (offerData: any) => {
    const offer = offerData.data;
    const offer_from = offerData.user_id;

    if (offer && offer.sdp && offer.type === "offer") {
      await remotePeerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      console.log("Remote description set");

      const answer = await remotePeerConnection.current.createAnswer();
      await remotePeerConnection.current.setLocalDescription(answer);
      console.log("Local description set");

      processIceCandidateQueue(); // Add this line

      await insert({
        variables: {
          data: [
            {
              user_id: userId,
              data: answer,
              space_id: id,
              for_user: offer_from,
              reason: "answer",
            },
          ],
        },
      });
      console.log("Answer sent:", answer);
    } else {
      console.error("Invalid offer received:", offer);
    }
  };

  const sendOfferRequest = async (to_user: any) => {
    await insert({
      variables: {
        data: [
          {
            user_id: userId,
            data: {},
            space_id: id,
            for_user: to_user,
            reason: "req_offer",
          },
        ],
      },
    });
  };

  useEffect(() => {
    if (spaceData?.spaces?.length > 0) {
      if (!spaceDetail) setSpaceDetail({ ...spaceData?.spaces[0] });
      if (
        spaceData.spaces[0].spaces_watchers.filter(
          (watcher: any) =>
            watcher.user_id === userId && watcher.reason === "req_offer"
        ).length === 0
      ) {
        const to_user = spaceData.spaces[0].user_id;
        sendOfferRequest(to_user);
      }

      const offer = spaceData.spaces[0].spaces_watchers.find(
        (watcher: any) =>
          watcher.for_user === userId && watcher.reason === "offer"
      );

      const answer = spaceData.spaces[0].spaces_watchers.filter(
        (watcher: any) =>
          watcher.user_id === userId && watcher.reason === "answer"
      );

      console.log("checkans", offer, answer);
      if (offer && answer.length === 0) {
        sendOfferAnswer(offer);
      }

      // Handle incoming ICE candidates
      const iceCandidates = spaceData.spaces[0].spaces_watchers.filter(
        (watcher: any) =>
          watcher.for_user === userId && watcher.reason === "ice"
      );

      iceCandidates.forEach((iceCandidate: any) => {
        if (remotePeerConnection.current.remoteDescription) {
          remotePeerConnection.current
            .addIceCandidate(new RTCIceCandidate(iceCandidate.data))
            .then(() => {
              console.log("ICE candidate added:", iceCandidate.data);
            })
            .catch((error: any) => {
              console.error("Error adding ICE candidate:", error);
            });
        } else {
          console.log("Queuing ICE candidate");
          // Queue the ICE candidate to be added later
          iceCandidateQueue.current.push(iceCandidate.data);
        }
      });
    }
  }, [spaceData]);

  const processIceCandidateQueue = () => {
    while (iceCandidateQueue.current.length) {
      const candidate = iceCandidateQueue.current.shift();
      remotePeerConnection.current
        .addIceCandidate(new RTCIceCandidate(candidate))
        .then(() => {
          console.log("Queued ICE candidate added");
        })
        .catch((error: any) => {
          console.error("Error adding queued ICE candidate:", error);
        });
    }
  };

  const Check = () => {
    // remotePeerConnection.oniceconnectionstatechange = () => {
    console.log(remotePeerConnection.current.iceConnectionState);
    // };
  };

  return (
    <div className="flex justify-center items-center flex-col pt-10">
      <button onClick={() => Check()}>check</button>
      <video ref={videoRef} autoPlay controls className="w-[550px]" />
    </div>
  );
};

export default Watch;
