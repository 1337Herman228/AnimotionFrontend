"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import Link from "next/link";
import useRegisterForm from "../api";

const RegisterPage = () => {
  const { form, onSubmit } = useRegisterForm();

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <Card className="max-w-md flex-grow-1 mx-4 gap-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your username"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mb-2 cursor-pointer">
                Submit
              </Button>
              <Link
                href="/login"
                className="underline  text-sm hover:opacity-70 transition-all duration-200"
              >
                Sign in
              </Link>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
