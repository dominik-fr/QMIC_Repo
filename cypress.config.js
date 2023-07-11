const { defineConfig } = require("cypress");

module.exports = defineConfig({
	viewportWidth: 1920,
	viewportHeight: 1080,
	chromeWebSecurity: false,
  	retries: { runMode: 1, openMode: 0 },

	//mochawesome reporter config
	reporter: "cypress-mochawesome-reporter",
	reporterOptions: {
		charts: true,
		reportPageTitle: "QMIC test report",
		embeddedScreenshots: true,
		inlineAssets: true,
		saveAllAttempts: false,
	},
	e2e: {
		//baseUrl:
		specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    	excludeSpecPattern: ["**/1-getting-started/*", "**/2-advanced-examples/*"],
		
		setupNodeEvents(on, config) {
			require("cypress-mochawesome-reporter/plugin")(on);
		},
	},
});
