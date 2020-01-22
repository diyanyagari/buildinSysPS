import { TranslateLoader } from '@ngx-translate/core';
import { Configuration } from '..';
import { Inject, forwardRef, Injectable, OnInit, OnDestroy } from '@angular/core';
import { Http, RequestOptions, Headers, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class TranslateLoaderService implements TranslateLoader {
  constructor(private http: Http) { };
  getTranslation(lang: string): Observable<any> {
    let langKdModulAplikasi = JSON.parse(localStorage.getItem('langKdModulAplikasi'));
    let kdModulAplikasi = null;
    let version = null;
    let kdProfile = null;
    if (langKdModulAplikasi) {
      if (langKdModulAplikasi.kdModulAplikasi) {
        kdModulAplikasi = langKdModulAplikasi.kdModulAplikasi;
      } else {
        kdModulAplikasi = "E2";
      }

      if (langKdModulAplikasi.kdVersion) {
        version = langKdModulAplikasi.kdVersion;
      } else {
        version = "2";
      }
      if (langKdModulAplikasi.kdProfile) {
        kdProfile = langKdModulAplikasi.kdProfile;
      } else {
        kdProfile = "2";
      }

    } else {
      kdModulAplikasi = "E2";
      version = "2";
      kdProfile = "2";
    }

    return this.http.request(Configuration.get().authLogin + '/auth/lang/' + kdProfile + '/' + kdModulAplikasi + '/' + version + '/' + lang + '.json').map((json:Response) => {
      return json.json();

    });
  }

}