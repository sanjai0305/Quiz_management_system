export interface User {
  id: number;
  name: string;
  email?: string;
  registration_number?: string;
  date_of_birth?: string;
  mobile?: string;
  role: 'admin' | 'student';
  department?: string;
  profile_picture?: string;
  priority_type?: 'general' | 'children' | 'disability';
}

export interface Quiz {
  id: number;
  title: string;
  subject: string;
  time_limit: number;
  stage: number;
  questions?: Question[];
}

export interface Question {
  id: number;
  quiz_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

export interface Attempt {
  name: string;
  registration_number: string;
  quiz_name: string;
  score: number;
  total_questions: number;
  attempt_date: string;
}
