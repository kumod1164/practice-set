import connectDB from "../db";
import Test, { ITest } from "@/models/Test";
import TestSession, { ITestSession } from "@/models/TestSession";
import Question, { IQuestion } from "@/models/Question";
import { NotFoundError, BusinessLogicError, DatabaseError } from "../errors";
import mongoose from "mongoose";

/**
 * Test Service
 * Handles all business logic related to tests and test sessions
 */

export interface TestResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  percentage: number;
  topicWisePerformance: TopicPerformance[];
  difficultyWisePerformance: DifficultyPerformance[];
}

export interface TopicPerformance {
  topic: string;
  correct: number;
  total: number;
  accuracy: number;
}

export interface DifficultyPerformance {
  difficulty: "easy" | "medium" | "hard";
  correct: number;
  total: number;
  accuracy: number;
}

export class TestService {
  /**
   * Create a new test session
   * @param userId - User ID
   * @param questions - Array of questions for the test
   * @returns Created test session
   */
  async createTestSession(
    userId: string,
    questions: IQuestion[]
  ): Promise<ITestSession> {
    try {
      await connectDB();

      // Check if user already has an active session
      const existingSession = await TestSession.findOne({ userId });
      if (existingSession) {
        throw new BusinessLogicError(
          "You already have an active test session. Please complete or abandon it first."
        );
      }

      // Calculate test duration (N × 1.2 minutes)
      const durationMinutes = Math.ceil(questions.length * 1.2);
      const durationSeconds = durationMinutes * 60;

      const now = new Date();
      const expiresAt = new Date(now.getTime() + durationSeconds * 1000);

      // Create session
      const session = await TestSession.create({
        userId,
        questions: questions.map((q) => q._id),
        answers: new Array(questions.length).fill(null),
        markedForReview: new Array(questions.length).fill(false),
        currentQuestionIndex: 0,
        remainingTime: durationSeconds,
        timeExtensions: 0,
        startedAt: now,
        expiresAt,
      });

      return session;
    } catch (error) {
      if (error instanceof BusinessLogicError) {
        throw error;
      }
      throw new DatabaseError("Failed to create test session");
    }
  }

  /**
   * Get active test session for a user
   * @param userId - User ID
   * @returns Test session or null
   */
  async getTestSession(userId: string): Promise<ITestSession | null> {
    try {
      await connectDB();

      const session = await TestSession.findOne({ userId }).populate("questions");
      return session;
    } catch (error) {
      throw new DatabaseError("Failed to fetch test session");
    }
  }

  /**
   * Abandon active test session
   * @param userId - User ID
   */
  async abandonTestSession(userId: string): Promise<void> {
    try {
      await connectDB();

      const session = await TestSession.findOne({ userId });
      if (!session) {
        throw new NotFoundError("Test session");
      }

      await TestSession.findByIdAndDelete(session._id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to abandon test session");
    }
  }

  /**
   * Save answer for a question
   * @param sessionId - Session ID
   * @param questionIndex - Index of the question
   * @param answer - Answer (0-3)
   */
  async saveAnswer(
    sessionId: string,
    questionIndex: number,
    answer: 0 | 1 | 2 | 3
  ): Promise<void> {
    try {
      await connectDB();

      const session = await TestSession.findById(sessionId);
      if (!session) {
        throw new NotFoundError("Test session");
      }

      // Validate question index
      if (questionIndex < 0 || questionIndex >= session.questions.length) {
        throw new BusinessLogicError("Invalid question index");
      }

      // Update answer
      session.answers[questionIndex] = answer;
      await session.save();
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BusinessLogicError) {
        throw error;
      }
      throw new DatabaseError("Failed to save answer");
    }
  }

