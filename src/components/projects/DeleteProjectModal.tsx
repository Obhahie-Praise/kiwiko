"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { deleteProjectAction } from "@/actions/project.actions";
import { useRouter } from "next/navigation";

interface DeleteProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    orgSlug: string;
}

const DeleteProjectModal = ({ isOpen, onClose, projectId, orgSlug }: DeleteProjectModalProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        const result = await deleteProjectAction(projectId, orgSlug);

        if (result.success) {
            onClose();
            // Refresh to update the list
            router.refresh();
        } else {
            setError(result.error);
            setIsDeleting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">Delete Project?</h3>
                    <p className="text-sm text-zinc-500 mt-2">
                        This action cannot be undone. This will permanently delete the project and remove all associated data.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center font-medium">
                        {error}
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 bg-zinc-100 text-zinc-700 font-medium rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Delete Project"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProjectModal;
