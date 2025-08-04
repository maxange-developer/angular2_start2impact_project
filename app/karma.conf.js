/**
 * Karma Configuration for Fruity Nutrition App
 *
 * This configuration file sets up the testing environment for unit tests
 * using Jasmine framework with Chrome browser and comprehensive coverage reporting.
 *
 * Features:
 * - Jasmine testing framework integration
 * - Chrome browser automation for test execution
 * - Comprehensive code coverage reporting with multiple formats
 * - Quality gates with minimum coverage thresholds
 * - CI/CD pipeline compatibility with headless browser support
 */

module.exports = function (config) {
  config.set({
    /**
     * Base path for resolving files and patterns
     */
    basePath: "",

    /**
     * Testing frameworks configuration
     * Using Jasmine for behavior-driven development testing
     */
    frameworks: ["jasmine", "@angular-devkit/build-angular"],

    /**
     * Required plugins for test execution and reporting
     */
    plugins: [
      require("karma-jasmine"), // Jasmine test framework adapter
      require("karma-chrome-launcher"), // Chrome browser launcher
      require("karma-jasmine-html-reporter"), // HTML test result reporter
      require("karma-coverage"), // Code coverage analysis
      require("@angular-devkit/build-angular/plugins/karma"), // Angular CLI integration
    ],

    /**
     * Client-side configuration for Jasmine test runner
     */
    client: {
      jasmine: {
        // Jasmine-specific configuration options can be added here
      },
      // Preserve context between tests for better debugging
      clearContext: false,
    },

    /**
     * Jasmine HTML reporter configuration
     * Suppresses verbose output for cleaner CI logs
     */
    jasmineHtmlReporter: {
      suppressAll: true,
    },

    /**
     * Code coverage reporting configuration
     * Generates multiple report formats for different use cases
     */
    coverageReporter: {
      // Output directory for coverage reports
      dir: require("path").join(__dirname, "./coverage/fruity-nutrition-app"),
      subdir: ".",

      /**
       * Multiple reporter formats for comprehensive coverage analysis:
       * - html: Interactive web-based coverage report
       * - text-summary: Console output summary
       * - lcov: Format compatible with external tools (SonarQube, Codecov)
       * - cobertura: XML format for CI/CD integration
       */
      reporters: [
        { type: "html" },
        { type: "text-summary" },
        { type: "lcov" },
        { type: "cobertura" },
      ],

      /**
       * Quality gates: Minimum coverage thresholds for build success
       * These thresholds ensure code quality standards are maintained
       */
      check: {
        global: {
          statements: 70, // Minimum 70% statement coverage
          branches: 60, // Minimum 60% branch coverage
          functions: 70, // Minimum 70% function coverage
          lines: 70, // Minimum 70% line coverage
        },
      },
    },

    /**
     * Test result reporters configuration
     * - progress: Shows test execution progress in console
     * - kjhtml: Generates interactive HTML test results
     * - coverage: Provides code coverage analysis
     */
    reporters: ["progress", "kjhtml", "coverage"],

    /**
     * Browser configuration for test execution
     * Default: Chrome for local development
     */
    browsers: ["Chrome"],

    /**
     * Custom browser launchers for different environments
     * ChromeHeadlessCI: Optimized for continuous integration pipelines
     */
    customLaunchers: {
      ChromeHeadlessCI: {
        base: "ChromeHeadless",
        flags: [
          "--no-sandbox", // Required for containerized environments
          "--disable-web-security", // Allows testing with CORS restrictions
        ],
      },
    },

    /**
     * Watch mode configuration
     * Automatically restart tests when source files change during development
     */
    restartOnFileChange: true,
  });
};
