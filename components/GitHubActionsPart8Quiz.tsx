'use client'

import { SimpleQuiz } from './SimpleQuiz'
import { encryptAnswerAdvanced } from '@/lib/quiz/encryption'

// Quiz questions based on GitHub Actions Part 8 content
const questions = [
  // Easy questions (3)
  {
    id: 'gha-p8-1',
    question: 'What are the three core principles of observability in CI/CD pipelines mentioned in the article?',
    type: 'single-choice' as const,
    options: [
      'Speed, efficiency, and cost reduction',
      'No log → no truth; No alert → no reaction; No recovery → no reliability',
      'Automation, monitoring, and testing',
      'Security, performance, and scalability'
    ],
    correctAnswer: 'No log → no truth; No alert → no reaction; No recovery → no reliability',
    explanation: 'The three core principles are: (1) No log → no truth - without logs, you can\'t understand why failures occur, (2) No alert → no reaction - a pipeline that fails silently is effectively dead, and (3) No recovery → no reliability - humans shouldn\'t have to manually rerun workflows constantly. These principles form the foundation of observability and self-healing pipelines.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['observability', 'principles', 'basics']
  },
  {
    id: 'gha-p8-2',
    question: 'What is the purpose of using `echo "::group::"` and `echo "::endgroup::"` in GitHub Actions workflows?',
    type: 'single-choice' as const,
    options: [
      'To create collapsible sections in logs, making them easier to read and navigate',
      'To group multiple jobs together',
      'To skip certain steps in the workflow',
      'To increase workflow execution speed'
    ],
    correctAnswer: 'To create collapsible sections in logs, making them easier to read and navigate',
    explanation: 'The `::group::` and `::endgroup::` commands create collapsible sections in GitHub Actions logs. This helps organize long logs by grouping related steps (like "Install dependencies", "Build project") into collapsible sections, making it much easier to find specific information when debugging failures.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['log-grouping', 'debugging', 'basics']
  },
  {
    id: 'gha-p8-3',
    question: 'What does setting `ACTIONS_STEP_DEBUG: true` in the environment do?',
    type: 'single-choice' as const,
    options: [
      'It speeds up workflow execution',
      'It enables detailed debug logging, showing environment variables and step internals, which helps identify hard-to-find issues',
      'It disables all error messages',
      'It automatically retries failed steps'
    ],
    correctAnswer: 'It enables detailed debug logging, showing environment variables and step internals, which helps identify hard-to-find issues',
    explanation: 'Setting `ACTIONS_STEP_DEBUG: true` enables verbose debug logging in GitHub Actions. This reveals detailed information about step execution, environment variables, and internal actions that aren\'t normally visible. While it makes logs longer, it\'s invaluable for debugging issues that are difficult to reproduce or understand from standard logs.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['debugging', 'ACTIONS_STEP_DEBUG', 'basics']
  },
  
  // Medium questions (6)
  {
    id: 'gha-p8-4',
    question: 'How can you implement alerting in GitHub Actions to notify teams when workflows fail?',
    type: 'multiple-choice' as const,
    options: [
      'Create a notification job with `if: failure()` that runs only when other jobs fail',
      'Use Slack integration (or other notification services) to send alerts to team channels',
      'Filter alerts to only notify on critical failures (e.g., production or deploy jobs) to avoid spam',
      'All jobs should always send notifications regardless of success or failure'
    ],
    correctAnswer: ['Create a notification job with `if: failure()` that runs only when other jobs fail', 'Use Slack integration (or other notification services) to send alerts to team channels', 'Filter alerts to only notify on critical failures (e.g., production or deploy jobs) to avoid spam'],
    explanation: 'Effective alerting requires: (1) A notification job that uses `if: failure()` to only run when workflows fail, (2) Integration with notification services like Slack to send alerts to team channels, and (3) Filtering to only alert on critical failures (production/deploy) to prevent alert fatigue. This ensures teams are notified quickly about important failures without being overwhelmed by non-critical alerts.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['alerting', 'notifications', 'if-failure', 'slack']
  },
  {
    id: 'gha-p8-5',
    question: 'What are the key mechanisms for implementing self-healing/auto-recovery in GitHub Actions workflows?',
    type: 'multiple-choice' as const,
    options: [
      'Retry logic for network-dependent operations (e.g., Docker push) with exponential backoff',
      'Rollback mechanisms using `continue-on-error: true` and conditional `if: failure()` steps',
      'Automatic retry of entire workflows without any limits',
      'Using `if: always()` to ensure cleanup steps always run'
    ],
    correctAnswer: ['Retry logic for network-dependent operations (e.g., Docker push) with exponential backoff', 'Rollback mechanisms using `continue-on-error: true` and conditional `if: failure()` steps', 'Using `if: always()` to ensure cleanup steps always run'],
    explanation: 'Self-healing mechanisms include: (1) Retry logic for transient failures (especially network operations) with limited retries and delays, (2) Rollback using `continue-on-error: true` on deployment steps and `if: failure()` on rollback steps to automatically revert on failure, and (3) `if: always()` for cleanup steps. However, retries should have limits—unlimited retries can mask real issues and waste resources.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['self-healing', 'retry', 'rollback', 'continue-on-error', 'auto-recovery']
  },
  {
    id: 'gha-p8-6',
    question: 'Why is it important to store logs and artifacts even when workflows fail?',
    type: 'multiple-choice' as const,
    options: [
      'Using `if: always()` with `upload-artifact` ensures logs are saved regardless of workflow outcome',
      'Stored logs enable post-mortem analysis and help identify patterns in failures over time',
      'Artifacts can include test reports, coverage data, and build logs that are valuable for debugging',
      'Logs should only be stored when workflows succeed'
    ],
    correctAnswer: ['Using `if: always()` with `upload-artifact` ensures logs are saved regardless of workflow outcome', 'Stored logs enable post-mortem analysis and help identify patterns in failures over time', 'Artifacts can include test reports, coverage data, and build logs that are valuable for debugging'],
    explanation: 'Storing logs and artifacts is crucial because: (1) Using `if: always()` ensures logs are saved even when workflows fail (when you need them most), (2) Historical logs enable post-mortem analysis and help identify failure patterns over time, and (3) Artifacts can include test reports, coverage, and build logs that are essential for debugging. The most important logs are often from failed runs, so they must be preserved.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['artifact-storage', 'if-always', 'log-preservation', 'post-mortem']
  },
  {
    id: 'gha-p8-7',
    question: 'What is the purpose of using `continue-on-error: true` in deployment steps?',
    type: 'multiple-choice' as const,
    options: [
      'It allows the workflow to continue even if the deployment step fails, enabling rollback steps to run',
      'It prevents the workflow from being marked as failed, allowing cleanup or rollback steps to execute',
      'It should be used carefully, as it can mask real failures if not combined with proper error handling',
      'It automatically retries the step until it succeeds'
    ],
    correctAnswer: ['It allows the workflow to continue even if the deployment step fails, enabling rollback steps to run', 'It prevents the workflow from being marked as failed, allowing cleanup or rollback steps to execute', 'It should be used carefully, as it can mask real failures if not combined with proper error handling'],
    explanation: '`continue-on-error: true` allows a step to fail without failing the entire workflow. This is useful for deployment steps where you want the workflow to continue to a rollback step if deployment fails. However, it must be used carefully with proper error handling (like checking `steps.deploy.outcome == \'failure\'` in rollback steps) to ensure failures are properly handled and not silently ignored.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['continue-on-error', 'error-handling', 'deployment', 'rollback']
  },
  {
    id: 'gha-p8-8',
    question: 'What are the key considerations when designing a self-healing pipeline that balances automation with human control?',
    type: 'multiple-choice' as const,
    options: [
      'Automation should handle "certain" operations (like retries for transient network failures) automatically',
      'Humans should remain the final decision-makers for critical decisions, but shouldn\'t need to intervene for routine failures',
      'Over-automation can hide real issues, while under-automation creates fatigue for developers',
      'All failures should require manual intervention'
    ],
    correctAnswer: ['Automation should handle "certain" operations (like retries for transient network failures) automatically', 'Humans should remain the final decision-makers for critical decisions, but shouldn\'t need to intervene for routine failures', 'Over-automation can hide real issues, while under-automation creates fatigue for developers'],
    explanation: 'The balance requires: (1) Automating operations where the recovery action is certain (like retrying network operations), (2) Keeping humans in control for critical decisions while minimizing routine interventions, and (3) Avoiding both extremes—over-automation can mask real problems, while under-automation creates developer fatigue. The goal is to let the pipeline "do what it knows for certain" and stop when human judgment is needed.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['automation-balance', 'human-control', 'self-healing', 'design-principles']
  },
  {
    id: 'gha-p8-9',
    question: 'How can observability help teams understand not just that a failure occurred, but the "story" behind the failure?',
    type: 'multiple-choice' as const,
    options: [
      'Well-structured logs with grouping and debug information reveal the sequence of events leading to failure',
      'Historical data and patterns help identify systemic issues (fragile dependencies, missing retries, tight configurations)',
      'Observability enables continuous learning loops, where each failure teaches something about the system',
      'Observability is only useful for immediate debugging, not for long-term insights'
    ],
    correctAnswer: ['Well-structured logs with grouping and debug information reveal the sequence of events leading to failure', 'Historical data and patterns help identify systemic issues (fragile dependencies, missing retries, tight configurations)', 'Observability enables continuous learning loops, where each failure teaches something about the system'],
    explanation: 'True observability goes beyond seeing failures—it enables understanding the "story" of failures: (1) Structured logs with grouping and debug info show the sequence of events, (2) Historical patterns reveal systemic issues (like fragile dependencies or missing retries), and (3) Each failure becomes a learning opportunity in a continuous improvement loop. This helps teams understand that reliability comes from continuous learning, not luck.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['observability', 'failure-analysis', 'continuous-learning', 'system-understanding']
  },
  
  // Hard question (1)
  {
    id: 'gha-p8-10',
    question: 'You are designing an observability and self-healing system for a production CI/CD pipeline that handles: (1) long-running builds (10+ minutes), (2) network-dependent deployments, (3) critical production releases, and (4) multiple teams needing visibility. What is the most effective approach?',
    type: 'single-choice' as const,
    options: [
      'Implement log grouping (::group::) for readability, enable ACTIONS_STEP_DEBUG for detailed debugging, add failure-based Slack alerts filtered to production/deploy jobs, implement retry logic (3 attempts with delays) for network operations, use continue-on-error + rollback for deployments, store logs/artifacts with if: always() for post-mortem analysis, and balance automation (handle certain retries) with human control (critical decisions). Integrate with external logging (S3/Grafana) for historical analysis.',
      'Enable all debug options, send alerts for every failure, retry everything indefinitely, and store all logs locally',
      'Only add basic logging and manual rerun capabilities',
      'Focus only on speed optimization without observability'
    ],
    correctAnswer: 'Implement log grouping (::group::) for readability, enable ACTIONS_STEP_DEBUG for detailed debugging, add failure-based Slack alerts filtered to production/deploy jobs, implement retry logic (3 attempts with delays) for network operations, use continue-on-error + rollback for deployments, store logs/artifacts with if: always() for post-mortem analysis, and balance automation (handle certain retries) with human control (critical decisions). Integrate with external logging (S3/Grafana) for historical analysis.',
    explanation: 'The most effective approach combines multiple observability and self-healing mechanisms: (1) Log grouping improves readability for long builds, (2) ACTIONS_STEP_DEBUG provides detailed debugging when needed, (3) Filtered alerts prevent spam while ensuring critical failures are noticed, (4) Limited retries (3 attempts) handle transient network issues without masking real problems, (5) Rollback mechanisms provide automatic recovery for deployment failures, (6) Artifact storage with if: always() preserves logs for analysis, (7) Balance between automation and human control ensures reliability without hiding issues, and (8) External logging enables historical pattern analysis. This comprehensive approach transforms the pipeline from a static YAML into a "self-aware" system that can observe, alert, and recover while maintaining human oversight.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['comprehensive-observability', 'self-healing', 'log-grouping', 'debugging', 'alerting', 'retry', 'rollback', 'artifact-storage', 'automation-balance', 'system-design', 'advanced']
  }
]

// Encrypt the answers
const encryptedQuestions = questions.map(q => ({
  ...q,
  correctAnswer: encryptAnswerAdvanced(q.correctAnswer, q.id)
}))

export function GitHubActionsPart8Quiz() {
  return (
    <SimpleQuiz
      title="GitHub Actions Part 8: Observability, Error Handling, and Self-Recovery Quiz"
      description="Test your understanding of pipeline observability, logging strategies, alerting mechanisms, self-healing workflows, retry logic, rollback strategies, and the balance between automation and human control. Based on the concepts covered in Part 8."
      timeLimit={15}
      passingScore={70}
      allowRetake={true}
      showCorrectAnswers={true}
      questions={encryptedQuestions}
    />
  )
}

