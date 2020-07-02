import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProjectGuard } from './core/guard/project';
import { AuthGuard } from './core/guard/auth';

const routes: Routes = [
  { path: 'home', redirectTo: 'projects', canActivate: [AuthGuard] },

  { path: 'auth', redirectTo: 'auth/signin' },
  { path: 'auth/signin', loadChildren: './pages/auth/sign-in/sign-in.module#SignInPageModule' },
  { path: 'auth/password-recovery', loadChildren: './pages/auth/password-recovery/password-recovery.module#PasswordRecoveryPageModule' },

  { path: 'auth/signup', loadChildren: './pages/auth/register/ready/ready.module#ReadyPageModule' },
  { path: 'auth/signup/1', loadChildren: './pages/auth/register/set/set.module#SetPageModule' },
  { path: 'auth/signup/2', loadChildren: './pages/auth/register/go/go.module#GoPageModule' },

  { path: 'reports', loadChildren: './pages/reports/reports.module#ReportsPageModule', canActivate: [AuthGuard] },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule', canActivate: [AuthGuard] },

  { path: 'projects', loadChildren: './pages/projects/projects.module#ProjectsPageModule', canActivate: [AuthGuard] },
  { path: 'project/:id', loadChildren: './pages/projects/project/project.module#ProjectPageModule', canActivate: [AuthGuard] },
  { path: 'project/:id/contract', loadChildren: './pages/projects/contract/contract.module#ContractPageModule', canActivate: [AuthGuard] },
  { path: 'project/:id/team', loadChildren: './pages/projects/team/team.module#TeamPageModule', canActivate: [AuthGuard] },
  { path: 'project/:id/deployments', loadChildren: './pages/projects/deployments/deployments.module#DeploymentsPageModule', canActivate: [AuthGuard] },

  { path: 'project/create/1', loadChildren: './pages/projects/create/project/project.module#ProjectPageModule', canActivate: [AuthGuard] },
  { path: 'project/create/2', loadChildren: './pages/projects/create/done/done.module#DonePageModule', canActivate: [ProjectGuard, AuthGuard] },

  { path: 'invite/:hash', loadChildren: './pages/auth/invite/invite.module#InvitePageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile/profile.module#ProfilePageModule', canActivate: [AuthGuard] },
  { path: 'profile/payment', loadChildren: './pages/profile/payment/payment.module#PaymentPageModule', canActivate: [AuthGuard] },
  { path: 'profile/contact', loadChildren: './pages/profile/contact/contact.module#ContactPageModule', canActivate: [AuthGuard] },
  { path: 'profile/address', loadChildren: './pages/profile/address/address.module#AddressPageModule', canActivate: [AuthGuard] },
  {
    path: '',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { 
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
