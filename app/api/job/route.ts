import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { APIGateway, JobSearchParams } from "@/app/lib/apiGateway";
import { Job } from "@/types/job";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchText = url.searchParams.get("searchText") || "";
  const jobType = url.searchParams.get("jobType") || "";
  const location = url.searchParams.get("location") || "";
  const datePosted = url.searchParams.get("datePosted") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const currentJobIds = url.searchParams.get("currentJobIds")?.split(",") || [];

  const offset = (page - 1) * pageSize;

  // Query the database
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

  // Exclude jobs that the client already has
  if (currentJobIds.length > 0) {
    query = query.not("external_job_id", "in", `(${currentJobIds.join(",")})`);
  }

  // Fetch one extra to know if there are more results
  query = query.range(offset, offset + pageSize);

  const { data: dbJobs, error, count } = await query;

  let jobs = dbJobs || [];
  let totalCount = count || 0;
  let hasMore = true; // Initialize hasMore to true

  // If we don't have enough results from the database or if we encountered the specific error,
  // fetch from API Gateway
  if (
    jobs.length < pageSize ||
    (error &&
      error.code === "PGRST103" &&
      error.message.includes("Requested range not satisfiable"))
  ) {
    try {
      const params: JobSearchParams = {
        searchText,
        jobType,
        location,
        datePosted,
        page,
        pageSize: pageSize - jobs.length,
      };
      const externalJobs = await APIGateway.fetchJobs(params);

      // Cache API results to the database
      if (externalJobs.length > 0) {
        const { error: insertError } = await supabase
          .from("jobs")
          .upsert(externalJobs, { onConflict: "external_job_id" });

        if (insertError) {
          console.error("Error inserting jobs into database:", insertError);
        } else {
          console.log(
            `Successfully inserted/updated ${externalJobs.length} jobs in the database`
          );
        }
      }

      // Filter out any jobs that the client already has
      const newExternalJobs = externalJobs.filter(
        (job) => !currentJobIds.includes(job.external_job_id)
      );

      jobs = [...jobs, ...newExternalJobs];
      totalCount += newExternalJobs.length;

      // Set hasMore to false only if we didn't get enough jobs from both DB and API
      hasMore = jobs.length >= pageSize;
    } catch (apiError) {
      console.error("Error fetching jobs from API Gateway:", apiError);
      // If there's an error fetching from API, we still might have more results in future
      hasMore = true;
    }
  } else {
    // If we got enough jobs from the database, there might be more
    hasMore = jobs.length >= pageSize;
  }

  // Ensure we only return pageSize number of jobs
  jobs = jobs.slice(0, pageSize);

  return NextResponse.json(
    {
      data: jobs,
      page: page,
      pageSize: pageSize,
      totalDocs: totalCount,
      hasMore: hasMore,
    },
    { status: 200 }
  );
}
