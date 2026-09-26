import { PromptBlock } from "@/components/portal/prompt-block";

const promptMvp = `I want to build a web app for [trip planning / expense tracking / AI writing].
The audience is [young people who like independent travel]. I want 3 core features at the minimum.
Acting as a product manager, list the MVP’s core features, the user flow, and a suitable tech stack.`;

const promptMaster = `Using the MVP feature list and tech stack we just agreed, write a “Cursor Master Prompt”.
This prompt must be purely technical. Include:
1. Target folder structure
2. Database schema
3. A step-by-step sprint backlog
Note: do not include market research or any task that is not writing code. Focus only on frontend and backend implementation.`;

const promptSupabase = `Integrate Supabase Auth into this Next.js project.
1. Build a login / signup page (email and password, plus Google OAuth).
2. Give me the SQL to run in the Supabase SQL Editor to create \`users\` and \`profiles\` tables, including Row Level Security so a user can only read and update their own data.`;

const promptStripe = `I need Stripe Checkout for [a one-time purchase / a monthly subscription].
1. Write an API route \`/api/stripe/create-checkout\` that creates the payment link.
2. Write a webhook API \`/api/webhooks/stripe\` that, on \`checkout.session.completed\`, sets that user’s \`is_premium\` field to true in Supabase.`;

const promptUi = `You are a world-class SaaS UI/UX designer.
I attached a screenshot of the current site and its React / Tailwind source.
Point out 3 visual problems (for example: not enough whitespace, unclear color hierarchy, messy layout) and give the full revised Tailwind code. Make the overall style feel like Vercel or Linear: modern, technical, and glassmorphic.`;

export function ProductionGuideEn() {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        Agile SaaS guide from 0 to 1 (Web & Mobile)
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        Stop building the wrong thing. Follow this 14-day standard process. Use ChatGPT or Gemini to think the logic through, then use Cursor to write high-quality code.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 1–2: Business planning and architecture</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          Do not open Cursor and start coding. First use a general model (ChatGPT-4o / Gemini 1.5 Pro) to brainstorm and sort the requirements.
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 What to do</h3>
        <ol className="mt-3 list-decimal space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>Tell the AI your rough idea and ask it to sort the business logic and the core MVP features.</li>
          <li>Once the feature list is agreed, ask the AI to turn it into a master prompt written for Cursor.</li>
        </ol>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">📝 Sample prompt 1 (ChatGPT / Gemini — clarify the product)</h3>
        <PromptBlock>{promptMvp}</PromptBlock>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">📝 Sample prompt 2 (ChatGPT / Gemini — write the master prompt)</h3>
        <PromptBlock>{promptMaster}</PromptBlock>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 3–5: Core features</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          Take the master prompt into Cursor and build with Composer (Cmd+I).
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 Pitfalls</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>Do not ask for too much at once. Have Cursor build one piece (for example: “Build the homepage hero section first”), check it, then move on.</li>
          <li>Commit often. Every time a feature works, run git commit in the terminal so you can restore it if the AI breaks the code.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 6–7: Accounts and payments</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          This is the core of turning a SaaS into revenue. We strongly recommend Supabase (auth and database) and Stripe (payments).
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">🔐 Stage 1: Supabase auth and database</h3>
        <h3 className="mt-4 font-semibold text-slate-950 dark:text-white">⚠️ Pitfalls</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>For Google login, create OAuth credentials in Google Cloud Console first, then paste the client ID into the Supabase dashboard.</li>
          <li>After you create a table, set Row Level Security. Without it, anyone can read and write your database. You can ask Cursor to write the RLS SQL.</li>
        </ul>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">📝 Sample prompt (Cursor — connect Supabase)</h3>
        <PromptBlock>{promptSupabase}</PromptBlock>
        <h3 className="mt-8 font-semibold text-slate-950 dark:text-white">💳 Stage 2: Stripe payments and webhooks</h3>
        <h3 className="mt-4 font-semibold text-slate-950 dark:text-white">⚠️ Pitfalls</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>While developing, turn on Test Mode in the Stripe dashboard.</li>
          <li>Create a product and copy the Price ID that starts with price_ into your .env.</li>
          <li>Webhook checks: in development, use the Stripe CLI to forward events to localhost:3000. After launch, switch the webhook endpoint to the production URL.</li>
        </ul>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">📝 Sample prompt (Cursor — connect Stripe)</h3>
        <PromptBlock>{promptStripe}</PromptBlock>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 8–9: UI polish</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          Once the features work, the interface often still looks like an engineer built it. Use a vision model to clean it up.
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 What to do</h3>
        <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
          Screenshot the page that looks bad and send the screenshot plus the source to Gemini 1.5 Pro or ChatGPT (GPT-4o).
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">📝 Sample prompt (a model that can see images)</h3>
        <PromptBlock>{promptUi}</PromptBlock>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 10–14: Infrastructure, SEO, and launch</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          The last mile before launch is where most of the work still sits.
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 What to do</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>Legal pages: ask ChatGPT to draft a Privacy Policy and Terms of Service, then add them to the project.</li>
          <li>SEO and GEO: ask Cursor to generate sitemap.xml, and add an llms.txt for AI crawlers.</li>
          <li>
            Hard UAT:
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Type a wrong password on purpose and check that an error appears.</li>
              <li>Tap every button on a phone and check for overflow or broken layout.</li>
              <li>Use a test card (4242…) and run the full path from payment to unlock.</li>
            </ul>
          </li>
          <li>Deploy on Vercel: push the code to GitHub and connect Vercel for automatic deploys.</li>
        </ul>
        <p className="mt-6 leading-relaxed text-slate-700 dark:text-slate-300">
          ⚠️ Final check: after deploy, replace the Vercel environment variables with the live Stripe keys and live Price ID, and set NEXT_PUBLIC_SITE_URL to your real custom domain.
        </p>
      </section>
    </article>
  );
}
