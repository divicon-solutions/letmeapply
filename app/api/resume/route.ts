import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Resume } from "@/types/resume";
import { withAuth } from "@/app/lib/authWrapper"; // Import the auth wrapper

export const POST = withAuth(async (req: NextRequest) => {
  const userId = (req as any).userId; // Get userId from the request

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const label = formData.get("label") as string;
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!label) {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }

    // Upload file to Supabase storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("resumes")
      .upload(`user_${userId}/${file.name}`, file);

    if (storageError) throw storageError;

    // Insert resume record into the database
    const { error } = await supabase.from<Resume>("resumes").insert([
      {
        user_id: parseInt(userId, 10),
        file_name: file.name,
        file_path: storageData.path,
        file_size: file.size,
        label: label,
      },
    ]);

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Resume uploaded and saved successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in uploadResume:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
});

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const resumeId = url.searchParams.get("id");

    const { data, error } = await supabase
      .from<Resume>("resumes")
      .select("*")
      .eq("resume_id", resumeId)
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error in getResume:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const resumeId = url.searchParams.get("id");

    const { error } = await supabase
      .from<Resume>("resumes")
      .delete()
      .eq("resume_id", resumeId);

    if (error) throw error;

    return NextResponse.json(
      { message: "Resume deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in deleteResume:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
});
