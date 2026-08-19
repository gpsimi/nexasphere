const sharedConfig = require('../../packages/config/tailwind.config.js');

module.exports = {
  ...sharedConfig,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/index.js",
    "../../packages/ui/utils.js"
  ],
};
