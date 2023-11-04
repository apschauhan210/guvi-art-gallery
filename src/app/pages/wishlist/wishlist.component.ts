import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Datum } from 'src/app/shared/interfaces/common';
import { ArtworkService } from 'src/app/shared/services/artwork/artwork.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  wishListItems?: Array<Datum>;
  imageUrl = environment.imageUrl;
  imageSize = 800

  constructor(private artService: ArtworkService, private router: Router) {
    window.scrollTo(0, 0);
    this.updateWishList();
  }

  updateWishList() {
    this.wishListItems = [];
    // console.log(this.artService.getWishList());

    this.artService.getWishList().map((articleId) => {
      this.artService.getArticle(articleId).subscribe(
        (response) => {
          this.wishListItems?.push(response.data);
        }
      )
    });
  }

  toggleArticleToWishList(id: number | undefined) {
    if (id) {
      if (this.artService.articleInWishList(id)) {
        this.artService.removeFromWishlist(id);
      } else {
        this.artService.addArticleToWishList(id);
      }

      this.updateWishList();

      // this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
      //   this.router.navigateByUrl('/wishlist');
      // });
    }
  }

  articleInWishList(id: number | undefined) {
    if (id) {
      return this.artService.articleInWishList(id);
    } else {
      return false;
    }
  }
}
