import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../store/snackbar";

const useAppMutation = ({ mutationFn, mutationKey, ...config }) => {
  const dispatch = useDispatch();
  return useMutation({
    mutationKey,
    mutationFn,
    onSuccess: (response) => {
      dispatch(
        showSnackbar({
          message: response?.data?.message || "Success",
          variant: "success",
        })
      );
      if (config?.onSuccess) config?.onSuccess(response);
    },
    onError: (error) => {
      console.log({ error });
      dispatch(
        showSnackbar({
          message: error?.response?.data?.message || "Something went wrong!",
          variant: "danger",
        })
      );
      if (config?.onError) config?.onError(error);
    },
  });
};

export default useAppMutation;
