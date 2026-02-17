import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin";
import { questionService } from "@/lib/services/question-service";
import { handleAPIError } from "@/lib/errors";

/**
 * GET /api/admin/questions/[id]
 * Get a single question by ID
 * Admin only
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    await requireAdminSession();

    // Get question
    const question = await questionService.getQuestionById(params.id);

    return Response.json({
      success: true,
      data: question,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * PUT /api/admin/questions/[id]
 * Update a question
 * Admin only
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    await requireAdminSession();

    // Parse request body
    const body = await request.json();

    // Update question
    const question = await questionService.updateQuestion(params.id, body);

    return Response.json({
      success: true,
      data: question,
      message: "Question updated successfully",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * DELETE /api/admin/questions/[id]
 * Delete a question
 * Admin only
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    await requireAdminSession();

    // Delete question
    await questionService.deleteQuestion(params.id);

    return Response.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
