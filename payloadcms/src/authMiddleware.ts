import { Response } from "express";
import { PayloadRequest } from "payload/types";

// use for protected endpoints, include it in endpoint handlers array
const authMiddleware = (req: PayloadRequest, res: Response, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};

export default authMiddleware;
