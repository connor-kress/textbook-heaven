import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function QuestionContentSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-6 w-5/6" />
    </div>
  );
}

export function RepliesSkeleton() {
  return (
    <div className="flex flex-col items-start gap-10 w-full">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="w-full">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-16 w-full mb-2" />
        </div>
      ))}
    </div>
  );
} 