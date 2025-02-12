import { SignIn, useUser } from '@clerk/clerk-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const SignInPage = () => {
    const navigate = useNavigate();
    const { isSignedIn } = useUser();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';

    useEffect(() => {
        if (isSignedIn) {
            navigate(redirectUrl, { replace: true });
        }
    }, [isSignedIn, navigate, redirectUrl]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md">
                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "shadow-xl"
                        }
                    }}
                    redirectUrl={redirectUrl}
                />
            </div>
        </div>
    );
};

export default SignInPage;