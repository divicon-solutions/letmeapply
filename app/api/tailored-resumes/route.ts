import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { TailoredResume } from "@/types/tailored_resume";
import { withAuth } from "@/app/lib/authWrapper"; // Assuming you have an auth wrapper

// Create a new tailored resume
export const POST = withAuth(async (req: NextRequest) => {
  try {
    const {
      original_resume_id,
      job_id,
      user_id,
      file_name,
      file_path,
      file_size,
    }: TailoredResume = await req.json();

    const { data, error } = await supabase
      .from<TailoredResume>("tailored_resumes")
      .insert([
        {
          original_resume_id,
          job_id,
          user_id,
          file_name,
          file_path,
          file_size,
        },
      ]);

    if (error) throw error;

    return NextResponse.json(
      { message: "Tailored resume created successfully", data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in createTailoredResume:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
});

// Get a tailored resume by ID
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const tailoredResumeId = url.searchParams.get("id");

    const { data, error } = await supabase
      .from<TailoredResume>("tailored_resumes")
      .select("*")
      .eq("tailored_resume_id", tailoredResumeId)
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error in getTailoredResume:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
});

// Update a tailored resume
export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const tailoredResumeId = url.searchParams.get("id");
    const { file_name, file_path, file_size }: Partial<TailoredResume> =
      await req.json();

    const { data, error } = await supabase
      .from<TailoredResume>("tailored_resumes")
      .update({ file_name, file_path, file_size })
      .eq("tailored_resume_id", tailoredResumeId);

    if (error) throw error;

    return NextResponse.json(
      { message: "Tailored resume updated successfully", data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in updateTailoredResume:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
});

// Delete a tailored resume
export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const tailoredResumeId = url.searchParams.get("id");

    const { error } = await supabase
      .from<TailoredResume>("tailored_resumes")
      .delete()
      .eq("tailored_resume_id", tailoredResumeId);

    if (error) throw error;

    return NextResponse.json(
      { message: "Tailored resume deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in deleteTailoredResume:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
});
