'use client'

import { SimpleQuiz } from './SimpleQuiz'
import { encryptAnswerAdvanced } from '@/lib/quiz/encryption'

// Quiz questions based on GitHub Actions Part 5 content
const questions = [
  // Easy questions (3)
  {
    id: 'gha-p5-1',
    question: 'What is the default permission scope of GITHUB_TOKEN in GitHub Actions?',
    type: 'single-choice' as const,
    options: [
      'read-only access to the repository',
      'write-all access (repo:*)',
      'no permissions by default',
      'read access to contents only'
    ],
    correctAnswer: 'write-all access (repo:*)',
    explanation: 'By default, GITHUB_TOKEN has `repo:*` scope, which is equivalent to full write access. This means any workflow can push code, create releases, or trigger other workflows unless you explicitly restrict permissions using the `permissions` key in your workflow YAML.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['github-token', 'permissions', 'defaults', 'basics']
  },
  {
    id: 'gha-p5-2',
    question: 'What is the main security risk when using the `pull_request_target` event?',
    type: 'single-choice' as const,
    options: [
      'It runs slower than regular pull_request events',
      'It runs in the context of the base repository with access to secrets, allowing malicious code from forks to execute with elevated privileges',
      'It cannot access secrets at all',
      'It only works with private repositories'
    ],
    correctAnswer: 'It runs in the context of the base repository with access to secrets, allowing malicious code from forks to execute with elevated privileges',
    explanation: 'The `pull_request_target` event runs in the context of the base repository (not the fork), which means it has access to secrets. If the workflow checks out code from the fork, malicious code in that PR could execute commands with access to those secrets, creating a serious security vulnerability.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['pull-request-target', 'secrets', 'fork', 'security-risk', 'basics']
  },
  {
    id: 'gha-p5-3',
    question: 'What is OIDC (OpenID Connect) and why is it preferred over static access keys for cloud deployments?',
    type: 'single-choice' as const,
    options: [
      'A GitHub Actions feature that automatically rotates secrets',
      'A federation mechanism that provides temporary credentials bound to specific workflows, repos, and runs, eliminating the need to store long-lived access keys',
      'A type of secret that never expires',
      'A way to share secrets between repositories'
    ],
    correctAnswer: 'A federation mechanism that provides temporary credentials bound to specific workflows, repos, and runs, eliminating the need to store long-lived access keys',
    explanation: 'OIDC allows GitHub Actions to authenticate with cloud providers (like AWS, Azure, GCP) using temporary credentials that are bound to specific workflows, repositories, and run IDs. These tokens last only a few minutes, don\'t need manual rotation, and are more secure than storing static access keys in secrets.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['oidc', 'authentication', 'temporary-credentials', 'cloud-deployment', 'basics']
  },
  
  // Medium questions (6)
  {
    id: 'gha-p5-4',
    question: 'Why should you always explicitly declare `permissions` in your workflow YAML files?',
    type: 'multiple-choice' as const,
    options: [
      'To reduce the default write-all scope to only what is needed (principle of least privilege)',
      'To prevent accidental code pushes or releases from test workflows',
      'To make workflow intentions clear and auditable',
      'It is optional and only needed for public repositories'
    ],
    correctAnswer: ['To reduce the default write-all scope to only what is needed (principle of least privilege)', 'To prevent accidental code pushes or releases from test workflows', 'To make workflow intentions clear and auditable'],
    explanation: 'Explicitly declaring `permissions` is a security best practice because: (1) it enforces the principle of least privilege by reducing default write-all access, (2) it prevents test workflows from accidentally pushing code or creating releases, and (3) it makes the workflow\'s required permissions clear for code review and auditing. This is not optional—it should be done for all repositories.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['permissions', 'least-privilege', 'best-practices', 'security']
  },
  {
    id: 'gha-p5-5',
    question: 'What are the main security risks of self-hosted runners compared to GitHub-hosted runners?',
    type: 'multiple-choice' as const,
    options: [
      'Self-hosted runners persist between jobs, potentially retaining cache, logs, or temporary credentials',
      'Self-hosted runners can be compromised and affect subsequent jobs',
      'Self-hosted runners are slower than hosted runners',
      'Self-hosted runners cannot be isolated per job without additional configuration'
    ],
    correctAnswer: ['Self-hosted runners persist between jobs, potentially retaining cache, logs, or temporary credentials', 'Self-hosted runners can be compromised and affect subsequent jobs', 'Self-hosted runners cannot be isolated per job without additional configuration'],
    explanation: 'Self-hosted runners pose security risks because they persist between jobs (unlike ephemeral hosted runners), which means they can retain state, cache, logs, or temporary credentials. A compromised job could affect subsequent jobs. Without proper configuration, they cannot be isolated per job. Speed is not a security concern.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['self-hosted-runner', 'isolation', 'persistence', 'security-risks']
  },
  {
    id: 'gha-p5-6',
    question: 'How can secrets leak in GitHub Actions logs even with GitHub\'s automatic masking?',
    type: 'multiple-choice' as const,
    options: [
      'If a secret is split across multiple lines or contains special characters, masking may fail',
      'If a step uses `set -x` (bash debug mode) or prints environment variables with `env` or `printenv`',
      'If secrets are written to files that are then uploaded as artifacts',
      'GitHub\'s masking is 100% reliable and secrets never leak'
    ],
    correctAnswer: ['If a secret is split across multiple lines or contains special characters, masking may fail', 'If a step uses `set -x` (bash debug mode) or prints environment variables with `env` or `printenv`', 'If secrets are written to files that are then uploaded as artifacts'],
    explanation: 'GitHub\'s secret masking is not 100% reliable. Secrets can leak if: (1) they are split across lines or contain special characters that break pattern matching, (2) debug mode (`set -x`) or commands like `env`/`printenv` print all environment variables, or (3) secrets are written to files that are uploaded as artifacts. Always be cautious and use `::add-mask::` for sensitive output.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['secrets', 'masking', 'log-leakage', 'debugging']
  },
  {
    id: 'gha-p5-7',
    question: 'What is the "trust boundary" problem with pull requests from forks, and how should you handle it?',
    type: 'single-choice' as const,
    options: [
      'Fork PRs are always safe and can access all secrets',
      'Fork PRs should never be trusted because they can contain malicious code. Use `pull_request` (not `pull_request_target`) for testing, and only allow secrets for PRs from the same repository',
      'All PRs should use `pull_request_target` to ensure they have access to secrets',
      'Fork PRs cannot run workflows at all'
    ],
    correctAnswer: 'Fork PRs should never be trusted because they can contain malicious code. Use `pull_request` (not `pull_request_target`) for testing, and only allow secrets for PRs from the same repository',
    explanation: 'The trust boundary problem occurs because PRs from forks can contain malicious code. If you use `pull_request_target`, the workflow runs in the base repository context with access to secrets, but if it checks out code from the fork, that malicious code executes with those privileges. Best practice: use `pull_request` for testing (no secrets), and if you must use `pull_request_target`, add a condition to only allow secrets for PRs from the same repository.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['trust-boundary', 'fork', 'pull-request', 'secrets', 'security']
  },
  {
    id: 'gha-p5-8',
    question: 'What are the recommended best practices for managing secrets in GitHub Actions?',
    type: 'multiple-choice' as const,
    options: [
      'Separate secrets by environment (dev/staging/prod)',
      'Never reuse secrets between workflows or repositories',
      'Never echo secrets directly, even in debug steps',
      'Use OIDC instead of static keys when possible'
    ],
    correctAnswer: ['Separate secrets by environment (dev/staging/prod)', 'Never reuse secrets between workflows or repositories', 'Never echo secrets directly, even in debug steps', 'Use OIDC instead of static keys when possible'],
    explanation: 'Best practices for secret management include: (1) separating secrets by environment to limit blast radius, (2) never reusing secrets between workflows/repos to prevent cross-contamination, (3) never echoing secrets (use `::add-mask::` if needed), and (4) using OIDC for temporary credentials instead of long-lived static keys. All of these practices reduce the risk of secret leakage and compromise.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['secrets', 'best-practices', 'management', 'security']
  },
  {
    id: 'gha-p5-9',
    question: 'Why is artifact and log retention important for security, and what should you do?',
    type: 'multiple-choice' as const,
    options: [
      'Artifacts and logs may contain sensitive information like secrets or build metadata',
      'You should set short retention periods (7-14 days) and automatically clean up old artifacts',
      'You should never upload files like `.env`, `.npmrc`, or `config.json` as artifacts',
      'Logs and artifacts are always safe and never contain sensitive data'
    ],
    correctAnswer: ['Artifacts and logs may contain sensitive information like secrets or build metadata', 'You should set short retention periods (7-14 days) and automatically clean up old artifacts', 'You should never upload files like `.env`, `.npmrc`, or `config.json` as artifacts'],
    explanation: 'Artifacts and logs can contain sensitive information (secrets, build metadata, credentials). Best practices include: (1) setting short retention periods (7-14 days) via `log_retention_days`, (2) automatically cleaning up old artifacts using scheduled workflows or `actions/delete-artifact`, and (3) never uploading sensitive files like `.env`, `.npmrc`, or `config.json` as artifacts. Logs and artifacts are NOT always safe.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['artifacts', 'logs', 'retention', 'cleanup', 'security']
  },
  
  // Hard question (1)
  {
    id: 'gha-p5-10',
    question: 'You are setting up a production deployment workflow that needs to: (1) deploy to AWS S3, (2) handle secrets for database connections, (3) accept PRs from both internal team members and external contributors (forks), and (4) publish Docker images. What is the most secure configuration approach?',
    type: 'single-choice' as const,
    options: [
      'Use `pull_request_target` for all PRs, store AWS keys in secrets, and grant `write-all` permissions for simplicity',
      'Use `pull_request` for testing (no secrets), `pull_request_target` with condition `if: github.event.pull_request.head.repo.full_name == github.repository` for internal PRs only, use OIDC for AWS instead of static keys, declare minimal `permissions` (contents: read, packages: write, id-token: write), and ensure artifacts don\'t contain sensitive files',
      'Disable workflows for fork PRs entirely, use static AWS keys in secrets, and grant full permissions',
      'Use the same workflow configuration for all scenarios to maintain consistency'
    ],
    correctAnswer: 'Use `pull_request` for testing (no secrets), `pull_request_target` with condition `if: github.event.pull_request.head.repo.full_name == github.repository` for internal PRs only, use OIDC for AWS instead of static keys, declare minimal `permissions` (contents: read, packages: write, id-token: write), and ensure artifacts don\'t contain sensitive files',
    explanation: 'The most secure approach combines multiple security best practices: (1) Use `pull_request` for testing external PRs (no secrets), (2) Use `pull_request_target` with a condition to only allow secrets for internal PRs, (3) Use OIDC for AWS (temporary credentials) instead of static keys, (4) Declare minimal permissions (principle of least privilege), and (5) Ensure artifacts don\'t leak sensitive files. This approach protects against fork-based attacks, minimizes secret exposure, uses temporary credentials, and follows least privilege principles.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['security-configuration', 'oidc', 'permissions', 'pull-request', 'production', 'advanced', 'comprehensive']
  }
]

// Encrypt the answers
const encryptedQuestions = questions.map(q => ({
  ...q,
  correctAnswer: encryptAnswerAdvanced(q.correctAnswer, q.id)
}))

export function GitHubActionsPart5Quiz() {
  return (
    <SimpleQuiz
      title="GitHub Actions Part 5: Security in GitHub Actions Quiz"
      description="Test your understanding of GitHub Actions security best practices, including GITHUB_TOKEN permissions, secrets management, OIDC authentication, runner isolation, and protecting against common attack vectors. Based on the concepts covered in Part 5."
      timeLimit={15}
      passingScore={70}
      allowRetake={true}
      showCorrectAnswers={true}
      questions={encryptedQuestions}
    />
  )
}

