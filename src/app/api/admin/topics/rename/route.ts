import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin";
import { topicService } from "@/lib/services/topic-service";
import { handleAPIError } from "@/lib/errors";

/**
 * POST /api/admin/topics/rename
 * Rename topics and update all related questions
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();

    const body = await request.json();
    const result = await topicService.renameTopic(body);

    return Response.json({
      success: true,
      data: result,
      message: `Renamed successfully. Updated ${result.questionsUpdated} questions and ${result.testsUpdated} test records.`,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
