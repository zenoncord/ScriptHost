"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Lock,
  Key,
  Copy,
  Check,
  Download,
  ArrowLeft,
  AlertCircle,
  FileCode,
  ShieldOff,
  Shield,
  Unlock,
} from "lucide-react";
import Link from "next/link";

interface ScriptData {
  script: string;
  filename: string;
  createdAt: string;
}

export default function ScriptPage() {
  const params = useParams();
  const scriptId = params.id as string;

  const [ownerKey, setOwnerKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptData, setScriptData] = useState<ScriptData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/scripts/${scriptId}/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid key");
      }

      setScriptData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid key");
    } finally {
      setLoading(false);
    }
  };

  const copyScript = async () => {
    if (scriptData) {
      await navigator.clipboard.writeText(scriptData.script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadScript = () => {
    if (scriptData) {
      const blob = new Blob([scriptData.script], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = scriptData.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,180,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,180,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <FileCode className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">
                  ScriptHost
                </h1>
                <p className="text-xs text-muted-foreground font-mono">
                  {scriptId}
                </p>
              </div>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-12">
          {!scriptData ? (
            <div className="space-y-6">
              {/* No Access Card */}
              <Card className="p-8 border-border bg-card/50 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
                    <ShieldOff className="h-10 w-10 text-destructive" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    No Access
                  </h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    This script is protected. If you{"'"}d like to view it, enter
                    your owner key below to get access.
                  </p>
                </div>

                <form onSubmit={handleUnlock} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Key className="h-4 w-4 text-primary" />
                      Owner Key
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your 32-character owner key"
                      value={ownerKey}
                      onChange={(e) => setOwnerKey(e.target.value)}
                      className="font-mono text-center tracking-wide h-12 bg-background border-border"
                      required
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold"
                    disabled={loading || !ownerKey}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Unlock className="h-5 w-5" />
                        Unlock Script
                      </span>
                    )}
                  </Button>
                </form>
              </Card>

              {/* Info */}
              <Card className="p-4 bg-secondary/30 border-border">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Why do I need a key?
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      ScriptHost protects your scripts. Only the owner key
                      (generated when hosting) can unlock and view the source
                      code. The loadstring still works without the key - only
                      viewing is protected.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
              {/* Access Granted */}
              <Card className="p-4 bg-primary/10 border-primary/30">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Access Granted
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(scriptData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>

              {/* Script Viewer */}
              <Card className="p-4 border-border bg-card/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">
                      {scriptData.filename}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyScript}
                      className="gap-2 bg-transparent"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadScript}
                      className="gap-2 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={scriptData.script}
                  readOnly
                  className="font-mono text-sm min-h-[400px] resize-none bg-background border-border"
                />
              </Card>

              {/* Lock Button */}
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setScriptData(null);
                  setOwnerKey("");
                }}
              >
                <Lock className="h-4 w-4 mr-2" />
                Lock Script
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
