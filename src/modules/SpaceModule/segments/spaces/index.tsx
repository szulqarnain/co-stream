import React from "react";
import Logo from "~/assets/logo/logo.png";
import { useSubscription } from "@apollo/client";
import { GET_SPACES } from "~/graphql/spaces";
import { Link } from "react-router-dom";

export default function Spaces() {
  const { loading, data, error } = useSubscription(GET_SPACES);

  console.log("data", data);
  return (
    <div className="flex justify-center items-center">
      <div className="min-w-[400px] ">
        <div className="flex justify-center w-full mt-[30px]">
          <img src={Logo} alt="" className="h-[100px]" />
        </div>
        <h1 className="text-white font-bold">Spaces:</h1>
        {/* <hr /> */}
        <div className="mt-2">
          {data?.spaces?.map((space: any) => {
            return (
              <Link to={`/user/space/${space.id}`} className="mb-4 block">
                <div
                  key={space.id}
                  className="flex h-[120px] w-full bg-[#7749b5] rounded-md cursor-pointer"
                >
                  <div className="flex justify-center flex-col w-[30%] ">
                    <img src={Logo} alt="" className="h-full" />
                  </div>
                  <div>
                    <h2 className="text-white mt-[5px]">{space.name}</h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
