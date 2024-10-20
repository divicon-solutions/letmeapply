import { supabase } from "@/lib/supabase";
import { User } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/app/lib/authWrapper";

export const POST = withAuth(async (req: NextRequest) => {
  return createUser(req);
});

export const GET = withAuth(async (req: NextRequest) => {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  const name = url.searchParams.get("name");
  const uid = url.searchParams.get("uid");

  console.log("GET request received with query:", { email, name, uid });

  if (email && name && uid) {
    return checkUserExistsAndCreate(req);
  } else {
    return getUser(req);
  }
});

export const PUT = withAuth(async (req: NextRequest) => {
  return updateUser(req);
});

export const DELETE = withAuth(async (req: NextRequest) => {
  return deleteUser(req);
});

async function createUser(req: NextRequest) {
  try {
    const { email, name, uid }: User = await req.json(); // Use await req.json() to get the request body

    const { data, error } = await supabase
      .from<User>("users")
      .insert([{ email, name, uid }]);

    if (error) throw error;

    return NextResponse.json(
      { message: "User created successfully", data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in createUser:", error); // Print detailed error
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
}

async function getUser(req: NextRequest) {
  try {
    const userId = req.query.id as string;

    const { data, error } = await supabase
      .from<User>("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error in getUser:", error); // Print detailed error
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
}

async function updateUser(req: NextRequest) {
  try {
    const userId = req.query.id as string;
    const { email, name, uid }: Partial<User> = await req.json(); // Use await req.json() to get the request body

    const { data, error } = await supabase
      .from<User>("users")
      .update({ email, name, uid })
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json(
      { message: "User updated successfully", data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in updateUser:", error); // Print detailed error
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
}

async function deleteUser(req: NextRequest) {
  try {
    const userId = req.query.id as string;

    const { error } = await supabase
      .from<User>("users")
      .delete()
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in deleteUser:", error); // Print detailed error
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
}

async function checkUserExistsAndCreate(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const name = url.searchParams.get("name");
    const uid = url.searchParams.get("uid");
    console.log("Checking user:", email, name, uid);

    const { data, error } = await supabase
      .from<User>("users")
      .select("id")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    if (!data) {
      console.log("User does not exist, creating new user.");
      const { data: newUser, error: createError } = await supabase
        .from<User>("users")
        .insert([{ email, name, uid }]);

      if (createError) throw createError;

      return NextResponse.json(
        { message: "User created successfully", newUser },
        { status: 201 }
      );
    } else {
      console.log("User already exists.");
      return NextResponse.json({ exists: true }, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error in checkUserExistsAndCreate:", error); // Print detailed error
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
}
