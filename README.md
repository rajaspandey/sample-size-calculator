# AI-Powered Statistical Sample Size Calculator

This repository strictly hosts a locally-driven, browser-native AI Statistical Sample Size & Power Calculator Single Page Application (SPA) natively engineered in React alongside WebAssembly.

## What This Application Does

Unlike traditional clinical reporting web apps that rely on expensive or unsecure external compute nodes, this application literally bootstraps the complete R programming language **locally into the user's browser via WebAssembly (WebR)**. It then compiles and evaluates complex statistical power matrices natively exactly as if running RStudio, relying heavily upon the standard [pwrSS](https://cran.r-project.org/web/packages/pwrss/index.html) CRAN package.

### Key Capabilities
- **Advanced Statistical Support:** Full structural integrations mapping 15+ different testing procedures, including:
  - T-Tests (1-Mean, 2-Means, Paired)
  - Proportions & Correlation Checks
  - Regressions (Linear, Logistic, Mediation structures)
  - Advanced ANOVAs (Factorial ANCOVAs, Mixed-Design split-plots, Keppel, and Shieh contrasts).
- **Dual Computation Matrix:** Dynamic parameters allow the frontend form controls to instantly swap evaluation intents—if you need 'Sample Size', it supplies 'Statistical Power'; if you ask for 'Statistical Power', it gracefully morphs the evaluation payload and bounds inputs for solving total 'N' sample distributions.
- **AI Study Designer (Native Bot):** Includes a deeply-integrated Google Gemini system hooked through a Vercel Serverless proxy structure. A user can talk to the bot in purely conversational text describing their clinical scenario, and the AI will logically deduce the requisite statistical model, gather parameters, and execute automated react-router navigation logic, filling out the fields independently.

---

## Technical Architecture & Codebase Structure

The application footprint has been purposely minimized. Instead of maintaining 15 distinct layout pages for each computation model, the entire infrastructure abstracts rendering natively inside a central array block.

### Core Files

- **`src/config/testsConfig.js`:** The brain of the application. It maps out an array containing the exact definitions, categories, mathematical constraints, URL IDs, and R-function string identifiers for every calculation procedure possible in `pwrSS`. All components natively map over this array.
- **`src/components/DynamicCalculator.jsx`:** The primary operational component engine rendering the SPA. It dynamically loops `testsConfig.js`, reads the underlying required parameters, draws the form blocks uniquely, intercepts custom target modes via React context state (like dynamic arrays and R-vector concatenated loops), and dispatches the explicit `res <- pwrss.t.mean(...)` execution queries directly into the WebR API instance.
- **`src/components/AIAssistant.jsx`:** Holds the primary dialogue history, constructs the system strict-JSON evaluation commands to Gemini via an internal proxy, and pushes programmatic form population through standard `react-router-dom` navigate state variables.
- **`src/webr/WebRContext.jsx`:** Initializes the WebR environment, asynchronously fetching WASM binaries on page load, installing `pwrss`, and offering the R evaluation hooks outward to the app components without breaking the DOM layout loop.
- **`api/chat.js`:** A custom Vercel Serverless Edge Function designed to execute OpenAI/Gemini logic requests remotely so that browser instances are completely insulated from intercepting master API authorization keys.

### Verification Engine
- **`tests/calculator.spec.js`:** A Playwright E2E spec loop that natively binds into the application DOM routing structure, waiting explicitly until background WebAssembly instantiates, before injecting mock parameters sequentially down every single `testsConfig.js` array element logically resolving calculation thresholds.

---

## Getting Started

### Local Setup & Dependencies

Ensure you are utilizing Node.js (v20+) and install dependencies:

```bash
npm install
```

### Running Locally

Because the Gemini implementation leverages a backend proxy function, it is heavily recommended to use Vercel's CLI sandbox to emulate the backend routing:

```bash
# Start explicitly with the Vercel emulator mapping the /api folder
npx vercel dev
```

### Environment Variables
You must inject your specific Gemini credentials into Vercel securely (or locally provision an `.env` block containing `GEMINI_API_KEY=your_key`) for the chatbot designer block to successfully bind responses.
