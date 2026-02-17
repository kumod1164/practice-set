import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { questionService } from "@/lib/services/question-service";
import { handleAPIError } from "@/lib/errors";
import { TestConfigSchema, validate } from "@/lib/validations";

/**
 * POST /api/tests/configure
 * Validate test configuration and check question availability
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuthAPI();
    const body = await request.json();

    console.log("Received body:", body); // Debug log

    // Validate configuration
    const validation = validate(TestConfigSchema, body);
    if (!validation.success) {
      console.log("Validation errors:", validation.errors.errors); // Debug log
      return Response.json(
        {
          success: false,
          error: "Invalid configuration",
          errors: validation.errors.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          })),
        },
        { status: 400 }
      );
    }

    const config = validation.data;

    // Check question availability
    const availableCount = await questionService.getQuestionCount({
      topics: config.topics,
      subtopics: config.subtopics,
      difficulty: config.difficulty,
    });

    if (availableCount < config.questionCount) {
      return Response.json(
        {
          success: false,
          error: `Insufficient questions available. Found ${availableCount}, need ${config.questionCount}`,
          availableCount,
        },
        { status: 400 }
      );
    }

    // Calculate test duration
    const durationMinutes = Math.ceil(config.questionCount * 1.2);

    return Response.json({
      success: true,
      data: {
        availableCount,
        durationMinutes,
        config,
      },
    });
  } catch (error) {
    console.error("Configure API error:", error); // Debug log
    return handleAPIError(error);
  }
}
