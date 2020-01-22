import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, Configuration } from '../../../global'; 


@Injectable()
export class RuanganService {
    constructor(private http: HttpClient) {}

     getRuangan(page:number,rows :number) {
        return this.http.get(Configuration.get().dataMasterNew+'/ruangan/findAll?page='+page+'&rows='+rows)
                    .toPromise()
                    .then(res =>  res.json().data)
                    .then(data => { return data; });
    }

     //Post
    postRuangan(body:any){
    	return this.http.post('/ruangan/save',body)
    	.toPromise()
    	.then(res=> res.json().data)
    	.then(data => { return data; });
    }


}