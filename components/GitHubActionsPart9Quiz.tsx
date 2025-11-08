'use client'

import { SimpleQuiz } from './SimpleQuiz'
import { encryptAnswerAdvanced } from '@/lib/quiz/encryption'

// Quiz questions based on GitHub Actions Part 9 content
const questions = [
  // Easy questions (3)
  {
    id: 'gha-p9-1',
    question: 'What is the fundamental mindset shift when treating CI/CD pipelines as production infrastructure?',
    type: 'single-choice' as const,
    options: [
      'Pipelines should be treated as disposable scripts that can be rewritten anytime',
      'Pipelines should be treated as infrastructure - stable, reusable, observable, and controllable, similar to Terraform or Kubernetes manifests',
      'Pipelines should only run tests and never deploy',
      'Pipelines should be written once and never changed'
    ],
    correctAnswer: 'Pipelines should be treated as infrastructure - stable, reusable, observable, and controllable, similar to Terraform or Kubernetes manifests',
    explanation: 'The key mindset shift is treating CI/CD pipelines as infrastructure, not just tools. This means they should have the qualities of real infrastructure: stability, reusability, observability, and control. Like Terraform or Kubernetes manifests, they should be version-controlled, reviewable, and rollback-able. This transforms pipelines from "scripts that run" into "operational systems."',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['infrastructure-mindset', 'production-grade', 'basics']
  },
  {
    id: 'gha-p9-2',
    question: 'What is the recommended branch-to-environment mapping for production-grade CI/CD?',
    type: 'single-choice' as const,
    options: [
      'All branches deploy to the same environment',
      'main = staging, production = production environment, feature branches = CI only (build + test)',
      'Every branch gets its own production environment',
      'Only production branch should exist'
    ],
    correctAnswer: 'main = staging, production = production environment, feature branches = CI only (build + test)',
    explanation: 'The recommended mapping is: `main` branch corresponds to staging environment, `production` branch corresponds to production environment, and all other feature branches only run CI (build + test) without deployment. This creates clear boundaries between environments and prevents accidental production deployments from feature branches.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['branching', 'environment-mapping', 'basics']
  },
  {
    id: 'gha-p9-3',
    question: 'What are the key capabilities that GitHub\'s `environment:` primitive provides?',
    type: 'single-choice' as const,
    options: [
      'It only changes the runner type',
      'It creates separate secret scopes per environment, configures required reviewers before deploy, and tracks deployment history per environment',
      'It automatically deploys to all environments',
      'It prevents all deployments'
    ],
    correctAnswer: 'It creates separate secret scopes per environment, configures required reviewers before deploy, and tracks deployment history per environment',
    explanation: 'The `environment:` primitive is powerful because it: (1) Creates separate secret scopes for each environment (staging secrets vs production secrets), (2) Allows configuring required reviewers before deployment (manual approval gates), and (3) Tracks complete deployment history per environment. This makes environments act like "natural firewalls" for CI/CD systems.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['environment', 'secrets', 'approval', 'basics']
  },
  
  // Medium questions (6)
  {
    id: 'gha-p9-4',
    question: 'What are the benefits of using reusable workflows in a production CI/CD system?',
    type: 'multiple-choice' as const,
    options: [
      'Reusable workflows eliminate copy-paste and allow centralized updates across all services',
      'A single PR to the workflows-core repo can update CI/CD for all services',
      'Reusable workflows ensure consistency and standardization across the organization',
      'Each service must maintain its own unique workflow files'
    ],
    correctAnswer: ['Reusable workflows eliminate copy-paste and allow centralized updates across all services', 'A single PR to the workflows-core repo can update CI/CD for all services', 'Reusable workflows ensure consistency and standardization across the organization'],
    explanation: 'Reusable workflows provide: (1) Elimination of copy-paste - common CI/CD functions (test, build, deploy, scan) are centralized in `.github/workflows-core/`, (2) Centralized updates - one PR to workflows-core updates all services, and (3) Consistency - all services follow the same standardized workflows. This is essential when workflows become a system rather than individual files.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['reusable-workflows', 'standardization', 'centralization']
  },
  {
    id: 'gha-p9-5',
    question: 'What is the purpose of compliance workflows in a production CI/CD system?',
    type: 'multiple-choice' as const,
    options: [
      'Compliance workflows ensure every repo follows minimum CI/CD standards (tests, scans, traceable artifacts)',
      'They are not about "catching errors" but ensuring consistent quality gates across all repositories',
      'Compliance workflows include security scans, license checks, and other mandatory checks',
      'Compliance workflows should only run in production'
    ],
    correctAnswer: ['Compliance workflows ensure every repo follows minimum CI/CD standards (tests, scans, traceable artifacts)', 'They are not about "catching errors" but ensuring consistent quality gates across all repositories', 'Compliance workflows include security scans, license checks, and other mandatory checks'],
    explanation: 'Compliance workflows serve to: (1) Ensure minimum CI/CD standards across all repos (tests, scans, traceable artifacts), (2) Provide consistent quality gates (not about catching errors, but about maintaining standards), and (3) Include mandatory checks like security scans and license checks. When workflows become a system, standardization is not optional—it\'s a self-defense mechanism.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['compliance', 'standardization', 'quality-gates']
  },
  {
    id: 'gha-p9-6',
    question: 'How should rollback be implemented in a production-grade CI/CD system?',
    type: 'multiple-choice' as const,
    options: [
      'Rollback should be a dedicated workflow (rollback.yml) triggered manually via workflow_dispatch',
      'Rollback workflows should accept version inputs to specify which version to rollback to',
      'Rollback should be documented in wiki pages, not implemented as workflows',
      'Rollback should automatically trigger on every deployment failure'
    ],
    correctAnswer: ['Rollback should be a dedicated workflow (rollback.yml) triggered manually via workflow_dispatch', 'Rollback workflows should accept version inputs to specify which version to rollback to'],
    explanation: 'Production-grade rollback should be: (1) A dedicated workflow (rollback.yml) that can be manually triggered via workflow_dispatch, and (2) Accept version inputs so operators can specify exactly which version to rollback to. This makes rollback a first-class operation, not just documentation. The workflow should be simple but reliable—when deploy fails, operators can go to Actions tab, select Rollback workflow, enter the version, and click Run.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['rollback', 'workflow-dispatch', 'production-safety']
  },
  {
    id: 'gha-p9-7',
    question: 'What are the key principles for production-grade CI/CD discipline mentioned in the article?',
    type: 'multiple-choice' as const,
    options: [
      'Workflow is just a tool, but discipline is the operating system',
      'YAML can be rewritten, but traceability and consistency must be preserved through engineering culture',
      'Automation helps avoid repeating old mistakes, but it doesn\'t create maturity by itself',
      'Complex workflows are more important than discipline'
    ],
    correctAnswer: ['Workflow is just a tool, but discipline is the operating system', 'YAML can be rewritten, but traceability and consistency must be preserved through engineering culture', 'Automation helps avoid repeating old mistakes, but it doesn\'t create maturity by itself'],
    explanation: 'The key principles are: (1) Workflow is just a tool, but discipline is the operating system - the mindset matters more than the YAML, (2) YAML can be rewritten, but traceability and consistency must be preserved through engineering culture - technical practices must be maintained culturally, and (3) Automation helps avoid repeating old mistakes, but doesn\'t create maturity by itself - automation is a tool, not a solution. To be truly "production-grade," you need operational discipline, not just complex workflows.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['discipline', 'principles', 'engineering-culture']
  },
  {
    id: 'gha-p9-8',
    question: 'What is the "CI/CD Law" checklist mentioned at the end of the article?',
    type: 'multiple-choice' as const,
    options: [
      'Every change must be traceable (who, when, which commit, which environment)',
      'Every environment must have clear boundaries (separate secrets, permissions, approvals)',
      'Every workflow must have an owner and logs',
      'Rollback must be a workflow, not just wiki documentation'
    ],
    correctAnswer: ['Every change must be traceable (who, when, which commit, which environment)', 'Every environment must have clear boundaries (separate secrets, permissions, approvals)', 'Every workflow must have an owner and logs', 'Rollback must be a workflow, not just wiki documentation'],
    explanation: 'The "CI/CD Law" checklist includes: (1) Every change must be traceable (who, when, which commit, which environment), (2) Every environment must have clear boundaries (separate secrets, permissions, approvals), (3) Every workflow must have an owner and logs, (4) Rollback must be a workflow, not just wiki documentation, and (5) Don\'t deploy when no one knows who is responsible. These "obvious" principles determine system reliability.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['checklist', 'principles', 'reliability', 'traceability']
  },
  {
    id: 'gha-p9-9',
    question: 'How does treating CI/CD as infrastructure improve observability and auditability?',
    type: 'multiple-choice' as const,
    options: [
      'The Deployments tab provides complete history: which version, which commit, who triggered, and when',
      'Post-mortem investigations that used to take hours can be completed in minutes by tracing workflow, commit, approver, and artifact',
      'Every job, artifact, and approval becomes a trace of transparency',
      'Observability requires complex external tools and cannot be achieved with GitHub Actions alone'
    ],
    correctAnswer: ['The Deployments tab provides complete history: which version, which commit, who triggered, and when', 'Post-mortem investigations that used to take hours can be completed in minutes by tracing workflow, commit, approver, and artifact', 'Every job, artifact, and approval becomes a trace of transparency'],
    explanation: 'Treating CI/CD as infrastructure enables: (1) Complete deployment history via Deployments tab (version, commit, trigger, timestamp), (2) Rapid post-mortem - investigations that took hours now take minutes by tracing workflow → commit → approver → artifact, and (3) Transparency - every job, artifact, and approval becomes a trace. This visibility enables continuous improvement. With transparency, you can improve.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['observability', 'auditability', 'transparency', 'post-mortem']
  },
  
  // Hard question (1)
  {
    id: 'gha-p9-10',
    question: 'You are designing a production-grade CI/CD system for an organization with 20+ services. The system must: (1) support multiple environments (staging, production), (2) ensure consistency across all services, (3) provide full traceability and auditability, (4) enable rapid rollback, and (5) maintain operational discipline. What is the most effective architecture?',
    type: 'single-choice' as const,
    options: [
      'Implement branch-based environment mapping (main=staging, production=prod), use reusable workflows in a centralized workflows-core repo for consistency, leverage GitHub environment primitive for secret scoping and approval gates, create dedicated rollback workflow with workflow_dispatch, integrate observability (Slack notifications, deployment history), and establish CI/CD "law" checklist (traceability, boundaries, ownership, rollback-as-workflow). Treat pipelines as infrastructure (version-controlled, reviewable, rollback-able) with operational discipline.',
      'Create unique workflows for each service, deploy everything from main branch, store rollback procedures in wiki, and rely on manual coordination',
      'Use only GitHub-hosted workflows without any standardization or observability',
      'Focus only on speed without considering traceability or discipline'
    ],
    correctAnswer: 'Implement branch-based environment mapping (main=staging, production=prod), use reusable workflows in a centralized workflows-core repo for consistency, leverage GitHub environment primitive for secret scoping and approval gates, create dedicated rollback workflow with workflow_dispatch, integrate observability (Slack notifications, deployment history), and establish CI/CD "law" checklist (traceability, boundaries, ownership, rollback-as-workflow). Treat pipelines as infrastructure (version-controlled, reviewable, rollback-able) with operational discipline.',
    explanation: 'The most effective architecture combines: (1) Branch-based environment mapping creates clear boundaries, (2) Reusable workflows in workflows-core ensure consistency and enable centralized updates, (3) GitHub environment primitive provides secret scoping, approval gates, and deployment history, (4) Dedicated rollback workflow makes recovery a first-class operation, (5) Observability integration (Slack, deployment history) provides transparency, and (6) CI/CD "law" checklist establishes operational discipline. The key insight is treating CI/CD as infrastructure (like Terraform/Kubernetes) with version control, reviewability, and rollback capability. This transforms pipelines from "scripts that run" into a "control plane for the entire release system" where every change is traceable, every environment has boundaries, and every workflow has ownership. The value of production-grade CI/CD is not running faster, but running correctly and reliably.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['comprehensive-architecture', 'production-grade', 'branching', 'reusable-workflows', 'environment', 'rollback', 'observability', 'discipline', 'infrastructure-mindset', 'system-design', 'advanced']
  }
]

// Encrypt the answers
const encryptedQuestions = questions.map(q => ({
  ...q,
  correctAnswer: encryptAnswerAdvanced(q.correctAnswer, q.id)
}))

export function GitHubActionsPart9Quiz() {
  return (
    <SimpleQuiz
      title="GitHub Actions Part 9: Production-Grade CI/CD Blueprint Quiz"
      description="Test your understanding of treating CI/CD as infrastructure, branch-based environment promotion, reusable workflows, compliance checks, audit and observability, rollback strategies, and production-grade CI/CD discipline. Based on the concepts covered in Part 9."
      timeLimit={15}
      passingScore={70}
      allowRetake={true}
      showCorrectAnswers={true}
      questions={encryptedQuestions}
    />
  )
}

