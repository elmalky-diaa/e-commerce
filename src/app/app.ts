import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { register } from 'swiper/element/bundle';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgxSpinnerComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('e-commerce');
  ngOnInit(): void {
    register();
  }
}
