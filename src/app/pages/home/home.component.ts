import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ArticlesResponse, Datum } from 'src/app/shared/interfaces/common';
import { ArtworkService } from 'src/app/shared/services/artwork/artwork.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  artworks: Array<Datum> = [];
  imageUrl = environment.imageUrl;
  imageSize: number = 400;
  currentPage: number = 1;
  activeClass = 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
  inactiveClass = 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
  nextExists: boolean = true;

  searchForm: FormGroup = new FormGroup({
    searchInput: new FormControl()
  })

  constructor(private artService: ArtworkService) {
    window.scrollTo(0, 0);
    this.updateArticles(1);
  }

  updateArticles(pageNo: number) {
    this.artworks = [];

    const query = this.searchForm.get('searchInput')?.value;
    // console.log(query);
    
    if (query && query !== '') {
      this.updateQueryArticles(query, pageNo);
    } else {
      this.artService.getArticles(50, pageNo).subscribe(
        (response: ArticlesResponse) => {
          if (response.pagination.next_url)
            this.nextExists = true;
          else
            false;

          response.data.map((value) => {
            if (value.image_id) {
              this.artworks.push(value);
            }
          });
          this.currentPage = response.pagination.current_page;

          this.artworks = this.artworks.slice(0, 12);

          // console.log(this.artworks);

          // console.log(response);
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      )
    }
  }

  toggleArticleToWishList(id: number | undefined) {
    if (id) {
      if (this.artService.articleInWishList(id)) {
        this.artService.removeFromWishlist(id);
      } else {
        this.artService.addArticleToWishList(id);
      }
    }
  }

  articleInWishList(id: number | undefined) {
    if (id) {
      return this.artService.articleInWishList(id);
    } else {
      return false;
    }
  }

  updateQueryArticles(query: string, pageNumber: number) {
    this.artService.getQueryArticles(query, 20, pageNumber).subscribe(
      (response: ArticlesResponse) => {
        // console.log(response);
        
        if (response.pagination.next_url)
          this.nextExists = true;
        else
          false;

        var count = 0;

        response.data.map((value) => {
          // console.log(value);
          
          this.artService.getArticle(value.id).subscribe(
            (response) => {
              // console.log(response);
              
              if(response.data.image_id && count < 12) {
                this.artworks.push(response.data);
                count++;
              }
            }
          );
        });

        this.currentPage = response.pagination.current_page;

        this.artworks = this.artworks.slice(0, 12);

        // console.log(this.artworks);
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    )
  }
}
