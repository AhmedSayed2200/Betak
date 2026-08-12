import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { CurrencyPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { OrdersService } from './services/orders.service';
import { AuthService } from '../../core/Auth/services/auth.service';
import { IOrders } from './modules/iorders.interface';

@Component({
  selector: 'app-orders',
  imports: [RouterLink,HeaderComponent,CurrencyPipe,DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  private readonly ordersService=inject(OrdersService)
  private readonly authService=inject(AuthService)
  private readonly pLATFORM_ID=inject(PLATFORM_ID)
  private readonly router=inject(Router)
  ordersList=signal<IOrders[]>([])
  ngOnInit(): void {
     if(isPlatformBrowser(this.pLATFORM_ID)){
       this.verifyToken();
     }
      // this.getUserOrders()
  }
  getUserOrders(userId:string){
    this.ordersService.getUserOrders(userId).subscribe({
      next:(res) => {
        console.log(res);
        res.forEach((order:IOrders) => {
          order.isDetailsAppear=false;
        });
        this.ordersList.set(res.reverse())
      },
      error:(err) => {
        console.log(err);
      }
    })
  }
  verifyToken(){
        if(localStorage.getItem("E-CommerceToken")){
          this.authService.verifyToken().subscribe({
             next: (res) => {
              console.log(res);
                if(res.message =="verified")
                     this.getUserOrders(res.decoded.id);
              },
        error: (err) => {
          console.log(err);
          localStorage.removeItem('E-CommerceToken');
          localStorage.removeItem('E-CommerceUser');
          this.router.navigate(["/login"]);
          this.authService.isLogged.set(false);
        }
        })
    }
  }
  calcCountItems(cartItems:any):number{
        let cartCount=0;
        cartItems.forEach((item:any) => {
          cartCount+=item.count;
        })
        return cartCount;
  }
}
