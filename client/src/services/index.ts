export * as authService from "./auth";
export * as vaultService from "./vault";

export const extractErrors = (error: any) => {
  let msg = "";

  if (error.isAxiosError && !error.response) {
    msg =
      "Failed to communicate with the server, please check your internet connection.";
  } else if (
    error?.response?.data?.errors &&
    typeof error.response.data.errors === "object"
  ) {
    const keys = Object.keys(error.response.data.errors);
    if (keys.length > 0) {
      msg = error.response.data.errors[keys[0]];
    }
  } else if (error?.response?.data?.message) {
    msg = error.response.data.message;
  } else {
    msg = error.message;
  }

  return {
    allErrors: error?.response?.data?.errors,
    message: msg,
  };
};
