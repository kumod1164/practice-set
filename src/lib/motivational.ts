/**
 * Motivational Feedback System
 * Provides encouraging messages and quotes based on test performance
 */

export interface MotivationalFeedback {
  message: string;
  quote: string;
  improvementMessage: string | null;
}

const INSPIRATIONAL_QUOTES = [
  "Excellence is not a destination; it is a continuous journey.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The expert in anything was once a beginner.",
  "It's not about perfect. It's about effort.",
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Your limitation—it's only your imagination.",
];

/**
 * Get motivational message based on score percentage
 * @param percentage - Score percentage (0-100)
 * @param previousAverage - Previous average score (optional)
 * @returns Motivational feedback object
 */
export function getMotivationalMessage(
  percentage: number,
  previousAverage: number | null = null
): MotivationalFeedback {
  let message: string;
  let quote: string;

  // Select message based on score range
  if (percentage >= 90) {
    message = "Outstanding! You're on the path to success! 🌟";
    quote = INSPIRATIONAL_QUOTES[0];
  } else if (percentage >= 70) {
    message = "Great work! Keep up the momentum! 💪";
    quote = INSPIRATIONAL_QUOTES[1];
  } else if (percentage >= 50) {
    message = "Good effort! Consistency will lead to excellence! 📈";
    quote = INSPIRATIONAL_QUOTES[2];
  } else {
    message = "Every expert was once a beginner. Keep practicing! 🎯";
    quote = INSPIRATIONAL_QUOTES[3];
  }

  // Calculate improvement message
  let improvementMessage: string | null = null;
  if (previousAverage !== null && percentage > previousAverage) {
    const improvement = (percentage - previousAverage).toFixed(1);
    improvementMessage = `Amazing! You've improved by ${improvement}% from your previous average! 🚀`;
  }

  return {
    message,
    quote,
    improvementMessage,
  };
}

/**
 * Get a random inspirational quote
 * @returns Random quote
 */
export function getRandomQuote(): string {
  return INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)];
}
