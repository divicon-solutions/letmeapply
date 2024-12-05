import { RedirectToSignIn } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignInPage() {
    const { isSignedIn, getToken } = useAuth();

    useEffect(() => {
        async function sendToken() {
            if (isSignedIn) {
                try {
                    const token = await getToken();
                    // Use postMessage to send the token
                    window.postMessage({
                        type: "AUTH_TOKEN",
                        data: { token }
                    }, "http://localhost:3001");

                    // Also try the runtime message as fallback
                    if (window.chrome?.runtime?.sendMessage) {
                        window.chrome.runtime.sendMessage({
                            action: "setAuthToken",
                            token
                        });
                    }

                    window.location.href = "/profile";
                } catch (error) {
                    console.error("Error sending token:", error);
                }
            }
        }
        sendToken();
    }, [isSignedIn, getToken]);

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    return null;
}