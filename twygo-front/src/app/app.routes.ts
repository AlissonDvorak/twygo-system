import { Routes } from '@angular/router';
import { CoursesComponent } from './pages/courses/courses.component';
import { TopMenuComponent } from './shared/top-menu/top-menu.component';

export const routes: Routes = [
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: 'courses', component: CoursesComponent },
  { path: 'topo', component: TopMenuComponent },
//   { path: 'new-course', component: CoursesComponent } // Certifique-se de que este componente existe
];