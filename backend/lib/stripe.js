import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// ADD THESE CONSOLE LOGS IMMEDIATELY BEFORE THE STRIPE INITIALIZATION:
console.log("Attempting to initialize Stripe...");
console.log("Stripe Secret Key from env:", process.env.STRIPE_SECRET_KEY);
console.log(
  "Length of Stripe Secret Key:",
  process.env.STRIPE_SECRET_KEY
    ? process.env.STRIPE_SECRET_KEY.length
    : "undefined"
);

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log("Stripe initialization complete (or attempted).");
