module.exports = {
  testEnvironment: "jest-environment-jsdom",
  moduleFileExtensions: ["js", "jsx"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"]
};
