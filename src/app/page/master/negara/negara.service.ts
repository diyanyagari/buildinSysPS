import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Negara} from './negara.interface';

@Injectable()
export class NegaraService {
    
    constructor(private http: Http) {}

     getAllNegara() {
        return this.http.get("http://localhost:9191/agama/findAll")
                    .toPromise()
                    .then(res => <Negara[]> res.json().data.Agama)
                    .then(data => { return data; });
    }
}