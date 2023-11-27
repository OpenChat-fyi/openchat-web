/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'standalone', 
    webpack: (config, { dev }) => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding', {
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      })
      if (!dev) {
        config.devtool = 'source-map';
        // config.optimization.minimize = false;
      }
      return config
    },
    // swcMinify: false
}  

module.exports = nextConfig
