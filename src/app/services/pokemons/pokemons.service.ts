import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment"
import { PokemonList, PokemonData } from "../../interfaces/pokemons/pokemon"
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class PokemonsService {

  public request: any;

  constructor(
    private httpClient: HttpClient
    ) { }

  getPokemons(): Promise<any> {
    return this.httpClient.get<PokemonList>(`${environment.pokemonAPI}pokemon?limit=100`)
      .toPromise().then((result: PokemonList) =>{
        return result;
    })
  }

  getPokemonData(pokemonID: number): Promise<any> {
    return this.httpClient.get<PokemonData>(`${environment.pokemonAPI}pokemon/${pokemonID}`)
      .toPromise().then((result: PokemonData) =>{
        return result;
    })
  }

  getAnyData(url): Promise<any> {
    return this.request = this.httpClient.get<PokemonData>(`${url}`)
      .toPromise().then((result: any) =>{
        return result;
    })
  }

  getMorePokemons(url): Promise<any> {
    return this.request = this.httpClient.get<PokemonData>(`${url}`)
      .toPromise().then((result: any) =>{
        return result;
    })
  }

}
