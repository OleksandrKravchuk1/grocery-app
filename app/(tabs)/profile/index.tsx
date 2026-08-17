import Auth from "@/src/features/auth/components/Auth";
import { LoadingView } from "@/components/ui/view/LoadingView";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { useProfile } from "@/src/features/profile/hooks/useProfile";
import { ProfileScreen } from "@/src/features/profile/components/ProfileScreen";

export default function ProfileRoute() {
    const { session } = useAuth();
    const { isLoading, isError } = useProfile();

    if (!session) return <Auth />;
    if (isError) return <Auth />;
    if (isLoading) return <LoadingView />;

    return <ProfileScreen />;
}