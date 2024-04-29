/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/game/genshin-impact",
                permanent: false,
            },
        ];
    },
};

module.exports = nextConfig;
