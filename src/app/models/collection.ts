import {Deserializable} from './deserializable';

// tslint:disable: variable-name
export class File implements Deserializable{
  file_uuid?: string;
  file_name?: string;
  file_path?: string;
  file_title?: string;
  file_category?: string;
  file_sortby?: string;
  file_size?: string;
  file_sku?: string;
  file_isrc?: string;
  revertable?: boolean;
  restorable?: boolean;
  file_history?: any;
  track?: any;
  org_file_sortby?: string;
  stamp_created?: number;
  stamp_created_by?: any;
  stamp_updated?: number;
  stamp_updated_by?: any;

  constructor() { }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
export class Collection implements Deserializable {
  collection_uuid?: string;
  project_uuid?: string;
  collection_comment?: string;
  stamp_created?: number;
  stamp_created_by?: any;
  stamp_updated?: number;
  stamp_updated_by?: any;
  files?: File[];
  directories?: any;
  history?: any;
  filehistory?: any;

  constructor() {
    this.files = new Array<File>(0);
  }

  deserialize(input: any) {
    Object.assign(this, input);
    this.files = input.files.data.map(file => new File().deserialize(file));
    return this;
  }

}
