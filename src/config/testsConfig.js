export const testsConfig = [
  {
    category: "T-Test (Means)",
    tests: [
      {
        id: "ttest-mean",
        name: "One Mean T-Test",
        func: "pwrss::pwrss.t.mean",
        docs: "A one-sample t-test is used to determine whether an observed sample comes from a population with a specific known mean. This calculator determines the required sample size based on a raw mean difference or standardized effect size (Cohen's d).",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "mu", label: "Expected Mean (or d)", type: "number", step: "0.01", default: 0.5 },
          { name: "mu0", label: "Reference/Constant Mean", type: "number", step: "0.01", default: 0 },
          { name: "sd", label: "Standard Deviation", type: "number", step: "0.01", default: 1 },
          { name: "alpha", label: "Alpha (Type I Error)", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power (1 - Beta)", type: "number", step: "0.01", default: 0.8 },
          { name: "alternative", label: "Alternative Hypothesis", type: "select", options: ["not equal", "greater", "less", "equivalent", "non-inferior", "superior"], default: "not equal" }
        ]
      },
      {
        id: "ttest-2means",
        name: "Two Independent Means T-Test",
        func: "pwrss::pwrss.t.2means",
        docs: "The independent samples t-test evaluates whether the means of two distinctly independent groups differ significantly. It is the most common test used in randomized controlled trials and A/B tests. If you want to use a standardized Cohen's d for Effect Size, input it into Expected Mean 1 while keeping Mean 2 = 0 and SDs = 1.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "mu1", label: "Expected Mean 1", type: "number", step: "0.01", default: 0.5 },
          { name: "mu2", label: "Expected Mean 2", type: "number", step: "0.01", default: 0 },
          { name: "sd1", label: "Standard Deviation 1", type: "number", step: "0.01", default: 1 },
          { name: "sd2", label: "Standard Deviation 2", type: "number", step: "0.01", default: 1 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 },
          { name: "alternative", label: "Alternative Hypothesis", type: "select", options: ["not equal", "greater", "less", "equivalent", "non-inferior", "superior"], default: "not equal" }
        ]
      },
      {
        id: "ttest-paired",
        name: "Paired Means T-Test",
        func: "pwrss::pwrss.t.paired",
        docs: "The paired t-test compares the means of two paired or dependent groups (such as pre-test and post-test values from the exact same cohort of subjects). Because the samples are correlated, it requires the expected correlation (paired.r) to properly narrow down the statistical variance.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "mu1", label: "Expected Mean 1", type: "number", step: "0.01", default: 0.5 },
          { name: "mu2", label: "Expected Mean 2", type: "number", step: "0.01", default: 0 },
          { name: "sd1", label: "Standard Deviation 1", type: "number", step: "0.01", default: 1 },
          { name: "sd2", label: "Standard Deviation 2", type: "number", step: "0.01", default: 1 },
          { name: "paired.r", label: "Correlation between pairs (r)", type: "number", step: "0.01", default: 0.5 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 },
          { name: "alternative", label: "Alternative Hypothesis", type: "select", options: ["not equal", "greater", "less"], default: "not equal" }
        ]
      }
    ]
  },
  {
    category: "Z-Test (Proportions & Correlations)",
    tests: [
      {
        id: "ztest-prop",
        name: "One Proportion Z-Test",
        func: "pwrss::pwrss.z.prop",
        docs: "Tests whether a single observed proportion differs from a strictly defined constant reference proportion. Commonly used when testing incidence rates against an established baseline.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "p", label: "Expected Proportion", type: "number", step: "0.01", default: 0.5 },
          { name: "p0", label: "Reference Proportion", type: "number", step: "0.01", default: 0.4 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 },
          { name: "alternative", label: "Alternative Hypothesis", type: "select", options: ["not equal", "greater", "less"], default: "not equal" }
        ]
      },
      {
        id: "ztest-2props",
        name: "Two Independent Proportions",
        func: "pwrss::pwrss.z.2props",
        docs: "Allows evaluating the statistical difference between the proportions of two independent categories (e.g. comparing conversion rates and adverse event incidences between two arms of a trial).",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "p1", label: "Expected Proportion 1", type: "number", step: "0.01", default: 0.5 },
          { name: "p2", label: "Expected Proportion 2", type: "number", step: "0.01", default: 0.4 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 },
          { name: "alternative", label: "Alternative Hypothesis", type: "select", options: ["not equal", "greater", "less"], default: "not equal" }
        ]
      },
      {
        id: "ztest-cor",
        name: "One Correlation Z-Test",
        func: "pwrss::pwrss.z.cor",
        docs: "A Z-test for a Pearson correlation coefficient. Determines if an observed linear correlation between two continuous sets of data deviates from a given reference (often 0, implying no correlation).",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "r", label: "Expected Correlation", type: "number", step: "0.01", default: 0.3 },
          { name: "r0", label: "Reference Correlation", type: "number", step: "0.01", default: 0 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 },
          { name: "alternative", label: "Alternative Hypothesis", type: "select", options: ["not equal", "greater", "less"], default: "not equal" }
        ]
      },
      {
        id: "ztest-2cors",
        name: "Two Independent Correlations",
        func: "pwrss::pwrss.z.2cors",
        docs: "Tests the difference between two completely distinct correlation coefficients evaluated on independent samples after applying the Fisher Z transformation.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "r1", label: "Expected Correlation 1", type: "number", step: "0.01", default: 0.3 },
          { name: "r2", label: "Expected Correlation 2", type: "number", step: "0.01", default: 0 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 },
          { name: "alternative", label: "Alternative Hypothesis", type: "select", options: ["not equal", "greater", "less"], default: "not equal" }
        ]
      }
    ]
  },
  {
    category: "Regression",
    tests: [
      {
        id: "reg-linear-f",
        name: "Linear Regression (F-Test)",
        func: "pwrss::pwrss.f.reg",
        docs: "Calculates the power for an Omnibus F-Test of an entire multiple linear regression model testing whether the aggregated predictors significantly predict variance (R-squared).",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "r2", label: "Expected R-squared", type: "number", step: "0.01", default: 0.1 },
          { name: "k", label: "Total Predictors", type: "number", step: "1", default: 3 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 }
        ]
      },
      {
        id: "reg-linear-t",
        name: "Linear Regression (Single Coef)",
        func: "pwrss::pwrss.t.reg",
        docs: "Determines power for testing a *single specific coefficient* among multiple independent variables within a multiple linear regression model.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "beta1", label: "Expected Std. Coefficient", type: "number", step: "0.01", default: 0.15 },
          { name: "r2.other.x", label: "R-squared of other predictors", type: "number", step: "0.01", default: 0 },
          { name: "k", label: "Total Predictors", type: "number", step: "1", default: 3 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 },
          { name: "alternative", label: "Alternative Hypothesis", type: "select", options: ["not equal", "greater", "less"], default: "not equal" }
        ]
      },
      {
        id: "reg-logistic",
        name: "Logistic Regression (Wald Z)",
        func: "pwrss::pwrss.z.logreg",
        docs: "Logistic regressions model binary outcomes (yes/no). This function calculates power testing whether a specific quantitative predictor changes the odds representation via the Wald Z-test criteria.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "p1", label: "Prob (Y=1) at X=1", type: "number", step: "0.01", default: 0.3 },
          { name: "p0", label: "Prob (Y=1) at X=0", type: "number", step: "0.01", default: 0.15 },
          { name: "r2.other.x", label: "R2 of other predictors", type: "number", step: "0.01", default: 0 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 },
          { name: "alternative", label: "Alternative Hypothesis", type: "select", options: ["not equal", "greater", "less"], default: "not equal" }
        ]
      },
      {
        id: "reg-pois",
        name: "Poisson Regression (Wald Z)",
        func: "pwrss::pwrss.z.poisreg",
        docs: "Evaluates Poisson count models (used heavily for incidents/occurrences over time) focusing on the relative expected incidence rate ratio of a treatment predictor vs baseline.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "exp.beta1", label: "Expected Rate Ratio", type: "number", step: "0.01", default: 1.2 },
          { name: "base.rate", label: "Baseline Rate", type: "number", step: "0.01", default: 1.0 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 },
          { name: "alternative", label: "Alternative Hypothesis", type: "select", options: ["not equal", "greater", "less"], default: "not equal" }
        ]
      },
      {
        id: "reg-med",
        name: "Mediation Regression (Sobel)",
        func: "pwrss::pwrss.z.med",
        docs: "A Sobel mediation analysis checks whether the intermediary indirect effect of a predictor across a specified variable is statistically significant to the final endpoint.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "a", label: "Path a coefficient", type: "number", step: "0.01", default: 0.25 },
          { name: "b", label: "Path b coefficient", type: "number", step: "0.01", default: 0.25 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 },
          { name: "alternative", label: "Alternative Hypothesis", type: "select", options: ["not equal", "greater", "less"], default: "not equal" }
        ]
      }
    ]
  },
  {
    category: "ANOVA",
    tests: [
      {
        id: "anova-1way",
        name: "One-Way ANOVA",
        func: "pwrss::pwrss.f.anova",
        docs: "One-Way Analysis of Variance extrapolates the logic of a T-test beyond two distinct categories, proving whether variations between the independent cluster categories overcome within-group variance.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "eta2", label: "Expected Eta-squared", type: "number", step: "0.01", default: 0.05 },
          { name: "k", label: "Number of Groups (k)", type: "number", step: "1", default: 3 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 }
        ]
      },
      {
        id: "anova-rm",
        name: "Repeated Measures ANOVA",
        func: "pwrss::pwrss.f.rmanova",
        docs: "Applies to Mixed-effects / Repeated Measurements where units undergo multiple measurements during a study. This dramatically reduces error variance.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        args: [
          { name: "eta2", label: "Expected Eta-squared", type: "number", step: "0.01", default: 0.05 },
          { name: "levels", label: "Number of Repeated Measurements", type: "number", step: "1", default: 3 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 }
        ]
      }
    ]
  }
];
