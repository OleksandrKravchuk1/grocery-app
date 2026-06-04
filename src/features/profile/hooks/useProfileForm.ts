import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { signInFormSchema } from "@/src/features/auth/schemas/auth";
import { useProfile } from "@/src/features/profile/hooks/useProfile";
import { GenderOption } from "@/src/types/profile";

export function useProfileForm() {
    const { profileDefaults, isLoading, isSaving, saveProfile } = useProfile();

    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
            gender: "Other" as GenderOption,
            birthday: "",
        },
        validators: {
            onSubmit: signInFormSchema,
        },
        onSubmit: async ({ value }) => {
            await saveProfile(value);
        },
    });

    useEffect(() => {
        if (!isLoading && profileDefaults) {
            form.reset(profileDefaults);
        }
    }, [isLoading, profileDefaults]);

    return {
        form,
        isLoading,
        isSaving,
    };
}
