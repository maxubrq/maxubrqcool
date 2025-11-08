'use client'

import { useCallback, useMemo, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'


// Custom node styles following the design system
const nodeStyles = {
  default: 'bg-white border-2 border-gray-900 shadow-sm',
  source: 'bg-white border-2 border-blue-600 shadow-sm',
  process: 'bg-white border-2 border-gray-900 shadow-sm',
  decision: 'bg-yellow-50 border-2 border-yellow-600 shadow-sm',
  success: 'bg-green-50 border-2 border-green-600 shadow-sm',
  error: 'bg-red-50 border-2 border-red-600 shadow-sm',
  parallel: 'bg-purple-50 border-2 border-purple-600 shadow-sm',
}

// Custom Node Component
function CustomNode({ data, selected }: { data: any; selected: boolean }) {
  const nodeType = data.type || 'default'
  const styleClass = nodeStyles[nodeType as keyof typeof nodeStyles] || nodeStyles.default

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-sm min-w-[160px] transition-all duration-200',
        styleClass,
        selected && 'ring-2 ring-blue-500 ring-offset-2'
      )}
    >
      <div className="flex flex-col gap-1">
        {data.label && (
          <div className="font-bold text-sm tracking-tight text-gray-900 uppercase">
            {data.label}
          </div>
        )}
        {data.description && (
          <div className="text-xs text-gray-600 font-light leading-relaxed">
            {data.description}
          </div>
        )}
        {data.badge && (
          <Badge variant="secondary" className="mt-2 w-fit text-xs">
            {data.badge}
          </Badge>
        )}
      </div>
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

interface ReactFlowDemoProps {
  height?: string
  showControls?: boolean
  showMinimap?: boolean
}

// Component that loads ReactFlow and only renders the flow when ready
function ReactFlowContent({
  height,
  showControls,
  showMinimap,
}: ReactFlowDemoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [ReactFlowModule, setReactFlowModule] = useState<any>(null)

  useEffect(() => {
    // Import ReactFlow CSS dynamically
    if (typeof window !== 'undefined') {
      // Use require to avoid TypeScript errors with CSS imports
      try {
        require('reactflow/dist/style.css')
      } catch (e) {
        // CSS import failed, but that's okay
      }
    }
    import('reactflow').then((mod) => {
      setReactFlowModule(mod)
      setIsLoaded(true)
    })
  }, [])

  if (!isLoaded || !ReactFlowModule) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px] bg-gray-50">
        <div className="text-sm text-gray-600">Loading flow diagram...</div>
      </div>
    )
  }

  return (
    <ReactFlowInner
      ReactFlow={ReactFlowModule.default}
      useNodesState={ReactFlowModule.useNodesState}
      useEdgesState={ReactFlowModule.useEdgesState}
      addEdge={ReactFlowModule.addEdge}
      MarkerType={ReactFlowModule.MarkerType}
      Background={ReactFlowModule.Background}
      Controls={ReactFlowModule.Controls}
      MiniMap={ReactFlowModule.MiniMap}
      height={height || '600px'}
      showControls={showControls ?? true}
      showMinimap={showMinimap ?? true}
    />
  )
}

