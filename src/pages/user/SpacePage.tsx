import { ChannelProvider } from "ably/react";
import { useParams } from "react-router-dom";
import Space from "~/modules/SpaceModule/segments/space";

export default function SpacePage() {
  const { id }: any = useParams();
  return (
    <div>
      <ChannelProvider channelName={id}>
        <Space />
      </ChannelProvider>
    </div>
  );
}
