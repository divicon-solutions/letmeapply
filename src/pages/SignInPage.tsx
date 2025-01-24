import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
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
                />
            </div>
        </div>
    );
};

export default SignInPage; 