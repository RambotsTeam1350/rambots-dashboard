# Rambots Pit Command Dashboard

A real-time FRC event dashboard showing match schedule, alliance colors, scores, and team details for use at the pit during competitions.

---

## Setup

The dashboard runs in one of two modes, depending on whether a `config.js` file with a TBA API key is deployed next to `index.html`:

- **Manual mode** (no `config.js`, or one without a TBA key) — on first load each visitor is prompted to enter their own settings, which are stored in their browser's `localStorage`. Nothing is sent anywhere except to the APIs you configure. Use this for a public deployment any team can use.
- **Locked mode** (`config.js` provides a TBA key) — settings come from the deployment, the settings gear and Help button are hidden, and everyone who opens the URL sees the same dashboard. Use this for your own team.

In either mode you can add `?team=` and/or `?event=` to the URL to override the team number or event key, e.g. `https://example.com/?team=1350&event=2026nhdur`.

To run locally, just open `index.html` in a browser (manual mode).

---

## Deploying to AWS Amplify

The included `amplify.yml` copies `index.html` into `dist/` and runs `scripts/write-config.mjs` to generate `dist/config.js` from the app's environment variables.

1. In the Amplify console, create an app from this repository (no framework / static site). Amplify picks up `amplify.yml` automatically.
2. Under **Hosting > Environment variables**, set:

   | Variable | Required | Description |
   |----------|----------|-------------|
   | `TBA_API_KEY` | for locked mode | The Blue Alliance read API key |
   | `TEAM_NUMBER` | with `TBA_API_KEY` | Your team number, e.g. `1350` |
   | `EVENT_KEY` | with `TBA_API_KEY` | TBA event key, e.g. `2026nhdur` |
   | `SCOUTING_ENABLED` | no | Set to `false` to turn off the scouting sheet |
   | `SHEETS_API_KEY` | no | Google API key for the scouting sheet |
   | `SHEETS_ID` | no | Scouting spreadsheet ID |
   | `SHEET_NAME` | no | Worksheet (tab) name; defaults to `Sheet1` |

3. **Redeploy after changing any variable.** Variables are only read at build time — e.g. when moving to a new event, update `EVENT_KEY` and click **Redeploy this version**.

Leave all variables unset for a public, manual-mode deployment. A common setup is two Amplify branches (or apps) from the same repo: one public with no variables, one for your team with variables set.

To test locked mode locally: `TBA_API_KEY=... TEAM_NUMBER=1350 EVENT_KEY=2026nhdur node scripts/write-config.mjs` writes `config.js` (git-ignored) next to `index.html`.

### Keys in locked mode are visible to viewers

Environment variables keep keys out of the repository, but this is a static page: the generated `config.js` is downloaded by every browser that opens the URL, so anyone with the link can read the keys. To limit exposure:

- The TBA key is read-only; if it leaks, delete it and create a new one.
- Restrict the Google API key to the **Google Sheets API** and add an **HTTP referrer** restriction for your Amplify domain (e.g. `https://main.xxxxxx.amplifyapp.com/*`).
- Optionally enable **Hosting > Access control** in Amplify to password-protect your team's branch.

---

## Required: The Blue Alliance API Key

1. Create a free account at [thebluealliance.com](https://www.thebluealliance.com)
2. Go to **Account > Read API Keys** and generate a new key
3. Paste it into the **TBA API Key** field in the dashboard settings

You'll also need:
- **Team #** — your FRC team number (e.g., `175`)
- **Event Key** — the TBA event identifier (e.g., `2026mabil`). Find it in the URL when viewing an event on The Blue Alliance.

---

## Optional: Scouting Sheet (Google Sheets)

You can connect a Google Sheet containing scouting notes. When set up, clicking any team number in the dashboard will show your team's notes for that team alongside their ranking and record.

### Sheet format

- **Row 1** — headers. One column must be titled starting with "Team Num" (e.g., `Team Number`), in any position; the rest are your scouting categories (e.g., `Autonomous`, `Teleop`, `Strengths`, `Weaknesses`, `Notes`)
- **Team number column** — team numbers, one per row (plain numbers, e.g., `254`). If a team appears in several rows, the last row wins.
- **Remaining columns** — your scouting data for each team. A `Timestamp` column (added by Google Forms) is ignored, so a form's response sheet works as-is.

Example:

| Team Number | Autonomous | Teleop | Notes |
|------|------------|--------|-------|
| 254  | 4-note auto | Speaker + Amp | Very fast cycle time |
| 1678 | 3-note auto | Amp focus | Strong defense |

### Step 1 — Share the sheet

The sheet must be accessible by anyone with the link:

1. Open the Google Sheet
2. Click **Share** → **Change to anyone with the link** → set to **Viewer**

### Step 2 — Create a Google API key

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Go to **APIs & Services > Library**, search for **Google Sheets API**, and click **Enable**
4. Go to **APIs & Services > Credentials** and click **+ Create Credentials > API key**
5. Click **Edit API key** and under **API restrictions**, select **Restrict key** → choose **Google Sheets API**
6. Optionally add an **HTTP referrer** restriction to lock the key to your machine or domain
7. Copy the API key

Note that this API Key will only be able to access Google Sheets that are made "publicly accessible to anyone with the link" and in a read-only fashion.  It can't access any of your organization's non-public sheets.

### Step 3 — Find your Spreadsheet ID

The Spreadsheet ID is in the URL of your Google Sheet:

```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_IS_HERE/edit
```

Copy the long string between `/d/` and `/edit`.

### Step 4 — Configure the dashboard

Open the settings panel (gear icon) and paste:
- **Google API Key** — the key you created above
- **Spreadsheet ID** — the ID from the sheet URL
- **Worksheet Name** — the tab name at the bottom of the sheet (e.g., `Sheet1`, or `Form Responses 1` for a Google Form)

Click **Save & Initialize**. Scouting data is loaded once on startup and whenever you save settings. Click any team number to see their scouting notes in the team detail modal.
