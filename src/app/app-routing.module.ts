import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { HomeComponent } from './home/home.component';
import { MyPlacesComponent } from './my-places/my-places.component';
import { ProfileComponent } from './profile/profile.component';
const routes: Routes = [{
  path: '',
  // component: LoginComponent,
  redirectTo: 'login',
  pathMatch: 'full'
},
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'forget-password',
  component: ForgetPasswordComponent
},
{
  path: 'default-layout',
  component: DefaultLayoutComponent,
  children: [
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
      canActivate: [AuthGuard],

    },
    {
      path: 'home',
      component: HomeComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'my-places',
      component: MyPlacesComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'profile',
      component: ProfileComponent,
      canActivate: [AuthGuard],
    }
  ]
},
{
  path: '**',
  component: LoginComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
