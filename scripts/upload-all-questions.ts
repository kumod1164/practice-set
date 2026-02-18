import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

interface Question {
  topic: string;
  subtopic: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
  tags?: string[];
}

async function uploadAllQuestions() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    const questionsCollection = db?.collection("questions");

    if (!questionsCollection) {
      throw new Error("Questions collection not found");
    }

    // Step 1: Delete all existing questions
    console.log("🗑️  Step 1: Deleting all existing questions...");
    const existingCount = await questionsCollection.countDocuments();
    console.log(`   Found ${existingCount} existing questions`);
    
    if (existingCount > 0) {
      const deleteResult = await questionsCollection.deleteMany({});
      console.log(`   ✅ Deleted ${deleteResult.deletedCount} questions\n`);
    } else {
      console.log("   ℹ️  No existing questions to delete\n");
    }

    // Step 2: Load and upload all JSON files
    console.log("📤 Step 2: Uploading new questions...\n");

    const questionsDir = path.resolve(process.cwd(), "scripts/questions");
    
    // Check if questions directory exists
    if (!fs.existsSync(questionsDir)) {
      console.log("❌ Error: 'scripts/questions' directory not found!");
      console.log("\n📝 Please create the directory and add your JSON files:");
      console.log("   1. Create folder: scripts/questions/");
      console.log("   2. Add your 5 JSON files there");
      console.log("   3. Run this script again\n");
      process.exit(1);
    }

    // Get all JSON files from the questions directory
    const jsonFiles = fs.readdirSync(questionsDir).filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.log("❌ Error: No JSON files found in 'scripts/questions' directory!");
      console.log("\n📝 Please add your JSON files to: scripts/questions/\n");
      process.exit(1);
    }

    console.log(`   Found ${jsonFiles.length} JSON file(s):\n`);

    let totalQuestionsUploaded = 0;
    const uploadResults: { file: string; count: number; success: boolean; error?: string }[] = [];

    // Process each JSON file
    for (const file of jsonFiles) {
      const filePath = path.join(questionsDir, file);
      console.log(`   📄 Processing: ${file}`);

      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const questions: Question[] = JSON.parse(fileContent);

        // Validate questions
        if (!Array.isArray(questions)) {
          throw new Error("JSON file must contain an array of questions");
        }

        // Validate each question
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          if (!q.topic || !q.subtopic || !q.question || !q.options || 
              q.correctAnswer === undefined || !q.difficulty || !q.explanation) {
            throw new Error(`Invalid question at index ${i}: Missing required fields`);
          }
          if (q.options.length !== 4) {
            throw new Error(`Invalid question at index ${i}: Must have exactly 4 options`);
          }
          if (q.correctAnswer < 0 || q.correctAnswer > 3) {
            throw new Error(`Invalid question at index ${i}: correctAnswer must be 0-3`);
          }
          if (!["easy", "medium", "hard"].includes(q.difficulty)) {
            throw new Error(`Invalid question at index ${i}: difficulty must be easy, medium, or hard`);
          }
        }

        // Add timestamps
        const questionsWithTimestamps = questions.map(q => ({
          ...q,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        // Insert questions
        const result = await questionsCollection.insertMany(questionsWithTimestamps);
        const insertedCount = result.insertedCount;

        console.log(`      ✅ Uploaded ${insertedCount} questions`);
        totalQuestionsUploaded += insertedCount;

        uploadResults.push({
          file,
          count: insertedCount,
          success: true,
        });

      } catch (error: any) {
        console.log(`      ❌ Error: ${error.message}`);
        uploadResults.push({
          file,
          count: 0,
          success: false,
          error: error.message,
        });
      }

      console.log(""); // Empty line for readability
    }

    // Summary
    console.log("=" .repeat(60));
    console.log("📊 UPLOAD SUMMARY");
    console.log("=" .repeat(60));
    console.log(`Total files processed: ${jsonFiles.length}`);
    console.log(`Successful uploads: ${uploadResults.filter(r => r.success).length}`);
    console.log(`Failed uploads: ${uploadResults.filter(r => !r.success).length}`);
    console.log(`Total questions uploaded: ${totalQuestionsUploaded}`);
    console.log("=" .repeat(60));

    if (uploadResults.some(r => !r.success)) {
      console.log("\n❌ Failed files:");
      uploadResults.filter(r => !r.success).forEach(r => {
        console.log(`   - ${r.file}: ${r.error}`);
      });
    }

    console.log("\n✨ Upload process completed!");
    
    if (totalQuestionsUploaded > 0) {
      console.log("\n🎉 Success! Your questions are now in the database.");
      console.log("   You can now:");
      console.log("   1. Start your dev server: npm run dev");
      console.log("   2. Login as admin");
      console.log("   3. View questions at: http://localhost:3000/admin/questions");
      console.log("   4. Create and take tests!");
    }

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Fatal Error:", error);
    process.exit(1);
  }
}

uploadAllQuestions();
