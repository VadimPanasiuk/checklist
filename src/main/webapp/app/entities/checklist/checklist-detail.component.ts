import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Checklist } from './checklist.model';
import { ChecklistService } from './checklist.service';

@Component({
    selector: 'jhi-checklist-detail',
    templateUrl: './checklist-detail.component.html'
})
export class ChecklistDetailComponent implements OnInit, OnDestroy {

    checklist: Checklist;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private checklistService: ChecklistService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInChecklists();
    }

    load(id) {
        this.checklistService.find(id)
            .subscribe((checklistResponse: HttpResponse<Checklist>) => {
                this.checklist = checklistResponse.body;
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

    registerChangeInChecklists() {
        this.eventSubscriber = this.eventManager.subscribe(
            'checklistListModification',
            (response) => this.load(this.checklist.id)
        );
    }
}
