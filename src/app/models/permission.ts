export class SectionPermission {
  add?: boolean;
  update ?: boolean;
  download?: boolean;
  delete?: boolean;
  restore?: boolean;
}
export class Permission {
  music = new SectionPermission();
  video = new SectionPermission();
  merch = new SectionPermission();
  other = new SectionPermission();
  createProject?: boolean;
  deployPlatform?: boolean;
  addMember?: boolean;
  deleteMember?: boolean;
  changePermission?: boolean;
  accountPayment?: boolean;
  auditLog?: boolean;
}
