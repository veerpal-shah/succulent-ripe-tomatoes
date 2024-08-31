/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      config.resolve.modules.push(__dirname + '/src');
      return config;
    },
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  };
  
export default nextConfig;
  