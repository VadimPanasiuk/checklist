import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChecklistSharedModule } from '../../shared';
import {
    SubitemService,
    SubitemPopupService,
    SubitemComponent,
    SubitemDetailComponent,
    SubitemDialogComponent,
    SubitemPopupComponent,
    SubitemDeletePopupComponent,
    SubitemDeleteDialogComponent,
    subitemRoute,
    subitemPopupRoute,
} from './';

const ENTITY_STATES = [
    ...subitemRoute,
    ...subitemPopupRoute,
];

@NgModule({
    imports: [
        ChecklistSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SubitemComponent,
        SubitemDetailComponent,
        SubitemDialogComponent,
        SubitemDeleteDialogComponent,
        SubitemPopupComponent,
        SubitemDeletePopupComponent,
    ],
    entryComponents: [
        SubitemComponent,
        SubitemDialogComponent,
        SubitemPopupComponent,
        SubitemDeleteDialogComponent,
        SubitemDeletePopupComponent,
    ],
    providers: [
        SubitemService,
        SubitemPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChecklistSubitemModule {}
