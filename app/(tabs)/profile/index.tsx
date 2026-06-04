import Auth from "@/src/features/auth/components/Auth";
import { SignInForm } from "@/src/features/auth/components/SignInForm";
import { LoadingView } from "@/components/ui/view/LoadingView";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { useProfile } from "@/src/features/profile/hooks/useProfile";

export default function ProfileScreen() {
    const { session } = useAuth();
    const { isLoading, isError } = useProfile();

    if (!session) return <Auth />;
    if (isError) return <Auth />;
    if (isLoading) return <LoadingView />;

    return <SignInForm />;
}