import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { ChecklistItem } from './checklist-item.model';
import { ChecklistItemService } from './checklist-item.service';

@Component({
    selector: 'jhi-checklist-item-detail',
    templateUrl: './checklist-item-detail.component.html'
})
export class ChecklistItemDetailComponent implements OnInit, OnDestroy {

    checklistItem: ChecklistItem;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private checklistItemService: ChecklistItemService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInChecklistItems();
    }

    load(id) {
        this.checklistItemService.find(id)
            .subscribe((checklistItemResponse: HttpResponse<ChecklistItem>) => {
                this.checklistItem = checklistItemResponse.body;
            });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInChecklistItems() {
        this.eventSubscriber = this.eventManager.subscribe(
            'checklistItemListModification',
            (response) => this.load(this.checklistItem.id)
        );
    }
}
