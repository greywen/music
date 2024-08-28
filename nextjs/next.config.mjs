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
                protocol: 'http',
                hostname: 'localhost',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'doubleu.work',
                pathname: '**',
            },
        ],
    },
};

export default withPWA(nextConfig);