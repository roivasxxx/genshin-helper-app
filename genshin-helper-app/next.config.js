/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/genshin-impact",
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
