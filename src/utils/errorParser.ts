
export const parseError = (error: any): string[] => {
  let errorMessages: string[] = [];
  let errorResponse = error.response.data;
  if (errorResponse.errors) {
    for (let [, value] of Object.entries(errorResponse.errors)) {
      let val: any = value;
      errorMessages.push(val[0]["message"]);
    }
  } else {
    errorMessages.push(errorResponse.detail);
  }
  return errorMessages;
};
