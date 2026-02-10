"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { Upload, X, FileText, ImageIcon, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useUploadThing } from "@/utils/uploadthing";
import { type OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";

type Endpoint = keyof OurFileRouter;

interface Props {
  endpoint: Endpoint;
  label?: string;
  onUploadSuccess?: (res: any) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  /** Whether to show small preview (useful for icons/logos) */
  showPreview?: boolean;
}

export default function UniversalUploadDropzone({
  endpoint,
  label = "Upload file",
  onUploadSuccess,
  onUploadError,
  className = "",
  showPreview = true,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState<{ url: string; type: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 1. Initialize UploadThing hook
  const { startUpload, isUploading, routeConfig } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        onUploadSuccess?.(res[0].url);
      }
    },
    onUploadError: (error: Error) => {
      console.error(`[UploadThing Error - ${endpoint}]:`, error);
      onUploadError?.(error);
    },
  });

  // 2. Compute accepted types and constraints from route config
  const config = useMemo(() => {
    // routeConfig is returned by useUploadThing in v7
    if (!routeConfig) return { accepted: ["image/*"], maxSize: "Unknown" };
    
    const types = Object.keys(routeConfig);
    const firstType = Object.values(routeConfig)[0] as any;
    
    return {
      accepted: types.map(t => t === 'image' ? 'image/*' : (t === 'pdf' ? 'application/pdf' : `${t}/*`)),
      maxSize: firstType?.maxFileSize || "??",
    };
  }, [routeConfig]);

  // 3. Handle file selection
const handleFileAction = useCallback(
  async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // preview
    if (showPreview && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setFilePreview({ url, type: file.type });
    } else {
      setFilePreview(null);
    }

    // 🚨 THIS IS THE IMPORTANT PART
    await startUpload([file]);
  },
  [showPreview, startUpload]
);
;

  return (
    <div className={`w-full group ${className}`}>
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileAction(e.dataTransfer.files);
        }}
        className={`
          relative overflow-hidden cursor-pointer
          border-2 border-dashed rounded-2xl
          min-h-[140px] flex flex-col items-center justify-center p-6
          transition-all duration-300
          ${isDragging ? "border-zinc-900 bg-zinc-50 scale-[1.01]" : "border-zinc-200 hover:border-zinc-400 bg-white"}
          ${isUploading ? "opacity-70 cursor-wait" : "active:scale-[0.98]"}
        `}
      >
        {/* Background Visual (Image Preview) */}
        {filePreview ? (
          <div className="absolute inset-0 z-0">
            <Image 
              src={filePreview.url} 
              alt="Preview" 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover Overlay */}
            <div className={`
              absolute inset-0 flex flex-col items-center justify-center gap-2
              bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            `}>
              <div className="p-2 bg-white/20 rounded-full border border-white/40">
                <Upload size={20} className="text-white" />
              </div>
              <p className="text-xs font-semibold text-white tracking-wide">
                Upload different image
              </p>
            </div>
          </div>
        ) : null}

        <div className={`relative z-10 flex flex-col items-center gap-3 ${filePreview ? "opacity-0 invisible" : "opacity-100 visible"}`}>
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-zinc-900 animate-spin" strokeWidth={1.5} />
              <p className="text-sm font-medium text-zinc-600">Uploading...</p>
            </div>
          ) : (
            <>
              <div className={`
                p-3 rounded-xl transition-all duration-300
                ${isDragging ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 group-hover:text-zinc-600"}
              `}>
                <Upload size={24} />
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-zinc-900 leading-tight">
                  {label}
                </p>
                <p className="text-[11px] text-zinc-400 mt-1 font-medium">
                  {config.maxSize} max &bull; {config.accepted.join(", ")}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Upload Progress Bar (Bottom) */}
        {isUploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-100/50 backdrop-blur-sm z-20">
            <div className="h-full bg-zinc-900 animate-progress-indeterminate origin-left" />
          </div>
        )}
      </div>

      <input 
        ref={inputRef}
        type="file"
        className="hidden"
        accept={config.accepted.join(",")}
        onChange={(e) => handleFileAction(e.target.files)}
        disabled={isUploading}
      />
    </div>
  );
}