// Internal component that uses ReactFlow hooks - only rendered when ReactFlow is loaded
function ReactFlowInner({
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Background,
  Controls,
  MiniMap,
  height,
  showControls,
  showMinimap,
}: {
  ReactFlow: any
  useNodesState: any
  useEdgesState: any
  addEdge: any
  MarkerType: any
  Background: any
  Controls: any
  MiniMap: any
  height: string
  showControls: boolean
  showMinimap: boolean
}) {
  // Edge options with MarkerType
  const edgeOptions = useMemo(() => ({
    type: 'smoothstep' as const,
    animated: true,
    style: { strokeWidth: 2 },
    markerEnd: MarkerType ? {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    } : undefined,
  }), [MarkerType])

  // Complex CI/CD Pipeline Flow
  const initialNodes = useMemo(
    () => [
      // Source nodes
      {
        id: 'source',
        type: 'custom',
        position: { x: 100, y: 100 },
        data: {
          type: 'source',
          label: 'Source',
          description: 'Git Repository',
          badge: 'Trigger',
        },
      },
      // Branch nodes
      {
        id: 'branch-protection',
        type: 'custom',
        position: { x: 300, y: 100 },
        data: {
          type: 'decision',
          label: 'Branch Protection',
          description: 'Check branch rules',
          badge: 'Gate',
        },
      },
      // Parallel build stages
      {
        id: 'lint',
        type: 'custom',
        position: { x: 500, y: 0 },
        data: {
          type: 'process',
          label: 'Lint',
          description: 'ESLint + Prettier',
          badge: 'Quality',
        },
      },
      {
        id: 'type-check',
        type: 'custom',
        position: { x: 500, y: 100 },
        data: {
          type: 'process',
          label: 'Type Check',
          description: 'TypeScript validation',
          badge: 'Quality',
        },
      },
      {
        id: 'unit-tests',
        type: 'custom',
        position: { x: 500, y: 200 },
        data: {
          type: 'process',
          label: 'Unit Tests',
          description: 'Vitest suite',
          badge: 'Quality',
        },
      },
      {
        id: 'integration-tests',
        type: 'custom',
        position: { x: 500, y: 300 },
        data: {
          type: 'process',
          label: 'Integration Tests',
          description: 'API & DB tests',
          badge: 'Quality',
        },
      },
      // Merge point
      {
        id: 'merge-quality',
        type: 'custom',
        position: { x: 700, y: 150 },
        data: {
          type: 'parallel',
          label: 'Merge Results',
          description: 'All checks passed',
          badge: 'Sync',
        },
      },
      // Build stage
      {
        id: 'build',
        type: 'custom',
        position: { x: 900, y: 150 },
        data: {
          type: 'process',
          label: 'Build',
          description: 'Next.js production build',
          badge: 'Compile',
        },
      },
      // Security scan
      {
        id: 'security-scan',
        type: 'custom',
        position: { x: 1100, y: 150 },
        data: {
          type: 'process',
          label: 'Security Scan',
          description: 'Dependency audit',
          badge: 'Security',
        },
      },
      // Decision point
      {
        id: 'deploy-decision',
        type: 'custom',
        position: { x: 1300, y: 150 },
        data: {
          type: 'decision',
          label: 'Deploy Decision',
          description: 'Environment check',
          badge: 'Gate',
        },
      },
      // Parallel deployment
      {
        id: 'deploy-staging',
        type: 'custom',
        position: { x: 1500, y: 50 },
        data: {
          type: 'process',
          label: 'Deploy Staging',
          description: 'Vercel staging',
          badge: 'Deploy',
        },
      },
      {
        id: 'e2e-tests',
        type: 'custom',
        position: { x: 1700, y: 50 },
        data: {
          type: 'process',
          label: 'E2E Tests',
          description: 'Playwright suite',
          badge: 'Test',
        },
      },
      {
        id: 'staging-approval',
        type: 'custom',
        position: { x: 1900, y: 50 },
        data: {
          type: 'decision',
          label: 'Staging Approval',
          description: 'Manual review',
          badge: 'Gate',
        },
      },
      {
        id: 'deploy-production',
        type: 'custom',
        position: { x: 1500, y: 250 },
        data: {
          type: 'process',
          label: 'Deploy Production',
          description: 'Vercel production',
          badge: 'Deploy',
        },
      },
      // Success nodes
      {
        id: 'production-success',
        type: 'custom',
        position: { x: 1700, y: 250 },
        data: {
          type: 'success',
          label: 'Production Live',
          description: 'Deployment complete',
          badge: 'Success',
        },
      },
      {
        id: 'monitoring',
        type: 'custom',
        position: { x: 1900, y: 250 },
        data: {
          type: 'process',
          label: 'Monitoring',
          description: 'Observability setup',
          badge: 'Ops',
        },
      },
      // Error path
      {
        id: 'rollback',
        type: 'custom',
        position: { x: 1300, y: 350 },
        data: {
          type: 'error',
          label: 'Rollback',
          description: 'Revert changes',
          badge: 'Error',
        },
      },
    ],
    []
  )

  const initialEdges = useMemo(
    () => [
      // Source to branch protection
      {
        id: 'e1',
        source: 'source',
        target: 'branch-protection',
        ...edgeOptions,
      },
      // Branch protection to parallel quality checks
      {
        id: 'e2',
        source: 'branch-protection',
        target: 'lint',
        ...edgeOptions,
      },
      {
        id: 'e3',
        source: 'branch-protection',
        target: 'type-check',
        ...edgeOptions,
      },
      {
        id: 'e4',
        source: 'branch-protection',
        target: 'unit-tests',
        ...edgeOptions,
      },
      {
        id: 'e5',
        source: 'branch-protection',
        target: 'integration-tests',
        ...edgeOptions,
      },
      // Quality checks to merge
      {
        id: 'e6',
        source: 'lint',
        target: 'merge-quality',
        ...edgeOptions,
      },
      {
        id: 'e7',
        source: 'type-check',
        target: 'merge-quality',
        ...edgeOptions,
      },
      {
        id: 'e8',
        source: 'unit-tests',
        target: 'merge-quality',
        ...edgeOptions,
      },
      {
        id: 'e9',
        source: 'integration-tests',
        target: 'merge-quality',
        ...edgeOptions,
      },
      // Merge to build
      {
        id: 'e10',
        source: 'merge-quality',
        target: 'build',
        ...edgeOptions,
      },
      // Build to security
      {
        id: 'e11',
        source: 'build',
        target: 'security-scan',
        ...edgeOptions,
      },
      // Security to decision
      {
        id: 'e12',
        source: 'security-scan',
        target: 'deploy-decision',
        ...edgeOptions,
      },
      // Decision branches
      {
        id: 'e13',
        source: 'deploy-decision',
        target: 'deploy-staging',
        label: 'Staging',
        ...edgeOptions,
      },
      {
        id: 'e14',
        source: 'deploy-decision',
        target: 'deploy-production',
        label: 'Production',
        ...edgeOptions,
      },
      {
        id: 'e15',
        source: 'deploy-decision',
        target: 'rollback',
        label: 'Failed',
        ...edgeOptions,
        style: { strokeWidth: 2, stroke: '#ef4444' },
      },
      // Staging flow
      {
        id: 'e16',
        source: 'deploy-staging',
        target: 'e2e-tests',
        ...edgeOptions,
      },
      {
        id: 'e17',
        source: 'e2e-tests',
        target: 'staging-approval',
        ...edgeOptions,
      },
      {
        id: 'e18',
        source: 'staging-approval',
        target: 'deploy-production',
        ...edgeOptions,
      },
      // Production flow
      {
        id: 'e19',
        source: 'deploy-production',
        target: 'production-success',
        ...edgeOptions,
      },
      {
        id: 'e20',
        source: 'production-success',
        target: 'monitoring',
        ...edgeOptions,
      },
    ],
    [edgeOptions]
  )

  // Always call hooks unconditionally (ReactFlow is guaranteed to be loaded when this component renders)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds: any) => addEdge(params, eds))
    },
    [addEdge, setEdges]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.1}
      maxZoom={2}
      defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
    >
      {Background && <Background color="#e5e7eb" gap={16} />}
      {showControls && Controls && <Controls />}
      {showMinimap && MiniMap && <MiniMap nodeColor="#000" maskColor="rgba(0,0,0,0.1)" />}
    </ReactFlow>
  )
}

