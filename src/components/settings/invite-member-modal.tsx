"use client";

import React, { useState } from "react";
import { X, UserPlus, Shield, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamMember } from "./types";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (member: Omit<TeamMember, "id" | "joinedDate" | "twoFactorEnabled">) => void;
  brandName?: string;
}

export function InviteMemberModal({
  isOpen,
  onClose,
  onInvite,
  brandName = "Gymshark",
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"Admin" | "Editor" | "Viewer">("Editor");
  const [title, setTitle] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onInvite({
        name: name.trim(),
        email: email.trim(),
        role,
        title: title.trim() || (role === "Admin" ? "SEO Director" : "Content Strategist"),
        status: "Active",
      });
      setEmail("");
      setName("");
      setTitle("");
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Invite Team Member
              </h3>
              <p className="text-xs text-slate-500">
                Grant access to {brandName} workspace analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Work Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@gymshark.com"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Job Title / Team
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Organic Search Manager"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Workspace Role & Permissions
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Admin", "Editor", "Viewer"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    role === r
                      ? "border-indigo-400 bg-indigo-50/40 text-indigo-900 ring-1 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="font-semibold text-xs">{r}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {r === "Admin" ? "Full access" : r === "Editor" ? "Edit prompts" : "Read only"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSending}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSending}
              className="h-9 text-xs bg-slate-900 hover:bg-slate-800 text-white"
            >
              {isSending ? "Sending Invite..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
