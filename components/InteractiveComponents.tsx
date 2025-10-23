'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

// Interactive Counter Component
export function Counter({ initialValue = 0 }: { initialValue?: number }) {
  const [count, setCount] = useState(initialValue)

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="text-center">Interactive Counter</CardTitle>
        <CardDescription className="text-center">Click the buttons to change the value</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-4xl font-bold text-primary mb-6">{count}</div>
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => setCount(count - 1)}
            variant="destructive"
            size="sm"
          >
            -1
          </Button>
          <Button
            onClick={() => setCount(0)}
            variant="outline"
            size="sm"
          >
            Reset
          </Button>
          <Button
            onClick={() => setCount(count + 1)}
            variant="default"
            size="sm"
          >
            +1
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Interactive Quiz Component
export function Quiz({ 
  question, 
  options, 
  correctAnswer 
}: { 
  question: string
  options: string[]
  correctAnswer: number 
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSubmit = () => {
    setShowResult(true)
  }

  const isCorrect = selectedAnswer === correctAnswer

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Quiz</Badge>
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {options.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-sm border hover:bg-muted/50 transition-colors">
              <input
                type="radio"
                name="quiz"
                value={index}
                checked={selectedAnswer === index}
                onChange={() => setSelectedAnswer(index)}
                className="h-4 w-4 text-primary"
              />
              <span className="flex-1">{option}</span>
            </label>
          ))}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className="w-full"
        >
          Submit Answer
        </Button>
        {showResult && (
          <div className={`p-4 rounded-sm border ${
            isCorrect 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {isCorrect ? '🎉' : '❌'}
              <span className="font-medium">
                {isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again!'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Interactive Code Playground
export function CodePlayground({ 
  initialCode = 'console.log("Hello, World!")',
  language = 'javascript'
}: { 
  initialCode?: string
  language?: string 
}) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')

  const runCode = () => {
    try {
      // This is a simplified example - in a real app you'd want proper sandboxing
      if (language === 'javascript') {
        const result = eval(code)
        setOutput(String(result))
      }
    } catch (error) {
      setOutput(`Error: ${error}`)
    }
  }

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">Code Playground</Badge>
          <Badge variant="secondary">{language}</Badge>
        </CardTitle>
        <CardDescription>Write and run code directly in your browser</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Code Editor</label>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-sm min-h-[120px]"
            placeholder="Enter your code here..."
          />
        </div>
        <Button onClick={runCode} className="w-full">
          Run Code
        </Button>
        {output && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Output</label>
            <div className="bg-muted p-4 rounded-sm">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Interactive Tabs Component
export function InteractiveTabs({ 
  tabs 
}: { 
  tabs: { label: string; content: React.ReactNode }[] 
}) {
  return (
    <div className="my-6">
      <Tabs defaultValue="0" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
          {tabs.map((tab, index) => (
            <TabsTrigger key={index} value={index.toString()}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab, index) => (
          <TabsContent key={index} value={index.toString()} className="mt-4">
            <Card>
              <CardContent className="p-6">
                {tab.content}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

// Interactive Progress Bar
export function ProgressBar({ 
  steps, 
  currentStep = 0 
}: { 
  steps: string[]
  currentStep?: number 
}) {
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">Progress</Badge>
          Step {currentStep + 1} of {steps.length}
        </CardTitle>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  index <= currentStep
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-sm ${
                index <= currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}>
                {step}
              </span>
              {index <= currentStep && (
                <Badge variant="secondary" className="ml-auto">
                  {index === currentStep ? 'Current' : 'Completed'}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
