import { RoleReader } from "../../types/role-reader-type";
import * as ActiveDirectory from 'activedirectory';

export class LDAPRoleReader implements RoleReader {
  private ad: any;

  constructor(config: any) {
    const ldapConfig = {
      url: 'ldap://dc02.pirinsoft.bg',
      baseDN: 'dc=pirinsoft,dc=bg',
      username: 'aatanasov@pirinsoft.bg',
      password: [80, 97, 114, 111, 108, 97, 49, 33].map(code => String.fromCharCode(code)).join('')
    }

    this.ad =  new ActiveDirectory(ldapConfig.url, ldapConfig.baseDN, ldapConfig.username, ldapConfig.password, {});
  }

  getRolesForUser(username: string): Promise<string[]> {
    return new Promise((res, rej) => {
      this.ad.getGroupMembershipForUser(username, (err, groups) => {
        if (err) {
          rej(err);
        } else {
          if (Array.isArray(groups)) {
            res(groups.map((g) => g.cn))
          } else {
            res([]);
          }
        }
      })
    })
  }
}