import { createClient } from '@supabase/supabase-js';

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Environment variable ${name} is required`);
  return value;
}

const stagingUrl = required('STAGING_SUPABASE_URL');
const stagingAnonKey = required('STAGING_SUPABASE_ANON_KEY');
const client = createClient(stagingUrl, stagingAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function login(emailEnv, passwordEnv) {
  await client.auth.signOut();
  const { data, error } = await client.auth.signInWithPassword({
    email: required(emailEnv),
    password: required(passwordEnv),
  });
  if (error) throw error;
  return data;
}

function report(name, result, passWhen) {
  const passed = passWhen(result);
  console.log(JSON.stringify({
    test: name,
    passed,
    error: result.error?.message || null,
    rowCount: Array.isArray(result.data) ? result.data.length : null,
  }, null, 2));
  return passed;
}

async function run() {
  const placeholderNames = [];
  for (const name of [
    'STAGING_SUPABASE_URL',
    'STAGING_SUPABASE_ANON_KEY',
    'STAGING_CANDIDATE_A_EMAIL',
    'STAGING_CANDIDATE_A_PASSWORD',
    'STAGING_CANDIDATE_A_ID',
    'STAGING_CANDIDATE_B_EMAIL',
    'STAGING_CANDIDATE_B_PASSWORD',
    'STAGING_CANDIDATE_B_ID',
    'STAGING_COMPANY_A_EMAIL',
    'STAGING_COMPANY_A_PASSWORD',
    'STAGING_COMPANY_A_ID',
    'STAGING_COMPANY_A_USER_ID',
    'STAGING_COMPANY_B_EMAIL',
    'STAGING_COMPANY_B_PASSWORD',
    'STAGING_APPLICATION_ID',
    'STAGING_APPLICATION_B_ID',
    'STAGING_MESSAGE_ID',
  ]) {
    const value = process.env[name]?.trim() || '';
    if (/<|>|project-ref|dummy-password|company-a-user-id|company-b-user-id/i.test(value)) {
      placeholderNames.push(name);
    }
  }

  if (placeholderNames.length) {
    throw new Error(`Replace placeholder values: ${placeholderNames.join(', ')}`);
  }

  let passed = true;

  await login('STAGING_CANDIDATE_B_EMAIL', 'STAGING_CANDIDATE_B_PASSWORD');
  const crossCandidate = await client.from('candidate_posts')
    .select('*')
    .eq('user_id', required('STAGING_CANDIDATE_A_ID'));
  passed = report(
    'Candidate B reads Candidate A',
    crossCandidate,
    ({ data, error }) => error != null || (Array.isArray(data) && data.length === 0),
  ) && passed;

  await login('STAGING_COMPANY_B_EMAIL', 'STAGING_COMPANY_B_PASSWORD');
  const crossCompany = await client.from('jobhub_applications')
    .select('*')
    .eq('company_id', required('STAGING_COMPANY_A_ID'));
  passed = report(
    'Company B reads Company A applications',
    crossCompany,
    ({ data, error }) => error != null || (Array.isArray(data) && data.length === 0),
  ) && passed;

  await login('STAGING_CANDIDATE_A_EMAIL', 'STAGING_CANDIDATE_A_PASSWORD');
  const statusUpdate = await client.from('jobhub_applications')
    .update({ status: 'Accepted' })
    .eq('id', required('STAGING_APPLICATION_ID'))
    .select();
  passed = report(
    'Candidate changes application status',
    statusUpdate,
    ({ data, error }) => error != null || (Array.isArray(data) && data.length === 0),
  ) && passed;

  const messageUpdate = await client.from('jobhub_messages')
    .update({
      application_id: required('STAGING_APPLICATION_B_ID'),
      sender_id: required('STAGING_CANDIDATE_B_ID'),
    })
    .eq('id', required('STAGING_MESSAGE_ID'))
    .select();
  passed = report(
    'Candidate moves message and sender identity',
    messageUpdate,
    ({ data, error }) => error != null || (Array.isArray(data) && data.length === 0),
  ) && passed;

  await login('STAGING_COMPANY_A_EMAIL', 'STAGING_COMPANY_A_PASSWORD');
  const verificationUpdate = await client.from('jobhub_company_verifications')
    .update({
      status: 'verified',
      reviewed_at: new Date().toISOString(),
      reviewed_by: required('STAGING_COMPANY_A_USER_ID'),
      review_note: 'Illegal staging test',
    })
    .eq('user_id', required('STAGING_COMPANY_A_USER_ID'))
    .select();
  passed = report(
    'Company changes verification decision',
    verificationUpdate,
    ({ data, error }) => error != null || (Array.isArray(data) && data.length === 0),
  ) && passed;

  await client.auth.signOut();
  if (!passed) process.exitCode = 1;
}

run().catch((error) => {
  console.error(error.message || String(error));
  process.exitCode = 1;
});
