"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export function CourseTest({ questions, onComplete }: { questions: Question[], onComplete: (score: number) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQ = questions[currentIndex];

  function handleOptionSelect(idx: number) {
    if (showAnswer) return;
    setSelectedOption(idx);
  }

  function handleCheck() {
    if (selectedOption === null) return;
    setShowAnswer(true);
    if (selectedOption === currentQ.correctAnswer) {
      setScore(s => s + 1);
    }
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setCompleted(true);
      onComplete(score + (selectedOption === currentQ.correctAnswer ? 0 : 0)); // Score already updated
    }
  }

  if (completed) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-center">Test Completed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-4xl font-bold text-primary">
            {score} / {questions.length}
          </div>
          <p className="text-muted-foreground">
            {score === questions.length ? "Perfect score! You've mastered this course." : 
             score > questions.length / 2 ? "Good job! Keep practicing." : "Review the course material and try again."}
          </p>
          <Button onClick={() => {
            setCompleted(false);
            setCurrentIndex(0);
            setScore(0);
            setSelectedOption(null);
            setShowAnswer(false);
          }}>
            <RotateCcw className="mr-2 h-4 w-4" /> Retry Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Final Course Test</span>
          <span className="text-sm font-normal text-muted-foreground">Question {currentIndex + 1} of {questions.length}</span>
        </CardTitle>
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-2">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }} 
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium">{currentQ.question}</div>
        
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let variant = "outline";
            let icon = null;
            
            if (showAnswer) {
              if (idx === currentQ.correctAnswer) {
                variant = "default"; // Green-ish usually, but default is primary
                icon = <CheckCircle className="ml-auto h-4 w-4 text-green-500" />;
              } else if (idx === selectedOption) {
                variant = "destructive";
                icon = <XCircle className="ml-auto h-4 w-4" />;
              }
            } else if (selectedOption === idx) {
              variant = "secondary";
            }

            return (
              <div 
                key={idx}
                className={`
                  flex items-center p-4 rounded-lg border cursor-pointer transition-colors
                  ${showAnswer && idx === currentQ.correctAnswer ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""}
                  ${showAnswer && idx === selectedOption && idx !== currentQ.correctAnswer ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""}
                  ${!showAnswer && selectedOption === idx ? "border-primary bg-primary/5" : "hover:bg-accent"}
                `}
                onClick={() => handleOptionSelect(idx)}
              >
                <div className={`
                  w-6 h-6 rounded-full border flex items-center justify-center mr-3 text-sm
                  ${showAnswer && idx === currentQ.correctAnswer ? "bg-green-500 text-white border-green-500" : ""}
                  ${showAnswer && idx === selectedOption && idx !== currentQ.correctAnswer ? "bg-red-500 text-white border-red-500" : ""}
                  ${!showAnswer && selectedOption === idx ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground"}
                `}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="flex-1">{opt}</span>
                {icon}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4">
          {!showAnswer ? (
            <Button onClick={handleCheck} disabled={selectedOption === null}>
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentIndex < questions.length - 1 ? "Next Question" : "Finish Test"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
