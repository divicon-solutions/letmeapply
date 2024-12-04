import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from "@/app/lib/authWrapper";
import { supabase } from "@/lib/supabase";
import { getAuth } from "@clerk/nextjs/server";

export const POST = withAuth(async (req: NextRequest) => {
  return saveProfile(req);
});

export const GET = withAuth(async (req: NextRequest) => {
  return getProfile(req);
});

async function getProfile(req: NextRequest) {
  try {
    // Get user ID from auth header
    const uid = getAuth(req).userId;
    console.log('User ID:', uid);

    // Get user_id from users table
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('user_id')
      .eq('uid', uid)
      .single();

    if (getUserError) {
      console.error('Error getting user:', getUserError);
      return NextResponse.json(
        { error: 'Failed to get profile' },
        { status: 500 }
      );
    }

    // Get profile from profiles table
    const { data, error: getProfileError } = await supabase
      .from('profile')
      .select('*')
      .eq('user_id', user.user_id)
      .single();

    if (getProfileError) {
      console.error('Error getting profile:', getProfileError);
      return NextResponse.json(
        { error: 'Failed to get profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error in getProfile:', error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
}

async function saveProfile(req: NextRequest) {
  try {
    // Get user ID from auth header
    const uid = getAuth(req).userId;
    console.log('User ID:', uid);

    // Get user_id from users table
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('user_id')
      .eq('uid', uid)
      .single();

    if (getUserError) {
      console.error('Error getting user:', getUserError);
      return NextResponse.json(
        { error: getUserError.message },
        { status: 500 }
      );
    }

    // Get the profile data from request body
    const profileData = await req.json();

    // Check if profile already exists for the user
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profile')
      .select('id')
      .eq('user_id', user.user_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', fetchError);
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    let result;
    if (existingProfile) {
      result = await supabase
        .from('profile')
        .update({
          resume_data: profileData
        })
        .eq('user_id', user.user_id);
    } else {
      result = await supabase
        .from('profile')
        .insert([
          {
            user_id: user.user_id,
            resume_data: profileData
          },
        ]);
    }

    if (result.error) {
      console.error('Error saving profile:', result.error);
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: existingProfile ? 'Profile updated' : 'Profile created',
      data: result.data
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save profile' },
      { status: 500 }
    );
  }
}
