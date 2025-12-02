import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { Product } from '../../core/types/Products';
import { CarrouselComponent } from "../../components/carrousel/carrousel.component";

@Component({
  selector: 'app-home',
  imports: [CarrouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  products:Product[] | null=[];

  constructor(private productsService:ProductsService){}

  ngOnInit(): void {
    this.productsService.getProductsSortedByPrice(10).subscribe({
      next:(product)=>{
        this.products=product;
        console.log(product)
      },
      error:(error)=>{
        this.products=null;
        console.log(error)
      }
    })
  }
}
