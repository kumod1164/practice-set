"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Upload, Search, FileUp } from "lucide-react";
import AdminQuestionForm from "@/components/AdminQuestionForm";
import BulkImportDialog from "@/components/BulkImportDialog";
import PdfImportDialog from "@/components/PdfImportDialog";
import PdfReviewDialog from "@/components/PdfReviewDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Question {
  _id: string;
  topic: string;
  subtopic: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  difficulty: "easy" | "medium" | "hard";
  pyqYear?: number;
  explanation?: string;
  tags: string[];
  createdAt: string;
}

export default function AdminQuestionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showPdfImport, setShowPdfImport] = useState(false);
  const [showPdfReview, setShowPdfReview] = useState(false);
  const [extractedQuestions, setExtractedQuestions] = useState<any[]>([]);
  const [pdfMetadata, setPdfMetadata] = useState<any>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Available topics and subtopics
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [availableSubtopics, setAvailableSubtopics] = useState<string[]>([]);

  // Filters
  const [topicFilter, setTopicFilter] = useState("");
  const [subtopicFilter, setSubtopicFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    } else if (status === "authenticated") {
      fetchQuestions();
      fetchTopics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router]);

  const fetchTopics = async () => {
    try {
      const response = await fetch("/api/tests/topics");
      const data = await response.json();
      if (data.success) {
        setAvailableTopics(data.data.topics || []);
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    }
  };

  // Update available subtopics when topic filter changes
  useEffect(() => {
    if (topicFilter) {
      const subtopics = [...new Set(
        questions
          .filter(q => q.topic === topicFilter)
          .map(q => q.subtopic)
      )].sort();
      setAvailableSubtopics(subtopics);
    } else {
      setAvailableSubtopics([]);
    }
  }, [topicFilter, questions]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (topicFilter && topicFilter !== "all") params.append("topic", topicFilter);
      if (subtopicFilter && subtopicFilter !== "all") params.append("subtopic", subtopicFilter);
      if (difficultyFilter && difficultyFilter !== "all") params.append("difficulty", difficultyFilter);
      
      // Fetch all questions for client-side pagination and search
      params.append("limit", "1000");

      const response = await fetch(`/api/admin/questions?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setQuestions(data.data);
        setTotalCount(data.total || data.data.length);
        setCurrentPage(1); // Reset to first page when filters change
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch questions",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setTopicFilter("");
    setSubtopicFilter("");
    setDifficultyFilter("all");
    setSearchQuery("");
    
    // Fetch all questions without filters
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/questions?limit=1000`);
      const data = await response.json();

      if (data.success) {
        setQuestions(data.data);
        setTotalCount(data.total || data.data.length);
        setCurrentPage(1);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Question deleted successfully",
        });
        fetchQuestions();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete question",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingQuestion(null);
    fetchQuestions();
  };

  const handleBulkImportClose = () => {
    setShowBulkImport(false);
    fetchQuestions();
  };

  const handlePdfImportClose = () => {
    // Only close if we're not in the middle of extraction
    setShowPdfImport(false);
  };

  const handleQuestionsExtracted = (questions: any[], metadata: any) => {
    setExtractedQuestions(questions);
    setPdfMetadata(metadata);
    setShowPdfImport(false);
    setShowPdfReview(true);
  };

  const handlePdfReviewClose = () => {
    setShowPdfReview(false);
    setExtractedQuestions([]);
    setPdfMetadata(null);
  };

  const handlePdfImportComplete = () => {
    setShowPdfReview(false);
    setExtractedQuestions([]);
    setPdfMetadata(null);
    fetchQuestions();
  };

  const filteredQuestions = questions.filter((q) =>
    searchQuery
      ? q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle></CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => setShowPdfImport(true)} variant="outline">
                <FileUp className="mr-2 h-4 w-4" />
                Import from PDF
              </Button>
              <Button onClick={() => setShowBulkImport(true)} variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Import JSON
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={topicFilter || "all"} onValueChange={(val) => setTopicFilter(val === "all" ? "" : val)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {availableTopics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={subtopicFilter || "all"} 
              onValueChange={(val) => setSubtopicFilter(val === "all" ? "" : val)}
              disabled={!topicFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by subtopic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subtopics</SelectItem>
                {availableSubtopics.map((subtopic) => (
                  <SelectItem key={subtopic} value={subtopic}>
                    {subtopic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 mb-4">
            <Button onClick={fetchQuestions} variant="outline">
              Apply Filters
            </Button>
            <Button 
              onClick={handleResetFilters} 
              variant="ghost"
            >
              Reset Filters
            </Button>
          </div>

          {/* Questions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Subtopic</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>PYQ</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No questions found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedQuestions.map((question) => (
                    <TableRow key={question._id}>
                      <TableCell className="font-medium">{question.topic}</TableCell>
                      <TableCell>{question.subtopic}</TableCell>
                      <TableCell className="max-w-md truncate">{question.question}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            question.difficulty === "easy"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : question.difficulty === "medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {question.difficulty}
                        </span>
                      </TableCell>
                      <TableCell>
                        {question.pyqYear && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            PYQ - {question.pyqYear}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {question.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                          {question.tags.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{question.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {question.createdAt ? new Date(question.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(question._id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground min-w-0">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredQuestions.length)} of {filteredQuestions.length} questions
            </div>

            {totalPages > 1 && (
              <div className="flex-shrink-0">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage = 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1);
                      
                      const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                      const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Form Dialog */}
      {showForm && (
        <AdminQuestionForm
          question={editingQuestion}
          onClose={handleFormClose}
        />
      )}

      {/* Bulk Import Dialog */}
      {showBulkImport && <BulkImportDialog onClose={handleBulkImportClose} />}

      {/* PDF Import Dialog */}
      {showPdfImport && (
        <PdfImportDialog
          onClose={handlePdfImportClose}
          onQuestionsExtracted={handleQuestionsExtracted}
        />
      )}

      {/* PDF Review Dialog */}
      {showPdfReview && extractedQuestions.length > 0 && pdfMetadata && (
        <PdfReviewDialog
          questions={extractedQuestions}
          metadata={pdfMetadata}
          onClose={handlePdfReviewClose}
          onImport={handlePdfImportComplete}
        />
      )}
    </>
  );
}
