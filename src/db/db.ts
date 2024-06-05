import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL as string);

// export async function connectToDb() {
//   client.
//   // client.connect((err) => {
//   //   if (err) {
//   //     console.trace(err);
//   //     throw err;
//   //   }
//   //   console.log("Connected to DB. ✨✨");
//   // });
// }

// export async function endDBConnection() {
//   client
//     .end()
//     .then(() => {
//       console.log(`DB Connection terminated. 💀`);
//     })
//     .catch((err) => {
//       console.trace(err);
//       throw err;
//     });
// }

export const db = drizzle(client, { schema, logger: true });
// await db.select().from(...)..
