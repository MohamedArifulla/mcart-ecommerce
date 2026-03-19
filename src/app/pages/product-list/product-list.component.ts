import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  products: any[] = [];
  loading = true;
  searchTerm = '';
  errorMsg = '';

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMsg = 'Failed to load products';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredProducts() {
    if (!this.searchTerm) return this.products;
    return this.products.filter(p =>
      p.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert(`✅ "${product.name}" added to cart!`);
  }
}
