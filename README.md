# Rambots Pit Command Dashboard

A real-time FRC event dashboard showing match schedule, alliance colors, scores, and team details for use at the pit during competitions.

---

## Setup

Open `index.html` in any browser. On first load you'll be prompted to enter your configuration. All settings are stored in `localStorage` — nothing is sent anywhere except to the APIs you configure.

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

- **Row 1** — headers. The first column header is the team number column; the rest are your scouting categories (e.g., `Team`, `Autonomous`, `Teleop`, `Strengths`, `Weaknesses`, `Notes`)
- **Column A** — team numbers, one per row (plain numbers, e.g., `254`)
- **Remaining columns** — your scouting data for each team

Example:

| Team | Autonomous | Teleop | Notes |
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

Click **Save & Initialize**. Scouting data is loaded once on startup and whenever you save settings. Click any team number to see their scouting notes in the team detail modal.
