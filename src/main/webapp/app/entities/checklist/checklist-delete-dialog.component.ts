import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Checklist } from './checklist.model';
import { ChecklistPopupService } from './checklist-popup.service';
import { ChecklistService } from './checklist.service';

@Component({
    selector: 'jhi-checklist-delete-dialog',
    templateUrl: './checklist-delete-dialog.component.html'
})
export class ChecklistDeleteDialogComponent {

    checklist: Checklist;

    constructor(
        private checklistService: ChecklistService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.checklistService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'checklistListModification',
                content: 'Deleted an checklist'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-checklist-delete-popup',
    template: ''
})
export class ChecklistDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private checklistPopupService: ChecklistPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.checklistPopupService
                .open(ChecklistDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
