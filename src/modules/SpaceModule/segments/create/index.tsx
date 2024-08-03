import React, { useState } from "react";
import toast from "react-hot-toast";
import Logo from "~/assets/logo/logo.png";
import { useMutation } from "@apollo/client";
import { INSERT } from "~/graphql/spaces";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useUserId } from "@nhost/react";
import { useNavigate } from "react-router-dom";

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
    let payload: any = {
      user_id,
      name: dataInput?.name,
      link: dataInput?.link,
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
        <div className="max-w-[600px] ">
          <div>
            <div className="flex justify-center w-full mt-[30px]">
              <img src={Logo} alt="" className="h-[100px]" />
            </div>
            <h1 className="text-white font-bold">Create Space:</h1>
            <div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 m-4 w-[500px]"
              >
                <TextField
                  {...register("name", { required: true })}
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  sx={style}
                />
                <TextField
                  {...register("link", { required: true })}
                  id="outlined-basic"
                  label="Link"
                  variant="outlined"
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
