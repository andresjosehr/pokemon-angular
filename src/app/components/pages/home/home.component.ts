import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { PokemonsService } from "../../../services/pokemons/pokemons.service"
import { PokemonShortData, PokemonData, PokemonList } from 'src/app/interfaces/pokemons/pokemon';
import { Observable, fromEvent, merge, pairs, from, timer, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, filter, distinct, switchMap, debounceTime, distinctUntilChanged, mergeMap, take, tap, toArray} from 'rxjs/operators'
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit, OnDestroy {

  public searchInput: FormControl;
  public pokemonList: any;


  constructor(
    public pokemonsService: PokemonsService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {

    this.pokemonList = this.pokemonsService.pokemonListOnInit()
  
    this.searchInput = new FormControl()
    
    const searchPokemon$=this.searchInput.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        this.pokemonsService.numberOfLoadedPokemons=0;
        this.pokemonsService.pokemonList=[]
      }),
      switchMap(pokemonName => {
        if(!pokemonName){
          return this.pokemonsService.getPokemons(this.pokemonsService.numberOfLoadedPokemons=0, this.pokemonsService.numberOfPokemonsToLoad=70) 
        }
        return from([pokemonName]).pipe(
          switchMap(resp=> {
            return this.pokemonsService.searchPokemon()
          }),
          switchMap(pokemons => {
           return  from(pokemons).pipe(
             filter(resp => {
               return resp.name.indexOf(pokemonName) > -1
              }),
              mergeMap(pokemonShortData => this.pokemonsService.getPokemonImagesAndID(pokemonShortData))
           )
          })
        )
      }),
      toArray(),
      map(console.log)
    )


    // this.pokemonList = merge(this.pokemonsService.pokemonListOnInit(), searchPokemon$)


  }   

  ngOnDestroy():void {
    // this.loadItems$.unsubscribe();
  }

}
