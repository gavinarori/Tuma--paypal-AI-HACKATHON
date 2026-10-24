import path from "node:path";
import type { NextConfig } from "next";

// With NEXT_PUBLIC_PAYPAL_MODE=simulate, the PayPal button is swapped for a built-in simulator at build time.
// The page code is not touched: it still imports "@paypal/react-paypal-js", and the bundler resolves it to the simulator.
const simulate = process.env.NEXT_PUBLIC_PAYPAL_MODE === "simulate";
const SIM = "./src/sim/paypal-react-sim.tsx";

const nextConfig: NextConfig = {
  // Next 16 builds with Turbopack and complains if only a webpack config exists, so a turbopack entry is always present
  turbopack: simulate ? { resolveAlias: { "@paypal/react-paypal-js": SIM } } : {},
  webpack(config) {
    if (simulate) config.resolve.alias["@paypal/react-paypal-js"] = path.resolve(SIM);
    return config;
  },
};

export default nextConfig;