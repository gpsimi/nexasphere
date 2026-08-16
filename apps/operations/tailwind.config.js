const sharedConfig = require('@nexasphere/config/tailwind.config');

module.exports = {
  ...sharedConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/index.js",
    "../../packages/ui/utils.js"
  ],
}
