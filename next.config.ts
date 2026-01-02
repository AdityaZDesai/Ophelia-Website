import type { NextConfig } from "next";
import dns from "dns";

// Force IPv4 for DNS resolution - fixes ECONNRESET issues with OAuth
dns.setDefaultResultOrder("ipv4first");

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
