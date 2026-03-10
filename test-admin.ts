import { getWaitlistStatsAction, getWaitlistEntriesAction, getAdminChartDataAction } from './src/actions/admin.actions';

async function test() {
  try {
    console.log("Testing stats...");
    const stats = await getWaitlistStatsAction();
    console.log("Stats OK", stats);
  } catch(e) { console.error("Stats Error", e); }

  try {
    console.log("Testing entries...");
    const entries = await getWaitlistEntriesAction();
    console.log("Entries OK", entries.length);
  } catch(e) { console.error("Entries Error", e); }

  try {
    console.log("Testing charts...");
    const charts = await getAdminChartDataAction();
    console.log("Charts OK");
  } catch(e) { console.error("Charts Error", e); }
}

test();
