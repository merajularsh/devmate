"use client";
import { useState, useEffect, useRef } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface ReviewResponse {
  language: string;
  summary: string;
  issues: Array<{
    line: number | null;
    severity: "high" | "medium" | "low";
    problem: string;
    fix: string;
  }>;
  improvedCode: string;
  testingTips?: string;
  performanceAnalysis?: string;
}

interface SavedReview {
  id: string;
  title: string;
  timestamp: string;
  code: string;
  language: string;
  review: ReviewResponse;
}

const LANGUAGES = [
  "auto-detect",
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "SQL",
];

const severityColors = {
  high: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700", dot: "🔴" },
  medium: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", dot: "🟡" },
  low: { bg: "bg-green-50", border: "border-green-300", text: "text-green-700", dot: "🟢" },
};

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("auto-detect");
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedReviews, setSavedReviews] = useState<SavedReview[]>([]);
  const [view, setView] = useState<"main" | "comparison">("main");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Load saved reviews from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("devmate_reviews");
    if (saved) {
      setSavedReviews(JSON.parse(saved));
    }
  }, []);

  // Sync line numbers with textarea scroll
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Generate line numbers
  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Auto-generate title from first line of code
  function generateTitle() {
    const firstLine = code.split("\n")[0].trim();
    if (firstLine.length > 50) {
      return firstLine.substring(0, 50) + "...";
    }
    return firstLine || `Review - ${language}`;
  }

  // Save review with title
  function handleSaveClick() {
    if (!review) return;
    setSaveTitle(generateTitle());
    setShowSaveDialog(true);
  }

  function confirmSave() {
    if (!review || !saveTitle.trim()) return;

    const newReview: SavedReview = {
      id: Date.now().toString(),
      title: saveTitle.trim(),
      timestamp: new Date().toLocaleString(),
      code,
      language,
      review,
    };

    const updated = [newReview, ...savedReviews].slice(0, 15); // Keep 15 reviews
    setSavedReviews(updated);
    localStorage.setItem("devmate_reviews", JSON.stringify(updated));
    setShowSaveDialog(false);
  }

  // Load a past review
  function loadReview(saved: SavedReview) {
    setCode(saved.code);
    setLanguage(saved.language);
    setReview(saved.review);
  }

  // Clear all inputs
  function clearAll() {
    setCode("");
    setLanguage("auto-detect");
    setReview(null);
    setError("");
  }

  // Delete a saved review
  function deleteReview(id: string) {
    const updated = savedReviews.filter((r) => r.id !== id);
    setSavedReviews(updated);
    localStorage.setItem("devmate_reviews", JSON.stringify(updated));
  }

  async function handleReview() {
    if (!code.trim()) {
      setError("Please paste some code.");
      return;
    }

    setLoading(true);
    setError("");
    setReview(null);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setReview(data);
        setView("main");
      }
    } catch (err) {
      setError("Failed to connect. Try again.");
    }

    setLoading(false);
  }

  function copyCode() {
    if (!review?.improvedCode) return;
    navigator.clipboard.writeText(review.improvedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function exportMarkdown() {
    if (!review) return;

    const markdown = `# Code Review Report

**Title**: ${code.split("\n")[0].substring(0, 100)}
**Date**: ${new Date().toLocaleString()}
**Language**: ${review.language}

## Summary
${review.summary}

## Issues Found (${review.issues.length})
${review.issues
  .map(
    (issue, i) =>
      `
### ${i + 1}. ${issue.severity.toUpperCase()} - ${issue.problem}
${issue.line ? `**Line**: ${issue.line}` : ""}

**Problem**: ${issue.problem}

**Fix**: ${issue.fix}
`
  )
  .join("\n")}

## Improved Code
\`\`\`${review.language.toLowerCase()}
${review.improvedCode}
\`\`\`

${review.testingTips ? `## Testing Suggestions\n${review.testingTips}\n` : ""}
${review.performanceAnalysis ? `## Performance Analysis\n${review.performanceAnalysis}\n` : ""}

---
Generated by DevMate | https://devmate.vercel.app
`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `review-${Date.now()}.md`;
    a.click();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            DevMate
          </h1>
          <p className="text-purple-200 text-lg">
            AI Code Reviewer — Paste your code, get intelligent feedback.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar: History */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4 sticky top-4">
              <h3 className="text-sm font-bold text-purple-300 mb-4">
                📋 Review History
              </h3>

              {savedReviews.length === 0 ? (
                <p className="text-xs text-purple-400">No saved reviews yet.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {savedReviews.map((saved) => (
                    <div
                      key={saved.id}
                      className="bg-slate-700 p-2 rounded text-xs hover:bg-slate-600 transition"
                    >
                      <button
                        onClick={() => loadReview(saved)}
                        className="text-left w-full mb-1 text-purple-200 hover:text-purple-100"
                      >
                        <div className="font-semibold truncate text-xs">
                          {saved.title}
                        </div>
                        <div className="text-purple-400 text-xs mt-0.5">
                          {saved.language}
                        </div>
                        <div className="text-purple-500 text-xs mt-0.5">
                          {saved.timestamp}
                        </div>
                      </button>
                      <button
                        onClick={() => deleteReview(saved.id)}
                        className="text-red-400 hover:text-red-300 text-xs w-full text-left mt-1 py-1 px-1 hover:bg-red-900/20 rounded"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {view === "main" ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Input Panel */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Programming Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Paste Your Code
                    </label>
                    <div className="flex gap-2 bg-slate-800 border border-purple-500 rounded-lg overflow-hidden">
                      {/* Line Numbers */}
                      <div
                        ref={lineNumbersRef}
                        className="bg-slate-700 text-purple-400 font-mono text-sm p-3 overflow-hidden select-none min-w-fit"
                        style={{ lineHeight: "1.5" }}
                      >
                        {lineNumbers.map((num) => (
                          <div key={num}>{num}</div>
                        ))}
                      </div>

                      {/* Code Textarea */}
                      <textarea
                        ref={textareaRef}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onScroll={handleScroll}
                        placeholder="Paste code here... max 8000 characters"
                        className="flex-1 px-4 py-3 bg-slate-800 text-white focus:outline-none font-mono text-sm resize-none min-h-[500px]"
                        maxLength={8000}
                        style={{ lineHeight: "1.5" }}
                      />
                    </div>
                    <div className="text-xs text-purple-300 mt-2">
                      {code.length} / 8000 characters • {lineCount} lines
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleReview}
                      disabled={loading || !code.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition"
                    >
                      {loading ? "Analyzing..." : "Review Code"}
                    </button>

                    <button
                      onClick={clearAll}
                      className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                      title="Clear all inputs"
                    >
                      🗑️ Clear
                    </button>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-900/30 border border-red-600 rounded-lg text-red-200 text-sm">
                      {error}
                    </div>
                  )}
                </div>

                {/* Output Panel */}
                <div className="space-y-4">
                  {review ? (
                    <>
                      {/* Summary */}
                      <div className="p-4 bg-slate-800/50 border border-purple-500 rounded-lg">
                        <h3 className="text-sm font-semibold text-purple-300 mb-2">
                          📋 Summary
                        </h3>
                        <p className="text-white text-sm leading-relaxed">
                          {review.summary}
                        </p>
                        <p className="text-xs text-purple-300 mt-2">
                          Language: <span className="font-mono">{review.language}</span>
                        </p>
                      </div>

                      {/* Issues */}
                      {review.issues && review.issues.length > 0 ? (
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-purple-300">
                            🔍 Issues Found ({review.issues.length})
                          </h3>
                          {review.issues.map((issue, i) => {
                            const colors = severityColors[issue.severity];
                            return (
                              <div
                                key={i}
                                className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="text-lg mt-0.5">{colors.dot}</span>
                                  <div className="flex-1">
                                    <div className={`font-semibold ${colors.text} text-sm`}>
                                      {issue.severity.charAt(0).toUpperCase() +
                                        issue.severity.slice(1)}{" "}
                                      {issue.line ? `• Line ${issue.line}` : ""}
                                    </div>
                                    <p className={`text-sm ${colors.text} mt-1`}>
                                      {issue.problem}
                                    </p>
                                    <p className={`text-xs ${colors.text} mt-2 italic`}>
                                      💡 {issue.fix}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 bg-green-900/30 border border-green-600 rounded-lg">
                          <p className="text-green-200 text-sm font-semibold">
                            ✅ No issues found! Code looks good.
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setView("comparison")}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition"
                        >
                          👀 See Comparison
                        </button>
                        <button
                          onClick={exportMarkdown}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition"
                        >
                          📥 Export MD
                        </button>
                        <button
                          onClick={handleSaveClick}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition"
                        >
                          💾 Save
                        </button>
                      </div>

                      {/* Improved Code */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-purple-300">
                            ✨ Improved Code
                          </h3>
                          <button
                            onClick={copyCode}
                            className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                          >
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <div className="rounded-lg overflow-hidden">
                          <SyntaxHighlighter
                            language={review.language.toLowerCase()}
                            style={atomOneDark}
                            customStyle={{
                              margin: 0,
                              fontSize: "12px",
                              padding: "12px",
                            }}
                          >
                            {review.improvedCode}
                          </SyntaxHighlighter>
                        </div>
                      </div>

                      {/* Testing Tips */}
                      {review.testingTips && (
                        <div className="p-4 bg-slate-800/50 border border-blue-500/30 rounded-lg">
                          <h4 className="text-sm font-semibold text-blue-300 mb-2">
                            🧪 Testing Suggestions
                          </h4>
                          <p className="text-sm text-white whitespace-pre-wrap">
                            {review.testingTips}
                          </p>
                        </div>
                      )}

                      {/* Performance Analysis */}
                      {review.performanceAnalysis && (
                        <div className="p-4 bg-slate-800/50 border border-orange-500/30 rounded-lg">
                          <h4 className="text-sm font-semibold text-orange-300 mb-2">
                            ⚡ Performance Analysis
                          </h4>
                          <p className="text-sm text-white whitespace-pre-wrap">
                            {review.performanceAnalysis}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center p-6 bg-slate-800/50 border border-purple-500/30 rounded-lg">
                      <p className="text-purple-300 text-center text-sm">
                        Paste code on the left and click Review Code
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Comparison View
              <div className="space-y-4">
                <button
                  onClick={() => setView("main")}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  ← Back
                </button>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Original */}
                  <div>
                    <h3 className="text-sm font-semibold text-red-300 mb-2">
                      ❌ Original Code
                    </h3>
                    <div className="rounded-lg overflow-hidden">
                      <SyntaxHighlighter
                        language={review?.language.toLowerCase() || "text"}
                        style={atomOneDark}
                        customStyle={{
                          margin: 0,
                          fontSize: "12px",
                          padding: "12px",
                        }}
                        showLineNumbers
                      >
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  {/* Improved */}
                  <div>
                    <h3 className="text-sm font-semibold text-green-300 mb-2">
                      ✅ Improved Code
                    </h3>
                    <div className="rounded-lg overflow-hidden">
                      <SyntaxHighlighter
                        language={review?.language.toLowerCase() || "text"}
                        style={atomOneDark}
                        customStyle={{
                          margin: 0,
                          fontSize: "12px",
                          padding: "12px",
                        }}
                        showLineNumbers
                      >
                        {review?.improvedCode || ""}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>

                {/* Issues List */}
                {review?.issues && (
                  <div className="p-4 bg-slate-800/50 border border-purple-500 rounded-lg">
                    <h3 className="text-sm font-semibold text-purple-300 mb-3">
                      📝 What Changed
                    </h3>
                    <div className="space-y-2">
                      {review.issues.map((issue, i) => {
                        const colors = severityColors[issue.severity];
                        return (
                          <div key={i} className={`p-2 rounded ${colors.bg}`}>
                            <p className={`text-sm font-semibold ${colors.text}`}>
                              {colors.dot} {issue.problem}
                            </p>
                            <p className={`text-xs ${colors.text} mt-1`}>
                              → {issue.fix}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-purple-500 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-white mb-4">Save Review</h3>
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="Enter a title for this review"
                className="w-full px-4 py-2 bg-slate-700 text-white border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={confirmSave}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-purple-300 text-xs">
          Built with Next.js, Claude AI, and Tailwind CSS
        </div>
      </div>
    </main>
  );
}