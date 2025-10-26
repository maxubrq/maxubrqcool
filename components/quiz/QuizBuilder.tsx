'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, GripVertical, Eye, Save, Copy, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QuizModel, QuizQuestion, QuizChoice } from '@/lib/quiz/types';
import { ZQuizModel } from '@/lib/quiz/schemas';
import { cn } from '@/lib/utils';

interface QuizBuilderProps {
  initialQuiz?: QuizModel;
  onSave?: (quiz: QuizModel) => void;
  onPreview?: (quiz: QuizModel) => void;
  onExport?: (quiz: QuizModel, format: 'mdx' | 'json') => void;
  className?: string;
}

export function QuizBuilder({ 
  initialQuiz, 
  onSave, 
  onPreview, 
  onExport,
  className 
}: QuizBuilderProps) {
  const [quiz, setQuiz] = useState<QuizModel>(
    initialQuiz || {
      id: '',
      title: '',
      description: '',
      questions: [],
      shuffle: false,
      timeLimitSec: undefined,
      version: '1.0.0'
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('edit');

  const validateQuiz = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!quiz.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (quiz.questions.length === 0) {
      newErrors.questions = 'At least one question is required';
    }
    
    quiz.questions.forEach((question, index) => {
      if (!question.prompt.trim()) {
        newErrors[`question-${index}-prompt`] = 'Question prompt is required';
      }
      
      if (question.type !== 'input' && (!question.choices || question.choices.length === 0)) {
        newErrors[`question-${index}-choices`] = 'At least one choice is required';
      }
      
      if (question.type === 'input' && !question.answerPattern) {
        newErrors[`question-${index}-pattern`] = 'Answer pattern is required for input questions';
      }
      
      if (question.type !== 'input' && question.choices) {
        const hasCorrect = question.choices.some(c => c.isCorrect);
        if (!hasCorrect) {
          newErrors[`question-${index}-correct`] = 'At least one choice must be marked as correct';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [quiz]);

  const handleQuizChange = useCallback((updates: Partial<QuizModel>) => {
    setQuiz(prev => ({ ...prev, ...updates }));
    setErrors({});
  }, []);

  const handleAddQuestion = useCallback(() => {
    const newQuestion: QuizQuestion = {
      id: `q${Date.now()}`,
      type: 'single',
      prompt: '',
      choices: [
        { id: 'a', label: '', isCorrect: false },
        { id: 'b', label: '', isCorrect: false }
      ],
      points: 1
    };
    
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  }, []);

  const handleRemoveQuestion = useCallback((questionId: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  }, []);

  const handleQuestionChange = useCallback((questionId: string, updates: Partial<QuizQuestion>) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  }, []);

  const handleAddChoice = useCallback((questionId: string) => {
    const question = quiz.questions.find(q => q.id === questionId);
    if (!question) return;

    const newChoice: QuizChoice = {
      id: String.fromCharCode(97 + (question.choices?.length || 0)),
      label: '',
      isCorrect: false
    };

    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, choices: [...(q.choices || []), newChoice] }
          : q
      )
    }));
  }, [quiz.questions]);

  const handleRemoveChoice = useCallback((questionId: string, choiceId: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, choices: (q.choices || []).filter(c => c.id !== choiceId) }
          : q
      )
    }));
  }, []);

  const handleChoiceChange = useCallback((questionId: string, choiceId: string, updates: Partial<QuizChoice>) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              choices: (q.choices || []).map(c => 
                c.id === choiceId ? { ...c, ...updates } : c
              )
            }
          : q
      )
    }));
  }, []);

  const handleSave = useCallback(() => {
    if (validateQuiz()) {
      onSave?.(quiz);
    }
  }, [quiz, validateQuiz, onSave]);

  const handlePreview = useCallback(() => {
    if (validateQuiz()) {
      onPreview?.(quiz);
    }
  }, [quiz, validateQuiz, onPreview]);

  const handleExport = useCallback((format: 'mdx' | 'json') => {
    if (validateQuiz()) {
      onExport?.(quiz, format);
    }
  }, [quiz, validateQuiz, onExport]);

  const generateMDX = useCallback((quiz: QuizModel) => {
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

    return `<Quiz
  id="${quiz.id}"
  title="${quiz.title}"
  ${quiz.description ? `description="${quiz.description}"` : ''}
  ${quiz.shuffle ? 'shuffle' : ''}
  ${quiz.timeLimitSec ? `timeLimitSec={${quiz.timeLimitSec}}` : ''}
  questions={[
${questionsCode}
  ]}
/>`;
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quiz Builder</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('json')}>
            <Copy className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button variant="outline" onClick={() => handleExport('mdx')}>
            <Copy className="w-4 h-4 mr-2" />
            Export MDX
          </Button>
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={hasErrors}>
            <Save className="w-4 h-4 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>

      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors before saving:
            <ul className="mt-2 list-disc list-inside">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          {/* Quiz Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={quiz.title}
                  onChange={(e) => handleQuizChange({ title: e.target.value })}
                  placeholder="Enter quiz title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={quiz.description || ''}
                  onChange={(e) => handleQuizChange({ description: e.target.value })}
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Limit (seconds)</label>
                  <Input
                    type="number"
                    value={quiz.timeLimitSec || ''}
                    onChange={(e) => handleQuizChange({ 
                      timeLimitSec: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shuffle Questions</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={quiz.shuffle}
                      onChange={(e) => handleQuizChange({ shuffle: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Randomize question order</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Questions ({quiz.questions.length})</CardTitle>
                <Button onClick={handleAddQuestion} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence>
                {quiz.questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{question.type}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveQuestion(question.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Question Type */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Question Type</label>
                        <select
                          value={question.type}
                          onChange={(e) => handleQuestionChange(question.id, { 
                            type: e.target.value as any,
                            choices: e.target.value === 'input' ? undefined : [
                              { id: 'a', label: '', isCorrect: false },
                              { id: 'b', label: '', isCorrect: false }
                            ]
                          })}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="single">Single Choice</option>
                          <option value="multiple">Multiple Choice</option>
                          <option value="truefalse">True/False</option>
                          <option value="input">Text Input</option>
                        </select>
                      </div>

                      {/* Question Prompt */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Question *</label>
                        <Textarea
                          value={question.prompt}
                          onChange={(e) => handleQuestionChange(question.id, { prompt: e.target.value })}
                          placeholder="Enter your question"
                          rows={2}
                          className={errors[`question-${index}-prompt`] ? 'border-red-500' : ''}
                        />
                        {errors[`question-${index}-prompt`] && (
                          <p className="text-sm text-red-500">{errors[`question-${index}-prompt`]}</p>
                        )}
                      </div>

                      {/* Choices for non-input questions */}
                      {question.type !== 'input' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Choices</label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddChoice(question.id)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Choice
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {question.choices?.map((choice, choiceIndex) => (
                              <div key={choice.id} className="flex items-center gap-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={choice.isCorrect}
                                    onChange={(e) => handleChoiceChange(question.id, choice.id, { 
                                      isCorrect: e.target.checked 
                                    })}
                                    className="rounded"
                                  />
                                  <Input
                                    value={choice.label}
                                    onChange={(e) => handleChoiceChange(question.id, choice.id, { 
                                      label: e.target.value 
                                    })}
                                    placeholder={`Choice ${String.fromCharCode(65 + choiceIndex)}`}
                                    className="flex-1"
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveChoice(question.id, choice.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          {errors[`question-${index}-choices`] && (
                            <p className="text-sm text-red-500">{errors[`question-${index}-choices`]}</p>
                          )}
                          {errors[`question-${index}-correct`] && (
                            <p className="text-sm text-red-500">{errors[`question-${index}-correct`]}</p>
                          )}
                        </div>
                      )}

                      {/* Answer Pattern for input questions */}
                      {question.type === 'input' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Answer Pattern (Regex) *</label>
                          <Input
                            value={question.answerPattern || ''}
                            onChange={(e) => handleQuestionChange(question.id, { answerPattern: e.target.value })}
                            placeholder="e.g., ^yes$|^y$"
                            className={errors[`question-${index}-pattern`] ? 'border-red-500' : ''}
                          />
                          {errors[`question-${index}-pattern`] && (
                            <p className="text-sm text-red-500">{errors[`question-${index}-pattern`]}</p>
                          )}
                        </div>
                      )}

                      {/* Explanation */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Explanation</label>
                        <Textarea
                          value={question.explanation || ''}
                          onChange={(e) => handleQuestionChange(question.id, { explanation: e.target.value })}
                          placeholder="Optional explanation for the answer"
                          rows={2}
                        />
                      </div>

                      {/* Points */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Points</label>
                        <Input
                          type="number"
                          value={question.points || 1}
                          onChange={(e) => handleQuestionChange(question.id, { 
                            points: parseInt(e.target.value) || 1 
                          })}
                          min="1"
                          className="w-20"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {quiz.questions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No questions yet. Click "Add Question" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{quiz.title}</h3>
                  {quiz.description && (
                    <p className="text-muted-foreground">{quiz.description}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {quiz.questions.length} questions
                    {quiz.timeLimitSec && ` • ${Math.floor(quiz.timeLimitSec / 60)}:${(quiz.timeLimitSec % 60).toString().padStart(2, '0')} time limit`}
                    {quiz.shuffle && ' • Shuffled'}
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  {quiz.questions.map((question, index) => (
                    <div key={question.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{question.type}</Badge>
                        <span className="text-sm font-medium">Question {index + 1}</span>
                        {question.points && question.points > 1 && (
                          <Badge variant="secondary">{question.points} points</Badge>
                        )}
                      </div>
                      <p className="text-sm">{question.prompt}</p>
                      {question.choices && (
                        <div className="space-y-1 ml-4">
                          {question.choices.map((choice, choiceIndex) => (
                            <div key={choice.id} className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">
                                {String.fromCharCode(65 + choiceIndex)}.
                              </span>
                              <span>{choice.label}</span>
                              {choice.isCorrect && (
                                <Badge variant="default" className="text-xs">Correct</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {question.explanation && (
                        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
