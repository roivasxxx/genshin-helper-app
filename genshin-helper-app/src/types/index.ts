export enum HTTP_METHOD {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    PUT = "PUT",
    DELETE = "DELETE",
}

export type RequestUtilsBody =
    | {
          body?: object | undefined | null;
          method: HTTP_METHOD.POST | HTTP_METHOD.PATCH | HTTP_METHOD.PUT;
      }
    | {
          body?: undefined | null;
          method: HTTP_METHOD.GET | HTTP_METHOD.delete;
      };

export enum AuthErrors {
    INVALID_SESSION = "INVALID_SESSION",
}
