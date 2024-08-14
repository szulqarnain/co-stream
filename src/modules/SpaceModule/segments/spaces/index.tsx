import React from "react";
import Logo from "~/assets/logo/logo.png";
import { useSubscription } from "@apollo/client";
import { GET_SPACES } from "~/graphql/spaces";
import { Link } from "react-router-dom";
import { useUserId } from "@nhost/react";

export default function Spaces() {
  const { loading, data, error } = useSubscription(GET_SPACES);
  const user_id = useUserId();

  console.log("data", data);
  return (
    <div className="flex justify-center items-center">
      <div className="min-w-full p-4 sm:min-w-[400px] mb-40 ">
        <div className="flex justify-center w-full mt-[30px]">
          <Link to={"/"}>
            {" "}
            <img src={Logo} alt="" className="h-[100px]" />{" "}
          </Link>
        </div>
        {loading ? (
          <>
            {" "}
            <h1 className="text-white font-bold">My Spaces:</h1>
            <Loading />
            <h1 className="text-white font-bold">Public Spaces:</h1>
            <Loading />
            <Loading />
            <Loading />
          </>
        ) : (
          <>
            {data?.spaces?.filter((sp: any) => sp.user_id === user_id).length >
              0 && (
              <div>
                <h1 className="text-white font-bold">My Spaces:</h1>
                <SpaceArea
                  spaces={data?.spaces?.filter(
                    (sp: any) => sp.user_id === user_id
                  )}
                />
              </div>
            )}

            <h1 className="text-white font-bold">Public Spaces:</h1>
            <SpaceArea
              spaces={data?.spaces?.filter((sp: any) => sp.user_id !== user_id)}
            />
          </>
        )}
      </div>
    </div>
  );
}
function SpaceArea({ spaces }: any) {
  return (
    <div className="mt-2">
      {spaces &&
        spaces?.map((space: any) => {
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
  );
}

const Loading = () => {
  return (
    <div className=" mt-2 flex max-w-[400px] bg-[#7749b5] rounded-md cursor-pointer h-[150px] space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
      <div className="flex justify-center flex-col w-[200px] ">
        <div className="w-[200px] dark:bg-gray-700 h-[150px] rounded-md"></div>
      </div>
      <div className="h-[120px] p-2 w-[200px]">
        {/* <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-28 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[180px] mb-2.5"></div> */}
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[100px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[100px] mb-2.5"></div>
        {/* <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[80px] mb-2.5"></div> */}
        {/* <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[90px]"></div> */}
      </div>
      {/* <div role="status" className="">
        <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
          <div></div>
        </div>
        <div className="w-full"></div>
        <span className="sr-only">Loading...</span>
      </div> */}
    </div>
  );
};
