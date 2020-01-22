import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient ,Configuration} from '../../../global'; 


@Injectable()
export class AgamaService {
    constructor(private http: HttpClient) {}
    //Get
     getAgama(page:number,rows :number) {
        return this.http.get('/agama/findAll?page='+page+'&rows='+rows)
                    .toPromise()
                    .then(res =>  res.json().data)
                    .then(data => { return data; });
    }
    //Post
    postAgama(body:any){
    	return this.http.post('/agama/save',body)
    	.toPromise()
    	.then(res=> res.json().data)
    	.then(data => { return data; });
    }
    //Delete
    // deleteAgama(kdAgama){
    // 	return this.http.delete('/agama/del/'+kdAgama,'')
    //                 .toPromise()
    //                 .then(res =>  res.json().data)
    //                 .then(data => { return data; });
    // }
}