'use client'

import { SimpleQuiz } from './SimpleQuiz'
import { encryptAnswerAdvanced } from '@/lib/quiz/encryption'

// Quiz questions based on GitHub Actions Part 6 content
const questions = [
  // Easy questions (3)
  {
    id: 'gha-p6-1',
    question: 'What is the primary purpose of `strategy.matrix` in GitHub Actions?',
    type: 'single-choice' as const,
    options: [
      'To run multiple jobs sequentially with different configurations',
      'To run multiple jobs in parallel with different configurations (e.g., different Node versions, OS, or environments)',
      'To reduce the number of jobs in a workflow',
      'To automatically cache dependencies'
    ],
    correctAnswer: 'To run multiple jobs in parallel with different configurations (e.g., different Node versions, OS, or environments)',
    explanation: 'The `strategy.matrix` feature allows you to run multiple jobs in parallel, each with different configurations. For example, you can test against multiple Node.js versions (18, 20) and operating systems (Ubuntu, Windows) simultaneously. Each matrix combination runs as a separate job on its own runner, enabling parallel execution.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['matrix', 'parallelization', 'strategy', 'basics']
  },
  {
    id: 'gha-p6-2',
    question: 'What is the main benefit of using `actions/cache` in GitHub Actions workflows?',
    type: 'single-choice' as const,
    options: [
      'It automatically installs dependencies',
      'It stores and reuses dependencies (like node_modules) between workflow runs, reducing installation time',
      'It runs jobs faster by skipping tests',
      'It reduces the number of runners needed'
    ],
    correctAnswer: 'It stores and reuses dependencies (like node_modules) between workflow runs, reducing installation time',
    explanation: 'The `actions/cache` action stores dependencies (like npm packages in `~/.npm` or `node_modules`) between workflow runs. When a cache hit occurs, it restores the cached dependencies instead of downloading them again, significantly reducing installation time. This is especially valuable in matrix builds where multiple jobs would otherwise download the same dependencies.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['cache', 'dependencies', 'optimization', 'basics']
  },
  {
    id: 'gha-p6-3',
    question: 'What is the purpose of uploading and downloading artifacts between jobs in GitHub Actions?',
    type: 'single-choice' as const,
    options: [
      'To share secrets between jobs',
      'To pass build outputs (like compiled files) from one job to another without rebuilding',
      'To store logs permanently',
      'To reduce workflow file size'
    ],
    correctAnswer: 'To pass build outputs (like compiled files) from one job to another without rebuilding',
    explanation: 'Artifacts allow you to pass files (like compiled `dist/` folders) from one job to another. For example, a test job can build the project and upload it as an artifact, then a deployment job can download that artifact instead of rebuilding from scratch. This saves time and ensures consistency across jobs.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['artifacts', 'build-output', 'job-dependencies', 'basics']
  },
  
  // Medium questions (6)
  {
    id: 'gha-p6-4',
    question: 'Why is it important to include the OS and Node version in the cache key when using matrix builds?',
    type: 'multiple-choice' as const,
    options: [
      'Different OS and Node versions may have incompatible dependencies or binaries',
      'Using a cache key like `${{ runner.os }}-${{ matrix.node-version }}-${{ hashFiles(\'**/package-lock.json\') }}` ensures each matrix combination gets the correct cache',
      'It prevents "false cache hits" where the wrong cache is reused, causing random build failures',
      'Cache keys don\'t need to include OS or version information'
    ],
    correctAnswer: ['Different OS and Node versions may have incompatible dependencies or binaries', 'Using a cache key like `${{ runner.os }}-${{ matrix.node-version }}-${{ hashFiles(\'**/package-lock.json\') }}` ensures each matrix combination gets the correct cache', 'It prevents "false cache hits" where the wrong cache is reused, causing random build failures'],
    explanation: 'Cache keys must be specific to each matrix combination because dependencies can differ between OS (e.g., native binaries for Windows vs Linux) and Node versions. A cache key that includes `runner.os` and `matrix.node-version` ensures each combination gets its own cache. Without this, you risk "false cache hits" where Ubuntu cache is reused for Windows jobs, causing mysterious build failures.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['cache-key', 'matrix', 'false-cache-hit', 'optimization']
  },
  {
    id: 'gha-p6-5',
    question: 'What is the purpose of the `concurrency` configuration in GitHub Actions workflows?',
    type: 'multiple-choice' as const,
    options: [
      'To limit the number of parallel jobs that can run simultaneously',
      'To cancel in-progress workflows when a new commit is pushed, preventing wasted runner time',
      'To group workflows by `${{ github.workflow }}-${{ github.ref }}` so only the latest run executes',
      'To automatically retry failed jobs'
    ],
    correctAnswer: ['To cancel in-progress workflows when a new commit is pushed, preventing wasted runner time', 'To group workflows by `${{ github.workflow }}-${{ github.ref }}` so only the latest run executes'],
    explanation: 'The `concurrency` configuration groups workflows and can cancel in-progress runs when a new commit is pushed. For example, `concurrency: group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true` ensures that if you push multiple commits quickly, only the latest workflow runs. This prevents wasted runner time on outdated commits and can reduce wait time by 30-40%.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['concurrency', 'workflow-optimization', 'cancel-in-progress', 'resource-management']
  },
  {
    id: 'gha-p6-6',
    question: 'What are the practical limitations of using matrix builds for performance optimization?',
    type: 'multiple-choice' as const,
    options: [
      'Matrix builds always make workflows faster, regardless of the number of combinations',
      'When the number of matrix combinations grows (e.g., 3 OS × 3 Node versions × 2 regions = 18 jobs), the overhead of setting up and tearing down runners can sometimes make total time worse',
      'Performance optimization is about choosing the right level of parallelism, not maximizing it',
      'Each matrix job requires its own runner, which consumes parallel execution slots'
    ],
    correctAnswer: ['When the number of matrix combinations grows (e.g., 3 OS × 3 Node versions × 2 regions = 18 jobs), the overhead of setting up and tearing down runners can sometimes make total time worse', 'Performance optimization is about choosing the right level of parallelism, not maximizing it', 'Each matrix job requires its own runner, which consumes parallel execution slots'],
    explanation: 'Matrix builds have practical limits. While they enable parallelism, each combination requires its own runner and has setup/teardown overhead. When you have too many combinations (e.g., 18 jobs), the total overhead can exceed the time saved. Additionally, each job consumes parallel execution slots, which can exhaust your quota. The key is finding the right balance—not always "more is better."',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['matrix-limitations', 'overhead', 'parallelism', 'optimization']
  },
  {
    id: 'gha-p6-7',
    question: 'How can you optimize workflows by skipping unnecessary jobs using conditional logic?',
    type: 'multiple-choice' as const,
    options: [
      'Use `if: ${{ github.event_name == \'push\' && contains(github.ref, \'main\') }}` to only run certain jobs on main branch pushes',
      'Skip build jobs on feature branches if they don\'t need deployment',
      'Conditional jobs help avoid running expensive operations when they\'re not needed',
      'All jobs should always run regardless of branch or event type'
    ],
    correctAnswer: ['Use `if: ${{ github.event_name == \'push\' && contains(github.ref, \'main\') }}` to only run certain jobs on main branch pushes', 'Skip build jobs on feature branches if they don\'t need deployment', 'Conditional jobs help avoid running expensive operations when they\'re not needed'],
    explanation: 'You can use conditional logic with the `if` keyword to skip jobs that aren\'t needed. For example, deployment jobs might only run on `main` branch pushes, while feature branches skip them. This saves runner time and costs. The principle is: "Don\'t run what hasn\'t changed or isn\'t needed."',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['conditional-jobs', 'if-statements', 'workflow-optimization', 'cost-reduction']
  },
  {
    id: 'gha-p6-8',
    question: 'What are the benefits and considerations of using self-hosted runners for GitHub Actions?',
    type: 'multiple-choice' as const,
    options: [
      'Self-hosted runners can reduce costs for heavy build jobs (e.g., saving ~40% compared to hosted runners)',
      'Self-hosted runners are suitable for CPU-intensive or long-running jobs',
      'Self-hosted runners require infrastructure management and security considerations',
      'Self-hosted runners are always faster than GitHub-hosted runners'
    ],
    correctAnswer: ['Self-hosted runners can reduce costs for heavy build jobs (e.g., saving ~40% compared to hosted runners)', 'Self-hosted runners are suitable for CPU-intensive or long-running jobs', 'Self-hosted runners require infrastructure management and security considerations'],
    explanation: 'Self-hosted runners can significantly reduce costs for heavy workloads (e.g., saving ~40% in the article\'s example). They\'re ideal for CPU-intensive or long-running jobs. However, they require you to manage the infrastructure (setup, updates, monitoring) and consider security (isolation, access control). They\'re not always faster—the benefit is primarily cost savings for high-volume workflows.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['self-hosted-runner', 'cost-optimization', 'infrastructure', 'considerations']
  },
  {
    id: 'gha-p6-9',
    question: 'What is a build summary report and why is it valuable for pipeline optimization?',
    type: 'multiple-choice' as const,
    options: [
      'A report that tracks execution time for each job and averages over recent runs (e.g., 7 days)',
      'It helps teams identify which jobs are "bloating" (taking longer over time) without guessing',
      'It can be generated using `actions/github-script` at the end of workflows',
      'Build summary reports are only useful for debugging failed jobs'
    ],
    correctAnswer: ['A report that tracks execution time for each job and averages over recent runs (e.g., 7 days)', 'It helps teams identify which jobs are "bloating" (taking longer over time) without guessing', 'It can be generated using `actions/github-script` at the end of workflows'],
    explanation: 'A build summary report tracks job execution times and calculates averages (e.g., over 7 days). This helps teams spot performance regressions—jobs that are gradually taking longer—without manual investigation. It can be generated using `actions/github-script` to post statistics as a workflow summary. This visibility is crucial for maintaining pipeline performance over time.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['build-summary', 'monitoring', 'performance-tracking', 'optimization']
  },
  
  // Hard question (1)
  {
    id: 'gha-p6-10',
    question: 'You are optimizing a GitHub Actions workflow that: (1) needs to test on Node 18/20 and Ubuntu/Windows, (2) builds a Next.js app, (3) deploys to staging on main branch pushes, (4) has frequent commits causing runner queue delays, and (5) is experiencing slow dependency installation. What is the most effective optimization strategy?',
    type: 'single-choice' as const,
    options: [
      'Use matrix builds for testing, add cache with key `${{ runner.os }}-${{ matrix.node-version }}-${{ hashFiles(\'**/package-lock.json\') }}`, separate build job that downloads test artifacts, add `concurrency` to cancel old workflows, use conditional `if` to skip deployment on feature branches, and consider self-hosted runners for heavy build jobs if cost becomes an issue',
      'Run all jobs sequentially, cache everything with a single key, and always deploy on every push',
      'Use matrix builds without cache, run build in every test job, and deploy on all branches',
      'Only optimize YAML syntax without considering data flow or job dependencies'
    ],
    correctAnswer: 'Use matrix builds for testing, add cache with key `${{ runner.os }}-${{ matrix.node-version }}-${{ hashFiles(\'**/package-lock.json\') }}`, separate build job that downloads test artifacts, add `concurrency` to cancel old workflows, use conditional `if` to skip deployment on feature branches, and consider self-hosted runners for heavy build jobs if cost becomes an issue',
    explanation: 'The most effective strategy combines multiple optimization techniques: (1) Matrix builds enable parallel testing across Node versions and OS, (2) Proper cache keys (OS + Node version + package-lock hash) prevent false hits and speed up dependency installation, (3) Artifact-based job separation avoids rebuilding, (4) Concurrency cancels outdated workflows to reduce queue time, (5) Conditional jobs skip unnecessary deployments, and (6) Self-hosted runners can reduce costs for heavy workloads. This approach addresses performance as a system-level concern, not just YAML tweaking. The key insight is understanding data flow, dependencies, and when to parallelize vs. when to optimize setup overhead.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['comprehensive-optimization', 'matrix', 'cache', 'artifacts', 'concurrency', 'conditional-jobs', 'self-hosted-runner', 'system-thinking', 'advanced']
  }
]

// Encrypt the answers
const encryptedQuestions = questions.map(q => ({
  ...q,
  correctAnswer: encryptAnswerAdvanced(q.correctAnswer, q.id)
}))

export function GitHubActionsPart6Quiz() {
  return (
    <SimpleQuiz
      title="GitHub Actions Part 6: Matrix Builds and Pipeline Optimization Quiz"
      description="Test your understanding of GitHub Actions matrix builds, cache optimization, artifact management, concurrency configuration, self-hosted runners, and performance optimization strategies. Based on the concepts covered in Part 6."
      timeLimit={15}
      passingScore={70}
      allowRetake={true}
      showCorrectAnswers={true}
      questions={encryptedQuestions}
    />
  )
}

