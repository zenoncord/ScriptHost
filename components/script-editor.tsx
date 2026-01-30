"use client";

import React from "react"

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileCode, Loader2, Shield, Zap } from "lucide-react";

interface ScriptEditorProps {
  onUploadSuccess: (data: UploadResult) => void;
}

interface UploadResult {
  success: boolean;
  id: string;
  ownerKey: string;
  filename: string;
  loadstring: string;
  executeUrl: string;
}

export function ScriptEditor({ onUploadSuccess }: ScriptEditorProps) {
  const [script, setScript] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setScript(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          setScript(event.target?.result as string);
        };
        reader.readAsText(file);
      }
    },
    []
  );

  const handleUpload = async () => {
    if (!script.trim()) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("script", script);
      if (fileName) {
        formData.append("filename", fileName);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onUploadSuccess(data);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative rounded-lg border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileCode className="h-4 w-4" />
              <span className="text-sm font-mono">
                {fileName || "script.lua"}
              </span>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".lua,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                <Upload className="h-4 w-4" />
                <span>Upload File</span>
              </div>
            </label>
          </div>

          <Textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="-- Paste your Lua script here...&#10;print('Hello, World!')"
            className="min-h-[300px] font-mono text-sm bg-background/50 border-border/50 resize-none focus:border-primary/50"
          />
        </div>

        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <Upload className="h-12 w-12 mx-auto text-primary mb-2" />
              <p className="text-primary font-medium">Drop your script here</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={handleUpload}
          disabled={!script.trim() || isUploading}
          className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Hosting...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              Host It
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3 text-primary" />
          <span>Hidden Source Code</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-primary" />
          <span>Instant Loadstring</span>
        </div>
      </div>
    </div>
  );
}
