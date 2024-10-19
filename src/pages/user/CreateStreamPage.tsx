import React, { useEffect } from "react";
import CreateStream from "~/modules/SpaceModule/segments/Stream";
import { INSERT } from "~/graphql/spaces";
import { useMutation } from "@apollo/client";
import { useUserId } from "@nhost/react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function CreateStreamPage() {
  const [insert] = useMutation(INSERT);
  const user_id = useUserId();

  const navigate = useNavigate();

  const start = async () => {
    let payload: any = {
      user_id,
      name: "screen",
      img: "",
      link: ``,
    };

    const response = await insert({
      variables: {
        data: [payload],
      },
    });
    console.log("response", response);

    toast.success(
      "Space created successfully, you can start sharing your screen"
    );

    navigate(
      `/user/share-screen/${response?.data?.insert_spaces?.returning?.[0]?.id}`
    );
  };

  useEffect(() => {
    start();
  }, []);
  return <div>{/* <CreateStream /> */}</div>;
}
