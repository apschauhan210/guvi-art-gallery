import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ArticleResponse, ArticlesResponse } from '../../interfaces/common';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {

  serverUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {

  }

  public getArticles(limit?: number, page?: number): Observable<ArticlesResponse> {
    if (!limit)
      limit = 20;
    if (!page)
      page = 1;
    return this.http.get<ArticlesResponse>(`${this.serverUrl}?page=${page}&limit=${limit}`);
  }

  public getArticle(artId: number): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(`${this.serverUrl}/${artId}`);
  }

  public addArticleToWishList(id: number) {
    var localWishlist = localStorage.getItem('wishlist');
    var wishList = new Set<number>();
    if(localWishlist)
      wishList = new Set(JSON.parse(localWishlist));
    
    wishList.add(id);
    localStorage.setItem('wishlist', JSON.stringify(Array.from(wishList.values())));
  }

  public getWishList(): Array<number> {
    var localWishlist = localStorage.getItem('wishlist');
    if(!localWishlist)
      return [];
    return JSON.parse(localWishlist);
  } 

  public articleInWishList(id: number) {
    if(this.getWishList().indexOf(id) >= 0)
      return true;
    return false;
  }

  public removeFromWishlist(id: number) {
    var localWishlist = localStorage.getItem('wishlist');
    var wishList = new Set<number>();
    if(localWishlist)
      wishList = new Set(JSON.parse(localWishlist));
    
    wishList.delete(id);
    localStorage.setItem('wishlist', JSON.stringify(Array.from(wishList.values())));
  }

  public getQueryArticles(query: string, limit?: number, page?: number) {
    if (!limit)
      limit = 20;
    if (!page)
      page = 1;
    return this.http.get<ArticlesResponse>(`${this.serverUrl}/search?q=${query}&page=${page}&limit=${limit}`);
  }
}

