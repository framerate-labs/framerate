import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: "http://localhost:3000/success",
  server: "sandbox", // Change to production
});
