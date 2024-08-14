import React, { useState } from "react";
import Logo from "~/assets/logo/logo.png";
import { useSignInEmailPassword } from "@nhost/react";
import { nhost } from "~/lib/nhost";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  // const baseUrl =
  //   process.env.ENV === "local"
  //     ? "http://localhost:3000"
  //     : "https://co-stream.vercel.app/";

  // const redirectTo = `${baseUrl}/user`;

  const baseUrl = window.location.origin;

  console.log("add", baseUrl);

  const loginWithGoogle = () => {
    if (!isLoading) {
      setIsLoading(true);
      // const baseUrl =
      //   process.env.ENV === "local"
      //     ? "http://localhost:3000"
      //     : "https://co-stream.vercel.app/";

      // const redirectTo = `${baseUrl}/user`;

      console.log("add", baseUrl);

      nhost.auth.signIn({
        provider: "google",
        options: {
          redirectTo: baseUrl,
        },
      });

      // window.location.href =
      // "https://aashcwcbrnqfgnvohxxi.auth.eu-central-1.nhost.run/v1/signin/provider/google";
    }
  };

  return (
    <div className="flex flex-col-reverse gap-8 lg:flex-row bg-[#291248]">
      <div className="flex flex-col justify-center items-center w-full min-h-[100vh] m-[10px]">
        <div className="w-full flex flex-start px-[10px] md:px-[30px]  pt-[20px]"></div>
        <div className="px-[20px] w-full md:w-[400px] min-h-[90vh] pt-[20px] md:pt-[50px]">
          <div className="flex mb-[30px] flex-col justify-center ">
            {" "}
            <div className="flex justify-center">
              <img src={Logo} className="h-[100px] " />
            </div>
            <h1 className="text-center text-[20px] py-6 font-bold leading-tight tracking-tight text-gray-900  dark:text-white">
              Co Stream
            </h1>
          </div>
          <div className="fle gap-2 flex-row justify-center w-half  ">
            <button
              onClick={() => {
                loginWithGoogle();
              }}
              className="  px-6 py-[2px] w-full text-center flex justify-center gap-2 rounded-md text-white   transition duration-150 "
            >
              <img
                className="w-4 h-4 mt-[5px]"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
              />
              <span className="dark:text-gra-500">
                {isLoading ? "Redirecting..." : "Continue with Google"}
              </span>
            </button>
          </div>
          {/* <div className="base-separator my-4 flex w-full justify-between">
            <span className="flex-1 flex flex-col justify-center">
              <span className="line w-full"></span>
            </span>
            <span className="text-[#707da7] px-2">or</span>
            <span className="flex-1 flex flex-col justify-center">
              <span className="line"></span>
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
