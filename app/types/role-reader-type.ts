export type RoleReader = {
  getRolesForUser(username: string): Promise<string[]>;
}