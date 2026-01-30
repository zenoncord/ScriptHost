"use client";

import { useState } from "react";
import { ScriptEditor } from "@/components/script-editor";
import { ResultPanel } from "@/components/result-panel";
import { Terminal, Shield, Zap, Eye, Key } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UploadResult {
  success: boolean;
  id: string;
  ownerKey: string;
  filename: string;
  loadstring: string;
  executeUrl: string;
}

export default function HomePage() {
  const [result, setResult] = useState<UploadResult | null>(null);

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,180,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,180,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Terminal className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">
                  ScriptHost
                </h1>
                <p className="text-xs text-muted-foreground">
                  Hidden Script Hosting
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Have a key? Go to /script/YOUR_ID
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
              <Shield className="h-4 w-4" />
              <span>Hidden Script Protection</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Host Scripts Invisibly
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-balance">
              Upload your Lua scripts - nobody can view your code except you. 
              The loadstring works perfectly, but the source stays completely hidden.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-card border border-border">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">Hidden</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-card border border-border">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">Instant</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-card border border-border">
              <Key className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">Owner Key</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-2xl shadow-primary/5">
            {result ? (
              <ResultPanel result={result} onReset={() => setResult(null)} />
            ) : (
              <ScriptEditor onUploadSuccess={setResult} />
            )}
          </div>

          {/* How it works */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-xl font-bold text-foreground text-center mb-6">
              How It Works
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-lg bg-card border border-border text-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">Upload</h4>
                <p className="text-xs text-muted-foreground">
                  Paste or upload your Lua script
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border text-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">Get Loadstring</h4>
                <p className="text-xs text-muted-foreground">
                  Receive your loadstring and owner key
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border text-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">Execute</h4>
                <p className="text-xs text-muted-foreground">
                  Loadstring works - source stays hidden
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-border/50 py-6 mt-12">
          <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>ScriptHost - Your code, completely hidden</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
