import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient } from '../../../global'; 


@Injectable()
export class KecamatanService {
    constructor(private http: HttpClient) {}

     getKecamatan(page:number,rows :number) {
        return this.http.get('/kecamatan/findAllByKdProfile?page='+page+'&rows='+rows)
                    .toPromise()
                    .then(res =>  res.json().data)
                    .then(data => { return data; });
    }
}