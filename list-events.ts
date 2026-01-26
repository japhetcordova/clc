import { db } from "./db/index";
import { events } from "./db/schema";

async function main() {
  const result = await db.select().from(events);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
