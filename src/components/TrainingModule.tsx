import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import type { User } from '../App';

interface TrainingModuleProps {
  user: User;
  onComplete: () => void;
}

interface TrainingSlide {
  title: string;
  content: string;
  image?: string;
  tips: string[];
}

const trainingSlides: TrainingSlide[] = [
  {
    title: "Welcome to Waste Segregation Training",
    content: "Learn the fundamentals of proper waste segregation to create a cleaner, healthier environment for everyone.",
    tips: [
      "This training takes approximately 10 minutes",
      "You'll receive a certificate upon completion",
      "Proper segregation helps reduce pollution"
    ]
  },
  {
    title: "Types of Waste",
    content: "Understanding different categories of waste is the first step to proper segregation.",
    tips: [
      "Wet waste: Food scraps, vegetable peels, tea bags",
      "Dry waste: Paper, plastic, metal, glass",
      "Hazardous waste: Batteries, medicines, chemicals"
    ]
  },
  {
    title: "The 3-Bin System",
    content: "Use three different colored bins to separate your household waste effectively.",
    tips: [
      "Green bin: Wet/Organic waste",
      "Blue bin: Dry recyclable waste",
      "Red bin: Hazardous waste"
    ]
  },
  {
    title: "Best Practices",
    content: "Follow these guidelines to ensure maximum efficiency in waste processing.",
    tips: [
      "Clean containers before disposal",
      "Keep wet and dry waste separate",
      "Store hazardous waste safely",
      "Compost organic waste when possible"
    ]
  },
  {
    title: "Benefits of Proper Segregation",
    content: "Your efforts in waste segregation have far-reaching positive impacts.",
    tips: [
      "Reduces landfill burden",
      "Enables effective recycling",
      "Prevents environmental pollution",
      "Creates employment opportunities"
    ]
  }
];

const quizQuestions = [
  {
    question: "Which bin should you use for food scraps and vegetable peels?",
    options: ["Green bin", "Blue bin", "Red bin", "Any bin"],
    correct: 0
  },
  {
    question: "What type of waste belongs in the blue bin?",
    options: ["Food waste", "Dry recyclable waste", "Hazardous waste", "Garden waste"],
    correct: 1
  },
  {
    question: "Which of these is considered hazardous waste?",
    options: ["Newspaper", "Banana peel", "Old batteries", "Plastic bottle"],
    correct: 2
  },
  {
    question: "Why is waste segregation important?",
    options: ["It looks organized", "It reduces processing costs", "It helps in recycling", "All of the above"],
    correct: 3
  }
];

export function TrainingModule({ user, onComplete }: TrainingModuleProps) {
  const [currentStep, setCurrentStep] = useState<'training' | 'quiz' | 'certificate'>('training');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleNextSlide = () => {
    if (currentSlide < trainingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentStep('quiz');
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleAnswerQuestion = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === quizQuestions[index].correct ? 1 : 0);
    }, 0);
  };

  const handleRetakeQuiz = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);
  };

  const handleGenerateCertificate = () => {
    const score = calculateScore();
    if (score >= quizQuestions.length * 0.7) { // 70% passing score
      // Update user certification status
      const updatedUser = { ...user, certified: true };
      localStorage.setItem('greenloop_user', JSON.stringify(updatedUser));
      setCurrentStep('certificate');
    } else {
      alert('You need at least 70% to pass. Please retake the quiz.');
      handleRetakeQuiz();
    }
  };

  if (currentStep === 'certificate') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Congratulations, {user.name}!
          </h1>
          
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-xl text-white mb-6">
            <h2 className="text-2xl font-bold mb-2">Certificate of Completion</h2>
            <p className="text-lg">Waste Segregation Training</p>
            <p className="text-sm opacity-90 mt-2">
              Issued on {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm opacity-90">
              Score: {calculateScore()}/{quizQuestions.length} ({Math.round((calculateScore() / quizQuestions.length) * 100)}%)
            </p>
          </div>
          
          <p className="text-gray-600 mb-8">
            You have successfully completed the waste segregation training and are now certified to participate in the GreenLoop system.
          </p>
          
          <button
            onClick={onComplete}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'quiz') {
    if (showResults) {
      const score = calculateScore();
      const passed = score >= quizQuestions.length * 0.7;
      
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <CheckCircle2 className={`h-12 w-12 ${passed ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h2>
              <p className={`text-xl ${passed ? 'text-green-600' : 'text-red-600'}`}>
                You scored {score} out of {quizQuestions.length} ({Math.round((score / quizQuestions.length) * 100)}%)
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {quizQuestions.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-2">
                    {index + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded text-sm ${
                          optionIndex === question.correct
                            ? 'bg-green-100 text-green-800'
                            : optionIndex === answers[index]
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option} {optionIndex === question.correct && '✓'}
                        {optionIndex === answers[index] && optionIndex !== question.correct && '✗'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center space-x-4">
              {passed ? (
                <button
                  onClick={handleGenerateCertificate}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Get Certificate
                </button>
              ) : (
                <button
                  onClick={handleRetakeQuiz}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Retake Quiz
                </button>
              )}
              <button
                onClick={onComplete}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    const question = quizQuestions[currentQuestion];
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Knowledge Quiz</h2>
              <span className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {question.question}
            </h3>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerQuestion(index)}
                  className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border-2 border-transparent hover:border-blue-200"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const slide = trainingSlides[currentSlide];
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Training Module</h2>
            <span className="text-sm text-gray-500">
              {currentSlide + 1} of {trainingSlides.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / trainingSlides.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{slide.title}</h3>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">{slide.content}</p>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h4 className="font-semibold text-green-800 mb-3">Key Points:</h4>
            <ul className="space-y-2">
              {slide.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-green-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentSlide === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>
          
          <button
            onClick={handleNextSlide}
            className="flex items-center bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {currentSlide === trainingSlides.length - 1 ? 'Take Quiz' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}