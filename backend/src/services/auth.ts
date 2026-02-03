/**
 * Auth service: register, login, session tokens. Uses MySQL for user persistence.
 */

import crypto from "crypto";
import bcrypt from "bcrypt";
import { query } from "../config/db";
import * as emailService from "./email";

export type Role = "user" | "admin";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

const sessions: Map<string, SessionUser> = new Map();
const otpSessions: Map<string, { otp: string; expires: number }> = new Map();

export async function register(
  email: string,
  password: string,
  name: string,
  role: Role = "user"
): Promise<{ user: SessionUser; token: string }> {
  const existingUsers = await query<User[]>(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existingUsers.length > 0) {
    throw new Error("Email already registered");
  }

  const id = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);

  await query(
    "INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)",
    [id, email, passwordHash, name, role]
  );

  const sessionUser: SessionUser = { id, email, name, role };
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, sessionUser);

  return { user: sessionUser, token };
}

export async function login(
  email: string,
  password: string
): Promise<{ user: SessionUser; token: string }> {
  const users = await query<User[]>(
    "SELECT id, email, password_hash AS passwordHash, name, role FROM users WHERE email = ?",
    [email]
  );

  if (users.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = users[0];

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new Error("Invalid email or password");
  }

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, sessionUser);

  return { user: sessionUser, token };
}

export function getSession(token: string): SessionUser | null {
  return sessions.get(token) ?? null;
}

export function logout(token: string): void {
  sessions.delete(token);
}

export async function requestPasswordReset(email: string): Promise<boolean> {
  const users = await query<User[]>(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (users.length === 0) {
    throw new Error("User not found");
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpSessions.set(email, { otp, expires });

  // Send email (mock or real)
  return emailService.sendOTP(email, otp);
}

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  const session = otpSessions.get(email);
  if (!session) {
    throw new Error("OTP expired or not requested");
  }

  if (Date.now() > session.expires) {
    otpSessions.delete(email);
    throw new Error("OTP expired");
  }

  if (session.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  return true;
}

export async function resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
  const valid = await verifyOTP(email, otp);
  if (!valid) {
    throw new Error("Invalid or expired OTP");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await query(
    "UPDATE users SET password_hash = ? WHERE email = ?",
    [passwordHash, email]
  );

  otpSessions.delete(email);
}
