import { RoleReader, UserInfo } from "../../types/role-reader-type";
// import * as ActiveDirectory from 'activedirectory';

export class LDAPRoleReader implements RoleReader {
  // private ad: any;

  constructor(config: any) {
    // const ldapConfig = {
    //   url: 'ldap://dc02.pirinsoft.bg',
    //   baseDN: 'dc=pirinsoft,dc=bg',
    //   username: 'aatanasov@pirinsoft.bg',
    //   password: [].map(code => String.fromCharCode(code)).join('')
    // }

    // this.ad =  new ActiveDirectory(ldapConfig.url, ldapConfig.baseDN, ldapConfig.username, ldapConfig.password, {});
  }

  getRolesForUser(userInfo: UserInfo): Promise<string[]> {
    return new Promise((res, rej) => {
      res(userInfo.groups);
      // this.ad.getGroupMembershipForUser(username, (err, groups) => {
      //   if (err) {
      //     rej(err);
      //   } else {
      //     if (Array.isArray(groups)) {
      //       res(groups.map((g) => g.cn))
      //     } else {
      //       res([]);
      //     }
      //   }
      // })
    })
  }
}