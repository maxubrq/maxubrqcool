import React from 'react'
import { AlertTriangle, Info, CheckCircle, XCircle, Lightbulb, FileText } from 'lucide-react'

interface AlertProps {
  type: 'info' | 'warning' | 'error' | 'success' | 'tip' | 'note'
  title?: string
  children: React.ReactNode
  className?: string
}

const alertConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-900 dark:text-blue-100',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-800 dark:text-blue-200'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-900 dark:text-yellow-100',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    titleColor: 'text-yellow-800 dark:text-yellow-200'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    borderColor: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-900 dark:text-red-100',
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-800 dark:text-red-200'
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-900 dark:text-green-100',
    iconColor: 'text-green-600 dark:text-green-400',
    titleColor: 'text-green-800 dark:text-green-200'
  },
  tip: {
    icon: Lightbulb,
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-900 dark:text-purple-100',
    iconColor: 'text-purple-600 dark:text-purple-400',
    titleColor: 'text-purple-800 dark:text-purple-200'
  },
  note: {
    icon: FileText,
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-700',
    textColor: 'text-gray-900 dark:text-gray-100',
    iconColor: 'text-gray-600 dark:text-gray-400',
    titleColor: 'text-gray-800 dark:text-gray-200'
  }
}

const defaultTitles = {
  info: 'Information',
  warning: 'Warning',
  error: 'Error',
  success: 'Success',
  tip: 'Tip',
  note: 'Note'
}

export function Alert({ type, title, children, className = '' }: AlertProps) {
  const config = alertConfig[type]
  const Icon = config.icon
  const displayTitle = title || defaultTitles[type]

  return (
    <div className={`relative my-8 pl-4 py-3 border-l-2 ${config.borderColor} ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-4 w-4 mt-0.5 ${config.iconColor}`} />
        <div className="flex-1 space-y-2">
          <h4 className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground">
            {displayTitle}
          </h4>
          <div className="text-sm leading-7 text-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Convenience components for each alert type
export function InfoAlert({ title, children, className }: Omit<AlertProps, 'type'>) {
  return <Alert type="info" title={title} className={className}>{children}</Alert>
}

export function WarningAlert({ title, children, className }: Omit<AlertProps, 'type'>) {
  return <Alert type="warning" title={title} className={className}>{children}</Alert>
}

export function ErrorAlert({ title, children, className }: Omit<AlertProps, 'type'>) {
  return <Alert type="error" title={title} className={className}>{children}</Alert>
}

export function SuccessAlert({ title, children, className }: Omit<AlertProps, 'type'>) {
  return <Alert type="success" title={title} className={className}>{children}</Alert>
}

export function TipAlert({ title, children, className }: Omit<AlertProps, 'type'>) {
  return <Alert type="tip" title={title} className={className}>{children}</Alert>
}

export function NoteAlert({ title, children, className }: Omit<AlertProps, 'type'>) {
  return <Alert type="note" title={title} className={className}>{children}</Alert>
}
