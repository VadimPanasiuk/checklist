import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ChecklistItemComponent } from './checklist-item.component';
import { ChecklistItemDetailComponent } from './checklist-item-detail.component';
import { ChecklistItemPopupComponent } from './checklist-item-dialog.component';
import { ChecklistItemDeletePopupComponent } from './checklist-item-delete-dialog.component';

export const checklistItemRoute: Routes = [
    {
        path: 'checklist-item',
        component: ChecklistItemComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ChecklistItems'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'checklist-item/:id',
        component: ChecklistItemDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ChecklistItems'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const checklistItemPopupRoute: Routes = [
    {
        path: 'checklist-item-new',
        component: ChecklistItemPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ChecklistItems'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'checklist-item/:id/edit',
        component: ChecklistItemPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ChecklistItems'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'checklist-item/:id/delete',
        component: ChecklistItemDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ChecklistItems'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
