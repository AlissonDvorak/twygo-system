import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  standalone: true
})
export class TopMenuComponent {
  constructor(private router: Router) {}

  onNewCourse() {
    this.router.navigate(['/new-course']);
  }
}