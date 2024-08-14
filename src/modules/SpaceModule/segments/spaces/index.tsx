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
      <div className="min-w-full p-4 sm:min-w-[400px] ">
        <div className="flex justify-center w-full mt-[30px]">
          <Link to={"/"}>
            {" "}
            <img src={Logo} alt="" className="h-[100px]" />{" "}
          </Link>
        </div>
        <h1 className="text-white font-bold">Spaces:</h1>
        {/* <hr /> */}
        <div className="mt-2 mb-40">
          {data?.spaces?.map((space: any) => {
            return (
              <Link to={`/user/space/${space.id}`} className="mb-4 block">
                <div
                  key={space.id}
                  className="flex max-w-[400px] bg-[#7749b5] rounded-md cursor-pointer h-[150px]"
                >
                  <div className="flex justify-center flex-col w-[200px] ">
                    <img src={space.img} alt="" className="w-full" />
                  </div>
                  <div className="h-[120px] p-2 w-[200px]">
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
