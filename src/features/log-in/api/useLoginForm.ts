"use client";

import { signIn } from "next-auth/react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm, UseFormReturn } from "react-hook-form";
import * as v from "valibot";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FormSchema = v.object({
    email: v.pipe(
        v.string(),
        v.minLength(2, "Email must be at least 2 characters."),
        v.email("Invalid email")
    ),
    password: v.pipe(v.string(), v.minLength(1, "Write your password")),
});
type TFormSchema = v.InferOutput<typeof FormSchema>;

const useLoginForm = (): [
    UseFormReturn<TFormSchema>,
    (data: TFormSchema) => void
] => {
    const router = useRouter();

    const form = useForm<TFormSchema>({
        resolver: valibotResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data: TFormSchema) {
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
