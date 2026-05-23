import Auth from "@/components/auth/Auth";
import { SignInForm } from "@/components/form/SignInForm";
import { LoadingView } from "@/components/ui/view/LoadingView";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/forms/useProfile";

export default function ProfileScreen() {
    const { session } = useAuth();
    const { isLoading, isError } = useProfile();

    if (!session) return <Auth />;
    if (isError) return <Auth />;
    if (isLoading) return <LoadingView />;

    return <SignInForm />;
}