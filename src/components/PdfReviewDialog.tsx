"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Edit, Trash2, Check } from "lucide-react";

interface ExtractedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface PdfReviewDialogProps {
  questions: ExtractedQuestion[];
  metadata: {
    topic: string;
    subtopic: string;
    difficulty: "easy" | "medium" | "hard";
    tags: string[];
    pyqYear?: number;
  };
  onClose: () => void;
  onImport: () => void;
}

export default function PdfReviewDialog({
  questions: initialQuestions,
  metadata,
  onClose,
  onImport,
}: PdfReviewDialogProps) {
  const { toast } = useToast();
  const [questions, setQuestions] = useState(
    initialQuestions.map((q, idx) => ({ ...q, id: idx, selected: true }))
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggleSelect = (id: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, selected: !q.selected } : q))
    );
  };

  const handleEdit = (id: number) => {
    setEditingIndex(id);
  };

  const handleSaveEdit = (id: number, updatedQuestion: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updatedQuestion } : q))
    );
    setEditingIndex(null);
  };

  const handleDelete = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleImport = async () => {
    const selectedQuestions = questions.filter((q) => q.selected);

    if (selectedQuestions.length === 0) {
      toast({
        title: "No Questions Selected",
        description: "Please select at least one question to import",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const questionsToImport = selectedQuestions.map((q) => ({
        topic: metadata.topic,
        subtopic: metadata.subtopic,
        question: q.question,
        options: q.options as [string, string, string, string],
        correctAnswer: q.correctAnswer as 0 | 1 | 2 | 3,
        difficulty: metadata.difficulty,
        explanation: q.explanation,
        tags: metadata.tags,
        pyqYear: metadata.pyqYear,
      }));

      const response = await fetch("/api/admin/questions/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: questionsToImport }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Imported ${selectedQuestions.length} questions successfully`,
        });
        onImport();
      } else {
        toast({
          title: "Import Failed",
          description: data.error,
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

  const selectedCount = questions.filter((q) => q.selected).length;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Review Extracted Questions ({selectedCount} of {questions.length} selected)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Metadata Summary */}
          <div className="p-4 bg-secondary rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Topic:</span>{" "}
                <span className="font-medium">{metadata.topic}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Subtopic:</span>{" "}
                <span className="font-medium">{metadata.subtopic}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Difficulty:</span>{" "}
                <span className="font-medium capitalize">{metadata.difficulty}</span>
              </div>
              {metadata.pyqYear && (
                <div>
                  <span className="text-muted-foreground">PYQ Year:</span>{" "}
                  <span className="font-medium">{metadata.pyqYear}</span>
                </div>
              )}
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className={`border rounded-lg p-4 ${
                  q.selected ? "border-primary bg-primary/5" : "border-border opacity-60"
                }`}
              >
                {editingIndex === q.id ? (
                  <EditQuestionForm
                    question={q}
                    onSave={(updated) => handleSaveEdit(q.id, updated)}
                    onCancel={() => setEditingIndex(null)}
                  />
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={q.selected}
                        onCheckedChange={() => handleToggleSelect(q.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium mb-2">
                          {index + 1}. {q.question}
                        </div>
                        <div className="space-y-1 text-sm">
                          {q.options.map((opt, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded ${
                                idx === q.correctAnswer
                                  ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100"
                                  : "bg-secondary"
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}. {opt}
                              {idx === q.correctAnswer && (
                                <Check className="inline h-4 w-4 ml-2" />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                          <strong>Explanation:</strong>{" "}
                          {q.explanation || (
                            <span className="text-muted-foreground italic">
                              No explanation provided - you can add one while editing
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(q.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(q.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={loading || selectedCount === 0}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              `Import ${selectedCount} Questions`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditQuestionForm({
  question,
  onSave,
  onCancel,
}: {
  question: any;
  onSave: (updated: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(question);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Question</Label>
        <Textarea
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label>Options</Label>
        {formData.options.map((opt: string, idx: number) => (
          <Input
            key={idx}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            className="mb-2"
            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
          />
        ))}
      </div>

      <div>
        <Label>Correct Answer</Label>
        <Select
          value={formData.correctAnswer.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, correctAnswer: parseInt(value) })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Option A</SelectItem>
            <SelectItem value="1">Option B</SelectItem>
            <SelectItem value="2">Option C</SelectItem>
            <SelectItem value="3">Option D</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Explanation (Optional)</Label>
        <Textarea
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          rows={3}
          placeholder="Add explanation if not provided in PDF..."
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onSave(formData)} size="sm">
          Save
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          Cancel
        </Button>
      </div>
    </div>
  );
}
