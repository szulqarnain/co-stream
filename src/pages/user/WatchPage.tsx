import { ChannelProvider } from "ably/react";
import { useParams } from "react-router-dom";
import Space from "~/modules/SpaceModule/segments/space";
import Watch from "~/modules/SpaceModule/segments/Watch";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_SPACE, GET_SPACE_QUERY } from "~/graphql/spaces";

export default function WatchPage() {
  const { id }: any = useParams();
  const { data } = useSubscription(GET_SPACE, {
    variables: { id },
  });

  if (!data?.spaces?.[0].offer) {
    return <p>Waiting...</p>;
  }
  return (
    <div>
      <ChannelProvider channelName={id}>
        <Watch for__user={data?.spaces?.[0].user_id} />
      </ChannelProvider>
    </div>
  );
}
