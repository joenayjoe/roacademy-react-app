import { AxiosError } from "axios";

export const axiosErrorParser = (error: AxiosError<any>): string[] => {
  let errorMessages: string[] = [];
  let errorResponse = error.response && error.response.data;
  if (errorResponse === undefined) {
    return [error + ""];
  }

  if (errorResponse.errors) {
    for (let [, value] of Object.entries(errorResponse.errors)) {
      let val: any = value;
      errorMessages.push(val[0]["message"]);
    }
  } else if (errorResponse.message) {
    errorMessages.push(errorResponse.message);
  } else {
    errorMessages.push(errorResponse.detail);
  }
  return errorMessages;
};
