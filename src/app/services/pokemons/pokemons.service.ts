import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment"
import { PokemonList, PokemonData, PokemonShortData } from "../../interfaces/pokemons/pokemon"
import { HttpClient } from "@angular/common/http"
import { map, pluck, mergeMap, filter, distinct, switchMap, refCount, publishReplay, tap, toArray, share, pairwise, startWith } from 'rxjs/operators'
import { Observable, from, merge, fromEvent, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonsService {

  // public request: any;
  public pokemonList: PokemonShortData[] = [];
  public isLoading: boolean = false
  public numberOfLoadedPokemons: number = 0;
  public numberOfPokemonsToLoad: number = 35;
  public pokemonSubject: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  // loadItems$: any;

  constructor(
    private httpClient: HttpClient
    ) { }


  scrollEvent(){
    
  }

  pokemonListOnInit(): Observable<any>{

    const pageScroll$ = fromEvent(window, "scroll").pipe(
      map(() => window.scrollY),                                                                          // && !this.searchInput.value 
      filter((current) => current >= (document.body.clientHeight - window.innerHeight) && !this.isLoading),
      distinct(),
      switchMap((data) =>{ 
        return this.getPokemons(this.numberOfLoadedPokemons+=35, this.numberOfPokemonsToLoad)
      }),
    )
    
    return merge(this.getPokemons(this.numberOfLoadedPokemons, this.numberOfPokemonsToLoad), pageScroll$).pipe(
      startWith([]),
      pairwise(),
      map(resp => this.pokemonList = resp[0] ? this.pokemonList.concat(resp[1]) : resp[1] ),
    )
    
  }

  getPokemons(offset: number, limit: number): Observable<any> {
    return this.httpClient.get<PokemonList>(`${environment.pokemonAPI}pokemon?offset=${offset}&limit=${limit}`).pipe(
      pluck("results"),
      mergeMap((pokemonList: PokemonShortData[]) => {
          return from(pokemonList).pipe(
            mergeMap((pokemonShortData: PokemonShortData) => {
              return this.getPokemonImagesAndID(pokemonShortData)
            }),          
          )
      }),
      toArray(),
    )
  }

  getPokemonImagesAndID(pokemonShortData: PokemonShortData): Observable<any> {
    return this.httpClient.get<PokemonData>(`${pokemonShortData.url}`).pipe(
      map((pokemon: PokemonData)=>{
        return {
          id: pokemon.id,
          name: pokemonShortData.name,
          url: pokemonShortData.url,
          front_default: pokemon.sprites.front_default
        }
      })
    )
  }

  searchPokemon(): Observable<PokemonShortData[]> {
    return this.httpClient.get<PokemonData>(`${environment.pokemonAPI}pokemon?&limit=1000`).pipe(
      pluck("results"),
    )
  }

  initPokemonSearch(PokemonName: Array<string>){

    return from([PokemonName]).pipe(
      tap(() => {
        this.numberOfLoadedPokemons=0;
        this.pokemonList=[];
      }),
      switchMap(pokemonName => {
        if(!pokemonName[0]){
          return this.pokemonListOnInit()
        }
        return from(pokemonName).pipe(
          switchMap(resp=> {
            return this.searchPokemon()
          }),
          switchMap(pokemons => {
           return  from(pokemons).pipe(
             filter(resp => {
               return resp.name.indexOf(pokemonName[0]) > -1
              }),
              mergeMap(pokemonShortData => this.getPokemonImagesAndID(pokemonShortData))
           )
          }),
          toArray(),
        )
      })
    )
  }


}
