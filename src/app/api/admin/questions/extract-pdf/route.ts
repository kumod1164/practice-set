import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireAdminSession } from "@/lib/admin";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin access
    await requireAdminSession();

    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No PDF file provided" },
        { status: 400 }
      );
    }

    // Convert file to base64 for Gemini
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Use Gemini 2.5 Flash (latest stable, supports PDFs)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash" 
    });

    const prompt = `Extract all multiple-choice questions from this PDF document. For each question, identify:
- Question text
- Exactly 4 options (A, B, C, D)
- Correct answer (as index 0-3, where 0=A, 1=B, 2=C, 3=D)
- Explanation (ONLY if explicitly provided in the PDF, otherwise leave it empty)

IMPORTANT RULES:
1. Each question MUST have exactly 4 options
2. correctAnswer MUST be a number from 0 to 3
3. If explanation is NOT in the PDF, set explanation to empty string ""
4. Do NOT create explanations - only extract what's in the PDF
5. Extract ALL questions from the document
6. Maintain the original question text exactly as written

Return ONLY a valid JSON array with this exact structure (no markdown, no code blocks, just raw JSON):
[{
  "question": "question text here",
  "options": ["option A", "option B", "option C", "option D"],
  "correctAnswer": 0,
  "explanation": ""
}]`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64,
        },
      },
      { text: prompt },
    ]);

    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    let questions;
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      questions = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse extracted questions. Please try again or check the PDF format.",
        },
        { status: 500 }
      );
    }

    // Validate the extracted questions
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No questions found in the PDF. Please check the document format.",
        },
        { status: 400 }
      );
    }

    // Validate each question structure
    const validatedQuestions = questions.map((q) => {
      // Ensure explanation exists (empty string if not provided)
      if (!q.explanation) {
        q.explanation = "";
      }
      return q;
    }).filter((q) => {
      return (
        q.question &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctAnswer === "number" &&
        q.correctAnswer >= 0 &&
        q.correctAnswer <= 3
      );
    });

    if (validatedQuestions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Extracted questions do not match the required format.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        questions: validatedQuestions,
        totalExtracted: questions.length,
        validQuestions: validatedQuestions.length,
      },
    });
  } catch (error: any) {
    console.error("PDF extraction error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to extract questions from PDF",
      },
      { status: 500 }
    );
  }
}
