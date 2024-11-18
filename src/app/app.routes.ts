import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        title: 'Jeu de la bataille - LERANDY ',
        path: 'jeu-bataille',
        children:[
            {
                path:'home',
                loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent)
            },
            {
                path:'game',
                loadComponent: () => import('./pages/game/game.component').then(m => m.GameComponent)
            },
        ]
        
    },
    {
        path: '**',
        redirectTo: 'jeu-bataille/home'
    }
];