export function ReactFlowDemo({
  height = '600px',
  showControls = true,
  showMinimap = true,
}: ReactFlowDemoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="w-full my-8"
    >
      <Card className="border-2 border-gray-900 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-black tracking-tighter uppercase">
            CI/CD Pipeline Flow
          </CardTitle>
          <CardDescription className="text-sm font-light tracking-wider">
            Interactive visualization of a complex continuous integration and deployment workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ height, width: '100%' }} className="bg-gray-50">
            <ReactFlowContent
              height={height}
              showControls={showControls}
              showMinimap={showMinimap}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Simplified version for smaller flows
export function SimpleFlowDemo({ height = '400px' }: { height?: string }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [ReactFlowModule, setReactFlowModule] = useState<any>(null)

  useEffect(() => {
    // Import ReactFlow CSS dynamically
    if (typeof window !== 'undefined') {
      // Use require to avoid TypeScript errors with CSS imports
      try {
        require('reactflow/dist/style.css')
      } catch (e) {
        // CSS import failed, but that's okay
      }
    }
    import('reactflow').then((mod) => {
      setReactFlowModule(mod)
      setIsLoaded(true)
    })
  }, [])

  if (!isLoaded || !ReactFlowModule) {
    return (
      <div style={{ height, width: '100%' }} className="bg-gray-50 border-2 border-gray-900 rounded-sm flex items-center justify-center">
        <div className="text-sm text-gray-600">Loading flow diagram...</div>
      </div>
    )
  }

  return (
    <SimpleFlowInner
      ReactFlow={ReactFlowModule.default}
      useNodesState={ReactFlowModule.useNodesState}
      useEdgesState={ReactFlowModule.useEdgesState}
      addEdge={ReactFlowModule.addEdge}
      MarkerType={ReactFlowModule.MarkerType}
      Background={ReactFlowModule.Background}
      Controls={ReactFlowModule.Controls}
      height={height}
    />
  )
}

