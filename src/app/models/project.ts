import { Deserializable } from './deserializable';

// tslint:disable: variable-name
export class Project implements Deserializable {
  project_uuid?: any;
  project_title?: string;
  project_avatar?: string;
  project_type?: any;
  project_date?: Date;
  project_upc?: string;
  project_subgenres?: any[];
  project_genre?: any;
  stamp_created?: number;
  stamp_created_by?: any;
  stamp_updated?: number;
  stamp_updated_by?: any;
  status?: any;
  service?: any;
  tracks?: any[];
  collections?: any;
  deployments?: any;

  constructor() { }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }

  get serviceName() {
    if (!this.service) { return ''; }
    return this.service.service_name;
  }
}
