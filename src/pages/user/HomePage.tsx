import React from "react";
import { Link } from "react-router-dom";
import Spaces from "~/modules/SpaceModule/segments/spaces";

export default function HomePage() {
  return (
    <div>
      <Spaces />
      <div className=" bottom-0 fixed flex justify-center w-full bg-[#291248] pt-4">
        <Link
          to="/user/create"
          className="py-4 border border-1 border-[white] text-white rounded-lg px-4 mb-[40px]"
        >
          Create Space
        </Link>
      </div>
    </div>
  );
}
