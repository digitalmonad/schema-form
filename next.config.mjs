/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: process.env.NODE_ENV === 'development' ? '' : '/schema-form',
}

export default nextConfig
