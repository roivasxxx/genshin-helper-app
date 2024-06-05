import { PayloadRequest } from "payload/types";
export const isAllowed = async ({ req, ...rest }: { req: PayloadRequest }) => {
    if (req.user) {
        const user = req.user;
        if (req.route.path === "/me") {
            return true;
        }

        return user.collection === "users" && user.roles.includes("admin");
    }
    return false;
};

export const accessControls = {
    create: isAllowed,
    delete: isAllowed,
    read: isAllowed,
    readVersions: isAllowed,
    unlock: isAllowed,
    update: isAllowed,
};
