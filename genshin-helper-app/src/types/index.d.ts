export type RequestUtilsBody =
    | {
          body?: object | undefined | null;
          method: "POST" | "PATCH" | "PUT";
      }
    | {
          body?: undefined | null;
          method: "GET" | "DELETE";
      };
