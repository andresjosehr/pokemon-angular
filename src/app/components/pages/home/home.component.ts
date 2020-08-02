import { Component, OnInit, HostListener } from '@angular/core';
import { PokemonsService } from "../../../services/pokemons/pokemons.service"
import { PokemonShortData, PokemonData, PokemonList } from 'src/app/interfaces/pokemons/pokemon';
import { Observable, fromEvent, merge, pairs, from, timer, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, filter, distinct, switchMap, debounceTime, distinctUntilChanged, mergeMap, take, tap} from 'rxjs/operators'
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  

  public pokemonList: PokemonShortData[] = [];
  public isLoading: boolean = false
  private numberOfLoadedPokemons: number = 0;
  private numberOfPokemonsToLoad: number = 70;
  public searchInput: FormControl;

  constructor(
    public pokemonsService: PokemonsService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {

    this.searchInput = new FormControl()
    const searchPokemon$=this.searchInput.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        this.numberOfLoadedPokemons=0;
        this.pokemonList=[]
      }),
      switchMap(pokemonName => {
        if(!pokemonName){
          return this.pokemonsService.getPokemons(this.numberOfLoadedPokemons=0, this.numberOfPokemonsToLoad=70) 
        }
        return from(pokemonName).pipe(
          switchMap(resp=> {
            return this.pokemonsService.searchPokemon()
          }),
          switchMap(pokemons => {
           return  from(pokemons).pipe(
             filter(resp => {
               return resp.name.indexOf(pokemonName) > -1
              }),
              mergeMap(pokemonShortData => this.pokemonsService.getPokemonImages(pokemonShortData))
           )
          })
        )
      })
    )
    
    const pageScroll$ = fromEvent(window, "scroll").pipe(
      
      map(() => window.scrollY),
      filter((current) => current >= (document.body.clientHeight - window.innerHeight) && !this.isLoading && !this.searchInput.value),
      distinct(),
      switchMap(() => this.pokemonsService.getPokemons(this.numberOfLoadedPokemons, this.numberOfPokemonsToLoad))

    )

    const loadItems$ = merge(this.pokemonsService.getPokemons(this.numberOfLoadedPokemons, this.numberOfPokemonsToLoad), pageScroll$, searchPokemon$).pipe(
    ).subscribe((resp: any) => {
      this.numberOfLoadedPokemons++
      this.pokemonList.push(resp)
    })
  }
  

}
