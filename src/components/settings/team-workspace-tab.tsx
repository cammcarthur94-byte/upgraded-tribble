"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Mail,
  MoreHorizontal,
  Trash2,
  Send,
  CheckCircle2,
  Clock,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamMember } from "./types";

interface TeamWorkspaceTabProps {
  members: TeamMember[];
  onOpenInviteModal: () => void;
  onUpdateRole: (memberId: string, newRole: "Admin" | "Editor" | "Viewer") => void;
  onRemoveMember: (memberId: string) => void;
  onResendInvite: (member: TeamMember) => void;
  brandName?: string;
  seatsMax?: number;
}

export function TeamWorkspaceTab({
  members,
  onOpenInviteModal,
  onUpdateRole,
  onRemoveMember,
  onResendInvite,
  brandName = "Gymshark",
  seatsMax = 10,
}: TeamWorkspaceTabProps) {
  const [selectedRoleMemberId, setSelectedRoleMemberId] = useState<string | null>(null);

  const seatsUsed = members.length;
  const seatsAvailable = Math.max(0, seatsMax - seatsUsed);
  const percentUsed = Math.min(100, Math.round((seatsUsed / seatsMax) * 100));

  return (
    <div className="space-y-6">
      {/* Header & Seat Usage Meter */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
              <Users className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                Workspace Team Members
              </h2>
              <p className="text-xs text-slate-500">
                Manage organization roles, single sign-on (SSO), and generative report permissions for {brandName}.
              </p>
            </div>
          </div>

          <div className="mt-4 max-w-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                {seatsUsed} of {seatsMax} Seats Used
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {seatsAvailable} seats remaining
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <Button
            size="sm"
            onClick={onOpenInviteModal}
            className="gap-1.5 h-9 px-4 text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            + Invite Member
          </Button>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role & Access</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">2FA Security</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {members.map((member) => {
              const isOwner = member.role === "OWNER";

              return (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* User info */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{member.name}</span>
                          {isOwner && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              PRIMARY
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        {isOwner ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-purple-50 text-purple-700 border border-purple-200">
                              OWNER
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              (Organization Founder)
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {member.title && (
                              <span className="text-xs font-semibold text-slate-900 tracking-tight">
                                {member.title}
                              </span>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400 text-xs">(</span>
                              <select
                                value={member.role}
                                onChange={(e) =>
                                  onUpdateRole(
                                    member.id,
                                    e.target.value as "Admin" | "Editor" | "Viewer"
                                  )
                                }
                                className="text-xs font-semibold py-0.5 px-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 rounded text-slate-700 focus:outline-indigo-500 cursor-pointer transition-colors"
                              >
                                <option value="Admin">Admin</option>
                                <option value="Editor">Editor</option>
                                <option value="Viewer">Viewer</option>
                              </select>
                              <span className="text-slate-400 text-xs">)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Active
                    </span>
                  </td>

                  {/* 2FA */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Enabled
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {member.joinedDate}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {!isOwner ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onResendInvite(member)}
                          title="Resend Invite & Reset Credentials"
                          className="h-7 px-2 text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                          <Send className="w-3 h-3 mr-1 text-slate-400" />
                          Resend
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveMember(member.id)}
                          title="Remove user seat"
                          className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 italic">
                        Account Owner
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Security Policies notice */}
      <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Enforce mandatory Two-Factor Authentication (2FA) and Google Workspace SAML SSO across all team seats.
          </span>
        </div>
        <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
          Enforced Organization Policy
        </span>
      </div>
    </div>
  );
}
