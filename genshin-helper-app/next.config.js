/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/game/genshin-impact",
                permanent: false,
            },
            {
                source: "/game/genshin-impact/wiki",
                destination: "/game/genshin-impact/wiki/characters",
                permanent: false,
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
            },
        ],
    },
};

module.exports = nextConfig;
