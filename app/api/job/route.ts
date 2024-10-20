import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Job } from "@/types/job";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchText = url.searchParams.get("searchText") || "";
  const jobType = url.searchParams.get("jobType") || "";
  const location = url.searchParams.get("location") || "";
  const datePosted = url.searchParams.get("datePosted") || "";

  // Step 1: Extract pagination parameters
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

  // Step 2: Calculate offset
  const offset = (page - 1) * pageSize;

  // Query to get the total count of documents in the collection
  const { count: totalDocsCount, error: countError } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("Error fetching total job count:", countError);
    return NextResponse.json(
      { error: "Failed to fetch total job count" },
      { status: 500 }
    );
  }

  // Check if the offset is greater than the total number of documents
  if (offset >= (totalDocsCount || 0)) {
    return NextResponse.json(
      {
        data: [],
        page: page,
        pageSize: pageSize,
        total: totalDocsCount || 0,
      },
      { status: 200 }
    );
  }

  let query = supabase.from("jobs").select("*", { count: "exact" });

  if (searchText) {
    query = query.or(`title.ilike.%${searchText}%,desc.ilike.%${searchText}%`);
  }
  if (jobType) {
    query = query.eq("job_type", jobType);
  }
  if (location) {
    query = query.eq("location", location);
  }
  if (datePosted) {
    const now = new Date();
    let dateLimit;
    switch (datePosted) {
      case "Past 24 hours":
        dateLimit = new Date(now.setDate(now.getDate() - 1));
        break;
      case "Last 3 days":
        dateLimit = new Date(now.setDate(now.getDate() - 3));
        break;
      case "Last week":
        dateLimit = new Date(now.setDate(now.getDate() - 7));
        break;
      case "Last month":
        dateLimit = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        dateLimit = null;
    }
    if (dateLimit) {
      query = query.gte("posted_at", dateLimit.toISOString());
    }
  }

  // Step 3: Add limit and offset to the query
  query = query.range(offset, offset + pageSize - 1);

  const { data, error } = await query.returns<Job>();

  if (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      data: data,
      page: page,
      pageSize: pageSize,
      totalDocs: totalDocsCount || 0,
    },
    { status: 200 }
  );
}
