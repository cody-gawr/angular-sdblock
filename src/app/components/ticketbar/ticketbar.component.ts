import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

import { Ticket, TicketMessage } from 'src/app/models/ticket';
import { ProfileService } from 'src/app/services/account/profile';
import { TicketService } from 'src/app/services/support/ticket';
import { SharedService } from 'src/app/services/shared/shared';
import { PanelService } from 'src/app/services/shared/panel';

@Component({
  selector: 'app-ticket-sidebar',
  templateUrl: './ticketbar.component.html',
  styleUrls: ['./ticketbar.component.scss'],
})
export class TicketSidebarComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagePane', { static: false }) messagePane: ElementRef;
  private subs = new SubSink();
  currentUser: any;
  ticketsObs: Observable<Ticket[]>;
  messagesObs: Observable<TicketMessage[]>;
  ticket: Ticket;

  newTicket: Ticket = new Ticket();
  message: string;
  file: any;
  
  pageStatus = 0;
  ticketbarVisible = false;
  ticketTypes = ['Customer Service', 'Technical Support', 'Feedback'];

  constructor(
    private ticketService: TicketService,
    private panelService: PanelService,
    private profileService: ProfileService,
    private sharedService: SharedService,
  ) { }
  ngOnInit() {
    this.getData();
    this.watchTicketbarVisible();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  getData() {
    this.subs.sink = this.profileService.getBasicUserInfo().subscribe(res => {
      this.currentUser = res;
    });
    this.ticketsObs = this.ticketService.getSupportTickets();
  }
  watchTicketbarVisible() {
    this.subs.sink = this.panelService.getTicketbarVisible().subscribe(res => {
      this.ticketbarVisible = res;
    });
  }
  onTicket(ticket: Ticket) {
    this.ticket = ticket;
    this.messagesObs = this.ticketService.getTicketMessages(ticket.ticket_uuid);
    this.pageStatus = 1;
    this.message = '';
    this.file = null;
  }
  attachFile(event) {
    this.file = event[0];
  }
  onSend() {
    if (!this.message && !this.file) {
      return;
    }

    this.ticketService.addMessage(this.ticket.ticket_uuid, this.currentUser.user_uuid, this.message, [this.file]).subscribe(res => {
      this.messagesObs = this.ticketService.getTicketMessages(this.ticket.ticket_uuid);
      this.message = '';
      this.file = null;
    });
  }
  backToTicket() {
    this.pageStatus = 0;
  }
  scrollToBottom() {
    try {
      this.messagePane.nativeElement.scrollTop = this.messagePane.nativeElement.scrollHeight;
    } catch (err) {}
  }
  showTicketPage() {
    this.newTicket = new Ticket();
    this.file = null;
    this.pageStatus = 2;
  }
  createTicket(form) {
    console.log({form});
    if (!form.valid) { return; }

    this.ticketService.addTicket(this.newTicket, this.message, this.file).subscribe(res => {
      this.ticketsObs = this.ticketService.getSupportTickets();
      this.newTicket = new Ticket();
      this.pageStatus = 0;
      this.message = '';
      this.file = null;
    });
  }
  download(file) {
    console.log({file});
    const link =  document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', file.attachment_url);
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  showTicketbar() {
    this.panelService.setTicketbarVisible(!this.ticketbarVisible);
  }
  closeDialog(ref) {
    ref.close();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
