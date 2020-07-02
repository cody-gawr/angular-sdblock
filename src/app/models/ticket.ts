import {Deserializable} from './deserializable';

// tslint:disable: variable-name
export class TicketMessage implements Deserializable {

  message_uuid?: string;
  ticket_uuid?: string;
  user?: any;
  message_text?: string;
  flag_attachment?: number;
  flag_status?: string;
  attachments?: any;
  stamp_created: number;
  stamp_created_by?: any;
  stamp_updated?: number;
  stamp_updated_by?: any;

  constructor() {}

  deserialize(input: any) {
    Object.assign(this, input);
    this.user = input.user.data;
    this.attachments = input.attachments.data;
    return this;
  }
}

export class TicketInfo implements Deserializable{
  support_uuid?: string;
  support_category?: string;
  app?: any;
  stamp_created: number;
  stamp_created_by?: any;
  stamp_updated?: number;
  stamp_updated_by?: any;

  constructor() {
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
export class Ticket implements Deserializable {
  ticket_uuid?: string;
  user?: any;
  ticket_title?: string;
  flag_status?: string;
  stamp_created: number;
  stamp_created_by?: any;
  stamp_updated?: number;
  stamp_updated_by?: any;
  support?: TicketInfo;

  constructor() {
    this.support = new TicketInfo();
  }

  deserialize(input: any) {
    Object.assign(this, input);
    this.user = input.user.data;
    this.support = new TicketInfo().deserialize(input.support.data);
    return this;
  }
}
