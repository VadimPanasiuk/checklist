import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { SubitemComponent } from './subitem.component';
import { SubitemDetailComponent } from './subitem-detail.component';
import { SubitemPopupComponent } from './subitem-dialog.component';
import { SubitemDeletePopupComponent } from './subitem-delete-dialog.component';

export const subitemRoute: Routes = [
    {
        path: 'subitem',
        component: SubitemComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Subitems'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'subitem/:id',
        component: SubitemDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Subitems'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const subitemPopupRoute: Routes = [
    {
        path: 'subitem-new',
        component: SubitemPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Subitems'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'subitem/:id/edit',
        component: SubitemPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Subitems'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'subitem/:id/delete',
        component: SubitemDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Subitems'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
