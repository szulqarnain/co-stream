import { ChannelProvider } from "ably/react";
import React from "react";
import { useParams } from "react-router-dom";
import Stream from "~/modules/SpaceModule/segments/Stream";

export default function ShareScreenPage() {
  const { id }: any = useParams();
  return (
    <div>
      <ChannelProvider channelName={id}>
        <Stream />
      </ChannelProvider>
    </div>
  );
}
