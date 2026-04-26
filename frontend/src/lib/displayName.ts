// Resolve the best name to show for a user.
// Order of preference:
//   1. display_name if set (and non-empty)
//   2. email username (everything before @, lowercased)
// Used everywhere a name is rendered: home greeting, profile identity, etc.

export function displayNameFor(user: {
  display_name: string | null
  email?: string
}): string {
  if (user.display_name && user.display_name.trim()) {
    return user.display_name.trim()
  }
  if (user.email) {
    return user.email.split('@')[0].toLowerCase()
  }
  return 'you'
}

export function avatarInitial(user: {
  display_name: string | null
  email?: string
}): string {
  const name = displayNameFor(user)
  return name.charAt(0).toUpperCase() || 'Y'
}
