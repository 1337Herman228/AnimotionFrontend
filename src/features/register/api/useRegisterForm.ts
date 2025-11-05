import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/shared/api/axiosInstance";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z
        .string()
        .min(2, {
            message: "Email must be at least 2 characters.",
        })
        .email("Invalid email"),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

const useRegisterForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
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
