import IReturnCode from "~~/base/types/IReturnCode";

export const returnCode = function (
  statuscode: number,
  textmessage: string
): IReturnCode {
  return {
    status: statuscode,
    message: textmessage,
  };
};

export const returnCodeReject = function (
  statuscode: number,
  textmessage: string
): Promise<IReturnCode> {
  return Promise.reject({
    status: statuscode,
    message: textmessage,
  });
};
export const returnCodeResolve = function (
  statuscode: number,
  textmessage: string
): Promise<IReturnCode> {
  return Promise.resolve({
    status: statuscode,
    message: textmessage,
  });
};
