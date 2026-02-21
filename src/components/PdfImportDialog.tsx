"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Loader2 } from "lucide-react";

interface PdfImportDialogProps {
  onClose: () => void;
  onQuestionsExtracted: (questions: any[], metadata: any) => void;
}

export default function PdfImportDialog({
  onClose,
  onQuestionsExtracted,
}: PdfImportDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Uploading PDF...");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep] = useState<"upload" | "metadata">("upload");
  const [extractedQuestions, setExtractedQuestions] = useState<any[]>([]);
  
  // Metadata
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [tags, setTags] = useState("");
  const [pyqYear, setPyqYear] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid File",
          description: "Please select a PDF file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleExtract = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setLoadingMessage("Uploading PDF...");
    
    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);

      // Simulate progress messages
      const messageInterval = setInterval(() => {
        setLoadingMessage((prev) => {
          if (prev === "Uploading PDF...") return "Analyzing document...";
          if (prev === "Analyzing document...") return "Extracting questions...";
          if (prev === "Extracting questions...") return "Processing answers...";
          if (prev === "Processing answers...") return "Almost done...";
          return "Finalizing...";
        });
      }, 5000);

      const response = await fetch("/api/admin/questions/extract-pdf", {
        method: "POST",
        body: formData,
      });

      clearInterval(messageInterval);
      const data = await response.json();

      if (data.success) {
        console.log("Extracted questions:", data.data.questions);
        setExtractedQuestions(data.data.questions);
        setStep("metadata");
        toast({
          title: "Success",
          description: `Extracted ${data.data.validQuestions} questions from PDF`,
        });
      } else {
        toast({
          title: "Extraction Failed",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract questions from PDF",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (!topic || !subtopic) {
      toast({
        title: "Missing Information",
        description: "Please provide topic and subtopic",
        variant: "destructive",
      });
      return;
    }

    const metadata = {
      topic,
      subtopic,
      difficulty,
      tags: tags.split(",").map((t) => t.trim()).filter((t) => t),
      pyqYear: pyqYear ? parseInt(pyqYear) : undefined,
    };

    onQuestionsExtracted(extractedQuestions, metadata);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === "upload" ? "Upload PDF" : "Add Metadata"}
          </DialogTitle>
        </DialogHeader>

        {step === "upload" ? (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <Label htmlFor="pdf-upload" className="cursor-pointer">
                <div className="text-sm font-medium mb-2">
                  {selectedFile ? selectedFile.name : "Click to upload PDF"}
                </div>
                <div className="text-xs text-muted-foreground">
                  PDF files only, max 10MB
                </div>
              </Label>
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{selectedFile.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> The PDF should contain multiple-choice questions
                with 4 options each. The AI will extract questions, options, and correct
                answers. Explanations are optional - you can add them during review if not
                present in the PDF.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-sm text-green-900 dark:text-green-100">
                ✓ Extracted {extractedQuestions.length} questions successfully
              </div>
            </div>

            <div>
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Indian Polity"
                required
              />
            </div>

            <div>
              <Label htmlFor="subtopic">Subtopic *</Label>
              <Input
                id="subtopic"
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                placeholder="e.g., Fundamental Rights"
                required
              />
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pyqYear">PYQ Year (Optional)</Label>
              <Input
                id="pyqYear"
                type="number"
                min={1950}
                max={new Date().getFullYear() + 1}
                value={pyqYear}
                onChange={(e) => setPyqYear(e.target.value)}
                placeholder="e.g., 2023"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (Optional, comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., constitution, rights, law"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          {step === "upload" ? (
            <Button onClick={handleExtract} disabled={!selectedFile || loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {loadingMessage}
                </>
              ) : (
                "Extract Questions"
              )}
            </Button>
          ) : (
            <Button onClick={handleProceed}>
              Review Questions
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
