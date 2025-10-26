'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { QuizModel } from '@/lib/quiz/types';
import { QuizPlayer } from './QuizPlayer';
import { QuizBuilder } from './QuizBuilder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Play, Code } from 'lucide-react';

interface QuizProps {
  id: string;
  title: string;
  description?: string;
  questions: QuizModel['questions'];
  shuffle?: boolean;
  timeLimitSec?: number;
  mode?: 'practice' | 'exam';
  showBuilder?: boolean;
  className?: string;
}

export function Quiz({
  id,
  title,
  description,
  questions,
  shuffle = false,
  timeLimitSec,
  mode = 'practice',
  showBuilder = false,
  className
}: QuizProps) {
  const [activeTab, setActiveTab] = useState('play');
  const [quizData, setQuizData] = useState<QuizModel>({
    id,
    title,
    description,
    questions,
    shuffle,
    timeLimitSec,
    version: '1.0.0'
  });

  const handleQuizComplete = useCallback((result: any) => {
    console.log('Quiz completed:', result);
    // Analytics and result handling would go here
  }, []);

  const handleAnalytics = useCallback((event: string, data?: any) => {
    console.log('Analytics event:', event, data);
    // Analytics tracking would go here
  }, []);

  const handleSave = useCallback((quiz: QuizModel) => {
    setQuizData(quiz);
    console.log('Quiz saved:', quiz);
  }, []);

  const handlePreview = useCallback((quiz: QuizModel) => {
    setQuizData(quiz);
    setActiveTab('play');
  }, []);

  const handleExport = useCallback((quiz: QuizModel, format: 'mdx' | 'json') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(quiz, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${quiz.id}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'mdx') {
      // Generate MDX code
      const questionsCode = quiz.questions.map(q => {
        const choicesCode = q.choices?.map(c => 
          `{ id: '${c.id}', label: '${c.label}', isCorrect: ${c.isCorrect}${c.hint ? `, hint: '${c.hint}'` : ''} }`
        ).join(',\n        ');
        
        return `    { 
      id: '${q.id}', 
      type: '${q.type}', 
      prompt: '${q.prompt}',
      ${q.choices ? `choices: [\n        ${choicesCode}\n      ],` : ''}
      ${q.answerPattern ? `answerPattern: '${q.answerPattern}',` : ''}
      ${q.explanation ? `explanation: '${q.explanation}',` : ''}
      ${q.points && q.points !== 1 ? `points: ${q.points}` : ''}
    }`;
      }).join(',\n');

      const mdxCode = `<Quiz
  id="${quiz.id}"
  title="${quiz.title}"
  ${quiz.description ? `description="${quiz.description}"` : ''}
  ${quiz.shuffle ? 'shuffle' : ''}
  ${quiz.timeLimitSec ? `timeLimitSec={${quiz.timeLimitSec}}` : ''}
  questions={[
${questionsCode}
  ]}
/>`;

      navigator.clipboard.writeText(mdxCode);
      alert('MDX code copied to clipboard!');
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="play" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Play
          </TabsTrigger>
          {showBuilder && (
            <TabsTrigger value="build" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Build
            </TabsTrigger>
          )}
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="play" className="mt-6">
          <QuizPlayer
            quiz={quizData}
            mode={mode}
            onComplete={handleQuizComplete}
            onAnalytics={handleAnalytics}
          />
        </TabsContent>

        {showBuilder && (
          <TabsContent value="build" className="mt-6">
            <QuizBuilder
              initialQuiz={quizData}
              onSave={handleSave}
              onPreview={handlePreview}
              onExport={handleExport}
            />
          </TabsContent>
        )}

        <TabsContent value="code" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleExport(quizData, 'json')}
                  >
                    Export JSON
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport(quizData, 'mdx')}
                  >
                    Copy MDX
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">JSON Format:</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(quizData, null, 2)}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">MDX Format:</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`<Quiz
  id="${quizData.id}"
  title="${quizData.title}"
  ${quizData.description ? `description="${quizData.description}"` : ''}
  ${quizData.shuffle ? 'shuffle' : ''}
  ${quizData.timeLimitSec ? `timeLimitSec={${quizData.timeLimitSec}}` : ''}
  questions={[
    // ... questions array
  ]}
/>`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
