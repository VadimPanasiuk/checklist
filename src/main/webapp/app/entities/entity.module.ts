import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ChecklistItemModule } from './item/item.module';
import { ChecklistSubitemModule } from './subitem/subitem.module';
import { ChecklistChecklistModule } from './checklist/checklist.module';
import { ChecklistChecklistItemModule } from './checklist-item/checklist-item.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        ChecklistItemModule,
        ChecklistSubitemModule,
        ChecklistChecklistModule,
        ChecklistChecklistItemModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChecklistEntityModule {}
