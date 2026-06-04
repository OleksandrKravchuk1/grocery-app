import { useForm } from "@tanstack/react-form";
import { Alert } from "react-native";
import { authFormSchema } from "@/src/features/auth/schemas/auth";
import { signIn, signUp } from "@/src/features/auth/services/auth";

export function useAuthForm() {
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onSubmit: authFormSchema,
        },
        onSubmit: async ({ value }) => {
            await signIn(value.email, value.password);
        },
    });

    const handleSignIn = () => form.handleSubmit();

    const handleSignUp = async () => {
        const isValid = await form.validate("submit");
        if (!isValid) return;

        const { email, password } = form.state.values;
        try {
            const { session } = await signUp(email, password);
            if (!session) {
                Alert.alert("Check your inbox", "Please verify your email before signing in.");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Sign up failed";
            Alert.alert("Error", message);
        }
    };

    return {
        form,
        handleSignIn,
        handleSignUp,
        isSubmitting: form.state.isSubmitting,
    };
}
