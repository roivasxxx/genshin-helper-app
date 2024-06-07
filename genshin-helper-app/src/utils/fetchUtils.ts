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
        next: { revalidate: 0 };
    } = {
        method: params.method,
        credentials: "include",
        headers: {},
        next: { revalidate: 0 },
    };

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

/**
 * Wrapping promises for the React.Suspense component
 */
const wrapPromise = (promise: Promise<Response>) => {
    let status = "pending";
    let result: Response | null = null;
    let suspender = promise.then(
        (r) => {
            status = "success";
            result = r;
        },
        (e) => {
            status = "error";
            result = e;
        }
    );
    return {
        read() {
            if (status === "pending") {
                throw suspender;
            } else if (status === "error") {
                throw result;
            }
            return result;
        },
    };
};

/**
 * Used to make requests to the backend when using React.Suspense
 */
export const createResource = (request: Promise<Response>) => {
    return wrapPromise(request);
};

export type ResourceType = ReturnType<typeof createResource>;
