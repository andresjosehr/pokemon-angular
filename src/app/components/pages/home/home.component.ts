import { Component, OnInit, HostListener } from '@angular/core';
import { PokemonsService } from "../../../services/pokemons/pokemons.service"
import { PokemonShortData } from 'src/app/interfaces/pokemons/pokemon';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  
  public pokemonShortData: PokemonShortData[];
  public nextURL: string;

  constructor(
    public pokemonsService: PokemonsService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {

    this.pokemonsService.getPokemons().then((resp) => {
      this.pokemonShortData = resp.results;
      this.nextURL = resp.next;
      this.pokemonShortData.forEach((value, key)=>{
        this.pokemonsService.getAnyData(this.pokemonShortData[key].url).then((val) => this.pokemonShortData[key].data = val)
      });
    });
  }

  getMorePokemons(url: string): void{
    this.pokemonsService.getAnyData(url).then((resp) => {
      this.pokemonShortData = this.pokemonShortData.concat(resp.results);
      this.nextURL = resp.next;
      // console.log(val)
    })
  }

  // getMorePokemons(url: string): Observable<any> {
    
  //   return this.httpClient.get(url) (1)
  //       .map(res => { (2)
  //         return res.json().results.map(item => {
  //           console.log(item)
  //         });
  //       });
  // }

  @HostListener("window:scroll", ['$event'])
  doSomethingOnWindowScroll($event:Event){
    const element = $event.target as HTMLElement;
    if((element.children[0].scrollHeight)===(element.children[0].scrollTop+element.children[0].clientHeight)){
      this.getMorePokemons(this.nextURL);
    }
  }

}
