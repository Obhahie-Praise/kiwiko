"use client";

import React, { useState } from "react";
import { Loader2, Plus, X, Image as ImageIcon } from "lucide-react";
import UploadDropzone from "../ui/upload/UploadDropZone";
import { createProjectUpdateAction } from "@/actions/project.actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface UpdateFormProps {
    projectId: string;
    onSuccess?: () => void;
}

const UpdateForm = ({ projectId, onSuccess }: UpdateFormProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");
    const [showUpload, setShowUpload] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("projectId", projectId);
            formData.append("title", title);
            formData.append("details", details);
            if (imageUrl) formData.append("imageUrl", imageUrl);

            const res = await createProjectUpdateAction(formData);

            if (res.success) {
                toast.success({
                    title: "Update Posted",
                    description: "Your project update has been shared with the team.",
                });
                setTitle("");
                setDetails("");
                setImageUrl("");
                setShowUpload(false);
                if (onSuccess) onSuccess();
                router.refresh();
            } else {
                setError(res.error);
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="bg-white border-[0.1px] border-zinc-200 rounded-lg p-6 mb-8 transition-all">
            <h3 className="text-lg font-semibold text-zinc-900 special-font tracking-wide mb-6">Post New Update</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="text-sm font-medium text-zinc-700 mb-1.5 flex items-center gap-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Just reached 100 users!"
                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all placeholder:text-zinc-400"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="details" className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Details
                    </label>
                    <textarea
                        id="details"
                        rows={4}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Tell the world what you've been up to..."
                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all placeholder:text-zinc-400 resize-none"
                        required
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                         <button
                            type="button"
                            onClick={() => setShowUpload(!showUpload)}
                            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-2"
                        >
                            <ImageIcon size={14} />
                            {imageUrl ? "Change Image" : "Add Image (Optional)"}
                        </button>
                        {imageUrl && !showUpload && (
                            <button 
                                type="button"
                                onClick={() => setImageUrl("")}
                                className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"
                            >
                                <X size={12} /> Remove
                            </button>
                        )}
                    </div>

                    {showUpload && (
                        <div className="relative rounded-lg overflow-hidden border border-dashed border-zinc-200 p-2 bg-zinc-50/50 animate-in fade-in slide-in-from-top-2 duration-300">
                             <UploadDropzone
                                endpoint="projectUpdateUploader"
                                label="Upload Image"
                                onUploadSuccess={(url) => {
                                    setImageUrl(url);
                                    setShowUpload(false);
                                }}
                                className="h-40 border-none bg-transparent"
                                showPreview={true}
                                initialImage={imageUrl}
                            />
                        </div>
                    )}
                    
                    {imageUrl && !showUpload && (
                        <div className="relative w-full max-w-xs h-32 rounded-lg overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-300">
                             <img src={imageUrl} className="w-full h-full object-cover" alt="Update preview" />
                        </div>
                    )}
                </div>

                {error && <p className="text-xs font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isPending || !title || !details}
                        className="px-6 py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold tracking-wide hover:bg-zinc-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Posting...
                            </>
                        ) : (
                            <>{/* 
                                <Plus size={16} /> */}
                                Post Update
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateForm;
