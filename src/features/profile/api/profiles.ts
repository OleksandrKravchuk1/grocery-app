
import { api } from "@/api/client";
import { Profile } from "@/src/types/profile";

export async function getProfiles() {
  const { data } = await api.get('/users/me');
  return data;
}

export async function upsertProfile(userId: string, data: Profile) {
  const { data: updatedProfile } = await api.patch('/users/me', {
    id: userId,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    gender: data.gender,
    birthDay: data.birthday,
  });
  return updatedProfile;
}
