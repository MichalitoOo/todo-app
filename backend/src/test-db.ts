import { Client } from 'pg';

const connectionString = 'postgresql://postgres:Ak6JNKlLew1w0eU4@barely-expedient-linnet.data-1.euc1.tembo.io:5432/postgres';

const client = new Client({
  connectionString,
});

client.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });


// Example query
client.query('SELECT * FROM users')
  .then((res) => {
    console.log(res.rows);  // Logs rows fetched from the users table
  })
  .catch((err) => {
    console.error('Error running query:', err);
  })
  .finally(() => {
    client.end();  // Close connection
  });
