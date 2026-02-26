import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { environment } from "@environments/environment";
import type{ GiphyResponse } from "../interfaces/giphy.interface";
import type{ Gif } from "../interfaces/gif.interface";
import { GifMapper } from "../mapper/gif.mapper";
import { map, tap } from "rxjs";

@Injectable({providedIn: 'root'})
export class GifService{

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([])
  trendingGifsLoading = signal(true);
 // searchHistory: diccionario (objeto) donde cada búsqueda (string) guarda su lista de gifs (Gif[]).
searchHistory = signal<Record<string, Gif[]>>({});

// searchHistoryKeys: obtiene las “llaves” del diccionario (los términos buscados) como un array de strings.
searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));



  constructor(){
    this.loadTrendingGifs();
    console.log("Servicio Creado.")
  }

  loadTrendingGifs(){

    this.http.get<GiphyResponse>(`${ environment.giphyUrl }/gifs/trending`,{
      params: {
        api_key: environment.apiKey,
        limit: 20,
      },
    }).subscribe( (resp) =>{
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs)
      this.trendingGifsLoading.set(false);
      console.log({ gifs });
    });

  }

  searchGifs(query: string){

    return this.http.get<GiphyResponse>(`${ environment.giphyUrl }/gifs/search`,{
      params: {
        api_key: environment.apiKey,
        limit: 20,
        q: query
      },
    })
    .pipe(
      // ({ data }) significa: "del objeto que llega, saca la propiedad 'data' y úsala".
      // Es equivalente a: (resp) => resp.data
      map(({ data }) => data ),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
      tap((items) => {
        this.searchHistory.update((history) => ({
          ...history,
          [query.toLowerCase()] : items
        }));
      })
    );
  }
}
