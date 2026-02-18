import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { testService } from "@/lib/services/test-service";
import { handleAPIError } from "@/lib/errors";

/**
 * GET /api/tests/[id]
 * Get test results with detailed review
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthAPI();

    // Await params
    const { id } = await params;

    const test = await testService.getTestById(id);

    return Response.json({
      success: true,
      data: test,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
