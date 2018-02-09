import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ChecklistItem } from './checklist-item.model';
import { ChecklistItemPopupService } from './checklist-item-popup.service';
import { ChecklistItemService } from './checklist-item.service';

@Component({
    selector: 'jhi-checklist-item-delete-dialog',
    templateUrl: './checklist-item-delete-dialog.component.html'
})
export class ChecklistItemDeleteDialogComponent {

    checklistItem: ChecklistItem;

    constructor(
        private checklistItemService: ChecklistItemService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.checklistItemService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'checklistItemListModification',
                content: 'Deleted an checklistItem'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-checklist-item-delete-popup',
    template: ''
})
export class ChecklistItemDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private checklistItemPopupService: ChecklistItemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.checklistItemPopupService
                .open(ChecklistItemDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
