import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient } from '../../../global'; 


@Injectable()
export class KelompokPegawaiService {
    constructor(private http: HttpClient) {}

     getKelompokPegawai(page:number,rows :number) {
        return this.http.get('/kelompokPegawai/findAllByKdProfile?page='+page+'&rows='+rows)
                    .toPromise()
                    .then(res =>  res.json().data)
                    .then(data => { return data; });
    }
}