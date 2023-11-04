import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleResponse, Datum } from 'src/app/shared/interfaces/common';
import { ArtworkService } from 'src/app/shared/services/artwork/artwork.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-artpage',
  templateUrl: './artpage.component.html',
  styleUrls: ['./artpage.component.css']
})
export class ArtpageComponent {
  imageUrl: string = environment.imageUrl;
  article?: Datum
  imageSize = 1686

  constructor(private route: ActivatedRoute, private artService: ArtworkService) {
    window.scrollTo(0, 0);
    const artId = this.route.snapshot.paramMap.get('artId');
    // console.log(artId);

    if (artId) {
      this.artService.getArticle(Number.parseInt(artId)).subscribe(
        (response: ArticleResponse) => {
          this.article = response.data;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    }
  }

  addArticleToWishList(id: number | undefined) {
    if (id)
      this.artService.addArticleToWishList(id);
  }
}
