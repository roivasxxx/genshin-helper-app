import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: async (req) => {
            // checks if user has token
            return !!req.token;
        },
    },
    // redirect list
    pages: {
        signIn: "/login",
        error: "/login",
        signOut: "/",
        newUser: "/register",
    },
});

//checks /me path
export const config = {
    matcher: ["/me/:path*"],
};
