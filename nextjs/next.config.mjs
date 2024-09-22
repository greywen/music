import nextPWA from 'next-pwa';

console.log(process.env?.NODE_ENV);
const isDev = process.env?.NODE_ENV === 'development';

const withPWA = nextPWA({
    dest: 'public',
    register: !isDev,
    skipWaiting: !isDev,
    disable: isDev,
});

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'io.anhejin.cn',
                pathname: '**',
            },
        ],
    },
};

export default withPWA(nextConfig);