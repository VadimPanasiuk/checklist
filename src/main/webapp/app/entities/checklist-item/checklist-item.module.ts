import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChecklistSharedModule } from '../../shared';
import {
    ChecklistItemService,
    ChecklistItemPopupService,
    ChecklistItemComponent,
    ChecklistItemDetailComponent,
    ChecklistItemDialogComponent,
    ChecklistItemPopupComponent,
    ChecklistItemDeletePopupComponent,
    ChecklistItemDeleteDialogComponent,
    checklistItemRoute,
    checklistItemPopupRoute,
} from './';

const ENTITY_STATES = [
    ...checklistItemRoute,
    ...checklistItemPopupRoute,
];

@NgModule({
    imports: [
        ChecklistSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ChecklistItemComponent,
        ChecklistItemDetailComponent,
        ChecklistItemDialogComponent,
        ChecklistItemDeleteDialogComponent,
        ChecklistItemPopupComponent,
        ChecklistItemDeletePopupComponent,
    ],
    entryComponents: [
        ChecklistItemComponent,
        ChecklistItemDialogComponent,
        ChecklistItemPopupComponent,
        ChecklistItemDeleteDialogComponent,
        ChecklistItemDeletePopupComponent,
    ],
    providers: [
        ChecklistItemService,
        ChecklistItemPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChecklistChecklistItemModule {}
