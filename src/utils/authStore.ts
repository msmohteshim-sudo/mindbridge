/**
 * authStore.ts
 * Secure credential storage for MindBridge (prototype).
 * 
 * PINs are hashed using a simple but consistent deterministic hash
 * (djb2 + salt). In production this would use bcrypt/argon2 server-side.
 * 
 * Credentials are NEVER returned in plain text from any function here.
 * The stored record only contains: userId, role, email, pinHash.
 */

export type UserCredentialRole = 'patient' | 'doctor' | 'caregiver';

export interface StoredCredential {
  userId: string;           // e.g. "patient-001"
  role: UserCredentialRole;
  email: string;            // stored lower-case
  pinHash: string;          // hashed — never the raw PIN
}

const STORE_KEY = 'mindbridge_credentials';

/** Simple non-cryptographic hash for prototype use (djb2 variant + salt) */
function hashPin(pin: string, salt: string): string {
  const input = `${salt}:${pin}:mindbridge`;
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h) ^ input.charCodeAt(i);
    h = h >>> 0; // keep 32-bit unsigned
  }
  return h.toString(16).padStart(8, '0');
}

function loadAll(): StoredCredential[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as StoredCredential[];
  } catch {
    /* ignore */
  }
  return [];
}

function saveAll(creds: StoredCredential[]): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(creds));
  } catch {
    /* ignore */
  }
}

/** Seed the default doctor + caregiver + demo patient accounts (idempotent). */
export function seedDefaultCredentials(): void {
  const existing = loadAll();

  const seeds: StoredCredential[] = [];

  const maybeAdd = (cred: StoredCredential) => {
    if (!existing.some((c) => c.userId === cred.userId)) {
      seeds.push(cred);
    }
  };

  // Doctor
  maybeAdd({
    userId: 'doc-001',
    role: 'doctor',
    email: 'doctor.demo@example.com',
    pinHash: hashPin('doctor123', 'doc-001'),
  });

  // Caregiver
  maybeAdd({
    userId: 'caregiver-001',
    role: 'caregiver',
    email: 'caregiver.demo@example.com',
    pinHash: hashPin('caregiver123', 'caregiver-001'),
  });

  // Demo patients — use 123456 as default 6-digit PIN
  maybeAdd({
    userId: 'patient-001',
    role: 'patient',
    email: 'patient.demo@example.com',
    pinHash: hashPin('123456', 'patient-001'),
  });
  maybeAdd({
    userId: 'patient-002',
    role: 'patient',
    email: 'sunita.demo@example.com',
    pinHash: hashPin('123456', 'patient-002'),
  });
  maybeAdd({
    userId: 'patient-003',
    role: 'patient',
    email: 'ramesh.demo@example.com',
    pinHash: hashPin('123456', 'patient-003'),
  });

  if (seeds.length > 0) {
    saveAll([...existing, ...seeds]);
  }
}

/**
 * Register a new patient credential.
 * Returns an error string if the email is already taken, or null on success.
 */
export function registerPatientCredential(
  userId: string,
  email: string,
  pin: string
): string | null {
  const normalizedEmail = email.trim().toLowerCase();
  const all = loadAll();
  if (all.some((c) => c.email === normalizedEmail)) {
    return 'This email is already registered.';
  }
  const newCred: StoredCredential = {
    userId,
    role: 'patient',
    email: normalizedEmail,
    pinHash: hashPin(pin, userId),
  };
  saveAll([...all, newCred]);
  return null;
}

/**
 * Verify a credential. Returns the matching StoredCredential (without pinHash)
 * on success, or null on failure.
 * We deliberately don't say WHICH field was wrong.
 */
export function verifyCredential(
  email: string,
  pin: string
): Omit<StoredCredential, 'pinHash'> | null {
  const normalizedEmail = email.trim().toLowerCase();
  const all = loadAll();
  const found = all.find((c) => c.email === normalizedEmail);
  if (!found) return null;
  const expected = hashPin(pin, found.userId);
  if (expected !== found.pinHash) return null;
  // Return WITHOUT pinHash
  return { userId: found.userId, role: found.role, email: found.email };
}

/** Check if an email is already taken (case-insensitive). */
export function isEmailTaken(email: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  return loadAll().some((c) => c.email === normalizedEmail);
}

/** Remove a credential by userId (e.g. when deleting a patient). */
export function removeCredential(userId: string): void {
  const all = loadAll().filter((c) => c.userId !== userId);
  saveAll(all);
}
