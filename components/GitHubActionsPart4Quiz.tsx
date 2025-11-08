'use client'

import { SimpleQuiz } from './SimpleQuiz'
import { encryptAnswerAdvanced } from '@/lib/quiz/encryption'

// Quiz questions based on GitHub Actions Part 4 content
const questions = [
  // Easy questions (3)
  {
    id: 'gha-p4-1',
    question: 'What is a Composite Action in GitHub Actions?',
    type: 'single-choice' as const,
    options: [
      'A way to package multiple steps into a reusable action within the same repository',
      'A workflow that can be called from other repositories',
      'A special type of job that runs in parallel',
      'A GitHub-hosted runner with pre-installed tools'
    ],
    correctAnswer: 'A way to package multiple steps into a reusable action within the same repository',
    explanation: 'A Composite Action allows you to combine multiple steps into a single reusable action. It\'s defined in `.github/actions/<name>/action.yml` and can be used within the same repository using `uses: ./.github/actions/<name>`.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['composite-action', 'reusability', 'basics']
  },
  {
    id: 'gha-p4-2',
    question: 'What is the main difference between Composite Actions and Reusable Workflows?',
    type: 'single-choice' as const,
    options: [
      'Composite Actions can define jobs, while Reusable Workflows cannot',
      'Reusable Workflows can define jobs and be called from other repositories, while Composite Actions are limited to steps within the same repo',
      'Composite Actions require secrets, while Reusable Workflows do not',
      'There is no difference; they are the same thing'
    ],
    correctAnswer: 'Reusable Workflows can define jobs and be called from other repositories, while Composite Actions are limited to steps within the same repo',
    explanation: 'Reusable Workflows use `workflow_call` and can define full jobs, be called from other repositories, and handle secrets properly. Composite Actions are limited to steps and are typically used within the same repository for local reuse.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['composite-action', 'reusable-workflow', 'comparison', 'basics']
  },
  {
    id: 'gha-p4-3',
    question: 'What is the purpose of version tags (like `@v1`, `@v2`) when using Reusable Workflows?',
    type: 'single-choice' as const,
    options: [
      'To track the number of times a workflow has been called',
      'To ensure backward compatibility and prevent breaking changes from affecting existing workflows',
      'To indicate which GitHub Actions version is required',
      'To organize workflows by difficulty level'
    ],
    correctAnswer: 'To ensure backward compatibility and prevent breaking changes from affecting existing workflows',
    explanation: 'Version tags allow you to pin a specific version of a reusable workflow. When you make changes, you create a new version (v2, v3, etc.), allowing existing workflows to continue using the old version while new workflows can adopt the new one. This prevents breaking changes.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['versioning', 'reusable-workflow', 'backward-compatibility', 'basics']
  },
  
  // Medium questions (6)
  {
    id: 'gha-p4-4',
    question: 'When should you use a Composite Action instead of a Reusable Workflow?',
    type: 'single-choice' as const,
    options: [
      'When you need to define jobs and call from other repositories',
      'When you want to package a few related steps for reuse within the same repository',
      'When you need to handle secrets across repositories',
      'When you want to create a full CI/CD pipeline'
    ],
    correctAnswer: 'When you want to package a few related steps for reuse within the same repository',
    explanation: 'Composite Actions are best for packaging a small set of related steps (like setup, lint, test) that you want to reuse within the same repository. They are simpler than Reusable Workflows but have limitations: they cannot define jobs, cannot be called from other repositories, and have limited secret handling.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['composite-action', 'when-to-use', 'decision-making']
  },
  {
    id: 'gha-p4-5',
    question: 'What is a key limitation of Composite Actions that makes them unsuitable for organization-wide CI/CD?',
    type: 'multiple-choice' as const,
    options: [
      'They cannot define jobs',
      'They do not support permissions',
      'They cannot properly handle secrets in the same way as workflow_call',
      'They cannot be called from other repositories'
    ],
    correctAnswer: ['They cannot define jobs', 'They do not support permissions', 'They cannot properly handle secrets in the same way as workflow_call'],
    explanation: 'Composite Actions have several limitations: they cannot define jobs (only steps), they don\'t support permissions at the workflow level, and they cannot properly handle secrets in the same way as `workflow_call`. These limitations make them unsuitable for organization-wide CI/CD pipelines that need full workflow capabilities.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['composite-action', 'limitations', 'organization']
  },
  {
    id: 'gha-p4-6',
    question: 'Why is it important to avoid force-pushing to version tags like `@v1` in Reusable Workflows?',
    type: 'single-choice' as const,
    options: [
      'Force-pushing is not allowed in GitHub Actions',
      'It can break all workflows that depend on that version, causing widespread build failures',
      'Version tags are read-only by default',
      'It requires special permissions that most developers don\'t have'
    ],
    correctAnswer: 'It can break all workflows that depend on that version, causing widespread build failures',
    explanation: 'When you force-push to a version tag like `@v1`, all repositories using `@v1` will suddenly get the new version, which may contain breaking changes. This can cause widespread build failures across the organization. Instead, you should create new version tags (v2, v3) and maintain backward compatibility.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['versioning', 'best-practices', 'breaking-changes']
  },
  {
    id: 'gha-p4-7',
    question: 'What is the recommended approach for debugging Reusable Workflows?',
    type: 'multiple-choice' as const,
    options: [
      'Add `echo` steps to log context and values',
      'Use `ACTIONS_STEP_DEBUG=true` for detailed tracing',
      'Test workflows locally using tools like `act`',
      'Rely solely on GitHub Actions UI logs'
    ],
    correctAnswer: ['Add `echo` steps to log context and values', 'Use `ACTIONS_STEP_DEBUG=true` for detailed tracing', 'Test workflows locally using tools like `act`'],
    explanation: 'Debugging Reusable Workflows can be challenging because logs may not show full context. Best practices include: adding `echo` steps to log important values, using `ACTIONS_STEP_DEBUG=true` for detailed tracing, and testing workflows locally with tools like `act` before deploying to catch YAML errors and missing secrets early.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['debugging', 'troubleshooting', 'best-practices']
  },
  {
    id: 'gha-p4-8',
    question: 'What is the "YAML zoo" problem mentioned in the article?',
    type: 'single-choice' as const,
    options: [
      'A GitHub Actions feature for managing multiple workflows',
      'The problem of having many similar but slightly different workflow files across repositories, leading to maintenance issues',
      'A tool for visualizing workflow dependencies',
      'A naming convention for workflow files'
    ],
    correctAnswer: 'The problem of having many similar but slightly different workflow files across repositories, leading to maintenance issues',
    explanation: 'The "YAML zoo" refers to the problem where multiple repositories have similar workflow files (90% the same) but with small variations. When the "standard" workflow changes (e.g., updating Node version or action versions), some repositories forget to update, leading to inconsistent builds and maintenance nightmares.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['yaml-zoo', 'duplication', 'maintenance', 'problem-solving']
  },
  {
    id: 'gha-p4-9',
    question: 'What is the recommended balance between centralized CI/CD and repository autonomy?',
    type: 'single-choice' as const,
    options: [
      'Completely centralized: all workflows must be identical with no overrides',
      'Completely autonomous: each repository manages its own workflows independently',
      'Centralized workflows define the framework (build, test, deploy), but repositories can extend with additional steps',
      'Only use Composite Actions, never Reusable Workflows'
    ],
    correctAnswer: 'Centralized workflows define the framework (build, test, deploy), but repositories can extend with additional steps',
    explanation: 'The best approach is a balanced one: centralized workflows define the standard framework (build, test, deploy) that all repositories use, but individual repositories can extend these workflows with additional steps (like security scans or custom staging deployments) to meet their specific needs. This maintains consistency while preserving flexibility.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['architecture', 'balance', 'centralization', 'autonomy']
  },
  
  // Hard question (1)
  {
    id: 'gha-p4-10',
    question: 'You are managing CI/CD for an organization with 25 repositories. You\'ve created a Reusable Workflow `deploy.yml@v1` that handles deployment. After 3 months, you need to update the deployment logic to add a new security scan step. However, 5 repositories have custom post-deployment steps that depend on the old workflow structure. What is the best approach?',
    type: 'single-choice' as const,
    options: [
      'Force-push the changes to `@v1` and update all 25 repositories at once',
      'Create `deploy.yml@v2` with the new security scan, maintain `@v1` for at least 1 month, migrate the 5 repositories with custom steps first, then gradually migrate the rest',
      'Create separate workflows for each repository type',
      'Remove the custom post-deployment steps from the 5 repositories to maintain consistency'
    ],
    correctAnswer: 'Create `deploy.yml@v2` with the new security scan, maintain `@v1` for at least 1 month, migrate the 5 repositories with custom steps first, then gradually migrate the rest',
    explanation: 'The best approach follows versioning best practices: create a new version (`@v2`) with the security scan, maintain backward compatibility by keeping `@v1` available for at least 1 month, and migrate repositories gradually. Start with the 5 repositories that have custom steps to ensure compatibility, then migrate the rest. This prevents breaking changes and allows for proper testing.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['versioning', 'migration', 'backward-compatibility', 'organization', 'advanced']
  }
]

// Encrypt the answers
const encryptedQuestions = questions.map(q => ({
  ...q,
  correctAnswer: encryptAnswerAdvanced(q.correctAnswer, q.id)
}))

export function GitHubActionsPart4Quiz() {
  return (
    <SimpleQuiz
      title="GitHub Actions Part 4: Organizing Pipelines with Reusable Workflows & Composite Actions Quiz"
      description="Test your understanding of Composite Actions, Reusable Workflows, versioning strategies, and best practices for organizing CI/CD pipelines at scale. Based on the concepts covered in Part 4."
      timeLimit={15}
      passingScore={70}
      allowRetake={true}
      showCorrectAnswers={true}
      questions={encryptedQuestions}
    />
  )
}

