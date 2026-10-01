# ⚡ PM English Companion

A minimalist, high-impact web app designed specifically for **Technical Project Managers** to elevate their Business English skills across reading, writing, and speaking when communicating with external clients, cross-functional engineering teams, and executive stakeholders.

Built with **React (Next.js 14)**, **Tailwind CSS**, and **Google Gemini Flash / OpenAI GPT-4o-mini**, styled after the retro neo-brutalist / pixel terminal design system.

---

## 🚀 Key Features

- **Context-Specific Sentence Generation**:
  - Enter any phrase (e.g. `"Catch me up"`, `"Touch base"`, `"Push back"`).
  - Automatically generates **3 tailored sentences**:
    1. **Client / Customer Sync**: Professional, courteous, setting clear expectations.
    2. **Internal Team Standup**: Direct, agile-focused, collaborating with engineers/designers.
    3. **Stakeholder / Executive Update**: Concise, metrics/outcomes-driven.
- **Accordion Examples (Hidden by default)**:
  - Examples are neatly tucked away under an accordion button (`[ OPEN 3 BUSINESS EXAMPLES ]`) to keep your screen tidy until you are ready to study.
- **Audio Pronunciation (Speech Synthesis)**:
  - Built-in `[ 🔊 LISTEN ]` button for every sentence using the native Web Speech API (US English) to practice speaking and listening.
- **One-Click Clipboard Copy**:
  - `[ 📋 COPY ]` button to quickly paste sentences into Slack, Teams, or client emails.
- **Smart Pagination**:
  - Automatically activates pagination when you reach more than **10 phrases**, keeping the interface smooth and lightweight.
- **Mobile Responsive for iPhone 14 Pro**:
  - Tailored viewport, comfortable 44px+ tap targets, no horizontal scroll, beautiful on iOS Safari.
- **Zero Frontend Token Exposure**:
  - LLM API calls happen exclusively in backend serverless routes (`/api/generate`). API keys are never leaked to the client browser.
- **Minimal, Zero-Config Database**:
  - Works out of the box with local JSON storage and client-side sync.
  - Supports instant cloud persistence on Vercel with Upstash Redis / Vercel KV.

---

## 🤖 Recommended AI Model (Cheapest & High Quality)

To build these sentences cost-effectively:

### 🥇 **Primary Recommendation: Google Gemini 1.5 Flash / 2.0 Flash**
- **Why**:
  - **Generous Free Tier**: Up to **15 Requests/Min** and **1,500 Requests/Day** at **$0.00**.
  - **Paid Tier Cost**: Only **$0.075 per 1M input tokens** (less than $0.01 for thousands of sentences).
  - Fast response time and excellent grasp of professional corporate nuances.
- **How to get a key**: Go to [Google AI Studio](https://aistudio.google.com/) and create a free API key.

### 🥈 **Alternative: OpenAI GPT-4o-mini**
- **Cost**: $0.15 per 1M tokens.
- Supported out of the box by setting `OPENAI_API_KEY` instead.

---

## 🛠️ Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure your API key**:
   Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. **Start the local server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploying to Vercel (1-Click & Free)

Since this is built with Next.js, deploying to Vercel is seamless:

1. **Push your code to your GitHub repository**:
   ```bash
   git add .
   git commit -m "feat: complete PM English Companion app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Select your GitHub repository.
   - Expand **Environment Variables** and add:
     - `GEMINI_API_KEY` = `your_gemini_api_key`
   - Click **Deploy**.

3. *(Optional) Add Cloud KV Storage on Vercel*:
   - In your Vercel project, go to the **Storage** tab.
   - Click **Create Database** > **KV (Upstash Redis)**.
   - Connect it to your project. The environment variables (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) will be automatically injected!

---

## 🎨 UI Styleguide Tokens Used

- **Primary**: `#00FF00` (Neon Green Accent)
- **Background**: `#F5F3EC` (Retro warm terminal paper)
- **Surface**: `#FFFFFF` / `#F0F0F0` (Window cards)
- **Border**: `#000000` 2px solid with `#CCCCCC` accents
- **Shadow**: `2px 2px 0px #000000` retro hard drop shadow
- **Buttons**: Bracketed retro buttons `[ BUTTON ]` with tactile click feedback
- **Typography**: Monospace & pixel-style headings
