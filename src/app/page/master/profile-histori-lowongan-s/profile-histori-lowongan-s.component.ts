import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup} from '@angular/forms';
import {SelectItem,MenuItem,TreeNode} from 'primeng/primeng';
import {HttpClient} from '../../../global/service/HttpClient';

@Component({
  selector: 'app-profile-histori-lowongan-s',
  templateUrl: './profile-histori-lowongan-s.component.html',
  styleUrls: ['./profile-histori-lowongan-s.component.scss']
})
export class ProfileHistoriLowonganSComponent implements OnInit {
listSpek: SelectItem[];
listJabatan: SelectItem[];
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

}
