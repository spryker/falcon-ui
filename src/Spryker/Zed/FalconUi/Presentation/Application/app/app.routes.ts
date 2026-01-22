import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({ standalone: true, template: '' })
export class PlaceholderComponent {}

export const routes: Routes = [
    {
        path: '',
        component: PlaceholderComponent,
    },
];
