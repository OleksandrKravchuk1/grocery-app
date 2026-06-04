import { getProfiles, upsertProfile } from "@/src/features/profile/api/profiles";
import type { GenderOption, ProfileFormValues } from "@/src/types/profile";

export async function fetchProfile(userId: string) {
    try {
        return await getProfiles(userId);
    } catch (error) {
        const message = error instanceof Error ? error.message : "";
        const isMissingRow =
            message.includes("0 rows") || message.toLowerCase().includes("no rows");
        if (isMissingRow) return null;
        throw error;
    }
}

export async function saveProfile(userId: string, values: ProfileFormValues) {
    if (values.birthday && Number.isNaN(new Date(values.birthday).getTime())) {
        throw new Error("Invalid date. Please enter a valid date in YYYY-MM-DD format");
    }

    await upsertProfile(userId, {
        id: userId,
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        phone: values.phone.trim(),
        gender: values.gender,
        birthday: values.birthday ? new Date(values.birthday) : new Date(),
    });
}
