/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: true,
    transpilePackages: ["echarts", "zrender"],
    async rewrites() {
        return [
            {
                source: "/rest/api/:path*",
                destination: "https://apis.knnect.com/dev/:path*"
            }
        ];
    }
};

module.exports = nextConfig;
