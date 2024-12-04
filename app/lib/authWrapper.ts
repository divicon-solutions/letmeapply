import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const { isSignedIn } = await clerkClient().authenticateRequest(req, {});
    console.log("isSignedIn", isSignedIn);
    if (!isSignedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(req);
  };
}

/* 
same opt docs
i-983 kube
stem120
submit stem application in USCIS - Pay 410$
related to job description

legal team email address: 
*/
