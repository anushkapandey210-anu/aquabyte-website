// Turns Firebase error codes into messages people can act on.
const messages = {
  'auth/invalid-credential': "That email and password don't match. Try again, or reset your password.",
  'auth/wrong-password': "That email and password don't match. Try again, or reset your password.",
  'auth/user-not-found': "We couldn't find an account with that email. Create one instead?",
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/missing-email': 'Enter your email address first.',
  'auth/email-already-in-use': 'An account with this email already exists. Log in instead.',
  'auth/weak-password': 'Choose a stronger password with at least 8 characters.',
  'auth/too-many-requests': 'Too many attempts. Wait a minute, then try again.',
  'auth/network-request-failed': "Can't reach the server. Check your internet connection and try again.",
  'auth/popup-blocked': 'Your browser blocked the Google window. Allow pop-ups for this site and try again.',
  'auth/unauthorized-domain': "This website address isn't allowed to sign in yet. Add it in Firebase › Authentication › Settings › Authorized domains.",
  'auth/operation-not-allowed': "This sign-in method isn't turned on yet. Turn it on in Firebase › Authentication › Sign-in method.",
  'auth/account-exists-with-different-credential': 'This email already uses a different sign-in method. Try the other one.',
}

export function authErrorMessage(err) {
  if (!err) return ''
  // The person closed the Google window themselves, so there's nothing to report
  if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') return ''
  return messages[err.code] || 'Something went wrong. Please try again.'
}
