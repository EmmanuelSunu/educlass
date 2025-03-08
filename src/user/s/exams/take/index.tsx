import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout";
import { FiAlertTriangle } from "react-icons/fi";

function TakeExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Mock exam data fetch
    setTimeout(() => {
      setExam({
        id: id,
        title: "Advanced Programming Concepts Test",
        duration: "1 hour 30 minutes",
        durationMinutes: 90, // Total minutes
        questions: [
          { 
            id: 1,
            text: "What is the time complexity of QuickSort in the average case?", 
            options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            points: 5
          },
          { 
            id: 2,
            text: "Which data structure uses LIFO (Last In First Out) principle?", 
            options: ["Queue", "Stack", "List", "Tree"],
            points: 5 
          },
          { 
            id: 3,
            text: "What is a recursive function?", 
            options: ["A function that calls itself", "A function that never terminates", "A function with a loop", "A function that returns nothing"],
            points: 5
          }
        ]
      });

      setTimeLeft(90 * 60); // 90 minutes in seconds
      setLoading(false);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Auto-submit when time expires
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Here you would send the answers to your backend
      console.log("Submitting answers:", answers);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to results page
      navigate(`/user/s/exams/results/${id}`);
    } catch (error) {
      console.error("Error submitting exam:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
            <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-md flex items-center space-x-2">
              <span className="font-medium">Time Left:</span> 
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Exam Instructions</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Answer all questions to the best of your ability.</li>
              <li>Your answers will be auto-saved as you progress.</li>
              <li>Once submitted, you cannot return to change your answers.</li>
              <li>The exam will auto-submit when the time expires.</li>
            </ul>
          </div>

          <div className="space-y-8">
            {exam.questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Question {index + 1}</h3>
                  <span className="text-sm text-gray-500">{question.points} points</span>
                </div>
                <p className="text-gray-700 mb-4">{question.text}</p>
                <div className="space-y-3">
                  {question.options.map((option, optIndex) => (
                    <label key={optIndex} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswerChange(question.id, option)}
                        className="mt-0.5"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{Object.keys(answers).length}</span> of {exam.questions.length} questions answered
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Exam</span>
                </>
              )}
            </button>
          </div>

          {Object.keys(answers).length < exam.questions.length && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center space-x-3 text-amber-700">
              <FiAlertTriangle className="flex-shrink-0" />
              <p className="text-sm">You have unanswered questions. Please review before submitting.</p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

export default TakeExamPage;