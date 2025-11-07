import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { api } from "@/shared/api/axiosInstance";
import * as v from "valibot";

const FormSchema = v.object({
    name: v.pipe(
        v.string(),
        v.minLength(2, "Username must be at least 2 characters.")
    ),
    email: v.pipe(
        v.string(),
        v.minLength(2, "Email must be at least 2 characters."),
        v.email("Invalid email")
    ),
    password: v.pipe(
        v.string(),
        v.minLength(6, "Password must be at least 6 characters.")
    ),
});
type TFormSchema = v.InferOutput<typeof FormSchema>;

const useRegisterForm = () => {
    const router = useRouter();

    const form = useForm<TFormSchema>({
        resolver: valibotResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    function onSubmit(data: TFormSchema) {
        api.post("/auth/register", data)
            .then(() => {
                router.push("/");
            })
            .catch((err) => {
                toast("Registration failed", {
                    position: "top-center",
                    description: err.response.data.message,
                    action: {
                        label: "Close",
                        onClick: () => console.log("Close"),
                    },
                });
            });
    }

    return { form, onSubmit };
};

export default useRegisterForm;
