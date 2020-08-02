import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment"
import { PokemonList, PokemonData, PokemonShortData } from "../../interfaces/pokemons/pokemon"
import { HttpClient } from "@angular/common/http"
import { map, mapTo, pluck, mergeMap } from 'rxjs/operators'
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonsService {

  public request: any;
  public pokemonList

  constructor(
    private httpClient: HttpClient
    ) { }


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
      pluck("results")
    )
  }


}
