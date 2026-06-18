"use client";

import { useState, useRef } from "react";
import { Paperclip, Loader2, Upload, FileIcon, CheckCircle, Copy } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { attachmentsService, AttachmentResponse } from "@/lib/api/attachments.service";


export default function AttachmentsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<AttachmentResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => attachmentsService.upload(file),
    onSuccess: (data) => { toast.success("File uploaded successfully"); setUploadResult(data); setSelectedFile(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = () => { if (selectedFile) uploadMutation.mutate(selectedFile); };
  const copyUrl = () => { if (uploadResult?.url) { navigator.clipboard.writeText(uploadResult.url); toast.success("URL copied!"); } };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Paperclip className="h-6 w-6 text-teal-400" />Attachments</h1>
        <p className="text-slate-400 mt-1">Upload documents and files</p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 max-w-lg">
        <CardHeader><CardTitle className="text-white">Upload File</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-green-500/50 transition-colors">
            <Upload className="h-8 w-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400">{selectedFile ? selectedFile.name : "Click to select a file"}</p>
            {selectedFile && <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>}
          </div>
          <Button onClick={handleUpload} disabled={!selectedFile || uploadMutation.isPending} className="w-full bg-green-600 hover:bg-green-700 text-white">
            {uploadMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}Upload
          </Button>
        </CardContent>
      </Card>


      {uploadResult && (
        <Card className="bg-slate-800/50 border-slate-700 max-w-lg">
          <CardHeader><CardTitle className="text-white text-base flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />Upload Complete</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2"><FileIcon className="h-4 w-4 text-slate-400" /><span className="text-sm text-white">{uploadResult.fileName}</span></div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Key: <span className="font-mono text-slate-300">{uploadResult.key}</span></p>
              <p>Type: <span className="text-slate-300">{uploadResult.itemType}</span></p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyUrl} className="border-slate-600 text-slate-300"><Copy className="h-3 w-3 mr-1" />Copy URL</Button>
              <a href={uploadResult.url} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm" className="border-slate-600 text-slate-300">Open File</Button></a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
