import { Component, OnInit } from '@angular/core';
import {HttpClient} from '../../../global/service/HttpClient';

@Component({
  selector: 'app-pegawai',
  templateUrl: './pegawai.component.html',
  styleUrls: ['./pegawai.component.scss']
})
export class PegawaiComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

}
