'use client'

import { SimpleQuiz } from './SimpleQuiz'
import { encryptAnswerAdvanced } from '@/lib/quiz/encryption'

// Quiz questions based on GitHub Actions Part 7 content
const questions = [
  // Easy questions (3)
  {
    id: 'gha-p7-1',
    question: 'What is the key difference between CI (Continuous Integration) and CD (Continuous Delivery/Deployment)?',
    type: 'single-choice' as const,
    options: [
      'CI and CD are the same thing',
      'CI ensures code quality at each commit, while CD ensures the ability to release at any time without breaking',
      'CI is for testing, CD is for building',
      'CI runs on pull requests, CD runs on pushes'
    ],
    correctAnswer: 'CI ensures code quality at each commit, while CD ensures the ability to release at any time without breaking',
    explanation: 'CI (Continuous Integration) focuses on validating code quality at each commit through tests, linting, and type-checking. CD (Continuous Delivery/Deployment) ensures that validated code can be reliably released to production at any time. The key difference is that CI validates quality, while CD automates the release process with proper controls.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['ci', 'cd', 'concepts', 'basics']
  },
  {
    id: 'gha-p7-2',
    question: 'What is the primary purpose of adding metadata (like COMMIT_SHA and BUILD_DATE) to build artifacts?',
    type: 'single-choice' as const,
    options: [
      'To reduce artifact file size',
      'To enable traceability - knowing which commit and when each build was created, essential for audit, rollback, and compliance',
      'To speed up build times',
      'To automatically deploy artifacts'
    ],
    correctAnswer: 'To enable traceability - knowing which commit and when each build was created, essential for audit, rollback, and compliance',
    explanation: 'Metadata like COMMIT_SHA and BUILD_DATE in build artifacts provides traceability. This allows teams to identify exactly which commit produced a build, when it was built, and enables audit trails, rollback capabilities, and compliance verification. This is crucial when investigating production issues or proving regulatory compliance.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['metadata', 'traceability', 'artifacts', 'basics']
  },
  {
    id: 'gha-p7-3',
    question: 'Why should CI workflows (ci.yml) only run tests and not include build or publish steps?',
    type: 'single-choice' as const,
    options: [
      'CI workflows are faster without build steps',
      'CI should focus solely on validating code quality (test, lint, type-check), not on building or releasing',
      'Build steps require special permissions',
      'CI workflows cannot access build tools'
    ],
    correctAnswer: 'CI should focus solely on validating code quality (test, lint, type-check), not on building or releasing',
    explanation: 'CI workflows should have a single, clear purpose: validating code quality. By separating concerns, CI becomes faster, clearer, and easier to debug. When CI fails, you know it\'s a code quality issue, not a build or deployment problem. This separation also allows build and release workflows to run independently when needed.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['ci-workflow', 'separation-of-concerns', 'basics']
  },
  
  // Medium questions (6)
  {
    id: 'gha-p7-4',
    question: 'What are the benefits of separating workflows into ci.yml, build.yml, and release.yml?',
    type: 'multiple-choice' as const,
    options: [
      'Each workflow has a clear, single purpose, making them easier to read and maintain',
      'When one part fails, you know exactly which stage failed (test, build, or release)',
      'Workflows can be shorter and more focused, improving readability',
      'All workflows should be combined into one large file for simplicity'
    ],
    correctAnswer: ['Each workflow has a clear, single purpose, making them easier to read and maintain', 'When one part fails, you know exactly which stage failed (test, build, or release)', 'Workflows can be shorter and more focused, improving readability'],
    explanation: 'Separating workflows into ci.yml (testing), build.yml (artifact creation), and release.yml (deployment) provides clear boundaries and responsibilities. This makes each workflow easier to understand, maintain, and debug. When a failure occurs, logs immediately show which stage failed. Additionally, shorter, focused workflows are easier to read and modify than a single 400+ line workflow file.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['workflow-separation', 'architecture', 'maintainability']
  },
  {
    id: 'gha-p7-5',
    question: 'What are the key principles for implementing tag-based releases in GitHub Actions?',
    type: 'multiple-choice' as const,
    options: [
      'Only release when a valid tag (e.g., vX.Y.Z) is pushed, preventing automatic releases on every commit',
      'Tag-based releases give control to authorized users who can create tags',
      'Tag-based releases allow manual release via workflow_dispatch when needed (e.g., for rollback)',
      'Releases should happen automatically on every push to main branch'
    ],
    correctAnswer: ['Only release when a valid tag (e.g., vX.Y.Z) is pushed, preventing automatic releases on every commit', 'Tag-based releases give control to authorized users who can create tags', 'Tag-based releases allow manual release via workflow_dispatch when needed (e.g., for rollback)'],
    explanation: 'Tag-based releases prevent over-automation by requiring explicit version tags (like v1.2.3) before releasing. This ensures only authorized users (those who can create tags) can trigger releases, and prevents situations where every commit automatically becomes a release. The workflow_dispatch option allows manual triggering when needed, such as for rollback scenarios.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['tag-based-release', 'release-control', 'workflow-triggers']
  },
  {
    id: 'gha-p7-6',
    question: 'How can you share artifacts between separate workflows (e.g., from build.yml to release.yml)?',
    type: 'multiple-choice' as const,
    options: [
      'Use workflow_run trigger to detect when build.yml completes, then download artifacts in release.yml',
      'Upload artifacts in build.yml using actions/upload-artifact, then download them in release.yml using actions/download-artifact',
      'Artifacts are automatically shared between all workflows in a repository',
      'Use GitHub API to manually transfer files between workflows'
    ],
    correctAnswer: ['Use workflow_run trigger to detect when build.yml completes, then download artifacts in release.yml', 'Upload artifacts in build.yml using actions/upload-artifact, then download them in release.yml using actions/download-artifact'],
    explanation: 'To share artifacts between separate workflows, you need two mechanisms: (1) workflow_run trigger in release.yml to detect when build.yml completes, and (2) upload/download artifact actions. The build.yml uploads artifacts using actions/upload-artifact@v4, and release.yml downloads them using actions/download-artifact@v4. This creates a "workflow chaining" pattern where workflows communicate through artifacts.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['artifacts', 'workflow-run', 'workflow-chaining', 'data-sharing']
  },
  {
    id: 'gha-p7-7',
    question: 'What is the purpose of environment protection rules and manual approval in GitHub Actions?',
    type: 'multiple-choice' as const,
    options: [
      'Environment protection requires manual approval before production releases, creating a safety checkpoint',
      'It ensures that releases to production are reviewed by at least one person before execution',
      'It allows teams to review changelog and release notes one final time before deployment',
      'Environment protection is only needed for staging environments'
    ],
    correctAnswer: ['Environment protection requires manual approval before production releases, creating a safety checkpoint', 'It ensures that releases to production are reviewed by at least one person before execution', 'It allows teams to review changelog and release notes one final time before deployment'],
    explanation: 'Environment protection rules with manual approval create a critical safety checkpoint for production releases. They require at least one person to review and approve the release before it executes, following the "Trust, but verify" principle. This pause allows teams to review changelog, verify the release notes, and ensure everything is correct before pushing to production. Staging environments typically don\'t need this protection, allowing faster iteration.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['environment-protection', 'manual-approval', 'production-safety', 'governance']
  },
  {
    id: 'gha-p7-8',
    question: 'What are the key strategies for handling errors and rollback in release workflows?',
    type: 'multiple-choice' as const,
    options: [
      'Add a rollback job that runs on failure, automatically deleting failed releases or tags to prevent orphaned artifacts',
      'Use concurrency configuration to prevent multiple releases from running simultaneously',
      'Implement proper error handling so failures are "cleaned up" and don\'t leave the system in an inconsistent state',
      'Ignore failures and let them accumulate over time'
    ],
    correctAnswer: ['Add a rollback job that runs on failure, automatically deleting failed releases or tags to prevent orphaned artifacts', 'Use concurrency configuration to prevent multiple releases from running simultaneously', 'Implement proper error handling so failures are "cleaned up" and don\'t leave the system in an inconsistent state'],
    explanation: 'Effective error handling includes: (1) Rollback jobs that run on failure (using `if: failure()`) to clean up failed releases/tags, preventing orphaned artifacts that confuse users, (2) Concurrency limits to prevent multiple releases from running simultaneously (which could cause conflicts), and (3) Proper cleanup so failures don\'t leave the system in an inconsistent state. This ensures that when something goes wrong, the pipeline handles it gracefully rather than leaving a mess.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['error-handling', 'rollback', 'concurrency', 'failure-recovery']
  },
  {
    id: 'gha-p7-9',
    question: 'What is the purpose of concurrency configuration in release workflows, and what problem does it solve?',
    type: 'multiple-choice' as const,
    options: [
      'Concurrency groups workflows and can cancel in-progress runs when a new one starts, preventing duplicate releases',
      'It prevents situations where automation retries or outages cause multiple identical releases (e.g., v2.3.1, v2.3.1-hotfix, v2.3.1-retry)',
      'It ensures only one release workflow runs at a time for a given group, with cancel-in-progress: true canceling older runs',
      'Concurrency has no practical use in release workflows'
    ],
    correctAnswer: ['Concurrency groups workflows and can cancel in-progress runs when a new one starts, preventing duplicate releases', 'It prevents situations where automation retries or outages cause multiple identical releases (e.g., v2.3.1, v2.3.1-hotfix, v2.3.1-retry)', 'It ensures only one release workflow runs at a time for a given group, with cancel-in-progress: true canceling older runs'],
    explanation: 'Concurrency configuration (e.g., `concurrency: group: release, cancel-in-progress: true`) prevents duplicate or conflicting releases. When automation retries due to outages, or when multiple triggers occur, this ensures only one release workflow runs at a time. Older in-progress runs are canceled, preventing situations where you end up with multiple identical releases like v2.3.1, v2.3.1-hotfix, and v2.3.1-retry. This is a critical safeguard against "over-automation" that can cause confusion and waste resources.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['concurrency', 'release-safety', 'duplicate-prevention', 'automation-control']
  },
  
  // Hard question (1)
  {
    id: 'gha-p7-10',
    question: 'You are designing a CI/CD pipeline for a production application that requires: (1) code quality validation on PRs, (2) traceable builds with metadata, (3) controlled releases only on tags, (4) production approval gates, (5) automatic rollback on failure, and (6) audit logging. What is the most effective architecture?',
    type: 'single-choice' as const,
    options: [
      'Separate workflows: ci.yml (PR triggers, test/lint only), build.yml (push to main, create artifacts with COMMIT_SHA/BUILD_DATE), release.yml (tag triggers + workflow_dispatch, uses workflow_run to detect build completion, downloads artifacts, includes environment protection for production approval, has rollback job on failure, and logs to audit system). Add concurrency to release.yml to prevent duplicates. Use artifact sharing via workflow_run and download-artifact.',
      'Single workflow that does everything: test, build, and release on every push to main',
      'Two workflows: one for CI/CD combined, and one for manual releases',
      'No workflows needed - use manual scripts and local builds'
    ],
    correctAnswer: 'Separate workflows: ci.yml (PR triggers, test/lint only), build.yml (push to main, create artifacts with COMMIT_SHA/BUILD_DATE), release.yml (tag triggers + workflow_dispatch, uses workflow_run to detect build completion, downloads artifacts, includes environment protection for production approval, has rollback job on failure, and logs to audit system). Add concurrency to release.yml to prevent duplicates. Use artifact sharing via workflow_run and download-artifact.',
    explanation: 'The most effective architecture separates concerns into three workflows: (1) ci.yml focuses solely on code quality (test, lint) on PRs, (2) build.yml creates traceable artifacts with metadata on main branch pushes, and (3) release.yml handles controlled releases via tags with workflow_run to chain from build.yml, downloads artifacts, includes environment protection for production approval, implements rollback on failure, and logs to audit systems. Concurrency prevents duplicate releases. This architecture provides clear separation of concerns, traceability, controlled releases, safety checkpoints, error recovery, and auditability—all essential for production systems. The key insight is that automation must be controlled and observable, not just automatic.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['comprehensive-architecture', 'workflow-separation', 'traceability', 'release-control', 'environment-protection', 'rollback', 'audit', 'system-design', 'advanced']
  }
]

// Encrypt the answers
const encryptedQuestions = questions.map(q => ({
  ...q,
  correctAnswer: encryptAnswerAdvanced(q.correctAnswer, q.id)
}))

export function GitHubActionsPart7Quiz() {
  return (
    <SimpleQuiz
      title="GitHub Actions Part 7: CI/CD Integration and Automated Release Quiz"
      description="Test your understanding of CI/CD pipeline design, workflow separation, artifact traceability, tag-based releases, environment protection, error handling, and automated release strategies. Based on the concepts covered in Part 7."
      timeLimit={15}
      passingScore={70}
      allowRetake={true}
      showCorrectAnswers={true}
      questions={encryptedQuestions}
    />
  )
}

