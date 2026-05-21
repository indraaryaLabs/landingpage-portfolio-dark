// Fix Supabase Storage RLS policies for portfolio-media bucket
// Run: node src/lib/fix-storage.mjs

import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:indraarya771@db.hggwhbhcbgntggddbdmm.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('Connected to Supabase PostgreSQL');

  try {
    // 1. Check if the bucket exists
    const bucketCheck = await client.query(
      `SELECT id, name, public FROM storage.buckets WHERE name = 'portfolio-media'`
    );
    
    if (bucketCheck.rows.length === 0) {
      console.log('Creating portfolio-media bucket...');
      await client.query(`
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES ('portfolio-media', 'portfolio-media', true, 52428800, ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','video/mp4','video/webm'])
      `);
      console.log('  ✅ Bucket created');
    } else {
      console.log('Bucket exists:', bucketCheck.rows[0]);
      // Make sure it's public
      await client.query(`
        UPDATE storage.buckets SET public = true WHERE name = 'portfolio-media'
      `);
      console.log('  ✅ Bucket set to public');
    }

    // 2. Drop existing policies on storage.objects for this bucket (to avoid conflicts)
    const existingPolicies = await client.query(`
      SELECT policyname FROM pg_policies 
      WHERE tablename = 'objects' AND schemaname = 'storage'
      AND policyname LIKE '%portfolio-media%'
    `);
    
    for (const p of existingPolicies.rows) {
      console.log(`Dropping existing policy: ${p.policyname}`);
      await client.query(`DROP POLICY IF EXISTS "${p.policyname}" ON storage.objects`);
    }

    // 3. Create proper RLS policies for the bucket
    console.log('\nCreating storage RLS policies...');

    // Allow public read access (anyone can view images)
    await client.query(`
      CREATE POLICY "Public read portfolio-media" ON storage.objects
      FOR SELECT USING (bucket_id = 'portfolio-media')
    `);
    console.log('  ✅ Public SELECT policy created');

    // Allow authenticated users to upload
    await client.query(`
      CREATE POLICY "Auth upload portfolio-media" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'portfolio-media' 
        AND auth.role() = 'authenticated'
      )
    `);
    console.log('  ✅ Auth INSERT policy created');

    // Allow authenticated users to update their uploads
    await client.query(`
      CREATE POLICY "Auth update portfolio-media" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'portfolio-media' 
        AND auth.role() = 'authenticated'
      )
    `);
    console.log('  ✅ Auth UPDATE policy created');

    // Allow authenticated users to delete
    await client.query(`
      CREATE POLICY "Auth delete portfolio-media" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'portfolio-media' 
        AND auth.role() = 'authenticated'
      )
    `);
    console.log('  ✅ Auth DELETE policy created');

    console.log('\n🎉 Storage policies fixed! Upload should work now.');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

main();
