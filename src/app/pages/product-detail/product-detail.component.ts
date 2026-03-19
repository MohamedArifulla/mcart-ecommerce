import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  product: any = null;
  loading = true;
  quantity = 1;
  addedToCart = false;
  errorMsg = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(id).subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMsg = 'Product not found!';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  increaseQty() {
    if (this.quantity < this.product.stock) this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    this.cartService.addToCart(this.product, this.quantity);
    this.addedToCart = true;
    setTimeout(() => this.addedToCart = false, 3000);
  }
}
