import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Checklist } from './checklist.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Checklist>;

@Injectable()
export class ChecklistService {

    private resourceUrl =  SERVER_API_URL + 'api/checklists';

    constructor(private http: HttpClient) { }

    create(checklist: Checklist): Observable<EntityResponseType> {
        const copy = this.convert(checklist);
        return this.http.post<Checklist>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(checklist: Checklist): Observable<EntityResponseType> {
        const copy = this.convert(checklist);
        return this.http.put<Checklist>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Checklist>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Checklist[]>> {
        const options = createRequestOption(req);
        return this.http.get<Checklist[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Checklist[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Checklist = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Checklist[]>): HttpResponse<Checklist[]> {
        const jsonResponse: Checklist[] = res.body;
        const body: Checklist[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Checklist.
     */
    private convertItemFromServer(checklist: Checklist): Checklist {
        const copy: Checklist = Object.assign({}, checklist);
        return copy;
    }

    /**
     * Convert a Checklist to a JSON which can be sent to the server.
     */
    private convert(checklist: Checklist): Checklist {
        const copy: Checklist = Object.assign({}, checklist);
        return copy;
    }
}
