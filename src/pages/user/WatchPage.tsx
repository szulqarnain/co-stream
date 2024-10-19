import { ChannelProvider } from "ably/react";
import { useParams } from "react-router-dom";
import Space from "~/modules/SpaceModule/segments/space";
import Watch from "~/modules/SpaceModule/segments/Watch";

export default function WatchPage() {
  const { id }: any = useParams();
  return (
    <div>
      <ChannelProvider channelName={id}>
        <Watch />
      </ChannelProvider>
    </div>
  );
}
