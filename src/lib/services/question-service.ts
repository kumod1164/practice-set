import connectDB from "../db";
import Question, { IQuestion } from "@/models/Question";
import Test from "@/models/Test";
import { QuestionInput, QuestionFilterInput, validate, QuestionSchema, getFirstError } from "../validations";
import { ValidationError, NotFoundError, DatabaseError } from "../errors";
import mongoose from "mongoose";

/**
 * Question Service
 * Handles all business logic related to questions
 */

export interface TestConfig {
  topics: string[];
  subtopics?: string[];
  difficulty: "easy" | "medium" | "hard" | "mixed";
  questionCount: number;
  userId: string;
}

export interface BulkImportResult {
  successful: number;
  failed: number;
  errors: { line: number; error: string }[];
}

export class QuestionService {
  /**
   * Create a new question
   * @param data - Question data
   * @returns Created question
   */
  async createQuestion(data: QuestionInput): Promise<IQuestion> {
    try {
      await connectDB();

      // Validate input
      const validation = validate(QuestionSchema, data);
      if (!validation.success) {
        throw new ValidationError("Invalid question data", validation.errors.flatten().fieldErrors as any);
      }

      // Create question
      const question = await Question.create(validation.data);
      return question;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError("Failed to create question");
    }
  }

  /**
   * Update an existing question
   * @param id - Question ID
   * @param data - Updated question data
   * @returns Updated question
   */
  async updateQuestion(id: string, data: QuestionInput): Promise<IQuestion> {
    try {
      await connectDB();

      // Validate input
      const validation = validate(QuestionSchema, data);
      if (!validation.success) {
        throw new ValidationError("Invalid question data", validation.errors.flatten().fieldErrors as any);
      }

      // Update question (preserves ID and updates timestamp automatically)
      const question = await Question.findByIdAndUpdate(
        id,
        validation.data,
        { new: true, runValidators: true }
      );

      if (!question) {
        throw new NotFoundError("Question");
      }

      return question;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to update question");
    }
  }

  /**
   * Delete a question
   * @param id - Question ID
   */
  async deleteQuestion(id: string): Promise<void> {
    try {
      await connectDB();

      const question = await Question.findByIdAndDelete(id);

      if (!question) {
        throw new NotFoundError("Question");
      }

      // Note: The question will automatically be excluded from future test selections
      // since we're using references. Existing completed tests will retain the question data.
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to delete question");
    }
  }

