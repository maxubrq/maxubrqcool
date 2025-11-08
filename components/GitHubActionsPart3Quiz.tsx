'use client'

import { SimpleQuiz } from './SimpleQuiz'
import { encryptAnswerAdvanced } from '@/lib/quiz/encryption'

// Quiz questions based on GitHub Actions Part 3 content
const questions = [
  // Easy questions (3)
  {
    id: 'gha-p3-1',
    question: 'In GitHub Actions, what is true about jobs running in separate runners?',
    type: 'single-choice' as const,
    options: [
      'Each job runs in its own isolated runner with no shared filesystem',
      'All jobs share the same filesystem and can access each other\'s files',
      'Jobs can only run sequentially, never in parallel',
      'Jobs automatically share environment variables'
    ],
    correctAnswer: 'Each job runs in its own isolated runner with no shared filesystem',
    explanation: 'Each job runs in a completely isolated runner (VM or container). There is no shared filesystem between jobs unless you explicitly pass data through outputs or artifacts.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['jobs', 'runners', 'isolation', 'basics']
  },
  {
    id: 'gha-p3-2',
    question: 'How do you pass data from one job to another in GitHub Actions?',
    type: 'single-choice' as const,
    options: [
      'Using job outputs with `needs.<job>.outputs`',
      'By sharing files on a common filesystem',
      'Using environment variables that persist across jobs',
      'Through global variables accessible to all jobs'
    ],
    correctAnswer: 'Using job outputs with `needs.<job>.outputs`',
    explanation: 'Jobs pass data to each other using `outputs` defined in the source job and accessed via `needs.<job>.outputs` in dependent jobs. This is the proper way to create a data contract between jobs.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['jobs', 'outputs', 'data-flow', 'basics']
  },
  {
    id: 'gha-p3-3',
    question: 'What are the two main types of runners in GitHub Actions?',
    type: 'single-choice' as const,
    options: [
      'GitHub-hosted and self-hosted runners',
      'Linux and Windows runners',
      'Public and private runners',
      'Temporary and persistent runners'
    ],
    correctAnswer: 'GitHub-hosted and self-hosted runners',
    explanation: 'GitHub Actions supports two types of runners: GitHub-hosted (managed by GitHub) and self-hosted (managed by you). Self-hosted runners give you more control but require security considerations.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['runners', 'infrastructure', 'basics']
  },
  
  // Medium questions (6)
  {
    id: 'gha-p3-4',
    question: 'When is the `github.*` context evaluated in a workflow?',
    type: 'single-choice' as const,
    options: [
      'Early, when the workflow parses the event',
      'At runtime when each step executes',
      'Only when explicitly referenced in a step',
      'After all jobs have completed'
    ],
    correctAnswer: 'Early, when the workflow parses the event',
    explanation: 'The `github.*` context is evaluated early when the workflow parses the event, not at runtime. This means values like `github.sha` are fixed at trigger time, not when steps run.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['context', 'evaluation', 'timing']
  },
  {
    id: 'gha-p3-5',
    question: 'What is the main security concern when using self-hosted runners?',
    type: 'single-choice' as const,
    options: [
      'They can execute code from external PRs and forks',
      'They are slower than GitHub-hosted runners',
      'They require manual updates',
      'They cannot access secrets'
    ],
    correctAnswer: 'They can execute code from external PRs and forks',
    explanation: 'Self-hosted runners can execute code from external PRs and forks, which poses security risks. You should use conditions like `if: github.event.pull_request.head.repo.full_name == github.repository` to prevent this.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['security', 'self-hosted', 'runners']
  },
  {
    id: 'gha-p3-6',
    question: 'How can you debug and inspect context values in a GitHub Actions workflow?',
    type: 'single-choice' as const,
    options: [
      'Use `echo \'${{ toJson(github) }}\'` to dump context values',
      'Enable debug mode in repository settings',
      'Check the Actions tab in GitHub UI',
      'Context values cannot be inspected'
    ],
    correctAnswer: 'Use `echo \'${{ toJson(github) }}\'` to dump context values',
    explanation: 'You can debug context values by using `toJson()` function to dump context objects. For example, `echo \'${{ toJson(github) }}\'` will print all github context values, helping you understand what GitHub "sees" at that point.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['debugging', 'context', 'troubleshooting']
  },
  {
    id: 'gha-p3-7',
    question: 'What is the difference between `env.*` and `github.*` context in terms of when they are evaluated?',
    type: 'single-choice' as const,
    options: [
      '`env.*` is injected at step runtime, while `github.*` is evaluated at workflow parse time',
      'Both are evaluated at the same time',
      '`github.*` is only available in certain jobs',
      '`env.*` is evaluated before `github.*`'
    ],
    correctAnswer: '`env.*` is injected at step runtime, while `github.*` is evaluated at workflow parse time',
    explanation: 'The `env.*` context is injected into the environment of each step at runtime, while `github.*` context is evaluated early when the workflow parses the event. This timing difference can cause confusion when debugging.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['context', 'evaluation', 'timing', 'env']
  },
  {
    id: 'gha-p3-8',
    question: 'Why might a job fail to access data from a previous job even though the previous job succeeded?',
    type: 'multiple-choice' as const,
    options: [
      'The data was not passed through job outputs',
      'The dependent job does not have `needs:` specified',
      'Each job runs in an isolated filesystem',
      'The data was stored in a temporary location that was cleaned up'
    ],
    correctAnswer: ['The data was not passed through job outputs', 'Each job runs in an isolated filesystem'],
    explanation: 'Jobs run in completely isolated runners with separate filesystems. Data from one job is not automatically available to another. You must explicitly pass data through job outputs or artifacts. Simply having `needs:` is not enough if you don\'t set up the data contract properly.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['jobs', 'data-flow', 'outputs', 'isolation']
  },
  {
    id: 'gha-p3-9',
    question: 'What is the purpose of runner labels in GitHub Actions?',
    type: 'single-choice' as const,
    options: [
      'To group and route jobs to specific runners based on capabilities',
      'To organize workflow files in the repository',
      'To tag commits with metadata',
      'To categorize workflow runs in the UI'
    ],
    correctAnswer: 'To group and route jobs to specific runners based on capabilities',
    explanation: 'Runner labels (like `[self-hosted, gpu, staging]`) allow you to group runners and route specific jobs to runners with the required capabilities. This is essential for using self-hosted runners with specific hardware or software requirements.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['runners', 'labels', 'routing', 'self-hosted']
  },
  
  // Hard question (1)
  {
    id: 'gha-p3-10',
    question: 'You have a workflow with two jobs: `build` and `deploy`. The `build` job creates a Docker image and tags it with `${{ github.sha }}`. The `deploy` job runs 2 hours later (after manual approval) and tries to deploy using the same tag. What potential issue might occur?',
    type: 'single-choice' as const,
    options: [
      'The `github.sha` context is evaluated at workflow trigger time, so if new commits were pushed, the deploy job might try to deploy an image that doesn\'t exist or doesn\'t match the current code',
      'The deploy job will automatically use the latest image tag',
      'The `github.sha` will be updated automatically when the deploy job runs',
      'There is no issue; the tag will always match'
    ],
    correctAnswer: 'The `github.sha` context is evaluated at workflow trigger time, so if new commits were pushed, the deploy job might try to deploy an image that doesn\'t exist or doesn\'t match the current code',
    explanation: 'The `github.sha` context is resolved at workflow trigger time, not when each step runs. If the deploy job runs hours later after new commits, the SHA used for the image tag might not exist or might not match the current codebase. The solution is to explicitly pass the SHA value through job outputs to ensure consistency.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['context', 'timing', 'data-flow', 'deployment', 'advanced']
  }
]

// Encrypt the answers
const encryptedQuestions = questions.map(q => ({
  ...q,
  correctAnswer: encryptAnswerAdvanced(q.correctAnswer, q.id)
}))

export function GitHubActionsPart3Quiz() {
  return (
    <SimpleQuiz
      title="GitHub Actions Part 3: Jobs, Runners & Context Quiz"
      description="Test your understanding of job isolation, runner management, context evaluation, and security in GitHub Actions. Based on the concepts covered in Part 3."
      timeLimit={15}
      passingScore={70}
      allowRetake={true}
      showCorrectAnswers={true}
      questions={encryptedQuestions}
    />
  )
}

