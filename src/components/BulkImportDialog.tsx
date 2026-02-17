"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileJson, FileSpreadsheet, AlertCircle } from "lucide-react";

interface BulkImportDialogProps {
  onClose: () => void;
}

export default function BulkImportDialog({ onClose }: BulkImportDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    successful: number;
    failed: number;
    errors: { line: number; error: string }[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      const fileName = selectedFile.name.toLowerCase();
      if (!fileName.endsWith(".json") && !fileName.endsWith(".csv")) {
        toast({
          title: "Error",
          description: "Only JSON and CSV files are supported",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/questions/bulk-import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        toast({
          title: "Import Complete",
          description: `${data.data.successful} questions imported successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to import questions",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Import Questions</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="text-sm font-medium mb-2">
                {file ? file.name : "Click to upload or drag and drop"}
              </div>
              <div className="text-xs text-muted-foreground">
                JSON or CSV files (max 10MB)
              </div>
            </label>
          </div>

          {/* Format Information */}
          <div className="space-y-4">
            <div className="text-sm font-medium">Supported Formats:</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileJson className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">JSON Format</span>
                </div>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`{
  "questions": [
    {
      "topic": "History",
      "subtopic": "Ancient India",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "difficulty": "easy",
      "explanation": "...",
      "tags": ["tag1", "tag2"]
    }
  ]
}`}
                </pre>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileSpreadsheet className="h-5 w-5 text-green-500" />
                  <span className="font-medium">CSV Format</span>
                </div>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`topic,subtopic,question,option1,option2,option3,option4,correctAnswer,difficulty,explanation,tags
History,Ancient India,...,A,B,C,D,0,easy,...,tag1;tag2`}
                </pre>
              </div>
            </div>
          </div>

          {/* Import Result */}
          {result && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="font-medium">Import Results:</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">{result.successful}</div>
                  <div className="text-xs text-green-700">Successful</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded">
                  <div className="text-2xl font-bold text-red-600">{result.failed}</div>
                  <div className="text-xs text-red-700">Failed</div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-2">
                    <AlertCircle className="h-4 w-4" />
                    Errors:
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {result.errors.map((error, idx) => (
                      <div key={idx} className="text-xs bg-destructive/10 p-2 rounded">
                        <span className="font-medium">Line {error.line}:</span> {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {result ? "Close" : "Cancel"}
          </Button>
          {!result && (
            <Button onClick={handleUpload} disabled={!file || loading}>
              {loading ? "Importing..." : "Import Questions"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
