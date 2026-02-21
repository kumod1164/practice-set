import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { testService } from "@/lib/services/test-service";
import { handleAPIError } from "@/lib/errors";
import { isAdmin } from "@/lib/admin";

/**
 * GET /api/admin/users/[userId]/tests
 * Get test history for a specific user (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await requireAuthAPI();
    console.log("Admin viewing tests - Session user:", session.user);

    // Check if user is admin
    if (!isAdmin(session.user.email)) {
      console.log("Unauthorized access attempt by:", session.user.email);
      return Response.json(
        {
          success: false,
          error: "Unauthorized - Admin access required",
        },
        { status: 403 }
      );
    }

    const { userId } = await params;
    console.log("Fetching tests for userId:", userId);
    const tests = await testService.getTestHistory(userId, 50, 0);
    console.log("Found tests:", tests.length);

    return Response.json({
      success: true,
      data: tests,
    });
  } catch (error) {
    console.error("Error in admin user tests API:", error);
    return handleAPIError(error);
  }
}
