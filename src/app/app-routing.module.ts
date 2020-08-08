import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./components/pages/home/home.component";
import { HeaderComponent } from "./components/general/header/header.component";
import { PokemonDetailsComponent } from "./components/pages/pokemon-details/pokemon-details.component";

const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: "pokemon/:id", component: PokemonDetailsComponent},
  {path: "**", redirectTo:'home', pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
