import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./components/pages/home/home.component";
import { HeaderComponent } from "./components/general/header/header.component";

const routes: Routes = [
  {path: "home", component: HomeComponent},
  // {path: "home", component: HeaderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
