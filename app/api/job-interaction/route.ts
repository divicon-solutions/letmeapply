import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/app/lib/authWrapper"; // Import the auth wrapper
import { getAuth } from "@clerk/nextjs/server";

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const userId = getAuth(req).userId;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { job_id, external_job_id, title, company, location, link, status } =
      body;

    // For manual job creation
    if (title && company && location && link) {
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .insert({
          external_job_id,
          title,
          company,
          location,
          job_type: "full-time", // default value
          posted_at: new Date().toISOString(),
          desc: "",
          platform_name: "manual",
          link: link,
          is_active: false,
        })
        .select()
        .single();

      if (jobError) throw jobError;

      const { data, error } = await supabase
        .from("user_job_interactions")
        .insert({
          user_id: userId,
          job_id: jobData.job_id,
          external_job_id: jobData.external_job_id,
          status: "applied",
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    // Validate required fields
    if (!job_id || !external_job_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First check if an interaction already exists
    const { data: existingInteraction, error: checkError } = await supabase
      .from("user_job_interactions")
      .select("*")
      .eq("user_id", userId)
      .eq("job_id", job_id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    // If interaction exists, return it without creating a new one
    if (existingInteraction) {
      return NextResponse.json(existingInteraction);
    }

    // If no existing interaction, create a new one
    const { data, error } = await supabase
      .from("user_job_interactions")
      .insert({
        user_id: userId,
        job_id: job_id,
        external_job_id: external_job_id,
        status: "clicked",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating job interaction:", error);
    return NextResponse.json(
      { error: "Failed to create job interaction" },
      { status: 500 }
    );
  }
});

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const userId = getAuth(req).userId;
    const url = new URL(req.url);

    // If status is provided, return filtered interactions
    const status = url.searchParams.get("status");
    if (status) {
      const { data: interactions, error } = await supabase
        .from("user_job_interactions")
        .select(
          `
          *,
          jobs (*)
        `
        )
        .eq("user_id", userId)
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json(interactions);
    }

    // If no status provided, get counts using a raw count query
    const { data, error } = await supabase.rpc("get_interaction_counts", {
      user_id_param: userId,
    });

    if (error) throw error;

    // Initialize counts object with zeros
    const counts = {
      clicked: 0,
      applied: 0,
      under_consideration: 0,
      total: 0,
    };

    // Fill in the actual counts
    data?.forEach((item: { status: string; count: number }) => {
      if (item.status in counts) {
        counts[item.status as keyof typeof counts] = item.count;
        counts.total += item.count;
      }
    });

    return NextResponse.json({
      success: true,
      data: counts,
    });
  } catch (error) {
    console.error("Error fetching tab counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch tab counts" },
      { status: 500 }
    );
  }
});

export const PATCH = withAuth(async (req: NextRequest) => {
  try {
    const userId = getAuth(req).userId;

    const { interaction_id, status } = await req.json();

    const { data, error } = await supabase
      .from("user_job_interactions")
      .update({ status })
      .eq("interaction_id", interaction_id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating job interaction:", error);
    return NextResponse.json(
      { error: "Failed to update job interaction" },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const userId = getAuth(req).userId;
    const { interaction_id } = await req.json();

    const { data, error } = await supabase
      .from("user_job_interactions")
      .delete()
      .eq("interaction_id", interaction_id)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting job interaction:", error);
    return NextResponse.json(
      { error: "Failed to delete job interaction" },
      { status: 500 }
    );
  }
});
