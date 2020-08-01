import { Component, OnInit, HostListener } from '@angular/core';
import { PokemonsService } from "../../../services/pokemons/pokemons.service"
import { PokemonShortData, PokemonData, PokemonList } from 'src/app/interfaces/pokemons/pokemon';
import { Observable, fromEvent, merge, pairs, from, timer, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, concatMap, filter, debounceTime, distinct, tap, mapTo, take, pluck, concatAll, mergeAll, toArray, switchMap} from 'rxjs/operators'
import { async } from 'rxjs/internal/scheduler/async';
import { environment } from 'src/environments/environment';
import { Scroll } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  

  public pokemonList: PokemonShortData[] = [];
  public pokemonShortData: any = [];
  public nextURL: string;
  public isLoading: boolean = false

  private itemHeight: number = 296;
  private numberOfLoadedPokemons: number = 0;
  private numberOfPokemonsToLoad: number = 70;
  private cache = []; 

  constructor(
    public pokemonsService: PokemonsService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    
    const pageScroll$ = fromEvent(window, "scroll").pipe(
      
      map(() => window.scrollY),
      filter((current) => current >=  (document.body.clientHeight - window.innerHeight) && !this.isLoading),
      distinct(),
      switchMap(() => this.pokemonsService.getPokemons(this.numberOfLoadedPokemons, this.numberOfPokemonsToLoad))

    )

    const loadItems$ = merge(this.pokemonsService.getPokemons(this.numberOfLoadedPokemons, this.numberOfPokemonsToLoad), pageScroll$).pipe(
    ).subscribe((resp: any) => {
      this.numberOfLoadedPokemons++
      console.log(this.numberOfLoadedPokemons)
      this.pokemonList.push(resp)
    })
    

    // this.pokemonsService.getPokemons(10).subscribe(console.log)

    // this.pokemonShortDataObservable =  this.pokemonsService.getPokemons()

    // this.pokemonShortDataObservable.subscribe(val =>  this.pokemonShortData.push(val))

    // this.pokemonShortData.subscribe(val=> {
    //   return val.map(item =>{
    //     return this.pokemonsService.getPokemonImage(item.url).then(resp => {return item.front_default = resp })
    //   })
    // })
    

    // this.pokemonsService.getPokemons().then((resp) => {
    //   this.pokemonShortData = resp.results;
    //   this.nextURL = resp.next;
    //   this.pokemonShortData.forEach((value, key)=>{
    //     this.pokemonsService.getAnyData(this.pokemonShortData[key].url).then((val) => this.pokemonShortData[key].data = val)
    //   });
    // });
  }

  // getMorePokemons(url: string): void{
  //   this.pokemonsService.getAnyData(url).then((resp) => {
  //     this.pokemonShortData = this.pokemonShortData.concat(resp.results);
  //     this.nextURL = resp.next;
  //     // console.log(val)
  //   })
  // }

  // @HostListener("window:scroll", ['$event'])
  // doSomethingOnWindowScroll($event:Event){
  //   const element = $event.target as HTMLElement;
  //   if((element.children[0].scrollHeight)===(element.children[0].scrollTop+element.children[0].clientHeight)){
  //     this.getMorePokemons(this.nextURL);
  //   }
  // }

}
