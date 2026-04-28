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
        func: "pwrss::pwrss.t.2means",
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
        func: "pwrss::pwrss.z.corr",
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
        func: "pwrss::pwrss.z.2corrs",
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
          { name: "r2", label: "R-squared of predictors", type: "number", step: "0.01", default: 0 },
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
      }
    ]
  },
  {
    category: "Advanced ANOVA",
    tests: [
      {
        id: "anova-f-ancova",
        name: "ANCOVA (F-Test)",
        func: "pwrss::power.f.ancova",
        docs: "Power analysis for factorial ANCOVA designs.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        nParam: "n.total",
        args: [
          { name: "eta.squared", label: "Expected Eta-squared", type: "number", step: "0.01", default: 0.05 },
          { name: "factor.levels", label: "Factor Levels (e.g. c(2,2))", type: "raw", default: "c(2, 2)" },
          { name: "k.covariates", label: "Number of Covariates", type: "number", step: "1", default: 0 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 }
        ]
      },
      {
        id: "anova-f-keppel",
        name: "ANCOVA (Keppel)",
        func: "pwrss::power.f.ancova.keppel",
        docs: "Power analysis for one-way ANOVA/ANCOVA using means and standard deviations.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        nParam: "n.total",
        args: [
          { name: "mu.vector", label: "Means vector (e.g. c(1.2, 1.4, 1.8))", type: "raw", default: "c(1.2, 1.4, 1.8)" },
          { name: "sd.vector", label: "SD vector (e.g. c(1, 1, 1))", type: "raw", default: "c(1, 1, 1)" },
          { name: "p.vector", label: "Allocation proportions (c(0.33, 0.33, 0.33))", type: "raw", default: "c(0.33, 0.33, 0.33)" },
          { name: "r.squared", label: "R-squared of covariates", type: "number", step: "0.01", default: 0 },
          { name: "k.covariates", label: "Number of Covariates", type: "number", step: "1", default: 0 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 }
        ]
      },
      {
        id: "anova-f-shieh",
        name: "ANCOVA (Shieh)",
        func: "pwrss::power.f.ancova.shieh",
        docs: "Power analysis for ANCOVA designs based on Shieh leveraging exact contrast matrices and outcome distributions.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        nParam: "n.total",
        args: [
          { name: "mu.vector", label: "Means vector (e.g. c(1.2, 1.4, 1.8))", type: "raw", default: "c(1.2, 1.4, 1.8)" },
          { name: "sd.vector", label: "SD vector (e.g. c(1, 1, 1))", type: "raw", default: "c(1, 1, 1)" },
          { name: "r.squared.outcome", label: "Outcome variance R-squared", type: "number", step: "0.01", default: 0 },
          { name: "r.squared.mediator", label: "Mediator variance R-squared", type: "number", step: "0.01", default: 0 },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 }
        ]
      },
      {
        id: "anova-f-mixed",
        name: "Mixed-Design ANOVA",
        func: "pwrss::power.f.mixed.anova",
        docs: "Power analysis for mixed-design (split-plot) ANOVAs spanning between and within-subject repeated structures.",
        resource: "https://cran.r-project.org/web/packages/pwrss/vignettes/examples.html",
        nParam: "n.total",
        args: [
          { name: "eta.squared", label: "Expected Eta-squared", type: "number", step: "0.01", default: 0.05 },
          { name: "factor.levels", label: "Factor Levels c(between, within)", type: "raw", default: "c(2, 3)" },
          { name: "rho.within", label: "Intra-class Correlation", type: "number", step: "0.01", default: 0.5 },
          { name: "effect", label: "Analysis Path", type: "select", options: ["between", "within", "interaction"], default: "interaction" },
          { name: "alpha", label: "Alpha", type: "number", step: "0.01", default: 0.05 },
          { name: "power", label: "Target Power", type: "number", step: "0.01", default: 0.8 }
        ]
      }
    ]
  }
];
