"use client";

import StatsCards from "../components/dashboard/StatsCards";
import PostsChart from "../components/dashboard/PostChart";

export default function Home() {
  return (
    <div>
      <h1>HOME OK</h1>

      <StatsCards />
      <PostsChart />
    </div>
  );
}