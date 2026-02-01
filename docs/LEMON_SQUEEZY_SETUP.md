# Lemon Squeezy Integration Guide (India <-> Global Payments)

This guide explains how to set up payments so you can accept US Dollars (USD) while being an Indian founder, without Stripe.

## Why Lemon Squeezy?
*   **Merchant of Record (MoR):** They act as the reseller.
*   **Tax Compliance:** They handle US Sales Tax, EU VAT, and Indian GST on the *transaction* level.
*   **Payouts:** They pay you (the developer) via PayPal or Bank Transfer. You don't need to file GST for every $10 sale.

---

## Step 1: Create Account & Store
1.  Go to [Lemon Squeezy](https://www.lemonsqueezy.com/) and Sign Up.
2.  Create a Store (e.g., "HireScale").
3.  **Country:** Select "India" (or your residence).
4.  **Currency:** Select "USD" (This is what customers see).

## Step 2: Create a Product
1.  Go to **Products** -> **New Product**.
2.  **Name:** "HireScale Pro" (or "100 Resume Credits").
3.  **Pricing Model:** "Standard Pricing" (One-time) or "Subscription" (Recurring).
    *   *Recommendation for MVP:* Start with **Subscription** ($29/month) or **Top-up** ($9 for 50 resumes).
4.  **Price:** Set your price (e.g., $9).
5.  **Save Product.**

## Step 3: Get API Keys & Secrets
1.  Go to **Settings** -> **API**.
2.  Create a new API Key. Name it `HireScale`.
3.  **Copy the API Key.** Add it to your `.env.local` file:
    ```env
    LEMONSQUEEZY_API_KEY=your_api_key_here
    ```

## Step 4: Get Variant ID
1.  Go to **Products**.
2.  Click the "Share" button on your product.
3.  Copy the URL. It looks like `.../checkout/buy/123456`.
4.  The number `123456` is your **Variant ID**.
5.  Add it to `.env.local`:
    ```env
    LEMONSQUEEZY_VARIANT_ID=123456
    ```
    *Note: If you have a subscription, make sure you use the Variant ID, not the Product ID.*

## Step 5: Configure Webhook (Crucial)
This tells your app when someone pays.

1.  Go to **Settings** -> **Webhooks**.
2.  Click **Create Webhook**.
3.  **Callback URL:** `https://your-project.vercel.app/api/webhooks/lemonsqueezy`
    *   *For local testing:* Use ngrok (e.g., `https://abcdef.ngrok-free.app/api/webhooks/lemonsqueezy`).
4.  **Secret:** Generate a random string (e.g., `hirescale_secret_123`).
5.  **Events:** Check these boxes:
    *   `subscription_created`
    *   `subscription_updated`
    *   `subscription_cancelled`
    *   `subscription_payment_success` (for renewals)
6.  **Save Webhook.**
7.  Add the secret to `.env.local`:
    ```env
    LEMONSQUEEZY_WEBHOOK_SECRET=hirescale_secret_123
    ```

## Step 6: Verify Supabase Schema
Ensure your `profiles` table has these columns (already included in your migrations):
*   `subscription_status` (text)
*   `subscription_id` (text)
*   `queries_used` (int)

## Step 7: Test It
1.  Run the app locally (`npm run dev`).
2.  Go to `/settings` or click "Upgrade".
3.  It should redirect you to the Lemon Squeezy checkout.
4.  Use a **Test Card** (Lemon Squeezy Test Mode):
    *   Card: `4242 4242 4242 4242`
    *   Exp: `12/34`
    *   CVC: `123`
5.  After payment, check your Supabase `profiles` table. `subscription_status` should change to `pro`.

## Troubleshooting
*   **Webhook 401 Error:** Your `LEMONSQUEEZY_WEBHOOK_SECRET` doesn't match what you entered in the dashboard.
*   **"Payment not configured":** You forgot to add `LEMONSQUEEZY_VARIANT_ID` to `.env.local`.
