"use client";

import { useJobContext } from "@/components/dashboard/JobContext";
import { ResumeList, UploadedFile } from "@/components/ui/ResumeList";

export function LeftPanelClient() {
    const {
        filteredDocuments,
        uploadingFiles,
        handleUpload,
        handleDelete,
        shortlistedIds,
        viewResume,
        toggleShortlist,
    } = useJobContext();



    // Map to UI format
    const fileList: UploadedFile[] = [
        ...uploadingFiles,
        ...filteredDocuments.map(d => ({
            id: d.id,
            name: d.candidate_name ? `${d.candidate_name} — ${d.filename}` : d.filename,
            size: d.file_size || 0,
            status: d.status as "processing" | "ready" | "error" | "uploading",
        })),
    ];

    return (
        <div className="flex flex-col h-full overflow-hidden gap-aa">
            {/* <FiltersPanel /> commented out until implemented */}
            <ResumeList
                files={fileList}
                onUpload={handleUpload}
                onDelete={handleDelete}
                isUploading={uploadingFiles.length > 0}
                shortlistedIds={shortlistedIds}
                onViewResume={viewResume}
                onToggleShortlist={toggleShortlist}
            />
        </div>
    );
}
