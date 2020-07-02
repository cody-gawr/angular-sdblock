import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ProfileService } from 'src/app/services/account/profile';
import { empty, Observable } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-profile-tab',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  @Output() changeTab = new EventEmitter<number>();
  
  private subs = new SubSink();

  form: FormGroup;
  avatarPath = 'assets/images/user.png';
  focusedControl = '';
  phoneTypes = [];
  addressTypes = [];
  profileObservable: Observable<any>;
  profile: any;

  name = '';

  constructor(
    private dialogService: NbDialogService,
    private router: Router,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    this.phoneTypes = ['Home', 'Cell', 'Work', 'Other'];
    this.addressTypes = ['Home', 'Office', 'Billing', 'Other'];
  }

  ionViewWillEnter() {
    this.profileObservable = this.profileService.getUserProfile();
    this.subs.sink = this.profileObservable.subscribe(res => {
      console.log({res});
      this.profile = res;
      this.name = res.name;
    });
  }

  handleUploadImage(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        const path = reader.result;
        this.avatarPath = typeof path === 'string' ? path : path.toString();
      };
      reader.readAsDataURL(file);
    }
  }
  onInputFocus(controlName) {
    this.focusedControl = controlName;
  }
  onInputBlur() {
  }
  showDialog(ref) {
    this.dialogService.open(ref, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }

  saveEditName(ref) {
    this.subs.sink = this.profileService.editName(this.name).subscribe(res => {
      this.profileObservable = this.profileService.getUserProfile();
    });
    ref.close();
  }

  ionViewWillLeave() {
    this.profileObservable = empty();
  }

  closeDialog(ref) {
    ref.close();
  }
  navigate(route) {
    this.router.navigate([route]);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
