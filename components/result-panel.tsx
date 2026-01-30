"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Copy,
  Check,
  Shield,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface UploadResult {
  success: boolean;
  id: string;
  ownerKey: string;
  filename: string;
  loadstring: string;
  executeUrl: string;
}

interface ResultPanelProps {
  result: UploadResult;
  onReset: () => void;
}

export function ResultPanel({ result, onReset }: ResultPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyButton = ({
    text,
    itemKey,
  }: {
    text: string;
    itemKey: string;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, itemKey)}
      className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
    >
      {copied === itemKey ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-2">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Script Hosted Successfully
        </h2>
        <p className="text-muted-foreground">
          Your script is hidden and only works via loadstring execution
        </p>
      </div>

      <div className="space-y-4">
        {/* Loadstring - Primary */}
        <Card className="p-4 bg-primary/5 border-primary/30">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">
              Loadstring
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
              Ready to Use
            </span>
          </div>
          <div className="relative">
            <pre className="p-3 bg-background rounded-md border border-border overflow-x-auto text-sm font-mono text-foreground">
              {result.loadstring}
            </pre>
            <div className="absolute top-2 right-2">
              <CopyButton text={result.loadstring} itemKey="loadstring" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Execute this in your script executor. The script will run directly.
          </p>
        </Card>

        {/* Owner Key - IMPORTANT */}
        <Card className="p-4 bg-destructive/10 border-destructive/30">
          <div className="flex items-center gap-2 mb-3">
            <Key className="h-5 w-5 text-destructive" />
            <span className="font-semibold text-foreground">
              Owner Key
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-destructive/20 text-destructive">
              Save This!
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-destructive/5 rounded-md border border-destructive/20 mb-2">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
            <p className="text-xs text-destructive">
              This is the ONLY way to view or export your original script. Save it somewhere safe!
            </p>
          </div>
          <div className="relative">
            <pre className="p-3 bg-background rounded-md border border-border overflow-x-auto text-sm font-mono text-foreground">
              {showKey ? result.ownerKey : "•".repeat(32)}
            </pre>
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKey(!showKey)}
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <CopyButton text={result.ownerKey} itemKey="ownerKey" />
            </div>
          </div>
        </Card>

        {/* Script ID */}
        <Card className="p-3 bg-card border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm text-muted-foreground">Script ID:</span>
              <code className="text-sm font-mono text-foreground">{result.id}</code>
            </div>
            <div className="flex items-center gap-1">
              <CopyButton text={result.id} itemKey="scriptId" />
              <Link href={`/script/${result.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Info */}
        <Card className="p-4 bg-secondary/50 border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">How it works:</strong> Your script is encrypted and stored securely. 
            The loadstring URL serves your script only when executed - nobody can view the source code by visiting the URL directly. 
            Use your Owner Key on the "View Script" page to access your original code anytime.
          </p>
        </Card>
      </div>

      <Button
        onClick={onReset}
        variant="outline"
        className="w-full h-11 border-border hover:bg-secondary bg-transparent"
      >
        Host Another Script
      </Button>
    </div>
  );
}
