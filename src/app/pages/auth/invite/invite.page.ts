import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SubSink } from 'subsink';
import { AuthService } from 'src/app/services/account/auth';
import { SharedService } from 'src/app/services/shared/shared';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage implements OnInit, OnDestroy {
  private subs = new SubSink();
  password = '';
  email = '';
  user = {
    name: '',
    password: '',
    email: ''
  };
  passwordStrength = '';
  passwordConfirm = '';
  matched = false;
  agreed = false;

  info: any;
  artwork: any;

  assetUrl = environment.fileUrl;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.subs.sink = this.activatedRoute.data.subscribe((data: any) => {
      this.info = data[0];
      console.log('Invite Info', this.info);
      this.user.email = this.info.invite_email;
      this.email = this.info.invite_email;
    });
  }

  signIn(form: NgForm) {
    if (!form.valid) { return; }
    this.subs.sink = this.authService.signIn(this.email, this.password, this.info.invite_hash).subscribe(res => {
      console.log(res);
        this.router.navigate([`/project/${this.info.project.project_uuid}/contract`]);
    }, (err) => {
      console.log(err);
    });
  }

  navigate(url: string) {
    this.router.navigate([`/auth/${url}`]);
  }

  signUp(form: NgForm) {
    if (!form.valid || !this.agreed) { return; }
    this.subs.sink = this.authService.signUp(this.user.name, this.user.email, this.user.password, this.passwordConfirm, this.info.invite_hash).subscribe((res: any) => {
      console.log({res});
      this.router.navigate(['/auth/signup/1']);
    }, (err: Error) => {
      console.error(err.message);
    });
  }

  onChangePassword() {
    this.passwordStrength = this.sharedService.checkPasswordStrength(
      this.user.password
    );
  }

  mustMatch(password, confirmPassword): boolean {
    if (password === confirmPassword && this.passwordStrength === 'Strong') {
      return (this.matched = true);
    } else if (password === confirmPassword && this.passwordStrength === 'Medium') {
      return (this.matched = true);
    } else {
      return (this.matched = false);
    }
  }
  
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
