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
        domains: ["localhost", "127.0.0.1", "doubleu.work"],
    },
};

export default withPWA(nextConfig);