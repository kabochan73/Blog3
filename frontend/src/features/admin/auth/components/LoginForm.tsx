"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ApiError, apiFetch } from "@/shared/lib/api";
import { setToken } from "@/shared/lib/auth";
import type { LoginResponse } from "../types";
import { loginFormSchema, type LoginFormValues } from "./LoginForm.schema";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) });

  async function onSubmit(values: LoginFormValues) {
    setError(null);

    try {
      const { token } = await apiFetch<LoginResponse>("/api/login", {
        method: "POST",
        body: values,
      });
      setToken(token);
      router.push("/admin/posts");
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 422)) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        setError("ログインに失敗しました。しばらくしてから再度お試しください");
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-6 border border-foreground p-8"
    >
      <h1 className="font-heading text-3xl font-bold tracking-tight">Login</h1>

      <div className="space-y-1">
        <label htmlFor="email" className="font-heading block text-sm font-medium text-foreground/80">
          Mail Address
        </label>
        <input
          id="email"
          type="text"
          autoComplete="username"
          {...register("email")}
          className="w-full border border-foreground/40 bg-transparent px-3 py-2 text-sm focus:border-foreground focus:outline-none"
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="font-heading block text-sm font-medium text-foreground/80">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="w-full border border-foreground/40 bg-transparent px-3 py-2 text-sm focus:border-foreground focus:outline-none"
        />
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-foreground px-3 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-60 disabled:opacity-50"
      >
        {isSubmitting ? "Login..." : "Login"}
      </button>
    </form>
  );
}
