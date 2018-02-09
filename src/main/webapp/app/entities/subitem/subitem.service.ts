import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Subitem } from './subitem.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Subitem>;

@Injectable()
export class SubitemService {

    private resourceUrl =  SERVER_API_URL + 'api/subitems';

    constructor(private http: HttpClient) { }

    create(subitem: Subitem): Observable<EntityResponseType> {
        const copy = this.convert(subitem);
        return this.http.post<Subitem>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(subitem: Subitem): Observable<EntityResponseType> {
        const copy = this.convert(subitem);
        return this.http.put<Subitem>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Subitem>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Subitem[]>> {
        const options = createRequestOption(req);
        return this.http.get<Subitem[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Subitem[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Subitem = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Subitem[]>): HttpResponse<Subitem[]> {
        const jsonResponse: Subitem[] = res.body;
        const body: Subitem[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Subitem.
     */
    private convertItemFromServer(subitem: Subitem): Subitem {
        const copy: Subitem = Object.assign({}, subitem);
        return copy;
    }

    /**
     * Convert a Subitem to a JSON which can be sent to the server.
     */
    private convert(subitem: Subitem): Subitem {
        const copy: Subitem = Object.assign({}, subitem);
        return copy;
    }
}
