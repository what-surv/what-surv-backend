export const Role = {
  Admin: 'admin',
  User: 'user',
  MockUser: 'mockUser',
  NotYetSignedUp: 'notYetSignedUp',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
