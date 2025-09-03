import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';

// Connection string from user
const connectionString = 'postgresql://postgres:Ngonidzashe2003.@db.sqbnzpwxbzlmjbqsclia.supabase.co:5432/postgres';

async function setupDatabase() {
    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Connecting to Supabase database...');
        await client.connect();
        console.log('Connected successfully!');

        // Read the SQL setup file
        const sqlSetup = fs.readFileSync('supabase_setup.sql', 'utf8');
        
        console.log('Executing database setup...');
        await client.query(sqlSetup);
        
        console.log('✅ Database setup completed successfully!');
        console.log('\nTables created:');
        console.log('- donations');
        console.log('- campaign_settings');
        console.log('- newsletter_subscribers');
        console.log('\nFeatures enabled:');
        console.log('- Row Level Security (RLS)');
        console.log('- Real-time subscriptions');
        console.log('- Automatic timestamps');
        console.log('- Performance indexes');
        console.log('- Default campaign settings');
        
    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        process.exit(1);
    } finally {
        await client.end();
        console.log('\nDatabase connection closed.');
    }
}

setupDatabase();
