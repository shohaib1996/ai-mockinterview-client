// Session.feedback is polymorphic: a plain string for Mock Interview
// sessions, but a structured { criteriaScores, feedback } object for IELTS
// Speaking sessions (which also stores the per-criterion band breakdown).
// This extracts just the displayable text regardless of which shape it is.
export const getFeedbackText = (feedback: unknown): string | null => {
  if (!feedback) return null;
  if (typeof feedback === "string") return feedback;
  if (
    typeof feedback === "object" &&
    "feedback" in feedback &&
    typeof (feedback as { feedback: unknown }).feedback === "string"
  ) {
    return (feedback as { feedback: string }).feedback;
  }
  return null;
};