  /**
   * Toggle mark for review flag
   * @param sessionId - Session ID
   * @param questionIndex - Index of the question
   */
  async toggleMarkForReview(sessionId: string, questionIndex: number): Promise<void> {
    try {
      await connectDB();

      const session = await TestSession.findById(sessionId);
      if (!session) {
        throw new NotFoundError("Test session");
      }

      // Validate question index
      if (questionIndex < 0 || questionIndex >= session.questions.length) {
        throw new BusinessLogicError("Invalid question index");
      }

      // Toggle mark
      session.markedForReview[questionIndex] = !session.markedForReview[questionIndex];
      await session.save();
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BusinessLogicError) {
        throw error;
      }
      throw new DatabaseError("Failed to toggle mark for review");
    }
  }

  /**
   * Extend test time
   * @param sessionId - Session ID
   * @param minutes - Minutes to extend (5 or 10)
   * @returns Updated session
   */
  async extendTime(sessionId: string, minutes: 5 | 10): Promise<ITestSession> {
    try {
      await connectDB();

      const session = await TestSession.findById(sessionId);
      if (!session) {
        throw new NotFoundError("Test session");
      }

      // Check extension limit
      if (session.timeExtensions >= 2) {
        throw new BusinessLogicError("Maximum time extensions (2) reached");
      }

      // Add time
      const additionalSeconds = minutes * 60;
      session.remainingTime += additionalSeconds;
      session.timeExtensions += 1;
      session.expiresAt = new Date(session.expiresAt.getTime() + additionalSeconds * 1000);

      await session.save();
      return session;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BusinessLogicError) {
        throw error;
      }
      throw new DatabaseError("Failed to extend time");
    }
  }

  /**
   * Submit test and calculate results
   * @param sessionId - Session ID
   * @returns Completed test with results
   */
  async submitTest(sessionId: string): Promise<ITest> {
    try {
      await connectDB();

      const session = await TestSession.findById(sessionId).populate("questions");
      if (!session) {
        throw new NotFoundError("Test session");
      }

      // Get questions
      const questions = await Question.find({
        _id: { $in: session.questions },
      });

      // Calculate results
      const results = this.calculateResults(session, questions);

      // Create test record
      const test = await Test.create({
        userId: session.userId,
        questions: session.questions,
        answers: session.answers,
        markedForReview: session.markedForReview,
        score: results.score,
        totalQuestions: results.totalQuestions,
        correctAnswers: results.correctAnswers,
        incorrectAnswers: results.incorrectAnswers,
        unansweredQuestions: results.unansweredQuestions,
        timeTaken: Math.floor(
          (Date.now() - session.startedAt.getTime()) / 1000
        ),
        timeExtensions: session.timeExtensions,
        startedAt: session.startedAt,
        submittedAt: new Date(),
        topicWisePerformance: results.topicWisePerformance,
        difficultyWisePerformance: results.difficultyWisePerformance,
      });

      // Delete session
      await TestSession.findByIdAndDelete(sessionId);

      return test;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to submit test");
    }
  }

  /**
   * Calculate test results
   * @param session - Test session
   * @param questions - Questions array
   * @returns Test results
   */
  calculateResults(session: ITestSession, questions: IQuestion[]): TestResults {
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unansweredQuestions = 0;

    // Count correct, incorrect, and unanswered
    session.answers.forEach((answer, index) => {
      if (answer === null) {
        unansweredQuestions++;
      } else if (answer === questions[index].correctAnswer) {
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }
    });

    const totalQuestions = questions.length;
    const percentage = parseFloat(
      ((correctAnswers / totalQuestions) * 100).toFixed(2)
    );

    // Calculate topic-wise performance
    const topicMap = new Map<string, { correct: number; total: number }>();
    questions.forEach((q, index) => {
      if (!topicMap.has(q.topic)) {
        topicMap.set(q.topic, { correct: 0, total: 0 });
      }
      const perf = topicMap.get(q.topic)!;
      perf.total++;
      if (session.answers[index] === q.correctAnswer) {
        perf.correct++;
      }
    });

    const topicWisePerformance: TopicPerformance[] = Array.from(
      topicMap.entries()
    ).map(([topic, perf]) => ({
      topic,
      correct: perf.correct,
      total: perf.total,
      accuracy: parseFloat(((perf.correct / perf.total) * 100).toFixed(2)),
    }));

    // Calculate difficulty-wise performance
    const difficultyMap = new Map<
      "easy" | "medium" | "hard",
      { correct: number; total: number }
    >();
    questions.forEach((q, index) => {
      if (!difficultyMap.has(q.difficulty)) {
        difficultyMap.set(q.difficulty, { correct: 0, total: 0 });
      }
      const perf = difficultyMap.get(q.difficulty)!;
      perf.total++;
      if (session.answers[index] === q.correctAnswer) {
        perf.correct++;
      }
    });

    const difficultyWisePerformance: DifficultyPerformance[] = Array.from(
      difficultyMap.entries()
    ).map(([difficulty, perf]) => ({
      difficulty,
      correct: perf.correct,
      total: perf.total,
      accuracy: parseFloat(((perf.correct / perf.total) * 100).toFixed(2)),
    }));

    return {
      score: correctAnswers,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
      percentage,
      topicWisePerformance,
      difficultyWisePerformance,
    };
  }

  /**
   * Get test by ID
   * @param testId - Test ID
   * @returns Test
   */
  async getTestById(testId: string): Promise<ITest> {
    try {
      await connectDB();

      const test = await Test.findById(testId).populate("questions");
      if (!test) {
        throw new NotFoundError("Test");
      }

      return test;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to fetch test");
    }
  }

  /**
   * Get test history for a user
   * @param userId - User ID
   * @param limit - Number of tests to return
   * @param skip - Number of tests to skip
   * @returns Array of tests
   */
  async getTestHistory(
    userId: string,
    limit: number = 10,
    skip: number = 0
  ): Promise<ITest[]> {
    try {
      await connectDB();

      const tests = await Test.find({ userId })
        .sort({ submittedAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate("questions");

      return tests;
    } catch (error) {
      throw new DatabaseError("Failed to fetch test history");
    }
  }
}

// Export singleton instance
export const testService = new TestService();

/**
 * Calculate test duration in minutes
 * @param questionCount - Number of questions
 * @returns Duration in minutes
 */
export function calculateTestDuration(questionCount: number): number {
  return Math.ceil(questionCount * 1.2);
}

/**
 * Format time in seconds to HH:MM:SS
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
