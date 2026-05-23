import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { signInFormSchema } from "@/schemas/auth";
import { useProfile } from "@/hooks/forms/useProfile";
import { GenderOption } from "@/types/profile";

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