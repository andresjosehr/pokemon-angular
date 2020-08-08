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
  
    this.searchInput = new FormControl()
    
    const searchPokemon$=this.searchInput.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      mergeMap(pokemonName => this.pokemonsService.initPokemonSearch([pokemonName]))
    )

    this.pokemonList = merge(this.pokemonsService.pokemonListOnInit(), searchPokemon$)
  }   

  ngOnDestroy():void {
  }

}
