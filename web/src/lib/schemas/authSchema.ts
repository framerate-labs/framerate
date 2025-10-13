import { z } from 'zod/v4';

export const loginSchema = z.object({
	email: z.email({ message: 'Invalid email address' }).trim().toLowerCase(),
	password: z
		.string()
		.trim()
		.min(1, { message: 'Please enter a password' })
		.max(100, { message: 'Password must be 100 characters or less' })
});

export type LoginSchema = typeof loginSchema;
