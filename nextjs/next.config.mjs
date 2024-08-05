import nextPWA from 'next-pwa';

const isDev = process.env?.NODE_ENV === 'development';

const withPWA = nextPWA({
    dest: 'public',
    register: !isDev,
    skipWaiting: !isDev,
    disable: isDev,
});

const nextConfig = {
    images: {
        domains: ['y.gtimg.cn'],
    },
};

export default withPWA(nextConfig);