  /**
   * Get questions with optional filtering
   * @param filters - Filter criteria
   * @returns Array of questions
   */
  async getQuestions(filters: Partial<QuestionFilterInput> = {}): Promise<IQuestion[]> {
    try {
      await connectDB();

      const query: any = {};

      // Apply filters
      if (filters.topic) {
        query.topic = filters.topic;
      }
      if (filters.subtopic) {
        query.subtopic = filters.subtopic;
      }
      if (filters.difficulty) {
        query.difficulty = filters.difficulty;
      }
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }

      const questions = await Question.find(query)
        .limit(filters.limit || 1000)
        .skip(filters.skip || 0)
        .sort({ createdAt: -1 });

      return questions;
    } catch (error) {
      throw new DatabaseError("Failed to fetch questions");
    }
  }

  /**
   * Get a single question by ID
   * @param id - Question ID
   * @returns Question
   */
  async getQuestionById(id: string): Promise<IQuestion> {
    try {
      await connectDB();

      const question = await Question.findById(id);

      if (!question) {
        throw new NotFoundError("Question");
      }

      return question;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to fetch question");
    }
  }

  /**
   * Bulk import questions from array
   * @param questions - Array of question data
   * @returns Import result with success/failure counts
   */
  async bulkImport(questions: QuestionInput[]): Promise<BulkImportResult> {
    await connectDB();

    const result: BulkImportResult = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    const validQuestions: QuestionInput[] = [];

    // Validate all questions first
    questions.forEach((question, index) => {
      const validation = validate(QuestionSchema, question);
      if (!validation.success) {
        result.failed++;
        const errorMsg = getFirstError(validation.errors);
        console.log(`Validation failed for question ${index + 1}:`, errorMsg, question);
        result.errors.push({
          line: index + 1,
          error: errorMsg,
        });
      } else {
        validQuestions.push(validation.data);
      }
    });

    console.log(`Validation complete: ${validQuestions.length} valid, ${result.failed} failed`);

    // If all questions are valid, insert them in a transaction
    if (validQuestions.length > 0) {
      try {
        // Try inserting without transaction first for better error messages
        const insertedQuestions = await Question.insertMany(validQuestions, { 
          ordered: false // Continue on error
        });
        
        result.successful = insertedQuestions.length;
      } catch (error: any) {
        // Handle individual insertion errors
        if (error.writeErrors) {
          error.writeErrors.forEach((err: any) => {
            result.failed++;
            result.errors.push({
              line: err.index + 1,
              error: err.errmsg || err.message || "Database insertion failed",
            });
          });
          // Count successful insertions
          result.successful = validQuestions.length - error.writeErrors.length;
        } else {
          // Complete failure
          result.failed += validQuestions.length;
          result.errors.push({
            line: 0,
            error: error.message || "Database insertion failed",
          });
        }
      }
    }

    return result;
  }

  /**
   * Select questions for a test based on configuration
   * @param config - Test configuration
   * @returns Array of selected questions
   */
  async selectQuestionsForTest(config: TestConfig): Promise<IQuestion[]> {
    try {
      await connectDB();

      // Build query based on configuration
      const query: any = {
        topic: { $in: config.topics },
      };

      if (config.subtopics && config.subtopics.length > 0) {
        query.subtopic = { $in: config.subtopics };
      }

      if (config.difficulty !== "mixed") {
        query.difficulty = config.difficulty;
      }

      // Get all matching questions
      let availableQuestions = await Question.find(query);

      // Check if we have enough questions
      if (availableQuestions.length < config.questionCount) {
        throw new ValidationError(
          `Insufficient questions available. Found ${availableQuestions.length}, need ${config.questionCount}`
        );
      }

      // Get previously attempted questions by this user
      const previousTests = await Test.find({ userId: config.userId })
        .select("questions")
        .lean();

      const attemptedQuestionIds = new Set(
        previousTests.flatMap((test) => test.questions.map((q) => q.toString()))
      );

      // Separate into attempted and not attempted
      const notAttempted = availableQuestions.filter(
        (q) => !attemptedQuestionIds.has(q._id.toString())
      );
      const attempted = availableQuestions.filter((q) =>
        attemptedQuestionIds.has(q._id.toString())
      );

      // For mixed difficulty, ensure even distribution
      let selectedQuestions: IQuestion[] = [];

      if (config.difficulty === "mixed") {
        const questionsPerDifficulty = Math.floor(config.questionCount / 3);
        const remainder = config.questionCount % 3;

        // Separate by difficulty
        const easyQuestions = availableQuestions.filter((q) => q.difficulty === "easy");
        const mediumQuestions = availableQuestions.filter((q) => q.difficulty === "medium");
        const hardQuestions = availableQuestions.filter((q) => q.difficulty === "hard");

        console.log("Mixed difficulty distribution:", {
          total: config.questionCount,
          easy: easyQuestions.length,
          medium: mediumQuestions.length,
          hard: hardQuestions.length,
          perDifficulty: questionsPerDifficulty
        });

        // Select from each difficulty level
        const easySelected = this.selectAndShuffle(easyQuestions, questionsPerDifficulty + (remainder > 0 ? 1 : 0), attemptedQuestionIds);
        const mediumSelected = this.selectAndShuffle(mediumQuestions, questionsPerDifficulty + (remainder > 1 ? 1 : 0), attemptedQuestionIds);
        const hardSelected = this.selectAndShuffle(hardQuestions, questionsPerDifficulty, attemptedQuestionIds);

        selectedQuestions = [...easySelected, ...mediumSelected, ...hardSelected];

        console.log("Selected counts:", {
          easy: easySelected.length,
          medium: mediumSelected.length,
          hard: hardSelected.length,
          total: selectedQuestions.length
        });

        // If we don't have enough questions from even distribution, fill from available pool
        if (selectedQuestions.length < config.questionCount) {
          const selectedIds = new Set(selectedQuestions.map(q => q._id.toString()));
          const remaining = availableQuestions.filter(q => !selectedIds.has(q._id.toString()));
          const shuffledRemaining = this.shuffle(remaining);
          const needed = config.questionCount - selectedQuestions.length;
          selectedQuestions = [...selectedQuestions, ...shuffledRemaining.slice(0, needed)];
          
          console.log(`Filled ${needed} more questions from remaining pool. New total: ${selectedQuestions.length}`);
        }
      } else {
        // Prioritize not attempted, then shuffle
        const shuffledNotAttempted = this.shuffle(notAttempted);
        const shuffledAttempted = this.shuffle(attempted);

        // Combine: prioritize not attempted
        const combined = [...shuffledNotAttempted, ...shuffledAttempted];
        selectedQuestions = combined.slice(0, config.questionCount);
      }

      // Final shuffle to randomize order
      return this.shuffle(selectedQuestions);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError("Failed to select questions for test");
    }
  }

  /**
   * Select and shuffle questions, prioritizing not attempted
   * @param questions - Available questions
   * @param count - Number to select
   * @param attemptedIds - Set of attempted question IDs
   * @returns Selected and shuffled questions
   */
  private selectAndShuffle(
    questions: IQuestion[],
    count: number,
    attemptedIds: Set<string>
  ): IQuestion[] {
    const notAttempted = questions.filter((q) => !attemptedIds.has(q._id.toString()));
    const attempted = questions.filter((q) => attemptedIds.has(q._id.toString()));

    const shuffledNotAttempted = this.shuffle(notAttempted);
    const shuffledAttempted = this.shuffle(attempted);

    const combined = [...shuffledNotAttempted, ...shuffledAttempted];
    return combined.slice(0, count);
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   * @param array - Array to shuffle
   * @returns Shuffled array
   */
  private shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Get count of questions matching criteria
   * @param filters - Filter criteria
   * @returns Count of matching questions
   */
  async getQuestionCount(filters: Partial<TestConfig>): Promise<number> {
    try {
      await connectDB();

      const query: any = {};

      if (filters.topics && filters.topics.length > 0) {
        query.topic = { $in: filters.topics };
      }
      if (filters.subtopics && filters.subtopics.length > 0) {
        query.subtopic = { $in: filters.subtopics };
      }
      if (filters.difficulty && filters.difficulty !== "mixed") {
        query.difficulty = filters.difficulty;
      }

      const count = await Question.countDocuments(query);
      return count;
    } catch (error) {
      throw new DatabaseError("Failed to count questions");
    }
  }

  /**
   * Get available topics and subtopics from database
   * @returns Object with topics and their subtopics
   */
  async getAvailableTopics(): Promise<{ topics: string[]; subtopicsByTopic: Record<string, string[]> }> {
    try {
      await connectDB();

      // Get all unique topics
      const topics = await Question.distinct("topic");

      // Get subtopics for each topic
      const subtopicsByTopic: Record<string, string[]> = {};
      
      for (const topic of topics) {
        const subtopics = await Question.distinct("subtopic", { topic });
        subtopicsByTopic[topic] = subtopics.sort();
      }

      return {
        topics: topics.sort(),
        subtopicsByTopic,
      };
    } catch (error) {
      throw new DatabaseError("Failed to fetch available topics");
    }
  }
}

// Export singleton instance
export const questionService = new QuestionService();
