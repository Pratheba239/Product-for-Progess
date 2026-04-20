import { app, InvocationContext, Timer } from "@azure/functions";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

/**
 * Azure Function Timer Trigger: Cleanup completed tasks older than 2 days.
 * Runs every day at 1:00 AM UTC.
 */
export async function cleanupCompletedTasks(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log("Azure Function Cleanup Triggered");

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        
        // Delete tasks marked completed more than 2 days ago
        const deleteQuery = `
            DELETE FROM tasks 
            WHERE status = 'completed' 
            AND completed_at < NOW() - INTERVAL '2 days'
        `;
        
        const res = await client.query(deleteQuery);
        context.log(`Successfully deleted ${res.rowCount} old tasks.`);

    } catch (err) {
        context.error("Cleanup Function Error:", err);
    } finally {
        await client.end();
    }
}

app.timer("cleanupCompletedTasks", {
    schedule: "0 0 1 * * *", // 1 AM daily
    handler: cleanupCompletedTasks,
});
