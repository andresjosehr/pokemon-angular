import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment"
import { PokemonList, PokemonData, PokemonShortData } from "../../interfaces/pokemons/pokemon"
import { HttpClient } from "@angular/common/http"
import { map, pluck, mergeMap, filter, distinct, switchMap, refCount, publishReplay } from 'rxjs/operators'
import { Observable, from, merge, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonsService {

  public request: any;
  public pokemonList: PokemonShortData[] = [];
  public isLoading: boolean = false
  public numberOfLoadedPokemons: number = 0;
  public numberOfPokemonsToLoad: number = 35;
  loadItems$: any;

  constructor(
    private httpClient: HttpClient
    ) { }

  pokemonListOnInit(){

    const pageScroll$ = fromEvent(window, "scroll").pipe(
      
      map(() => window.scrollY),                                                                          // && !this.searchInput.value 
      filter((current) => current >= (document.body.clientHeight - window.innerHeight) && !this.isLoading),
      distinct(),
      switchMap(() => this.getPokemons(this.numberOfLoadedPokemons, this.numberOfPokemonsToLoad))

    )
    
    merge(this.getPokemons(this.numberOfLoadedPokemons, this.numberOfPokemonsToLoad), pageScroll$).pipe(
      
    )
      .subscribe((resp: any) => {
      this.numberOfLoadedPokemons++
      this.pokemonList.push(resp)
    })

  }

  getPokemons(offset: number, limit: number): Observable<any> {
    return this.httpClient.get<PokemonList>(`${environment.pokemonAPI}pokemon?offset=${offset}&limit=${limit}`).pipe(
      pluck("results"),
      mergeMap((pokemonList: PokemonShortData[]) => {
        return from(pokemonList).pipe(
          mergeMap((pokemonShortData: PokemonShortData) => {
            return this.getPokemonImages(pokemonShortData)
          }),
          
        )
    })
    )
  }

  getPokemonImages(pokemonShortData: PokemonShortData): Observable<any> {
    return this.httpClient.get<PokemonData>(`${pokemonShortData.url}`).pipe(
      pluck("sprites", "front_default"),
      map((pokemon: string)=>{
        return {
          name: pokemonShortData.name,
          url: pokemonShortData.url,
          front_default: pokemon
        }
      })
    )
  }

  searchPokemon(): Observable<PokemonShortData[]> {
    return this.httpClient.get<PokemonData>(`${environment.pokemonAPI}pokemon?&limit=1000`).pipe(
      pluck("results"),
      
    )
  }


}
