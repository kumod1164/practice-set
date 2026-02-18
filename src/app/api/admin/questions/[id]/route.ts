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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminSession();

    // Await params
    const { id } = await params;

    // Get question
    const question = await questionService.getQuestionById(id);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminSession();

    // Await params
    const { id } = await params;

    // Parse request body
    const body = await request.json();

    // Update question
    const question = await questionService.updateQuestion(id, body);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminSession();

    // Await params
    const { id } = await params;

    // Delete question
    await questionService.deleteQuestion(id);

    return Response.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
