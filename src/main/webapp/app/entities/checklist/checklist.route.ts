import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ChecklistComponent } from './checklist.component';
import { ChecklistDetailComponent } from './checklist-detail.component';
import { ChecklistPopupComponent } from './checklist-dialog.component';
import { ChecklistDeletePopupComponent } from './checklist-delete-dialog.component';

export const checklistRoute: Routes = [
    {
        path: 'checklist',
        component: ChecklistComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Checklists'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'checklist/:id',
        component: ChecklistDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Checklists'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const checklistPopupRoute: Routes = [
    {
        path: 'checklist-new',
        component: ChecklistPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Checklists'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'checklist/:id/edit',
        component: ChecklistPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Checklists'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'checklist/:id/delete',
        component: ChecklistDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Checklists'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
