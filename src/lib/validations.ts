import { z } from "zod";

/**
 * Validation schemas for the UPSC Practice Platform
 * Using Zod for runtime type validation
 */

// ============================================================================
// Question Validation
// ============================================================================

export const QuestionSchema = z.object({
  topic: z
    .string()
    .min(1, "Topic is required")
    .max(100, "Topic must be at most 100 characters")
    .trim(),
  subtopic: z
    .string()
    .min(1, "Subtopic is required")
    .max(100, "Subtopic must be at most 100 characters")
    .trim(),
  question: z
    .string()
    .min(10, "Question must be at least 10 characters")
    .max(1000, "Question must be at most 1000 characters"),
  options: z
    .tuple([
      z.string().min(1, "Option 1 is required").max(500, "Option 1 must be at most 500 characters"),
      z.string().min(1, "Option 2 is required").max(500, "Option 2 must be at most 500 characters"),
      z.string().min(1, "Option 3 is required").max(500, "Option 3 must be at most 500 characters"),
      z.string().min(1, "Option 4 is required").max(500, "Option 4 must be at most 500 characters"),
    ])
    .describe("Exactly 4 options are required"),
  correctAnswer: z
    .number()
    .int("Correct answer must be an integer")
    .min(0, "Correct answer must be between 0 and 3")
    .max(3, "Correct answer must be between 0 and 3"),
  difficulty: z.enum(["easy", "medium", "hard"], {
    message: "Difficulty must be 'easy', 'medium', or 'hard'",
  }),
  explanation: z
    .string()
    .min(10, "Explanation must be at least 10 characters")
    .max(2000, "Explanation must be at most 2000 characters")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string()).optional().default([]),
  pyqYear: z
    .number()
    .int("PYQ year must be an integer")
    .min(1950, "PYQ year must be 1950 or later")
    .max(new Date().getFullYear() + 1, `PYQ year cannot be beyond ${new Date().getFullYear() + 1}`)
    .optional(),
});

export type QuestionInput = z.infer<typeof QuestionSchema>;

// ============================================================================
// Test Configuration Validation
// ============================================================================

export const TestConfigSchema = z.object({
  topics: z
    .array(z.string().min(1, "Topic cannot be empty"))
    .min(1, "At least one topic is required")
    .max(10, "Maximum 10 topics allowed"),
  subtopics: z.array(z.string().min(1, "Subtopic cannot be empty")).optional(),
  difficulty: z.enum(["easy", "medium", "hard", "mixed"], {
    message: "Difficulty must be 'easy', 'medium', 'hard', or 'mixed'",
  }),
  questionCount: z
    .number()
    .int("Question count must be an integer")
    .min(1, "At least 1 question is required")
    .max(200, "Maximum 200 questions allowed"),
});

export type TestConfigInput = z.infer<typeof TestConfigSchema>;

// ============================================================================
// Answer Validation
// ============================================================================

export const AnswerSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  questionIndex: z
    .number()
    .int("Question index must be an integer")
    .min(0, "Question index must be non-negative"),
  answer: z
    .number()
    .int("Answer must be an integer")
    .min(0, "Answer must be between 0 and 3")
    .max(3, "Answer must be between 0 and 3"),
});

export type AnswerInput = z.infer<typeof AnswerSchema>;

// ============================================================================
// Mark for Review Validation
// ============================================================================

export const MarkForReviewSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  questionIndex: z
    .number()
    .int("Question index must be an integer")
    .min(0, "Question index must be non-negative"),
});

export type MarkForReviewInput = z.infer<typeof MarkForReviewSchema>;

// ============================================================================
// Time Extension Validation
// ============================================================================

export const TimeExtensionSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  minutes: z
    .number()
    .int("Minutes must be an integer")
    .refine((val) => val === 5 || val === 10, {
      message: "Extension must be either 5 or 10 minutes",
    }),
});

export type TimeExtensionInput = z.infer<typeof TimeExtensionSchema>;

// ============================================================================
// Bookmark Validation
// ============================================================================

export const BookmarkSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});

export type BookmarkInput = z.infer<typeof BookmarkSchema>;

// ============================================================================
// Bulk Import Validation
// ============================================================================

export const BulkImportSchema = z.object({
  questions: z.array(QuestionSchema).min(1, "At least one question is required"),
});

export type BulkImportInput = z.infer<typeof BulkImportSchema>;

// ============================================================================
// Filter Validation
// ============================================================================

export const QuestionFilterSchema = z.object({
  topic: z.string().optional(),
  subtopic: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
  skip: z.number().int().min(0).optional().default(0),
});

export type QuestionFilterInput = z.infer<typeof QuestionFilterSchema>;

export const BookmarkFilterSchema = z.object({
  topic: z.string().optional(),
  subtopic: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
});

export type BookmarkFilterInput = z.infer<typeof BookmarkFilterSchema>;

export const TestHistoryFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  topic: z.string().optional(),
  minScore: z.number().int().min(0).optional(),
  maxScore: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).max(100).optional().default(10),
  skip: z.number().int().min(0).optional().default(0),
});

export type TestHistoryFilterInput = z.infer<typeof TestHistoryFilterSchema>;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate data against a schema and return typed result
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with parsed data or errors
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Format Zod validation errors into a user-friendly format
 * @param error - Zod error object
 * @returns Object with field names as keys and error messages as values
 */
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  error.issues.forEach((err) => {
    const path = err.path.join(".");
    formatted[path] = err.message;
  });
  return formatted;
}

/**
 * Get the first validation error message
 * @param error - Zod error object
 * @returns First error message
 */
export function getFirstError(error: z.ZodError): string {
  return error.issues[0]?.message || "Validation failed";
}
