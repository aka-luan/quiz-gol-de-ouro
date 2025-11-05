type QuestionProps = {
  id: number;
  category: string;
  question: string;
  options: [string, string, string, string];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
};
