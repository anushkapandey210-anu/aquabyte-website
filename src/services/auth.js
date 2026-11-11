// The only accounts allowed into the Admin portal.
export const COMPANY_EMAIL = 'aquabyteiotsolutions@gmail.com'

export const ADMINS = [
  { name: 'Anushka Pandey', email: 'anushka06pandey@gmail.com' },
  { name: 'Bhavya Singhal', email: 'bbhavisingal@gmail.com' },
  { name: 'Nishant Kumar', email: 'nishantkumar1826@gmail.com' },
  { name: 'Nishant Kumar', email: 'aquabyte.nishant@gmail.com' },
  { name: 'AquaByte (company)', email: COMPANY_EMAIL },
]

export const FOUNDER_EMAILS = ADMINS.map(a => a.email.toLowerCase())

// Founding admins are always admins, and only they can add or remove other admins.
// Their email must be verified (Google sign-in always is), so nobody can sign up
// with a founder's email address and get in.
export function isFoundingAdmin(user) {
  return !!user?.email && user.verified && FOUNDER_EMAILS.includes(user.email.trim().toLowerCase())
}

// Kept so older code still works: the real answer comes from useAuth().isAdmin
export function isAdmin(user) {
  return !!user?.isAdmin
}
