describe("template spec", () => {
	it("test_case1", () => {
		cy.visit("https://qualityminds.com/"); ///Go to www.qualityminds.com URL

		cy.get("#top-menu > .wpml-ls-current-language")
			.realHover("mouse")
			.then((mouseover) => {
				cy.wrap(mouseover).find(".menu-item-wpml-ls-18-de > a").realClick(); ///Hover over the language menu and click German flag
				cy.url().should("contain", "qualityminds.com/de"); //Page url is https://qualityminds.com/de/
			});
		cy.get("#top-menu") //Hover over Portfolio and click Automatisiertes Testen
			.contains("PORTFOLIO", { matchCase: false })
			.realHover("mouse")
			.then(() => {
				cy.get('[href*="qa-kernkompetenzen"]')
					.first()
					.realHover("mouse")
					.then(() => {
						cy.contains("Automatisiertes Testen", {
							matchCase: false,
						}).realClick();
						cy.url().should("contain", "automatisiertes-testen"); //Automatisiertes Testen page is displayed
						cy.contains(".et_pb_button", "KONTAKTIERE UNS")
							.invoke("attr", "href")
							.should("contain", "testing@qualityminds.de"); //Page contains button with mailto testing@qualityminds.de email address
					});
			});
		cy.go(-2).url().should("equal", "https://qualityminds.com/"); //cy.visit("https://qualityminds.com/"); ///Navigate back to www.qualityminds.com main page
		cy.get("#top-menu > .wpml-ls-current-language")
			.find("a")
			.first()
			.as("selectedFlag")
			.invoke("attr", "href")
			.should("match", /.*qualityminds.com\/$/); //Verify that you see the English version of page

		cy.get("@selectedFlag")
			.find("img.wpml-ls-flag")
			.invoke("attr", "src")
			.should("contain", "en.png"); //British flag is displayed on page navigation bar (en.png)

		cy.get("#top-menu") //Hover over Services and click Test Automation
			.contains("Services", { matchCase: false })
			.realHover("mouse")
			.then(() => {
				cy.contains("Test Automation", {
					matchCase: false,
				})
					.realClick()
					.url()
					.should("contain", "test-automation"); //Test Automation page is displayed
			});
		cy.get("#top-menu > .wpml-ls-current-language") //Hover language menu and click German flag
			.realHover("mouse")
			.then((mouseover) => {
				cy.wrap(mouseover).find(".menu-item-wpml-ls-18-de > a").realClick(); //Automatisiertes Testen page is displayed
				cy.url().should("contain", "automatisiertes-testen"); //Pages displayed in steps 3 and 8 are the same.
			});
	});

	it("test_case2", () => {
		cy.visit("https://qualityminds.com/"); ///Go to www.qualityminds.com URL
		cy.get("#top-menu > .wpml-ls-current-language")
			.find("a")
			.first()
			.as("selectedFlag")
			.invoke("attr", "href")
			.should("match", /.*qualityminds.com\/$/); //Verify that you see the English version of page

		cy.get("@selectedFlag")
			.find("img.wpml-ls-flag")
			.invoke("attr", "src")
			.should("contain", "en.png"); //British flag is displayed on page navigation bar (en.png)

		cy.get("#top-menu") //Hover on ABOUT US at the top navigation and verify if submenu is displayed
			.contains("About us", { matchCase: false })
			.as("menu")
			.realHover("mouse")
			.then(() => {
				cy.get("@menu")
					.parent()
					.find(".sub-menu")
					.should("be.visible") //Submenu is displayed
					.contains("Events", { matchCase: false })
					.realClick() //Click on EVENTS
					.url()
					.should("contain", "events"); // Events page is displayed
			});
		cy.get('input[aria-label="Enter Keyword. Search for events by Keyword."]').type("2021");
		cy.contains("Find events", { matchCase: false }).click(); //In the "Search for events" bar, type 2021 and click Find Events
		cy.get(
			'.tribe-common-c-loader__dot > .tribe-events-c-messages__message[role="alert"]'
		).contains('There were no results found for "2021"'); //Results page displays no-results message.

		/**
		 * Function navigates back to given year
		 * @param {number} year
		 */
		function selectYearBack(year) {
			cy.get(".datepicker-months").then((yearCurrent) => {
				let yearValue = yearCurrent.text();
				if (!yearValue.includes(year)) {
					cy.log("Going back...");
					cy.wrap(yearCurrent).find(".prev").click();
					selectYearBack(year);
				} else {
					cy.log("Target year reached");
				}
			});
		}
		cy.contains("Upcoming", { matchCase: false }).click();
		cy.get(".datepicker-days").find(".datepicker-switch").click();
		selectYearBack(2021);
		cy.get(".datepicker-months").contains("Dec").click();
		cy.get(".datepicker-days").contains("31").click(); //Navigate through the calendar to December 2021 and select day 31.
		cy.get(".tribe-events-calendar-list__event-title-link")
			.should("have.length", 1) //	Verify that you have 1 search result
			.and("contain.text", "ICSTTP 2021"); //Result should be ICSTTP 2021,
		cy.get(".tribe-events-calendar-list__event-date-tag-datetime")
			.invoke("attr", "datetime")
			.should("equal", "2022-01-04"); //dated January 04, 2022.
	});

	it("test_case3", () => {
		let errorsNumber = 5;
		cy.visit("https://qualityminds.com/de/karriere/stellenangebote/");
		cy.get('[class="awsm-job-listing-item awsm-grid-item"]')
			.should("have.length.greaterThan", 0) //At least one box with job opening is available
			.first()
			.contains("Erfahre mehr", { matchCase: false })
			.click();
		cy.get('input[type="submit"]').click(); //Click SENDEN button
		cy.get("input.awsm-job-form-error").as("erroneousFields").should("have.length", errorsNumber); //Validation messages were displayed for 4 fields (even 5)
		cy.get("#awsm-applicant-name")
			.type("John Doe") //Type a name in Vorname und Nachname input
			.should("not.have.class", "awsm-job-form-error"); //Validation message under filled-in input is not displayed anymore.
		cy.get("@erroneousFields").should("have.length", errorsNumber - 1); // Validation messages were displayed for remaining 3(4) fields.
		cy.get("#awsm-applicant-email")
			.next("div.awsm-job-form-error")
			.as("emailErrorDescription")
			.should("have.text", "Dies ist ein Pflichtfeld.");
		cy.get("#awsm-applicant-email").type("😊"); //In Email input enter smiling face emoji
		cy.get("@emailErrorDescription").should(
			"have.text",
			"Bitte gebe eine gültige E-Mail-Adresse ein."
		); //Validation message changed from “This field is required” to “Please enter a valid email address”.
		//Read the first 10 words of job description on the left panel
		cy.get(".awsm-job-entry-content > p")
			.first()
			.then((jobDescription) => {
				const textDescription = jobDescription.text();
				const wordsArray = textDescription.split(" ");
				let tenWordsArray = wordsArray.slice(0, 10);
				let tenWords = tenWordsArray.join(" ");
				cy.get("#awsm-cover-letter").invoke("val", tenWords).trigger("blur"); //copy them to Bewerbungsschreiben input
			});
		cy.get("#awsm-cover-letter").should("not.have.class", "awsm-job-form-error"); //Validation message under filled-in input is not displayed anymore.
		cy.get('input[type="file"]').selectFile("cypress/fixtures/QMIC.docx", { force: true }); //Attach file with DATEIEN HOCHLADEN button
		cy.get(".custom-input").should("have.text", "QMIC.docx"); //File name is displayed on the button
		cy.get("#awsm_form_privacy_policy").should("not.be.checked").check().should("be.checked"); //Check the checkbox for Datenschutzerklärung	Checkbox is ticked
	});
});
