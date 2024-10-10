"use client";
import { Plus } from "lucide-react";
import { BoardList } from "./_components/board-list";

export default function DashboardPage() {
  // mocking the dashboard data
  return (
    <main className="relative isolate w-full flex-1 h-screen border rounded-md">
      <div className="max-sm:px-3 max-sm:w-full max-sm:overflow-x-auto sm:mx-auto pb-20 sm:w-[calc(100%-theme(spacing.10))] max-w-6xl gap-12 lg:pb-10 mt-4 lg:mt-10">
        <div className="mt-9 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-fr">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <BoardList key={i} />
            ))}
        </div>
      </div>
    </main>
  );
}
