export type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  type: "aptitude" | "english" | "gn" | `skill-${string}`;
  difficulty?: "easy" | "moderate" | "hard";
};

export const QUESTIONS: Question[] = [
  // Skill: Python (5 easy, 3 moderate, 2 hard)
  { id: "sp1", type: "skill-python", difficulty: "easy", text: "What is the output of print(2 ** 3)?", options: ["5", "6", "8", "9"], correctIndex: 2 },
  { id: "sp2", type: "skill-python", difficulty: "easy", text: "Which keyword is used to define a function in Python?", options: ["func", "def", "function", "define"], correctIndex: 1 },
  { id: "sp3", type: "skill-python", difficulty: "easy", text: "What is the correct file extension for Python files?", options: [".py", ".pt", ".pyt", ".python"], correctIndex: 0 },
  { id: "sp4", type: "skill-python", difficulty: "easy", text: "Which of the following is a mutable data type?", options: ["tuple", "str", "list", "int"], correctIndex: 2 },
  { id: "sp5", type: "skill-python", difficulty: "easy", text: "What does the 'len' function do?", options: ["Returns length", "Returns type", "Returns value", "Returns index"], correctIndex: 0 },
  { id: "sp6", type: "skill-python", difficulty: "moderate", text: "Which of the following is used to handle exceptions in Python?", options: ["try-except", "catch", "error", "handle"], correctIndex: 0 },
  { id: "sp7", type: "skill-python", difficulty: "moderate", text: "What is the output of print(type([]))?", options: ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'set'>"], correctIndex: 0 },
  { id: "sp8", type: "skill-python", difficulty: "moderate", text: "Which function converts a string to an integer in Python?", options: ["str()", "int()", "float()", "chr()"], correctIndex: 1 },
  { id: "sp9", type: "skill-python", difficulty: "hard", text: "Which method is used to add an element at the end of a list?", options: ["add()", "append()", "insert()", "extend()"], correctIndex: 1 },
  { id: "sp10", type: "skill-python", difficulty: "hard", text: "What is the output of print({1,2,2,3})?", options: ["{1,2,2,3}", "{1,2,3}", "[1,2,2,3]", "Error"], correctIndex: 1 },

  // Skill: Java (5 easy, 3 moderate, 2 hard)
  { id: "sj1", type: "skill-java", difficulty: "easy", text: "Which method is the entry point of a Java program?", options: ["start()", "main()", "run()", "init()"], correctIndex: 1 },
  { id: "sj2", type: "skill-java", difficulty: "easy", text: "Which keyword is used to inherit a class in Java?", options: ["inherits", "extends", "implements", "instanceof"], correctIndex: 1 },
  { id: "sj3", type: "skill-java", difficulty: "easy", text: "What is the default value of int in Java?", options: ["null", "0", "undefined", "1"], correctIndex: 1 },
  { id: "sj4", type: "skill-java", difficulty: "easy", text: "Which of these is not a Java primitive type?", options: ["int", "float", "String", "char"], correctIndex: 2 },
  { id: "sj5", type: "skill-java", difficulty: "easy", text: "Which symbol is used to end a statement in Java?", options: [".", ":", ";", ","], correctIndex: 2 },
  { id: "sj6", type: "skill-java", difficulty: "moderate", text: "Which keyword is used to create an object in Java?", options: ["new", "create", "object", "instance"], correctIndex: 0 },
  { id: "sj7", type: "skill-java", difficulty: "moderate", text: "Which method is used to compare two strings in Java?", options: ["equals()", "compare()", "==", "match()"], correctIndex: 0 },
  { id: "sj8", type: "skill-java", difficulty: "moderate", text: "Which collection does not allow duplicate elements?", options: ["List", "Set", "Map", "Array"], correctIndex: 1 },
  { id: "sj9", type: "skill-java", difficulty: "hard", text: "Which of the following is used for multi-threading in Java?", options: ["Runnable", "Thread", "Process", "Executor"], correctIndex: 1 },
  { id: "sj10", type: "skill-java", difficulty: "hard", text: "Which keyword is used to prevent inheritance in Java?", options: ["final", "static", "private", "protected"], correctIndex: 0 },

  // Skill: Web (5 easy, 3 moderate, 2 hard)
  { id: "sw1", type: "skill-web", difficulty: "easy", text: "Which HTML tag is used to create a hyperlink?", options: ["<a>", "<link>", "<href>", "<hyper>"], correctIndex: 0 },
  { id: "sw2", type: "skill-web", difficulty: "easy", text: "Which CSS property changes text color?", options: ["font-color", "color", "text-color", "background-color"], correctIndex: 1 },
  { id: "sw3", type: "skill-web", difficulty: "easy", text: "Which JavaScript keyword declares a variable?", options: ["var", "let", "const", "all of these"], correctIndex: 3 },
  { id: "sw4", type: "skill-web", difficulty: "easy", text: "What does HTTP stand for?", options: ["HyperText Transfer Protocol", "HyperText Transmission Protocol", "Hyper Transfer Text Protocol", "Hyper Transmission Text Protocol"], correctIndex: 0 },
  { id: "sw5", type: "skill-web", difficulty: "easy", text: "Which tag is used for the largest heading in HTML?", options: ["<h1>", "<h6>", "<head>", "<header>"], correctIndex: 0 },
  { id: "sw6", type: "skill-web", difficulty: "moderate", text: "Which attribute is used to provide an alternate text for an image?", options: ["alt", "title", "src", "href"], correctIndex: 0 },
  { id: "sw7", type: "skill-web", difficulty: "moderate", text: "Which CSS property is used to set the background image?", options: ["background-image", "image-background", "bg-img", "img-bg"], correctIndex: 0 },
  { id: "sw8", type: "skill-web", difficulty: "moderate", text: "Which JavaScript method is used to parse a JSON string?", options: ["JSON.parse()", "parseJSON()", "toJSON()", "stringify()"], correctIndex: 0 },
  { id: "sw9", type: "skill-web", difficulty: "hard", text: "Which HTML5 element is used for video playback?", options: ["<video>", "<media>", "<movie>", "<play>"], correctIndex: 0 },
  { id: "sw10", type: "skill-web", difficulty: "hard", text: "Which HTTP status code means 'Not Found'?", options: ["200", "404", "500", "403"], correctIndex: 1 },
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
