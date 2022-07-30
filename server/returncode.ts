export const returnCode = function (
  statuscode: number,
  textmessage: string
): Object {
  return {
    status: statuscode,
    message: textmessage,
  };
};

export const returnCodeReject = function (
  statuscode: number,
  textmessage: string
): Promise<Object> {
  return Promise.reject({
    status: statuscode,
    message: textmessage,
  });
};
export const returnCodeResolve = function (
  statuscode: number,
  textmessage: string
): Promise<Object> {
  return Promise.resolve({
    status: statuscode,
    message: textmessage,
  });
};
