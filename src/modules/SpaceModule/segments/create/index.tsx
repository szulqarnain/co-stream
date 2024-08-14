import React, { useState } from "react";
import toast from "react-hot-toast";
import Logo from "~/assets/logo/logo.png";
import { useMutation } from "@apollo/client";
import { INSERT } from "~/graphql/spaces";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useUserId } from "@nhost/react";
import { Link, useNavigate } from "react-router-dom";
import { apiCall } from "~/helpler/apiCall";
import { getYouTubeVideoId } from "~/helpler/getVideoId";

export default function CreateSpace() {
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    control,
  } = useForm();
  const user_id = useUserId();

  const [insert] = useMutation(INSERT);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (dataInput: any) => {
    setLoading(true);
    const id = getYouTubeVideoId(dataInput.link);
    if (!id) {
      toast.error("Invalid Url");
      setLoading(false);
      return false;
    }
    const { title, thumbnail }: any = await apiCall(id);

    if (!title) {
      toast.error("Sorry! We're unable to get video detail try another link");
      setLoading(false);
      return false;
    }
    let payload: any = {
      user_id,
      name: title,
      img: thumbnail,
      link: `https://youtu.be/${id}`,
    };

    const response = await insert({
      variables: {
        data: [payload],
      },
    });
    console.log("response", response);
    toast.success("Space created successfully");

    navigate(
      `/user/space/${response?.data?.insert_spaces?.returning?.[0]?.id}`
    );
  };

  const style = {
    "& .MuiInputBase-input": {
      color: "white",
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="max-w-full w-full sm:w-[inhret] sm:max-w-[600px] p-2 ">
          <div>
            <div className="flex justify-center w-full mt-[30px]">
              <Link to={"/"}>
                {" "}
                <img src={Logo} alt="" className="h-[100px]" />{" "}
              </Link>
            </div>
            <h1 className="text-white font-bold text-center">Create Space</h1>
            <div className="w-full flex justify-center items-center">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 m-0 sm:m-4 w-full sm:w-[500px]"
              >
                <TextField
                  {...register("link", { required: true })}
                  id="outlined-basic"
                  label="Youtube Link"
                  variant="outlined"
                  placeholder="Place youtube link here"
                  sx={style}
                />

                <LoadingButton
                  type="submit"
                  loading={loading}
                  variant="contained"
                >
                  Create
                </LoadingButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
