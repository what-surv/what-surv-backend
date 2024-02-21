export const Roles = {
  Admin: 'admin',
  User: 'user',
  MockUser: 'mockUser',
  NotYetSignedUp: 'notYetSignedUp',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