// Internal component for simple flow that uses ReactFlow hooks
function SimpleFlowInner({
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Background,
  Controls,
  height,
}: {
  ReactFlow: any
  useNodesState: any
  useEdgesState: any
  addEdge: any
  MarkerType: any
  Background: any
  Controls: any
  height: string
}) {

  const edgeOptions = useMemo(() => ({
    type: 'smoothstep' as const,
    animated: true,
    style: { strokeWidth: 2 },
    markerEnd: MarkerType ? {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    } : undefined,
  }), [MarkerType])

  const initialNodes = useMemo(
    () => [
      {
        id: 'start',
        type: 'custom',
        position: { x: 100, y: 150 },
        data: {
          type: 'source',
          label: 'Start',
          description: 'Process begins',
        },
      },
      {
        id: 'process1',
        type: 'custom',
        position: { x: 300, y: 150 },
        data: {
          type: 'process',
          label: 'Process',
          description: 'Execute task',
        },
      },
      {
        id: 'decision',
        type: 'custom',
        position: { x: 500, y: 150 },
        data: {
          type: 'decision',
          label: 'Decision',
          description: 'Check condition',
        },
      },
      {
        id: 'success',
        type: 'custom',
        position: { x: 700, y: 50 },
        data: {
          type: 'success',
          label: 'Success',
          description: 'Task complete',
        },
      },
      {
        id: 'error',
        type: 'custom',
        position: { x: 700, y: 250 },
        data: {
          type: 'error',
          label: 'Error',
          description: 'Handle failure',
        },
      },
    ],
    []
  )

  const initialEdges = useMemo(
    () => [
      {
        id: 'e1',
        source: 'start',
        target: 'process1',
        ...edgeOptions,
      },
      {
        id: 'e2',
        source: 'process1',
        target: 'decision',
        ...edgeOptions,
      },
      {
        id: 'e3',
        source: 'decision',
        target: 'success',
        label: 'Yes',
        ...edgeOptions,
      },
      {
        id: 'e4',
        source: 'decision',
        target: 'error',
        label: 'No',
        ...edgeOptions,
        style: { strokeWidth: 2, stroke: '#ef4444' },
      },
    ],
    [edgeOptions]
  )

  // Always call hooks unconditionally (ReactFlow is guaranteed to be loaded when this component renders)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds: any) => addEdge(params, eds))
    },
    [addEdge, setEdges]
  )

  return (
    <div style={{ height, width: '100%' }} className="bg-gray-50 border-2 border-gray-900 rounded-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        {Background && <Background color="#e5e7eb" gap={16} />}
        {Controls && <Controls />}
      </ReactFlow>
    </div>
  )
}
