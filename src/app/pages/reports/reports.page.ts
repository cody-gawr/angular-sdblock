import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import * as Chart from 'chart.js';
import { FormGroup, FormBuilder, ValidatorFn, FormArray, NgForm, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/services/account/profile';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit, OnDestroy {
  @ViewChild('myCanvas', { static: true }) canvas: ElementRef;
  private subs = new SubSink();
  accountObservable: Observable<any>;
  account: any;

  billChart: any;
  
  transactionData = [
    {
      date: new Date(2020, 3, 21),
      type: 'Balance Transfer',
      status: 'Debited',
      amount: -50.00,
      purpose: 'Monthly Pay',
      memo: 'Simple Block Storage Fee'
    },
    {
      date: new Date(2020, 3, 20),
      type: 'Credit',
      status: 'Pending',
      amount: 25.99,
      purpose: 'Payout from Project',
      memo: 'Revenue from Project 1'
    },
    {
      date: new Date(2020, 1, 19),
      type: 'Credit',
      status: 'Credited',
      amount: -18.50,
      purpose: 'Monthly Pay',
      memo: 'Simple Block Storage Fee'
    },
    {
      date: new Date(2020, 1, 1),
      type: 'Credit',
      status: 'Credited',
      amount: -14.00,
      purpose: 'Download Files',
      memo: 'Cost for download files'
    },
  ];

  monthlyReport = [
    { month: 1, bill: 28 }, { month: 2, bill: 17 }, { month: 3, bill: 13 }, { month: 4, bill: 32 },
    { month: 5, bill: 9 }, { month: 6, bill: 12 }
  ];
  constructor(
    private dialogService: NbDialogService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.getData();
    // this.makeChart();
  }

  getData() {
    this.accountObservable = this.profileService.getAccount();
    this.subs.sink = this.accountObservable.subscribe(res => {
      this.account = res;
      this.makeChart();
    });
  }

  makeChart() {
    const chartData = [];
    const chartLabels = [];

    for (const data of this.monthlyReport) {
      chartLabels.push(data.month);
      chartData.push(data.bill);
    }
    chartData.push(0);
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const ctx = this.canvas.nativeElement.getContext('2d');
    canvasEl.width = 500;
    canvasEl.height = 300;
    this.billChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Billing Status',
          backgroundColor: ['#518DC9', '#518DC9', '#518DC9', '#518DC9', '#518DC9', '#782c7f'],
          borderWidth: 0,
          barPercentage: 0.6,
          data: chartData
        }]
      },
      options: {
        responsive: true,
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Billing Status'
        }
      }
    });
  }
  getBillingDate(planDay) {
    const curDate = new Date();
    const month = curDate.getMonth();
    const day = curDate.getDay();
    if (day < planDay) {
      curDate.setDate(planDay);
      return curDate;
    } else {
      curDate.setMonth(month + 1);
      return curDate;
    }
  }
  showDialog(ref) {
    this.dialogService.open(ref, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }
  closeDialog(ref: any) {
    ref.close();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
