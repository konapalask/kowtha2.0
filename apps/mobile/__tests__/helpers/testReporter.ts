/**
 * Test Reporter for generating comprehensive test reports
 */

export interface BankTestResult {
  bankName: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
  duration: number;
  sectionCount: number;
  fieldCount: number;
}

export interface TestSummary {
  totalBanks: number;
  passedBanks: number;
  failedBanks: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  coverage: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  bankResults: BankTestResult[];
}

/**
 * Generate markdown report from test results
 */
export function generateMarkdownReport(summary: TestSummary): string {
  const successRate = ((summary.passedBanks / summary.totalBanks) * 100).toFixed(2);

  let report = `# PD Forms Test Report\n\n`;
  report += `**Generated:** ${new Date().toLocaleString()}\n\n`;

  // Summary Section
  report += `## Summary\n\n`;
  report += `- **Total Banks:** ${summary.totalBanks}\n`;
  report += `- **Passed:** ✅ ${summary.passedBanks}\n`;
  report += `- **Failed:** ❌ ${summary.failedBanks}\n`;
  report += `- **Success Rate:** ${successRate}%\n`;
  report += `- **Total Test Duration:** ${(summary.duration / 1000).toFixed(2)}s\n\n`;

  // Coverage Section
  report += `## Code Coverage\n\n`;
  report += `| Metric | Coverage |\n`;
  report += `|--------|----------|\n`;
  report += `| Statements | ${summary.coverage.statements.toFixed(2)}% |\n`;
  report += `| Branches | ${summary.coverage.branches.toFixed(2)}% |\n`;
  report += `| Functions | ${summary.coverage.functions.toFixed(2)}% |\n`;
  report += `| Lines | ${summary.coverage.lines.toFixed(2)}% |\n\n`;

  // Bank Results Table
  report += `## Bank-Wise Results\n\n`;
  report += `| Bank Name | Status | Sections | Fields | Duration | Errors |\n`;
  report += `|-----------|--------|----------|--------|----------|--------|\n`;

  summary.bankResults.forEach((result) => {
    const status = result.passed ? '✅ Pass' : '❌ Fail';
    const errorCount = result.errors.length;
    const duration = `${result.duration.toFixed(0)}ms`;

    report += `| ${result.bankName} | ${status} | ${result.sectionCount} | ${result.fieldCount} | ${duration} | ${errorCount} |\n`;
  });

  report += `\n`;

  // Failed Banks Details
  const failedBanks = summary.bankResults.filter((r) => !r.passed);
  if (failedBanks.length > 0) {
    report += `## Failed Banks Details\n\n`;

    failedBanks.forEach((result) => {
      report += `### ❌ ${result.bankName}\n\n`;
      report += `**Errors:**\n`;
      result.errors.forEach((error) => {
        report += `- ${error}\n`;
      });
      report += `\n`;

      if (result.warnings.length > 0) {
        report += `**Warnings:**\n`;
        result.warnings.forEach((warning) => {
          report += `- ${warning}\n`;
        });
        report += `\n`;
      }
    });
  }

  // Success Banks Summary
  const passedBanks = summary.bankResults.filter((r) => r.passed);
  if (passedBanks.length > 0) {
    report += `## Passed Banks (${passedBanks.length})\n\n`;
    passedBanks.forEach((result) => {
      report += `- ✅ ${result.bankName}\n`;
    });
    report += `\n`;
  }

  // Performance Analysis
  report += `## Performance Analysis\n\n`;
  const avgDuration =
    summary.bankResults.reduce((sum, r) => sum + r.duration, 0) /
    summary.bankResults.length;
  const slowestBank = summary.bankResults.reduce((prev, current) =>
    prev.duration > current.duration ? prev : current
  );
  const fastestBank = summary.bankResults.reduce((prev, current) =>
    prev.duration < current.duration ? prev : current
  );

  report += `- **Average Duration:** ${avgDuration.toFixed(2)}ms\n`;
  report += `- **Slowest Bank:** ${slowestBank.bankName} (${slowestBank.duration.toFixed(0)}ms)\n`;
  report += `- **Fastest Bank:** ${fastestBank.bankName} (${fastestBank.duration.toFixed(0)}ms)\n\n`;

  return report;
}

/**
 * Generate JSON report for programmatic consumption
 */
export function generateJSONReport(summary: TestSummary): string {
  return JSON.stringify(summary, null, 2);
}

/**
 * Generate console-friendly report
 */
export function generateConsoleReport(summary: TestSummary): string {
  const successRate = ((summary.passedBanks / summary.totalBanks) * 100).toFixed(2);

  let report = `\n${'='.repeat(60)}\n`;
  report += `PD FORMS TEST REPORT\n`;
  report += `${'='.repeat(60)}\n\n`;

  report += `Summary:\n`;
  report += `  Total Banks: ${summary.totalBanks}\n`;
  report += `  ✅ Passed: ${summary.passedBanks}\n`;
  report += `  ❌ Failed: ${summary.failedBanks}\n`;
  report += `  Success Rate: ${successRate}%\n`;
  report += `  Duration: ${(summary.duration / 1000).toFixed(2)}s\n\n`;

  if (summary.failedBanks > 0) {
    report += `Failed Banks:\n`;
    summary.bankResults
      .filter((r) => !r.passed)
      .forEach((result) => {
        report += `  ❌ ${result.bankName}\n`;
        result.errors.forEach((error) => {
          report += `     - ${error}\n`;
        });
      });
    report += `\n`;
  }

  report += `${'='.repeat(60)}\n`;

  return report;
}

/**
 * Send report to Slack (mock implementation)
 */
export function sendSlackNotification(summary: TestSummary): void {
  const successRate = ((summary.passedBanks / summary.totalBanks) * 100).toFixed(2);
  const status = summary.failedBanks === 0 ? '✅' : '⚠️';

  const message = `${status} PD Forms Tests: ${summary.passedBanks}/${summary.totalBanks} banks passed (${successRate}%)`;

  console.log(`[SLACK] ${message}`);

  if (summary.failedBanks > 0) {
    const failedBanks = summary.bankResults
      .filter((r) => !r.passed)
      .map((r) => r.bankName)
      .join(', ');

    console.log(`[SLACK] Failed banks: ${failedBanks}`);
  }
}

/**
 * Create test summary from results
 */
export function createTestSummary(
  bankResults: BankTestResult[],
  totalDuration: number,
  coverage: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  }
): TestSummary {
  return {
    totalBanks: bankResults.length,
    passedBanks: bankResults.filter((r) => r.passed).length,
    failedBanks: bankResults.filter((r) => !r.passed).length,
    totalTests: bankResults.length * 10, // Assuming ~10 tests per bank
    passedTests: bankResults.filter((r) => r.passed).length * 10,
    failedTests: bankResults.filter((r) => !r.passed).length * 10,
    duration: totalDuration,
    coverage,
    bankResults,
  };
}

