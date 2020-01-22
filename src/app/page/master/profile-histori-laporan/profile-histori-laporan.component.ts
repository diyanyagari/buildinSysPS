import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup} from '@angular/forms';
import {SelectItem,MenuItem,TreeNode} from 'primeng/primeng';
import {HttpClient} from '../../../global/service/HttpClient';


@Component({
  selector: 'app-profile-histori-laporan',
  templateUrl: './profile-histori-laporan.component.html',
  styleUrls: ['./profile-histori-laporan.component.scss']
})
export class ProfileHistoriLaporanComponent implements OnInit {
listEvent: SelectItem[];
listRekanan: SelectItem[];
listDepartemen: SelectItem[];
listRuangann: SelectItem[];
listAlamat: SelectItem[];
userform :FormGroup;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

}
