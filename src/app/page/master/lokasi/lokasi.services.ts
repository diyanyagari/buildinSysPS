import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient ,Configuration} from '../../../global'; 


@Injectable()
export class LokasiService {
    constructor(private http: HttpClient) {}
    //Get
     getLokasi(page:number,rows :number) {
        return this.http.get('/lokasi/findAll?page='+page+'&rows='+rows)
                    .toPromise()
                    .then(res =>  res.json().data)
                    .then(data => { return data; });
    }

    postLokasi(body:any){
    	return this.http.post('/lokasi/save',body)
    	.toPromise()
    	.then(res=> res.json().data)
    	.then(data => { return data; });
    }
   
}