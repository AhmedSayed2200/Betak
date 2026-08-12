import { Component, inject, signal } from '@angular/core';
import { BrandsService } from '../../core/services/brands.service';
import { IBrands } from '../../core/modules/ibrands.interface';
import { RouterLink } from "@angular/router";
import { HeaderComponent } from '../../shared/ui/header/header.component';

@Component({
  selector: 'app-brands',
  imports: [RouterLink,HeaderComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent {
 brandList=signal<IBrands[]>([])
  private readonly brandsService=inject(BrandsService)
  ngOnInit(): void {
    this.getAllBrands()
  }
  getAllBrands(){
    this.brandsService.getAllBrands().subscribe({
      next: (res) => {
       this.brandList.set(res.data)
       console.log( this.brandList(),"brands");
        
      },
      error: (err) => {
        console.log(err );
      }
    })
  }
}
