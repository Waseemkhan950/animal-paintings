import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../../models/product';
import { CurrencyPipe, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CartService } from '../../cart/cart.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
 import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-product-list',
  imports: [NgFor,MatCardModule, MatButtonModule, CurrencyPipe, FlexLayoutModule, MatSnackBarModule, MatInputModule,MatFormFieldModule, MatSelectModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  // a variable is needed to store the values we would get from subscription of service. later, it is used for {{interpolation}} in html
  products: Product[] = [];
  filteredProducts: Product[] = []; 
  sortOrder: string = "";
// before using service, we need its instance through constructor
  constructor(private productService: ProductService, private cartService: CartService, private snackbar: MatSnackBar) { }
  
  ngOnInit(): void {
    this.productService.getProduts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
    })
  }
  addToCart(product: Product): void{
    this.cartService.addToCart(product).subscribe({
      // next triggers when the call is successful
      next: () => {
        this.snackbar.open("The product has added to the Cart!", "", {
          duration: 2000,
          horizontalPosition: "right", 
          verticalPosition: "top" 
        });
      }
    });
  }
  // this is the best filter method that i have ever seen; and it is quite useful;try to use it whenever possible 
  applyFilter(event: Event): void {
    let searchTerm = (event.target as HTMLInputElement).value;
    searchTerm = searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(
      product => product.name.toLowerCase().includes(searchTerm)
    );
    // following line maintaing sorting even during filtering
    this.sortProducts(this.sortOrder);
  }
  // this is also the best sorting method i have ever seen
  sortProducts(sortValue: string) {
    this.sortOrder = sortValue;
    if (this.sortOrder === "priceLowHigh") {
      this.filteredProducts.sort((a,b) => a.price - b.price)
    } else if (this.sortOrder === "priceHighLow") {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    }
  } 
}
