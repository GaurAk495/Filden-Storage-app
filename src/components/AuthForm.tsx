"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { createAccount, login } from "@/action/auth.action";
import OTPModal from "./OTPModal";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const authSchema = (isSignInPage: boolean) => {
  const baseSchema = z.object({
    fullname: isSignInPage
      ? z.string().optional()
      : z
          .string()
          .min(2, { message: "Username must be at least 2 characters" })
          .max(50, { message: "Username must be at most 50 characters" }),

    email: z
      .string()
      .min(2, { message: "Email must be at least 2 characters" })
      .max(50, { message: "Email must be at most 50 characters" })
      .email({ message: "Enter a valid email address" }),
  });

  return baseSchema;
};

type Formdata = {
  type: "sign In" | "sign Up";
};

function AuthForm({ type }: Formdata) {
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState("");

  const isSignInPage = type === "sign In";
  const formSchema = authSchema(isSignInPage);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setisLoading(true);
    setErrorMessage("");
    try {
      const { email, fullname } = values;
      const userId =
        type === "sign In"
          ? await login({ email })
          : fullname
          ? await createAccount({ email, fullname })
          : null;

      setAccountId(userId.accountId);
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      setErrorMessage(
        error instanceof Error ? error.message : "Login/SignUp error"
      );
    } finally {
      setisLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl border"
        >
          <h1 className="text-3xl font-semibold text-center text-gray-800">
            {type.toUpperCase()}
          </h1>

          {/* Full Name - only for sign up */}
          {type === "sign Up" && (
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-600">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Full Name"
                      {...field}
                      className={cn(
                        "border border-gray-300 rounded-md px-3 py-2 focus-visible:outline-none focus-visible:ring-2",
                        form.formState.errors.fullname
                          ? "ring-red-500"
                          : "focus-visible:ring-blue-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className={cn(
                      "border border-gray-300 rounded-md px-3 py-2 focus-visible:outline-none focus-visible:ring-2",
                      form.formState.errors.email
                        ? "ring-red-500"
                        : "focus-visible:ring-blue-500"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#fa7275] hover:bg-[#ff7b7d] text-white font-semibold py-2 rounded-lg transition cursor-pointer"
          >
            {type === "sign In" ? "Login" : "Create New Account"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={15}
                height={15}
                className="ml-2 inline-block"
              />
            )}
          </Button>

          {/* Server-side error message */}
          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          {/* Auth Switch Link */}
          <p className="text-sm text-center text-gray-600">
            {type === "sign In" ? (
              <>
                Don’t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-[#ff7b7d] hover:underline"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-[#ff7b7d] hover:underline"
                >
                  Sign In
                </Link>
              </>
            )}
          </p>
        </form>
      </Form>
      {/* otp modal */}
      {accountId && (
        <OTPModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
}

export default AuthForm;
