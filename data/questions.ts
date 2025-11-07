export type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  type: "aptitude" | "english" | "gn";
};

export const QUESTIONS: Question[] = [
  // Aptitude
  { id: "a1", type: "aptitude", text: "If x + 3 = 7, what is x?", options: ["1", "2", "3", "4"], correctIndex: 3 },
  { id: "a2", type: "aptitude", text: "What is the next number in the series: 2, 4, 8, 16, ?", options: ["18", "20", "32", "24"], correctIndex: 2 },
  { id: "a3", type: "aptitude", text: "A train travels 60 km in 1.5 hours. What is its average speed in km/h?", options: ["30", "40", "45", "50"], correctIndex: 1 },
  { id: "a4", type: "aptitude", text: "If 5 workers can finish a job in 10 days, how many days would 10 workers take (same rate)?", options: ["5", "10", "15", "20"], correctIndex: 0 },
  { id: "a5", type: "aptitude", text: "What is 15% of 200?", options: ["20", "25", "30", "35"], correctIndex: 2 },

  // English
  { id: "e1", type: "english", text: "Choose the correct word: She ___ to the store yesterday.", options: ["go", "went", "gone", "goes"], correctIndex: 1 },
  { id: "e2", type: "english", text: "Choose the correct spelling:", options: ["Accommodate", "Acomodate", "Acommadate", "Acomodate"], correctIndex: 0 },
  { id: "e3", type: "english", text: "Select the sentence which is grammatically correct:", options: ["He don't like apples.", "He doesn't likes apples.", "He doesn't like apples.", "He not like apples."], correctIndex: 2 },
  { id: "e4", type: "english", text: "Choose the synonym of 'happy' :", options: ["sad", "angry", "joyful", "tired"], correctIndex: 2 },
  { id: "e5", type: "english", text: "Fill in the blank: She has been working here ___ 2019.", options: ["since", "for", "from", "at"], correctIndex: 0 },

  // General knowledge (kept small)
  { id: "g1", type: "gn", text: "Which is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correctIndex: 2 },
  { id: "g2", type: "gn", text: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], correctIndex: 1 },
];

export const DEFAULT_QUESTIONS_PER_TEST = 5;
