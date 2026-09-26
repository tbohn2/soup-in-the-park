"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/admin";

export default function LoginForm() {
  const [error, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className="panel my-4 col-xl-4 col-lg-6 col-md-8 col-11 d-flex flex-column gap-3">
      <h2 className="panel-title text-center mb-0">Admin</h2>
      <input className="form-control" type="password" name="password" placeholder="Password" required autoFocus />
      {error && <div className="text-danger">{error}</div>}
      <button className="key key-navy" type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
