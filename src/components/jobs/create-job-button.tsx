"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Briefcase, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import type { JobType } from "@/types";

interface CreateJobButtonProps {
  disabled?: boolean;
  defaultType?: JobType;
}

export function CreateJobButton({ disabled, defaultType = "job" }: CreateJobButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<JobType>(defaultType);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        user_id: user?.id,
        title: title.trim(),
        description: description.trim() || null,
        type: type,
      })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success(`${type === "job" ? "Job" : "Internship"} created!`);
    setOpen(false);
    setTitle("");
    setDescription("");
    setLoading(false);
    router.push(`/jobs/${data.id}`);
    router.refresh();
  };

  if (disabled) {
    return (
      <Button disabled>
        <Plus className="h-4 w-4 mr-2" />
        New {defaultType === "job" ? "Job" : "Internship"} (Limit Reached)
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New {defaultType === "job" ? "Job" : "Internship"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleCreate}>
          <DialogHeader>
            <DialogTitle>Create a new position</DialogTitle>
            <DialogDescription>
              Organize your resume screening by role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={type} onValueChange={(v) => setType(v as JobType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Full-time Job
                    </div>
                  </SelectItem>
                  <SelectItem value="internship">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Internship
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {type === "job" 
                  ? "AI will focus on experience, skills, and job stability" 
                  : "AI will focus on potential, coursework, and projects"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder={type === "job" ? "e.g., Senior React Developer" : "e.g., Marketing Intern"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Add notes about this role..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create {type === "job" ? "Job" : "Internship"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
