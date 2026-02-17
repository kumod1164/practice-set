import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin";
import { questionService } from "@/lib/services/question-service";
import { handleAPIError, FileUploadError } from "@/lib/errors";
import { QuestionInput } from "@/lib/validations";

/**
 * POST /api/admin/questions/bulk-import
 * Import multiple questions from JSON or CSV
 * Admin only
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminSession();

    // Get content type
    const contentType = request.headers.get("content-type") || "";

    let questions: QuestionInput[] = [];

    if (contentType.includes("application/json")) {
      // Handle JSON import
      const body = await request.json();

      if (!body.questions || !Array.isArray(body.questions)) {
        throw new FileUploadError("Invalid JSON format. Expected { questions: [...] }");
      }

      questions = body.questions;
    } else if (contentType.includes("multipart/form-data")) {
      // Handle file upload (JSON or CSV)
      const formData = await request.formData();
      const file = formData.get("file") as File;

      if (!file) {
        throw new FileUploadError("No file provided");
      }

      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        throw new FileUploadError("File size exceeds 10MB limit");
      }

      const fileContent = await file.text();
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith(".json")) {
        // Parse JSON file
        try {
          const parsed = JSON.parse(fileContent);
          questions = Array.isArray(parsed) ? parsed : parsed.questions || [];
        } catch (error) {
          throw new FileUploadError("Invalid JSON file format");
        }
      } else if (fileName.endsWith(".csv")) {
        // Parse CSV file
        questions = parseCSV(fileContent);
      } else {
        throw new FileUploadError("Unsupported file format. Please upload JSON or CSV file");
      }
    } else {
      throw new FileUploadError("Invalid content type. Expected application/json or multipart/form-data");
    }

    // Validate we have questions
    if (questions.length === 0) {
      throw new FileUploadError("No questions found in the import file");
    }

    // Perform bulk import
    const result = await questionService.bulkImport(questions);

    return Response.json({
      success: true,
      data: result,
      message: `Import completed. ${result.successful} successful, ${result.failed} failed`,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Parse CSV content into question objects
 * Expected CSV format:
 * topic,subtopic,question,option1,option2,option3,option4,correctAnswer,difficulty,explanation,tags
 */
function parseCSV(content: string): QuestionInput[] {
  const lines = content.split("\n").filter((line) => line.trim());

  if (lines.length < 2) {
    throw new FileUploadError("CSV file is empty or has no data rows");
  }

  // Parse header
  const header = lines[0].split(",").map((h) => h.trim());

  // Validate header
  const requiredColumns = [
    "topic",
    "subtopic",
    "question",
    "option1",
    "option2",
    "option3",
    "option4",
    "correctAnswer",
    "difficulty",
    "explanation",
  ];

  const missingColumns = requiredColumns.filter((col) => !header.includes(col));
  if (missingColumns.length > 0) {
    throw new FileUploadError(`Missing required columns: ${missingColumns.join(", ")}`);
  }

  // Parse data rows
  const questions: QuestionInput[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    try {
      // Simple CSV parsing (doesn't handle quoted commas)
      const values = line.split(",").map((v) => v.trim());

      if (values.length < requiredColumns.length) {
        throw new Error(`Insufficient columns at line ${i + 1}`);
      }

      const getColumnValue = (columnName: string): string => {
        const index = header.indexOf(columnName);
        return index >= 0 ? values[index] : "";
      };

      const question: QuestionInput = {
        topic: getColumnValue("topic"),
        subtopic: getColumnValue("subtopic"),
        question: getColumnValue("question"),
        options: [
          getColumnValue("option1"),
          getColumnValue("option2"),
          getColumnValue("option3"),
          getColumnValue("option4"),
        ] as [string, string, string, string],
        correctAnswer: parseInt(getColumnValue("correctAnswer")) as 0 | 1 | 2 | 3,
        difficulty: getColumnValue("difficulty") as "easy" | "medium" | "hard",
        explanation: getColumnValue("explanation"),
        tags: getColumnValue("tags")
          ? getColumnValue("tags").split(";").map((t) => t.trim())
          : [],
      };

      questions.push(question);
    } catch (error) {
      throw new FileUploadError(`Error parsing CSV at line ${i + 1}: ${error}`);
    }
  }

  return questions;
}

// Configure route to handle larger payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
