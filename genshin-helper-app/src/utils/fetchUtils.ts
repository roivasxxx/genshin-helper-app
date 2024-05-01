import { RequestUtilsBody } from "../types";
import ENV from "./env-utils";

export class HttpError extends Error {
    constructor(public response: Response) {
        super(`HTTP error ${response.status}`);
    }
}

/**
 * Creates a fetch request for the specified params
 * @param params
 * @returns fetch promise
 */
const cmsRequest = async (
    params: {
        path: string;
        abortController?: AbortController;
        headers?: Record<string, string>;
    } & RequestUtilsBody
) => {
    const fetchOptions: {
        body?: string;
        abortController?: typeof params.abortController;
        method: typeof params.method;
        credentials: "include";
        headers: Record<string, string>;
    } = { method: params.method, credentials: "include", headers: {} };

    if (params.body) {
        fetchOptions.body = JSON.stringify(params.body);
        fetchOptions.headers["Content-Type"] = "application/json";
    }
    if (params.abortController) {
        fetchOptions.abortController = params.abortController;
    }
    if (params.headers) {
        fetchOptions.headers = { ...fetchOptions.headers, ...params.headers };
    }
    const path =
        ENV.BACKEND_URL +
        (params.path[0] === "/" ? params.path : "/" + params.path);

    const result = await fetch(path, fetchOptions);
    if (result.ok) {
        return result;
    } else {
        throw new HttpError(result);
    }
};

export default cmsRequest;
