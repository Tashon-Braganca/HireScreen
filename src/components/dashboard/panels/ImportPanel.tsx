"use client";

import React, { useState, useRef } from "react";
import { useJobContext } from "@/components/dashboard/JobContext";
import { cn } from "@/lib/utils";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { importCandidates, type ParsedImportCandidate } from "@/app/actions/import";

interface CSVRow {
  name: string;
  email: string;
  resume_url: string;
  notes: string;
}

export function ImportPanel() {
  const { job } = useJobContext();
  const [parsedData, setParsedData] = useState<CSVRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError(null);
    setParsedData([]);
    setImported(false);

    if (!file.name.endsWith(".csv")) {
      setParseError("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = parseCSV(text);
        setParsedData(rows);
      } catch (err) {
        setParseError(err instanceof Error ? err.message : "Failed to parse CSV");
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) {
      throw new Error("CSV must have a header row and at least one data row");
    }

    const headerLine = lines[0].toLowerCase();
    const headers = headerLine.split(",").map((h) => h.trim().replace(/"/g, ""));

    const nameIdx = headers.findIndex((h) => h === "name");
    const emailIdx = headers.findIndex((h) => h === "email");
    const resumeUrlIdx = headers.findIndex((h) => h === "resume_url" || h === "resume url");
    const notesIdx = headers.findIndex((h) => h === "notes");

    if (nameIdx === -1 || emailIdx === -1) {
      throw new Error("CSV must have 'name' and 'email' columns");
    }

    const rows: CSVRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length >= 2) {
        rows.push({
          name: values[nameIdx]?.trim() || "",
          email: values[emailIdx]?.trim() || "",
          resume_url: resumeUrlIdx !== -1 ? values[resumeUrlIdx]?.trim() || "" : "",
          notes: notesIdx !== -1 ? values[notesIdx]?.trim() || "" : "",
        });
      }
    }

    const validRows = rows.filter((r) => r.name && r.email);
    if (validRows.length === 0) {
      throw new Error("No valid rows found. Each row must have a name and email.");
    }

    return validRows;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;

    setIsImporting(true);
    try {
      const candidates: ParsedImportCandidate[] = parsedData.map((row) => ({
        name: row.name,
        email: row.email,
        resume_url: row.resume_url || undefined,
        notes: row.notes || undefined,
      }));

      const result = await importCandidates(job.id, candidates);
      if (result.success) {
        toast.success(`Imported ${result.imported?.length || candidates.length} candidates`);
        setImported(true);
        setParsedData([]);
      } else {
        toast.error(result.error || "Failed to import");
      }
    } catch {
      toast.error("Failed to import candidates");
    } finally {
      setIsImporting(false);
    }
  };

  const removeRow = (index: number) => {
    setParsedData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-bg">
      <div className="p-4 border-b border-border">
        <h2 className="font-display text-base text-ink mb-1">Import Candidates</h2>
        <p className="text-xs text-muted">
          Export from Greenhouse, Lever, or Workday as CSV and import here.
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {parseError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{parseError}</p>
          </div>
        )}

        {imported && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 flex items-start gap-2">
            <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">Candidates imported successfully!</p>
          </div>
        )}

        {parsedData.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent hover:bg-accent-light/30 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <FileSpreadsheet size={32} className="mx-auto text-muted mb-3" />
            <p className="text-sm font-medium text-ink mb-1">
              Drop CSV file here or click to browse
            </p>
            <p className="text-xs text-muted">
              Required columns: name, email. Optional: resume_url, notes
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted">
                {parsedData.length} candidate{parsedData.length !== 1 ? "s" : ""} to import
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-accent hover:underline"
              >
                Upload different file
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-paper border-b border-border">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted">Email</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted hidden md:table-cell">Resume URL</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.map((row, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0">
                      <td className="px-3 py-2 text-ink">{row.name}</td>
                      <td className="px-3 py-2 text-muted">{row.email}</td>
                      <td className="px-3 py-2 text-muted hidden md:table-cell">
                        {row.resume_url && (
                          <a
                            href={row.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline flex items-center gap-1"
                          >
                            <span className="truncate max-w-[150px]">{row.resume_url}</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => removeRow(idx)}
                          className="p-1 text-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleImport}
                disabled={isImporting}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded transition-colors",
                  isImporting
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-accent text-white hover:bg-accent-hover"
                )}
              >
                <Upload size={16} />
                {isImporting ? "Importing..." : "Confirm Import"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 p-3 rounded-lg bg-paper border border-border">
          <p className="text-xs text-muted mb-2 font-medium">CSV Format Example:</p>
          <code className="text-xs text-muted block bg-bg p-2 rounded font-mono">
            name,email,resume_url,notes<br />
            John Doe,john@example.com,https://...,Applied via referral<br />
            Jane Smith,jane@example.com,,
          </code>
        </div>
      </div>
    </div>
  );
}
