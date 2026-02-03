/**
 * Auth HTTP handlers: register, login, logout, me.
 */

import { Request, Response } from "express";
import * as authService from "../services/auth";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, and name are required" });
      return;
    }

    const r = await authService.register(
      email,
      password,
      name,
      role === "admin" ? "admin" : "user"
    );

    res.status(201).json(r);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const r = await authService.login(email, password);
    res.json(r);
  } catch (e) {
    res.status(401).json({ error: (e as Error).message });
  }
}

export function logout(req: Request, res: Response): void {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) authService.logout(token);
  res.json({ ok: true });
}

export function me(req: Request, res: Response): void {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  res.json(user);
}
export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }
    await authService.requestPasswordReset(email);
    res.json({ message: "OTP sent to email" });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
}

export async function verifyOTP(req: Request, res: Response): Promise<void> {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({ error: "Email and OTP are required" });
      return;
    }
    await authService.verifyOTP(email, otp);
    res.json({ valid: true, message: "OTP verified" });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      res.status(400).json({ error: "Email, OTP, and new password are required" });
      return;
    }
    await authService.resetPassword(email, otp, newPassword);
    res.json({ message: "Password reset successful" });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
}
