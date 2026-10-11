// Writes config.js from environment variables so a deployment can preconfigure the dashboard.
// Usage: node scripts/write-config.mjs [output-path]   (default: config.js)
//
// When TBA_API_KEY is set the dashboard is locked to these settings and the settings gear is hidden.
// With no variables set, an empty config is written and visitors enter their own settings.
import { writeFileSync } from 'node:fs';

const env = process.env;
const config = {
    tbaApiKey: env.TBA_API_KEY,
    teamNumber: env.TEAM_NUMBER,
    eventKey: env.EVENT_KEY,
    scoutingEnabled: env.SCOUTING_ENABLED === undefined ? undefined : env.SCOUTING_ENABLED !== 'false',
    sheetsApiKey: env.SHEETS_API_KEY,
    sheetsId: env.SHEETS_ID,
    sheetName: env.SHEET_NAME,
};
for (const key of Object.keys(config)) {
    if (config[key] === undefined || config[key] === '') delete config[key];
}

if (config.tbaApiKey && (!config.teamNumber || !config.eventKey)) {
    console.error('TEAM_NUMBER and EVENT_KEY are required when TBA_API_KEY is set');
    process.exit(1);
}

const outPath = process.argv[2] || 'config.js';
writeFileSync(outPath, `window.DASHBOARD_CONFIG = ${JSON.stringify(config, null, 2)};\n`);
console.log(`Wrote ${outPath} (${config.tbaApiKey ? 'locked' : 'manual'} mode; keys: ${Object.keys(config).join(', ') || 'none'})`);
