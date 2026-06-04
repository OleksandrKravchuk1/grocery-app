export type Profile = {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    gender: string;
    birthday: Date;
}

export type GenderOption = "Male" | "Female" | "Other";

export type ProfileFormValues = {
    firstName: string;
    lastName: string;
    phone: string;
    gender: GenderOption;
    birthday: string;
};
