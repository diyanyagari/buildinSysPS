import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, Configuration } from '../../../global'; 


@Injectable()
export class GolonganPegawaiFormService {
    constructor(private http: HttpClient) {}

     getGolPegawai(page:number,rows :number) {
        return this.http.get('/ruangan/findAll?page='+page+'&rows='+rows)
                    .toPromise()
                    .then(res =>  res.json().data)
                    .then(data => { return data; });
    }

     //Post
    postGolPegawai(body:any){
    	return this.http.post('/ruangan/save',body)
    	.toPromise()
    	.then(res=> res.json().data)
    	.then(data => { return data; });
    }

     //Delete
    // deleteGolPegawai(kdAgama){
    // 	return this.http.delete('/agama/del/'+kdAgama+'/1','')
    //                 .toPromise()
    //                 .then(res =>  res.json().data)
    //                 .then(data => { return data; });
    // }

   


}