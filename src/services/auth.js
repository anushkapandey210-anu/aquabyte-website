// The only accounts allowed into the Admin portal.
export const COMPANY_EMAIL = 'aquabyteiotsolutions@gmail.com'

export const ADMINS = [
  { name: 'Anushka Pandey', email: 'anushka06pandey@gmail.com' },
  { name: 'Bhavya Singhal', email: 'bbhavisingal@gmail.com' },
  { name: 'Nishant Kumar', email: 'nishantkumar1826@gmail.com' },
  { name: 'Nishant Kumar', email: 'aquabyte.nishant@gmail.com' },
  { name: 'AquaByte (company)', email: COMPANY_EMAIL },
]

// True when the signed-in person's email is in the ADMINS list.
// Important: the backend must check this too before any admin action.
export function isAdmin(user) {
  return !!user?.email && ADMINS.some(a => a.email.toLowerCase() === user.email.trim().toLowerCase())
}