"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export function DangerZone() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDeleteAllData = async () => {
    if (confirmText !== "DELETE") return;
    
    setIsDeleting(true);
    try {
      const response = await fetch("/api/account", {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/login?deleted=true");
      } else {
        alert("Failed to delete data. Please try again.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-red-500/10">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-zinc-100">Danger Zone</h2>
          <p className="text-sm text-zinc-500">Irreversible actions</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
        <div>
          <p className="font-medium text-zinc-200">Delete all data</p>
          <p className="text-sm text-zinc-500">
            Permanently remove all jobs, resumes, and queries
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-zinc-900 border-zinc-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-zinc-100">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400 space-y-3">
                <p>This will permanently delete all your data including:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>All jobs and internships</li>
                  <li>All uploaded resumes</li>
                  <li>All query history</li>
                </ul>
                <p className="font-medium text-red-400">
                  This action cannot be undone.
                </p>
                <div className="pt-2">
                  <p className="text-sm mb-2 text-zinc-300">
                    Type <span className="font-mono font-bold text-zinc-100">DELETE</span> to confirm:
                  </p>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="font-mono bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => setConfirmText("")}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAllData}
                disabled={confirmText !== "DELETE" || isDeleting}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Everything"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
