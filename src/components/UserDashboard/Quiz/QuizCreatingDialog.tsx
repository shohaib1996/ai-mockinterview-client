import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateQuestionsMutation } from "@/redux/api/question/questionApi";
import { useCreateQuizAttemptMutation } from "@/redux/api/quiz-attempt/quizAttemptApi";
import { BookOpen, CheckCircle, Loader2, Play, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const QuizCreationDialog = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [quizName, setQuizName] = useState("");
  const [promptText, setPromptText] = useState("");
  const [createdQuizId, setCreatedQuizId] = useState<string | null>(null);
  console.log(createdQuizId)

  const [createQuizAttempt, { isLoading: isCreating }] = useCreateQuizAttemptMutation();
  const [generateQuestions, { isLoading: isGenerating }] = useGenerateQuestionsMutation();

  const handleCreate = async () => {
    if (!quizName) return;
    try {
      const res = await createQuizAttempt({ quizName }).unwrap(); // Assuming the mutation takes { quizName }
      console.log(res);
      setCreatedQuizId(res?.data?.id); // Assuming the response has 'id'
      setStep(2);
    } catch (error) {
      console.error("Failed to create quiz attempt:", error);
    }
  };

  const handleGenerate = async () => {
    if (!promptText || !createdQuizId) return;
    try {
      await generateQuestions({
        sessionType: "QUIZ",
        quizAttemptId: createdQuizId,
        numberOfQuestions: 10,
        promptText,
      }).unwrap();
      setStep(3);
    } catch (error) {
      console.error("Failed to generate questions:", error);
    }
  };

  const handleParticipate = () => {
    if (createdQuizId) {
      router.push(`/dashboard/quiz/practice/${createdQuizId}`); // Assuming redirect path; adjust as needed
    }
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-0 shadow-2xl">
      {step === 1 && (
        <>
          <DialogHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Quiz
              </DialogTitle>
              <p className="text-muted-foreground mt-2">Give your quiz a memorable name to get started</p>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quizName" className="text-sm font-medium text-foreground">
                Quiz Name
              </Label>
              <Input
                id="quizName"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                placeholder="e.g., JavaScript Fundamentals"
                className="h-12 border-2 border-muted focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreate}
              disabled={!quizName || isCreating}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Quiz...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </>
              )}
            </Button>
          </DialogFooter>
        </>
      )}
      {step === 2 && (
        <>
          <DialogHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Generate Questions
              </DialogTitle>
              <p className="text-muted-foreground mt-2">Describe the topic to generate relevant questions</p>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="promptText" className="text-sm font-medium text-foreground">
                Topic Description
              </Label>
              <Textarea
                id="promptText"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="e.g., Create questions about React hooks, state management, and component lifecycle..."
                className="min-h-[100px] border-2 border-muted focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors resize-none"
              />
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 <strong>Tip:</strong> Be specific about the topics you want to cover for better question quality.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleGenerate}
              disabled={!promptText || isGenerating}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Questions
                </>
              )}
            </Button>
          </DialogFooter>
        </>
      )}
      {step === 3 && (
        <>
          <DialogHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Quiz Ready!
              </DialogTitle>
              <p className="text-muted-foreground mt-2">Your quiz has been created with 10 questions</p>
            </div>
          </DialogHeader>
          <div className="py-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">All Set!</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your quiz questions have been generated successfully. You can now start taking the quiz.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleParticipate}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Quiz
            </Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  );
};

export default QuizCreationDialog;
