import type { User } from '../App';

const STORAGE_KEY = 'coffee-rewards-users';
const SIMULATED_DELAY = 100; // ms

// --- Private Helper Functions ---

async function getLocalUsers(): Promise<User[]> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

async function setLocalUsers(users: User[]): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// --- Public API Functions ---

/**
 * Checks if local data exists. If not, it fetches the backup JSON
 * to seed the initial data into localStorage.
 */
export async function initializeData(): Promise<void> {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (!localData) {
        try {
            console.log("No local data found, seeding from backup file...");
            const response = await fetch('./coffee-rewards-backup.json');
            if (!response.ok) throw new Error('Failed to fetch user data');
            const initialUsers: User[] = await response.json();
            await setLocalUsers(initialUsers);
        } catch (error) {
            console.error("Could not load initial user data:", error);
            // If fetching fails, initialize with an empty array
            await setLocalUsers([]);
        }
    }
}

export async function getAllUsers(): Promise<User[]> {
    await new Promise(res => setTimeout(res, SIMULATED_DELAY));
    return await getLocalUsers();
}

export async function getUser(username: string): Promise<User | undefined> {
    await new Promise(res => setTimeout(res, SIMULATED_DELAY));
    const users = await getLocalUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    return user ? {...user} : undefined;
}

export async function upsertUser(user: User): Promise<void> {
    await new Promise(res => setTimeout(res, SIMULATED_DELAY));
    const users = await getLocalUsers();
    const index = users.findIndex(u => u.username.toLowerCase() === user.username.toLowerCase());
    if (index !== -1) {
        users[index] = user;
    } else {
        users.push(user);
    }
    await setLocalUsers(users);
}

export async function deleteUser(username: string): Promise<void> {
    await new Promise(res => setTimeout(res, SIMULATED_DELAY));
    let users = await getLocalUsers();
    users = users.filter(u => u.username.toLowerCase() !== username.toLowerCase());
    await setLocalUsers(users);
}

export async function clearUsers(): Promise<void> {
    await new Promise(res => setTimeout(res, SIMULATED_DELAY));
    await setLocalUsers([]);
}
