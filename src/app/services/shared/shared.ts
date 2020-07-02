import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Permission } from 'src/app/models/permission';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  permissionInfo = [
    { name: 'App.Soundblock.Service.Report.Payments', section: 'report', subsection: 'report', action: 'payments' },
    { name: 'App.Soundblock.Service.Project.Create', section: 'service', subsection: 'project', action: 'create' },
    { name: 'App.Soundblock.Service.Project.Deploy', section: 'service', subsection: 'project', action: 'deploy' },
    { name: 'App.Soundblock.Project.Member.Create', section: 'service', subsection: 'member', action: 'create' },
    { name: 'App.Soundblock.Project.Member.Delete', section: 'service', subsection: 'member', action: 'delete' },
    { name: 'App.Soundblock.Project.Member.Permissions', section: 'service', subsection: 'member', action: 'permissions' },
    { name: 'App.Soundblock.Project.File.Music.Add', section: 'file', subsection: 'music', action: 'add' },
    { name: 'App.Soundblock.Project.File.Music.Delete', section: 'file', subsection: 'music', action: 'delete' },
    { name: 'App.Soundblock.Project.File.Music.Download', section: 'file', subsection: 'music', action: 'download' },
    { name: 'App.Soundblock.Project.File.Music.Restore', section: 'file', subsection: 'music', action: 'restore' },
    { name: 'App.Soundblock.Project.File.Music.Update', section: 'file', subsection: 'music', action: 'update' },
    { name: 'App.Soundblock.Project.File.Video.Add', section: 'file', subsection: 'video', action: 'add' },
    { name: 'App.Soundblock.Project.File.Video.Delete', section: 'file', subsection: 'video', action: 'delete' },
    { name: 'App.Soundblock.Project.File.Video.Download', section: 'file', subsection: 'video', action: 'download' },
    { name: 'App.Soundblock.Project.File.Video.Restore', section: 'file', subsection: 'video', action: 'restore' },
    { name: 'App.Soundblock.Project.File.Video.Update', section: 'file', subsection: 'video', action: 'update' },
    { name: 'App.Soundblock.Project.File.Merch.Add', section: 'file', subsection: 'merch', action: 'add' },
    { name: 'App.Soundblock.Project.File.Merch.Delete', section: 'file', subsection: 'merch', action: 'delete' },
    { name: 'App.Soundblock.Project.File.Merch.Download', section: 'file', subsection: 'merch', action: 'download' },
    { name: 'App.Soundblock.Project.File.Merch.Restore', section: 'file', subsection: 'merch', action: 'restore' },
    { name: 'App.Soundblock.Project.File.Merch.Update', section: 'file', subsection: 'merch', action: 'update' },
    { name: 'App.Soundblock.Project.File.Other.Add', section: 'file', subsection: 'other', action: 'add' },
    { name: 'App.Soundblock.Project.File.Other.Delete', section: 'file', subsection: 'other', action: 'delete' },
    { name: 'App.Soundblock.Project.File.Other.Download', section: 'file', subsection: 'other', action: 'download' },
    { name: 'App.Soundblock.Project.File.Other.Restore', section: 'file', subsection: 'other', action: 'restore' },
    { name: 'App.Soundblock.Project.File.Other.Update', section: 'file', subsection: 'other', action: 'update' },
  ];

  constructor() { }

  checkPasswordStrength(password: string) {
    const strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );
    const mediumRegex = new RegExp(
      '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
    );

    if (strongRegex.test(password)) {
      return 'Strong';
    }

    if (mediumRegex.test(password)) {
      return 'Medium';
    }

    return 'Weak';
  }

  getFileIcon(type) {
    switch (type) {
      case 'dir':
        return 'fa-folder';
      case 'mp3':
        return 'fa-file-audio';
      case 'doc':
      case 'docx':
        return 'fa-file-word';
      case 'ai':
      case 'psd':
      case 'png':
        return 'fa-file-image';
      case 'mp4':
        return 'fa-file-video';
      case 'pdf':
        return 'fa-file-pdf';
      default:
        return 'fa-file';
    }
  }

  getFileName(str: string) {
    const index = str.indexOf('.');
    return str.slice(0, index);
  }
  
  getFileKind(str: string) {
    const index = str.indexOf('.');
    return str.slice(index + 1, str.length);
  }

  getQueryParameter(key: string): string {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  parsePermissionsArrayToObject(permissions: any[], groupPermission?: Permission) {
    let result = new Permission();
    if (groupPermission) {
      result = _.cloneDeep(groupPermission);
    }
    for (const item of permissions) {

      const permissionDetail = this.permissionInfo.find(res => res.name == item.permission_name);

      if (!permissionDetail) { continue; }
      const section = permissionDetail.section;
      const subsection = permissionDetail.subsection;
      const action = permissionDetail.action;

      const value = item.permission_value;
      switch (section) {
        case 'service':
          if (subsection === 'project' && action === 'create') {
            result.createProject = value;
          }
          if (subsection === 'project' && action === 'deploy') {
            result.deployPlatform = value;
          }
          if (subsection === 'member' && action === 'create') {
            result.addMember = value;
          }
          if (subsection === 'member' && action === 'delete') {
            result.deleteMember = value;
          }
          if (subsection === 'member' && action === 'permissions') {
            result.changePermission = value;
          }
          break;
        case 'report':
          result.accountPayment = value;
          break;
        case 'file':
          result[subsection][action] = value;
          break;
      }
    }
    return result;
  }

  parsePermissionsObjectToArray(permission: Permission) {
    const result = [];
    for (const item of this.permissionInfo) {

      const section = item.section;
      const subsection = item.subsection;
      const action = item.action;
      
      switch (section) {
        case 'service':
          if (subsection === 'project' && action === 'create') {
            if (typeof permission.createProject !== 'undefined') {
              result.push({ permission_name: item.name, permission_value: permission.createProject ? 1 : 0 });
            }
          }
          if (subsection === 'project' && action === 'deploy') {
            if (typeof permission.deployPlatform !== 'undefined') {
              result.push({ permission_name: item.name, permission_value: permission.deployPlatform ? 1 : 0 });
            }
          }
          if (subsection === 'member' && action === 'create') {
            if (typeof permission.addMember !== 'undefined') {
              result.push({ permission_name: item.name, permission_value: permission.addMember ? 1 : 0 });
            }
          }
          if (subsection === 'member' && action === 'delete') {
            if (typeof permission.deleteMember !== 'undefined') {
              result.push({ permission_name: item.name, permission_value: permission.deleteMember ? 1 : 0 });
            }
          }
          if (subsection === 'member' && action === 'permissions') {
            if (typeof permission.changePermission !== 'undefined') {
              result.push({ permission_name: item.name, permission_value: permission.changePermission ? 1 : 0 });
            }
          }
          break;
        case 'report':
          if (typeof permission.accountPayment !== 'undefined') {
            result.push({ permission_name: item.name, permission_value: permission.accountPayment ? 1 : 0 });
          }
          break;
        case 'file':
          if (typeof permission[subsection][action] !== 'undefined') {
            result.push({ permission_name: item.name, permission_value: permission[subsection][action] ? 1 : 0 });
          }
          break;
      }
    }
    return result;
  }
}
