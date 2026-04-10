import React from 'react';

/* ── Base skeleton block ──────────────────────────────────────── */

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: string;
}

export function Skeleton({ className = '', width, height, rounded = 'rounded-xl' }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${rounded} ${className}`}
      style={{ width, height, minHeight: height }}
    />
  );
}

/* ── Stat card skeleton ───────────────────────────────────────── */

export function SkeletonStatCard() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20">
      <div className="flex justify-between items-start mb-4">
        <Skeleton width="48px" height="48px" rounded="rounded-2xl" />
        <Skeleton width="64px" height="24px" rounded="rounded-full" />
      </div>
      <Skeleton width="80px" height="14px" rounded="rounded-lg" className="mb-2" />
      <Skeleton width="120px" height="28px" rounded="rounded-lg" />
    </div>
  );
}

/* ── Customer table row skeleton ──────────────────────────────── */

export function SkeletonCustomerRow() {
  return (
    <tr className="border-b border-slate-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Skeleton width="40px" height="40px" rounded="rounded-full" />
          <div className="space-y-2">
            <Skeleton width="120px" height="14px" rounded="rounded-md" />
            <Skeleton width="160px" height="12px" rounded="rounded-md" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <Skeleton width="100px" height="14px" rounded="rounded-md" />
      </td>
      <td className="px-6 py-4">
        <Skeleton width="64px" height="24px" rounded="rounded-full" />
      </td>
      <td className="px-6 py-4">
        <Skeleton width="80px" height="14px" rounded="rounded-md" />
      </td>
      <td className="px-6 py-4">
        <Skeleton width="90px" height="14px" rounded="rounded-md" />
      </td>
      <td className="px-6 py-4">
        <Skeleton width="32px" height="32px" rounded="rounded-xl" />
      </td>
    </tr>
  );
}

/* ── Project card skeleton ────────────────────────────────────── */

export function SkeletonProjectCard() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20">
      <div className="flex items-start justify-between mb-4">
        <Skeleton width="80px" height="24px" rounded="rounded-full" />
        <Skeleton width="24px" height="24px" rounded="rounded-lg" />
      </div>
      <Skeleton width="180px" height="20px" rounded="rounded-lg" className="mb-1" />
      <Skeleton width="120px" height="14px" rounded="rounded-md" className="mb-6" />
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Skeleton width="60px" height="12px" rounded="rounded-md" />
          <Skeleton width="36px" height="14px" rounded="rounded-md" />
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full w-3/5 skeleton rounded-full" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Skeleton width="80px" height="14px" rounded="rounded-md" />
        <div className="flex -space-x-2">
          <Skeleton width="32px" height="32px" rounded="rounded-full" />
          <Skeleton width="32px" height="32px" rounded="rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ── Calendar skeleton ────────────────────────────────────────── */

export function SkeletonCalendar() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <Skeleton width="160px" height="28px" rounded="rounded-lg" />
          <div className="flex gap-2">
            <Skeleton width="36px" height="36px" rounded="rounded-xl" />
            <Skeleton width="36px" height="36px" rounded="rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="skeleton !aspect-square !rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 min-h-[500px]">
        <Skeleton width="100px" height="24px" rounded="rounded-lg" className="mb-2" />
        <Skeleton width="140px" height="14px" rounded="rounded-md" className="mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-100">
              <Skeleton width="140px" height="16px" rounded="rounded-lg" className="mb-2" />
              <Skeleton width="100px" height="12px" rounded="rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Chat skeleton ────────────────────────────────────────────── */

export function SkeletonChatList() {
  return (
    <div className="space-y-1 p-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl">
          <Skeleton width="48px" height="48px" rounded="rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton width="140px" height="14px" rounded="rounded-md" />
            <Skeleton width="100px" height="12px" rounded="rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Small list item skeleton (leads, messages, tasks) ────────── */

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 p-3 -mx-3 rounded-2xl">
      <Skeleton width="40px" height="40px" rounded="rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton width="120px" height="14px" rounded="rounded-md" />
        <Skeleton width="80px" height="12px" rounded="rounded-md" />
      </div>
      <Skeleton width="50px" height="12px" rounded="rounded-md" />
    </div>
  );
}

/* ── Dashboard skeleton ───────────────────────────────────────── */

export function SkeletonDashboard() {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <Skeleton width="280px" height="32px" rounded="rounded-lg" className="mb-2" />
        <Skeleton width="220px" height="16px" rounded="rounded-md" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm min-h-[380px]">
          <Skeleton width="160px" height="22px" rounded="rounded-lg" className="mb-2" />
          <Skeleton width="200px" height="14px" rounded="rounded-md" />
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm min-h-[380px]">
          <Skeleton width="120px" height="22px" rounded="rounded-lg" className="mb-2" />
          <Skeleton width="180px" height="14px" rounded="rounded-md" />
        </div>
      </div>
    </div>
  );
}
