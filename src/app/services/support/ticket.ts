import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Ticket, TicketMessage } from 'src/app/models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(
    private http: HttpClient,
  ) { }

  getSupportTickets() {
    return this.http.get<any>(`support/tickets`).pipe(map(res => {
      console.log({res});
      return res.data.map(ticket => { 
        return new Ticket().deserialize(ticket);
      });
    }));
  }

  getTicketMessages(ticket, perPage?) {
    let url = `support/ticket/${ticket}/messages`;
    if (perPage) {
      url += `?per_page=${perPage}`;
    }
    return this.http.get<any>(url).pipe(map(res => {
      console.log({res});
      res.data = res.data.map(message => {
        return new TicketMessage().deserialize(message);
      });
      return res.data;
    }));
  }

  addTicket(ticket: Ticket, message, file) {
    const formData = new FormData();
    formData.append('support', ticket.support.support_category);
    formData.append('title', ticket.ticket_title);
    formData.append('message', message);
    formData.append(`file`, file);

    return this.http.post<any>(`support/ticket`, formData).pipe(map(res => {
      console.log({res});
      return res.data;
    }));
  }
  addMessage(ticket, user, message, files?) {
    const formData = new FormData();
    formData.append('ticket', ticket);
    formData.append('user', user);
    formData.append('flag_officeonly', '0');
    formData.append('message_text', message);
    for (let i = 0; i < files.length; i ++) {
      formData.append(`files[${i}]`, files[i]);
    }

    return this.http.post<any>(`support/ticket/message`, formData).pipe(map(res => {
      console.log({res});
      return res.data;
    }));
  }
}
