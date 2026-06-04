import {supabase} from "@/src/lib/supabase";
import {Profile} from "@/src/types/profile";

export async function getProfiles(userId: string) {
    const {data, error} = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function upsertProfile(userId: string, data: Profile) {
    const {error} = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            gender: data.gender,
            birthday: data.birthday,
        });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}
