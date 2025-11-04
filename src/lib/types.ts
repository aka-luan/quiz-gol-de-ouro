type QuestionProps = {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
};
