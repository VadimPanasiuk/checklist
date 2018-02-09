import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { ChecklistItem } from './checklist-item.model';
import { ChecklistItemService } from './checklist-item.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-checklist-item',
    templateUrl: './checklist-item.component.html'
})
export class ChecklistItemComponent implements OnInit, OnDestroy {
checklistItems: ChecklistItem[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private checklistItemService: ChecklistItemService,
        private jhiAlertService: JhiAlertService,
        private dataUtils: JhiDataUtils,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.checklistItemService.query().subscribe(
            (res: HttpResponse<ChecklistItem[]>) => {
                this.checklistItems = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInChecklistItems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ChecklistItem) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    registerChangeInChecklistItems() {
        this.eventSubscriber = this.eventManager.subscribe('checklistItemListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
