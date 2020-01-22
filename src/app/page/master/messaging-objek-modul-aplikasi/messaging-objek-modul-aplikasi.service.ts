import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, Configuration } from '../../../global'; 

@Injectable()
export class MessagingObjekService {
	constructor(private http: Http, private httpC : HttpClient){}

	//untuk dropdown/combo
	getKodeMoAp(){
		return this.http.get(`http://192.168.0.63:9191/service/list-generic?table=ModulAplikasi&select=*&X-AUTH-TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhc2t1ciJ9.fGmTtUnuIM6HezatoqMfy02iURFSz24t0fJGXzbggqZ7X7Wt9EnSzjt_S4d4do1Zmcw7Ot4oGi9-rzHDjwwOHQ`)
		.map((res: Response) => res.json());
	}

	getKodeOMA(){
		return this.http.get(`http://192.168.0.63:9191/service/list-generic?table=ObjekModulAplikasi&select=*&X-AUTH-TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhc2t1ciJ9.fGmTtUnuIM6HezatoqMfy02iURFSz24t0fJGXzbggqZ7X7Wt9EnSzjt_S4d4do1Zmcw7Ot4oGi9-rzHDjwwOHQ`)
		.map((res: Response) => res.json());
	}

	//untuk get data dari tabel
	 getDataMessagingObjek() {
        return this.http.get('http://192.168.0.63:9191/service/list-generic?table=Messaging&select=*&X-AUTH-TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhc2t1ciJ9.fGmTtUnuIM6HezatoqMfy02iURFSz24t0fJGXzbggqZ7X7Wt9EnSzjt_S4d4do1Zmcw7Ot4oGi9-rzHDjwwOHQ')
                    .toPromise()
                    .then(res =>  res.json().data)
                    .then(data => { return data; });
    }

      //Post
    postMe(body:any){
    	return this.http.post('http://192.168.0.63:9191/messaging/save?X-AUTH-TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhc2t1ciJ9.fGmTtUnuIM6HezatoqMfy02iURFSz24t0fJGXzbggqZ7X7Wt9EnSzjt_S4d4do1Zmcw7Ot4oGi9-rzHDjwwOHQ',body)
    	.toPromise()
    	.then(res=> res.json().data)
    	.then(data => { return data; });
    }

    //Delete
    deleteMe(kode){
    	return this.http.delete('http://192.168.0.63:9191/messaging/del/'+kode+'?X-AUTH-TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhc2t1ciJ9.fGmTtUnuIM6HezatoqMfy02iURFSz24t0fJGXzbggqZ7X7Wt9EnSzjt_S4d4do1Zmcw7Ot4oGi9-rzHDjwwOHQ','')
        .toPromise()
        .then(res =>  res.json().data)
        .then(data => { return data; });
    }

}