import { NgModule } from '@angular/core';

import { DateAgoPipe } from './date-ago';
import { FileSizePipe } from './size';
import { AccountNumberPipe } from './account-number';
import { DurationPipe } from './duration';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  declarations: [FileSizePipe, DateAgoPipe, AccountNumberPipe, DurationPipe, SafeHtmlPipe],
  exports: [FileSizePipe, DateAgoPipe, AccountNumberPipe, DurationPipe, SafeHtmlPipe],
})
export class PipeModule { }
