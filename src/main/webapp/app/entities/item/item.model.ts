import { BaseEntity } from './../../shared';

export class Item implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public imageurl?: string,
        public identifier?: string,
        public order?: number,
        public subitems?: BaseEntity[],
    ) {
    }
}
