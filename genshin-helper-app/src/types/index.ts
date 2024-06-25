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
          method: HTTP_METHOD.GET | HTTP_METHOD.DELETE;
      };

export enum AUTH_ERRORS {
    INVALID_SESSION = "Invalid session",
    INVALID_CREDENTIALS = "You have entered an invalid username or password",
    UNKNOWN = "Something went wrong",
    RATE_LIMIT = "Too many requests, please try again later",
    NO_CREDENTIALS = "No credentials provided",
}
