import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '**',
        redirectTo: 'jeu-bataille/home'
    },
    {
        title: 'Jeu de la bataille - LERANDY ',
        path: 'jeu-bataille',
        children:[
            {
                path:'home',
                loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent)
            }
            
        ]
        
    }
];
