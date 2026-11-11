// The only accounts allowed into the Admin portal.
export const COMPANY_EMAIL = 'aquabyteiotsolutions@gmail.com'

export const ADMINS = [
  { name: 'Anushka Pandey', email: 'anushka06pandey@gmail.com' },
  { name: 'Bhavya Singhal', email: 'bbhavisingal@gmail.com' },
  { name: 'Nishant Kumar', email: 'nishantkumar1826@gmail.com' },
  { name: 'Nishant Kumar', email: 'aquabyte.nishant@gmail.com' },
  { name: 'AquaByte (company)', email: COMPANY_EMAIL },
]

// Later: return the real logged-in user from your login system.
// To test the locked screen, change this email to someone who isn't an admin.
export function getCurrentUser() {
  return { name: 'Anushka Pandey', email: 'anushka06pandey@gmail.com' }
}

export function isAdmin(user) {
  return !!user && ADMINS.some(a => a.email.toLowerCase() === user.email.trim().toLowerCase())
}