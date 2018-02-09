import { BaseEntity } from './../../shared';

export class ChecklistItem implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public order?: number,
        public identifier?: string,
        public imageContentType?: string,
        public image?: any,
        public checklists?: BaseEntity[],
    ) {
    }
}
