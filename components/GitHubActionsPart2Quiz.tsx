'use client'

import { SimpleQuiz } from './SimpleQuiz'
import { encryptAnswerAdvanced } from '@/lib/quiz/encryption'

// Quiz questions based on GitHub Actions Part 2 content
const questions = [
  // Easy questions (3)
  {
    id: 'gha-p2-1',
    question: 'What are the three main blocks in a GitHub Actions workflow YAML file?',
    type: 'single-choice' as const,
    options: [
      'on, jobs, steps',
      'trigger, actions, runners',
      'events, tasks, commands',
      'workflow, pipeline, stages'
    ],
    correctAnswer: 'on, jobs, steps',
    explanation: 'The three main blocks in a GitHub Actions workflow YAML are: `on` (triggers), `jobs` (work units), and `steps` (individual actions within jobs).',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['structure', 'yaml', 'basics']
  },
  {
    id: 'gha-p2-2',
    question: 'What event triggers a workflow when code is pushed to a repository?',
    type: 'single-choice' as const,
    options: [
      'push',
      'commit',
      'pull',
      'deploy'
    ],
    correctAnswer: 'push',
    explanation: 'The `push` event is triggered when code is pushed to a repository. This is one of the most common triggers for CI/CD workflows.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['events', 'triggers', 'basics']
  },
  {
    id: 'gha-p2-3',
    question: 'What is the primary purpose of the `actions/checkout` action?',
    type: 'single-choice' as const,
    options: [
      'To clone the repository code to the runner',
      'To check out a different branch',
      'To validate the code syntax',
      'To install dependencies'
    ],
    correctAnswer: 'To clone the repository code to the runner',
    explanation: 'The `actions/checkout` action clones the repository code to the runner, making it available for subsequent steps in the workflow.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['actions', 'checkout', 'basics']
  },
  
  // Medium questions (6)
  {
    id: 'gha-p2-4',
    question: 'What happens when a step in a job fails (exit code ≠ 0)?',
    type: 'single-choice' as const,
    options: [
      'The entire job is marked as failed',
      'The step is skipped and execution continues',
      'The workflow pauses and waits for manual intervention',
      'Only that step is marked as failed, but the job continues'
    ],
    correctAnswer: 'The entire job is marked as failed',
    explanation: 'When a step fails (exit code ≠ 0), the entire job is marked as failed and execution stops, unless you use `continue-on-error: true` on that step.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['steps', 'error-handling', 'execution']
  },
  {
    id: 'gha-p2-5',
    question: 'How do you make jobs run in a specific order (dependencies)?',
    type: 'single-choice' as const,
    options: [
      'Use the `needs:` keyword',
      'Use the `depends:` keyword',
      'Use the `after:` keyword',
      'Jobs always run in the order they are defined'
    ],
    correctAnswer: 'Use the `needs:` keyword',
    explanation: 'The `needs:` keyword specifies job dependencies. A job will only run after all jobs listed in its `needs:` array have completed successfully.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['jobs', 'dependencies', 'needs']
  },
  {
    id: 'gha-p2-6',
    question: 'What is the primary purpose of `actions/cache` in a workflow?',
    type: 'single-choice' as const,
    options: [
      'To store and reuse files between workflow runs',
      'To backup workflow artifacts',
      'To store secrets securely',
      'To cache GitHub API responses'
    ],
    correctAnswer: 'To store and reuse files between workflow runs',
    explanation: 'The `actions/cache` action stores files (like dependencies) between workflow runs, significantly reducing build times by avoiding re-downloading or re-building the same files.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['cache', 'optimization', 'performance']
  },
  {
    id: 'gha-p2-7',
    question: 'What is the key difference between `on: push` and `on: pull_request`?',
    type: 'single-choice' as const,
    options: [
      '`push` triggers on commits, `pull_request` triggers on PR events',
      '`push` is faster, `pull_request` is slower',
      '`push` runs on main branch only, `pull_request` runs on all branches',
      'There is no difference, they are interchangeable'
    ],
    correctAnswer: '`push` triggers on commits, `pull_request` triggers on PR events',
    explanation: '`on: push` triggers when code is pushed to a branch, while `on: pull_request` triggers when a pull request is opened, synchronized, or closed. A PR does not generate a `push` event.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['events', 'triggers', 'pull-requests']
  },
  {
    id: 'gha-p2-8',
    question: 'How do you enable debug logging in GitHub Actions to see detailed environment variables?',
    type: 'single-choice' as const,
    options: [
      'Set `ACTIONS_STEP_DEBUG=true` as a secret',
      'Add `debug: true` to the workflow file',
      'Use the `--debug` flag in commands',
      'Enable it in the repository settings'
    ],
    correctAnswer: 'Set `ACTIONS_STEP_DEBUG=true` as a secret',
    explanation: 'To enable debug logging, you need to set `ACTIONS_STEP_DEBUG=true` as a repository secret. This will show detailed logs including environment variables like `GITHUB_REF`, `GITHUB_SHA`, and `GITHUB_WORKSPACE`.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['debugging', 'logging', 'troubleshooting']
  },
  {
    id: 'gha-p2-9',
    question: 'What is the purpose of the `needs:` keyword in workflow jobs?',
    type: 'multiple-choice' as const,
    options: [
      'To specify which jobs must complete before this job runs',
      'To prevent race conditions between jobs',
      'To ensure jobs run in a specific order',
      'To share artifacts between jobs'
    ],
    correctAnswer: ['To specify which jobs must complete before this job runs', 'To prevent race conditions between jobs', 'To ensure jobs run in a specific order'],
    explanation: 'The `needs:` keyword serves multiple purposes: it specifies job dependencies (which jobs must complete first), prevents race conditions by ensuring proper ordering, and ensures jobs run in a specific sequence. While it enables artifact sharing, that is not its primary purpose.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['needs', 'dependencies', 'job-ordering']
  },
  
  // Hard question (1)
  {
    id: 'gha-p2-10',
    question: 'What is the correct order of the 8-step lifecycle of a GitHub Actions workflow execution?',
    type: 'single-choice' as const,
    options: [
      'Trigger → Queue → Runner → Checkout → Setup → Execute → Teardown → Report',
      'Queue → Trigger → Checkout → Runner → Setup → Execute → Report → Teardown',
      'Trigger → Runner → Queue → Setup → Checkout → Execute → Teardown → Report',
      'Queue → Runner → Trigger → Checkout → Setup → Execute → Report → Teardown'
    ],
    correctAnswer: 'Trigger → Queue → Runner → Checkout → Setup → Execute → Teardown → Report',
    explanation: 'The correct lifecycle is: 1) Trigger (event occurs), 2) Queue (workflow queued), 3) Runner (GitHub selects runner), 4) Checkout (code cloned), 5) Setup (environment prepared), 6) Execute (steps run), 7) Teardown (cleanup), 8) Report (results displayed).',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['lifecycle', 'execution', 'workflow-flow']
  }
]

// Encrypt the answers
const encryptedQuestions = questions.map(q => ({
  ...q,
  correctAnswer: encryptAnswerAdvanced(q.correctAnswer, q.id)
}))

export function GitHubActionsPart2Quiz() {
  return (
    <SimpleQuiz
      title="GitHub Actions Part 2: Workflow Structure & Lifecycle Quiz"
      description="Test your understanding of GitHub Actions workflow structure, lifecycle, and execution flow. Based on the concepts covered in Part 2."
      timeLimit={15}
      passingScore={70}
      allowRetake={true}
      showCorrectAnswers={true}
      questions={encryptedQuestions}
    />
  )
}

