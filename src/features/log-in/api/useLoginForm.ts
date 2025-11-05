"use client";

import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
    email: z
        .string()
        .min(2, {
            message: "Email must be at least 2 characters.",
        })
        .email("Invalid email"),
    password: z.string().min(1, {
        message: "Write your password",
    }),
});

const useLoginForm = (): [
    UseFormReturn<z.infer<typeof FormSchema>>,
    (data: z.infer<typeof FormSchema>) => void
] => {
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        }).then((res) => {
            if (res?.status !== 200) {
                toast("Login failed", {
                    position: "top-center",
                    description: "May be you wrote wrong credentials",
                    action: {
                        label: "Close",
                        onClick: () => console.log("Close"),
                    },
                });
            } else {
                router.push("/");
            }
        });
    }

    return [form, onSubmit];
};

export default useLoginForm;
