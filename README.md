This is the initial challenge solution in  ~8h as requested. Test suite runs on chromium based browsers, Firefox would need additional tweaks as it does not support cypress-real-events library. Reports are handled by mochawesome-reporter. 
Please refer to npm scripts in the package. json

For next steps I'd plan:
- Firefox support
- Code clean-up
- Adjusting timeouts (home page loads between 30 and 5 s)
- Setting up env variables
- Page object pattern/custom commands to avoid repetitions
- Setting fixtures with eg. translations