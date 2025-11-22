export const routes = [
    { path: '', redirectTo: '/citas', pathMatch: 'full' },
    { path: 'citas', loadComponent: () => import('./features/citas/citas-page.component').then(m => m.CitasPageComponent) },
    { path: 'pacientes', loadComponent: () => import('./features/pacientes/pacientes-page.component').then(m => m.PacientesPageComponent) },
    { path: 'odontograma', loadComponent: () => import('./features/odontograma/odontograma-page.component').then(m => m.OdontogramaPageComponent) },
    { path: 'medicos', loadComponent: () => import('./features/medicos/medicos-page.component').then(m => m.MedicosPageComponent) },
    { path: '**', redirectTo: '/citas' }
];
//# sourceMappingURL=app.routes.js.map