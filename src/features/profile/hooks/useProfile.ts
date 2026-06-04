import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { fetchProfile, saveProfile } from "@/src/features/profile/services/profile";
import type { ProfileFormValues } from "@/src/types/profile";

export type { GenderOption, ProfileFormValues } from "@/src/types/profile";

export function toGender(value?: string | null) {
    if (value === "Male" || value === "Female" || value === "Other") return value;
    return "Other" as const;
}

export function toFormValues(profile?: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    gender?: string | null;
    birthday?: Date | string | null;
}): ProfileFormValues {
    return {
        firstName: profile?.firstName ?? "",
        lastName: profile?.lastName ?? "",
        phone: profile?.phone ?? "",
        gender: toGender(profile?.gender),
        birthday: profile?.birthday
            ? new Date(profile.birthday).toISOString().slice(0, 10)
            : "",
    };
}

export const profileKeys = {
    all: ["profile"] as const,
    byUser: (userId: string) => [...profileKeys.all, userId] as const,
};

export function useProfile() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: profileKeys.byUser(user?.id ?? ""),
        queryFn: () => fetchProfile(user!.id),
        enabled: !!user?.id,
        select: toFormValues,
        retry: false,
    });

    const mutation = useMutation({
        mutationFn: (values: ProfileFormValues) => saveProfile(user!.id, values),
        onSuccess: () => {
            Alert.alert("Done", "Profile saved successfully");
            void queryClient.invalidateQueries({ queryKey: profileKeys.byUser(user?.id ?? "") });
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "An error occurred while saving your profile";
            Alert.alert("Error", message);
        },
    });

    return {
        profileDefaults: query.data ?? toFormValues(),
        isLoading: query.isLoading,
        isError: query.isError,
        isSaving: mutation.isPending,
        saveProfile: mutation.mutateAsync,
    };
}
