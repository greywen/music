import nextPWA from 'next-pwa';

const isDev = process.env?.NODE_ENV === 'development';
const url = new URL(process.env?.API_URL);

const withPWA = nextPWA({
    dest: 'public',
    register: !isDev,
    skipWaiting: !isDev,
    disable: isDev,
});

const nextConfig = {
    images: {
        domains: [url.hostname],
    },
};

export default withPWA(nextConfig);