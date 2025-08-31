import { createClient } from '@supabase/supabase-js';
import type { User } from '../App';

// Supabase connection details provided by the user.
// These are public keys and are safe to be exposed in the browser,
// as long as Row Level Security (RLS) is enabled on Supabase tables.
const supabaseUrl = 'https://tbbqgkwumologlyqpjlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiYnFna3d1bW9sb2dseXFwamx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzODQ0NTgsImV4cCI6MjA3MTk2MDQ1OH0.cJr_VNzLDVj0ZxsMoQa4fqGdHC1PEp5eJ3Jg1yzHmPw';

// The table name in Supabase, assumed to be 'users' based on application context.
const USERS_TABLE = 'users';

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Public API Functions ---

/**
 * Initializes the data store. No-op for Supabase as client is ready on creation.
 */
export async function initializeData(): Promise<void> {
  console.log("Connecting to Supabase backend.");
  return Promise.resolve();
}

/**
 * Fetches all users from the Supabase table.
 */
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select('username, stamps, language');

  if (error) {
    console.error("Error fetching all users:", error.message);
    throw new Error('Failed to fetch users from the database.');
  }
  return (data as User[]) || [];
}

/**
 * Fetches a single user by their username.
 */
export async function getUser(username: string): Promise<User | undefined> {
  const lowerCaseUsername = username.toLowerCase();
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select('username, stamps, language')
    .eq('username', lowerCaseUsername)
    .single();

  // 'PGRST116' is the Supabase error code for "No rows found", which is an expected outcome and not a critical error.
  if (error && error.code !== 'PGRST116') {
    console.error(`Error fetching user "${lowerCaseUsername}":`, error.message);
    throw new Error('Failed to fetch user data.');
  }
  
  return data ? (data as User) : undefined;
}

/**
 * Creates a new user or updates an existing one based on the primary key (username).
 */
export async function upsertUser(user: User): Promise<void> {
  const userToSave = { ...user, username: user.username.toLowerCase() };
  const { error } = await supabase
    .from(USERS_TABLE)
    .upsert(userToSave);

  if (error) {
    console.error("Error upserting user:", error.message);
    throw new Error('Failed to save user data.');
  }
}

/**
 * Deletes a user by their username.
 */
export async function deleteUser(username: string): Promise<void> {
  const lowerCaseUsername = username.toLowerCase();
  const { error } = await supabase
    .from(USERS_TABLE)
    .delete()
    .eq('username', lowerCaseUsername);

  if (error) {
    console.error(`Error deleting user "${lowerCaseUsername}":`, error.message);
    throw new Error('Failed to delete user.');
  }
}

/**
 * Deletes all users from the table.
 * Note: This requires appropriate RLS policies on the Supabase table to be enabled.
 */
export async function clearUsers(): Promise<void> {
    // Supabase client-side delete requires a filter to prevent accidental full-table wipes.
    // We use a filter that will match all possible rows.
    const { error } = await supabase
        .from(USERS_TABLE)
        .delete()
        .gte('stamps', 0); // This assumes all users have 0 or more stamps.

    if (error) {
        console.error("Error clearing all users:", error.message);
        throw new Error('Failed to clear all user data.');
    }
}
