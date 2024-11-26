export function getProfileLink(
  targetUserId: string,
  authenticatedUserId: string
): string {
  return targetUserId === authenticatedUserId
    ? `/profile`
    : `/friends/${targetUserId}`;
}
