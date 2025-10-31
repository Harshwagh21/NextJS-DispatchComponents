import { NextResponse } from "next/server";

export const sanitizeInput = (input: string): string => input.trim().replace(/[<>]/g, '');

export const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getJsonBody = async (req: Request) => {
  try {
    return await req.json();
  } catch {
    return null;
  }
};

export const createErrorResponse = (message: string, status: number = 500) =>
  NextResponse.json({ message }, { status });

