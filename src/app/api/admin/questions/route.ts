import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin";
import { questionService } from "@/lib/services/question-service";
import { handleAPIError } from "@/lib/errors";
import { QuestionFilterInput } from "@/lib/validations";

/**
 * GET /api/admin/questions
 * List all questions with optional filters
 * Admin only
 */
export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminSession();

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const filters: QuestionFilterInput = {
      topic: searchParams.get("topic") || undefined,
      subtopic: searchParams.get("subtopic") || undefined,
      difficulty: (searchParams.get("difficulty") as "easy" | "medium" | "hard") || undefined,
      tags: searchParams.get("tags")?.split(",") || undefined,
      limit: parseInt(searchParams.get("limit") || "50"),
      skip: parseInt(searchParams.get("skip") || "0"),
    };

    // Get questions
    const questions = await questionService.getQuestions(filters);

    return Response.json({
      success: true,
      data: questions,
      count: questions.length,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * POST /api/admin/questions
 * Create a new question
 * Admin only
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminSession();

    // Parse request body
    const body = await request.json();

    // Create question
    const question = await questionService.createQuestion(body);

    return Response.json(
      {
        success: true,
        data: question,
        message: "Question created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
