/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', 
    webpack: (config, { dev }) => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding')
      // if (!dev) {
      //   config.optimization.minimize = false;
      // }
      return config
    },
    // swcMinify: false
}  

module.exports = nextConfig
