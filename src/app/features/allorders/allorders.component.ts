import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../core/services/order/order.service';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink],
  styleUrl: './allorders.component.css',
  templateUrl: './allorders.component.html',
})
export class AllordersComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  orders = signal<any[]>([]);
  expandedOrderId = signal<number | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.orderService.getUserOrders().subscribe({
      next: (res) => {
        const sortedOrders = [...res].reverse();
        this.orders.set(sortedOrders);

        if (sortedOrders.length > 0) {
          this.expandedOrderId.set(sortedOrders[0].id);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }

  toggleOrder(orderId: number): void {
    this.expandedOrderId.update((current) => (current === orderId ? null : orderId));
  }
}
