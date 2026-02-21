import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(request: NextRequest) {
  try {
    // Direct API call to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: data.error?.message || "Failed to fetch models",
        statusCode: response.status,
      });
    }
    
    return NextResponse.json({
      success: true,
      models: data.models?.map((m: any) => ({
        name: m.name,
        displayName: m.displayName,
        description: m.description,
        supportedGenerationMethods: m.supportedGenerationMethods,
      })) || [],
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString(),
    });
  }
}
