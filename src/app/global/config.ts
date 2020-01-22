import { LocaleSettings } from 'primeng/primeng';

import vlocal from '../local-config'

export class Configuration {

    public static lang : string = 'id';

    static get() {

        if (window.location.hostname.indexOf('115.85') > -1){
            return v115;
        } else if (window.location.hostname.indexOf('jasamedika') > -1){
            return vJasmed;
        } else if (window.location.hostname.indexOf('sysadmin.bottis') > -1){
            return vSysadmin;
        } else if (window.location.hostname.indexOf('klinik.bottis') > -1){
            return vSysklinik;
        } else if (window.location.hostname.indexOf('.143') > -1){
            return v143;
		} else if (window.location.hostname.indexOf('.177') > -1){
            return v177;
        } else if (window.location.hostname.indexOf('.22') > -1){
            return v22;
        } else if (window.location.hostname.indexOf('.161') > -1){
            return v161;
        } else if (window.location.hostname.indexOf('127.') > -1 || window.location.hostname.indexOf('localhost') > -1){
            return vlocal;
        } else {
            return vlocal;
        }    
    }


    public static localeCal(){
        let  _locale: LocaleSettings;

        let en = {
            firstDayOfWeek: 0,
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
            monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
            monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
            today: 'Today',
            clear: 'Clear'
        };

        let id =  {
            firstDayOfWeek: 0,
            dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
            dayNamesShort: ["Mng", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
            dayNamesMin: ["Mg","Sn","Sl","Rb","Km","Jm","Sb"],
            monthNames: [ "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember" ],
            monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun","Jul", "Agu", "Sep", "Okt", "Nov", "Des" ],
            today: 'Hari ini',
            clear: 'Bersihkan'
        };

        switch (Configuration.lang) {
            case 'en':
                _locale = en;
                break;
            case 'id':
                _locale = id;
                break;
            default:
                _locale = id;
                break;
        }


        return _locale;

    }

    static kodeKelompokTransaksi() {

        return {
            Orientasi               :'2',
            PerubahanJadwalKerja    :'4',
            PengajuanPerjalananDinas:'5',
            CutiPegawai             :'11',
            Resign                  :'12',
            Reimburs                :'13',
            Lembur                  :'15',
            PengajuanReward         :'18',
            PengajuanSanksi         :'19',
            PengajuanPinjaman       :'20',
            MutasiPegawai           :'28',
            Phk                     :'82',
            HoldPinjaman            :'91',
            PembatalanCuti          :'93',
            PembatalanDinas         :'94',//113
            PembatalanLembur        :'95',
            Pensiun                 :'92',//105
            Bsc_kpi                 :'101',
            PemberianKesejahteraan  :'103',
            Pengajuan_Realisasi_KPI :'104',
            
        }
    }

    public static warnaChart = [
            '#e6194b',
            '#3cb44b',
            '#ffe119',
            '#0082c8',
            '#f58231',
            '#911eb4',
            '#46f0f0',
            '#f032e6',
            '#d2f53c',
            '#fabebe',
            '#008080',
            '#e6beff',
            '#aa6e28',
            '#fffac8',
            '#800000',
            '#aaffc3',
            '#808000',
            '#ffd8b1',
            '#000080',
            '#808080',
            '#000000',
    ];
}



class AppStaticMenu {
    public static model = [

    {
       "label": "Dashboard",
       "icon": "fa fa-fw fa-chevron-right",
       "routerLink": ["/"] 
    }];

}

var v143 = {
            
    apiBackend          : '',

    dataMaster          : 'https://192.168.0.143/dataMaster',
    dataMasterNew       : 'https://192.168.0.143/dataMaster',

    resourceFile        : 'https://192.168.0.143/authInfo',
    report              : 'https://192.168.0.143/authInfo',
    authLogin           : 'https://192.168.0.143/authInfo',

    dataHr1Mod1         : 'https://192.168.0.143/dataHr1Mod1',          
    dataHr1Mod2         : 'https://192.168.0.143/dataHr1Mod1',          
    dataHr2Mod1         : 'https://192.168.0.143/dataHr1Mod1',
    dataHr2Mod2         : 'https://192.168.0.143/dataHr1Mod1',

    dataHr2Mod3         : 'https://192.168.0.143/dataHr2Mod3',

    dataBSC             : 'http://192.168.0.143:9898',   

    dataBridging        : 'https://192.168.0.143/dataMaster',

    resourceReport      : 'https://192.168.0.143/authInfo', 
    klinik1Java          : 'http://192.168.0.143:9999',

    page                : 1,
    rows                : 15,
    headerToken         : 'x-auth-token',
    menuDinamic         : true,
    idleTimeOut         : 60, // menit
    menuStatic          : AppStaticMenu.model,
    socketIO            : 'https://192.168.0.143:2222'
};

var v22 = {
    apiBackend          : '',

    dataMaster          : 'http://192.168.0.22:9292',
    dataMasterNew       : 'http://192.168.0.22:9292',

    report              : 'http://192.168.0.22:9797',
    authLogin           : 'http://192.168.0.22:9797',

    dataHr1Mod1         : 'http://192.168.0.22:9393',
    dataHr1Mod2         : 'http://192.168.0.22:9393',
    dataHr2Mod1         : 'http://192.168.0.22:9393',
    dataHr2Mod2         : 'http://192.168.0.250:10002',

    dataHr2Mod3         : 'http://192.168.0.22:9696',

    dataBSC             : 'http://192.168.0.22:9898',

    dataBridging        : 'http://192.168.0.22:9193',

    resourceReport      : 'http://192.168.0.22:9797',
    klinik1Java          : 'http://192.168.0.22:9999',

    page                : 1,
    rows                : 15,
    headerToken         : 'x-auth-token',
    menuDinamic         : true,
    idleTimeOut         : 60, // menit
    menuStatic          : AppStaticMenu.model,
    socketIO            : 'http://192.168.0.22:2222',
    resourceFile        : 'http://192.168.0.22:9797'
};



var v177 = {
    apiBackend          : '',

    dataMaster          : 'http://192.168.0.177:9292',
    dataMasterNew       : 'http://192.168.0.177:9292',

    resourceFile        : 'http://192.168.0.177:9797',
    report              : 'http://192.168.0.177:9797',
    authLogin           : 'http://192.168.0.177:9797',

    dataHr1Mod1         : 'http://192.168.0.177:9393',
    dataHr1Mod2         : 'http://192.168.0.177:9393',
    dataHr2Mod1         : 'http://192.168.0.177:9393',
    dataHr2Mod2         : 'http://192.168.0.143:10002',

    dataHr2Mod3         : 'http://192.168.0.177:9696',

    dataBSC             : 'http://192.168.0.177:9898',

    dataBridging        : 'http://192.168.0.177:9193',

    resourceReport      : 'http://192.168.0.177:9797',
    klinik1Java          : 'http://192.168.0.177:9999',
    
    page                : 1,
    rows                : 15,
    headerToken         : 'x-auth-token',
    menuDinamic         : true,
    idleTimeOut         : 60, // menit
    menuStatic          : AppStaticMenu.model,
    socketIO            : 'http://192.168.0.177:2110'
};

var v115 = {
    apiBackend          : '',

    dataMaster          : 'http://115.85.80.20/dataMaster',
    dataMasterNew       : 'http://115.85.80.20/dataMaster',

    resourceFile        : 'http://115.85.80.20/authInfo',
    report              : 'http://115.85.80.20/authInfo',
    authLogin           : 'http://115.85.80.20/authInfo',

    dataHr1Mod1         : 'http://115.85.80.20/dataHr1Mod1',          
    dataHr1Mod2         : 'http://115.85.80.20/dataHr1Mod1',          
    dataHr2Mod1         : 'http://115.85.80.20/dataHr1Mod1',
    dataHr2Mod2         : 'http://115.85.80.20/dataHr1Mod1',

    dataHr2Mod3         : 'http://115.85.80.20/dataHr2Mod3',

    dataBSC             : 'http://192.168.0.143:9898',   

    dataBridging        : 'http://115.85.80.20/dataMaster',

    resourceReport      : 'http://115.85.80.20/authInfo',
     
    klinik1Java          : 'http://192.168.0.143:9999',
    page                : 1,
    rows                : 15,
    headerToken         : 'x-auth-token',
    menuDinamic         : true,
    idleTimeOut         : 60, // menit
    menuStatic          : AppStaticMenu.model,
    socketIO            : 'http://115.85.80.20:2222'
}

var v161 = {
    apiBackend          : '',

    dataMaster          : 'http://103.93.161.29/dataMaster',
    dataMasterNew       : 'http://103.93.161.29/dataMaster',

    resourceFile        : 'http://103.93.161.29/authInfo',
    report              : 'http://103.93.161.29/authInfo',
    authLogin           : 'http://103.93.161.29/authInfo',

    dataHr1Mod1         : 'http://103.93.161.29/dataHr1Mod1',          
    dataHr1Mod2         : 'http://103.93.161.29/dataHr1Mod1',          
    dataHr2Mod1         : 'http://103.93.161.29/dataHr1Mod1',
    dataHr2Mod2         : 'http://103.93.161.29/dataHr1Mod1',

    dataHr2Mod3         : 'http://103.93.161.29/dataHr2Mod3',

    dataBSC             : 'http://192.168.0.143:9898',   

    dataBridging        : 'http://103.93.161.29/dataMaster',

    resourceReport      : 'http://103.93.161.29/authInfo', 
    klinik1Java          : 'http://192.168.0.143:9999',

    page                : 1,
    rows                : 15,
    headerToken         : 'x-auth-token',
    menuDinamic         : true,
    idleTimeOut         : 60, // menit
    menuStatic          : AppStaticMenu.model,
    socketIO            : 'https://103.93.161.29:2222'
}


var vJasmed = {
    apiBackend          : '',

    dataMaster          : 'https://hris.jasamedika.co.id/dataMaster',
    dataMasterNew       : 'https://hris.jasamedika.co.id/dataMaster',

    resourceFile        : 'https://hris.jasamedika.co.id/authInfo',
    report              : 'https://hris.jasamedika.co.id/authInfo',
    authLogin           : 'https://hris.jasamedika.co.id/authInfo',

    dataHr1Mod1         : 'https://hris.jasamedika.co.id/dataHr1Mod1',          
    dataHr1Mod2         : 'https://hris.jasamedika.co.id/dataHr1Mod1',          
    dataHr2Mod1         : 'https://hris.jasamedika.co.id/dataHr1Mod1',
    dataHr2Mod2         : 'https://hris.jasamedika.co.id/dataHr1Mod1',

    dataHr2Mod3         : 'https://hris.jasamedika.co.id/dataHr2Mod3',

    dataBSC             : 'http://192.168.0.143:9898',   

    dataBridging        : 'https://hris.jasamedika.co.id/dataMaster',

    resourceReport      : 'https://hris.jasamedika.co.id/authInfo', 
    klinik1Java          : 'http://192.168.0.143:9999',

    page                : 1,
    rows                : 15,
    headerToken         : 'x-auth-token',
    menuDinamic         : true,
    idleTimeOut         : 60, // menit
    menuStatic          : AppStaticMenu.model,
    socketIO            : 'https://hris.jasamedika.co.id:2222'
}

var vSysadmin = {
    apiBackend          : '',

    dataMaster          : 'https://sysadmin.bottis.co.id/backend',
    dataMasterNew       : 'https://sysadmin.bottis.co.id/backend',

    resourceFile        : 'https://hris.bottis.co.id/authInfo',
    report              : 'https://hris.bottis.co.id/authInfo',
    authLogin           : 'https://hris.bottis.co.id/authInfo',

    dataHr1Mod1         : 'https://hris.bottis.co.id/dataHr1Mod1',          
    dataHr1Mod2         : 'https://hris.bottis.co.id/dataHr1Mod1',          
    dataHr2Mod1         : 'https://hris.bottis.co.id/dataHr1Mod1',
    dataHr2Mod2         : 'https://hris.bottis.co.id/dataHr1Mod1',

    dataHr2Mod3         : 'https://hris.bottis.co.id/dataHr2Mod3',

    dataBSC             : 'https://hris.bottis.co.id/dataBSC',   

    dataBridging        : 'https://hris.bottis.co.id/dataBridging',

    resourceReport      : 'https://hris.bottis.co.id/authInfo', 
    klinik1Java         : 'http://klinik.bottis.co.id/klinik1Java',

    page                : 1,
    rows                : 20,
    headerToken         : 'x-auth-token',
    menuDinamic         : true,
    idleTimeOut         : 240, // menit
    menuStatic          : AppStaticMenu.model,
    socketIO            : 'https://bottis.co.id:2110'
}

var vSysklinik = {
    apiBackend          : '',

    dataMaster          : 'https://klinik.bottis.co.id/dataMasterNew',
    dataMasterNew       : 'https://klinik.bottis.co.id/dataMasterNew',

    resourceFile        : 'https://hris.bottis.co.id/authInfo',
    report              : 'https://hris.bottis.co.id/authInfo',
    authLogin           : 'https://hris.bottis.co.id/authInfo',

    dataHr1Mod1         : 'https://hris.bottis.co.id/dataHr1Mod1',          
    dataHr1Mod2         : 'https://hris.bottis.co.id/dataHr1Mod1',          
    dataHr2Mod1         : 'https://hris.bottis.co.id/dataHr1Mod1',
    dataHr2Mod2         : 'https://hris.bottis.co.id/dataHr1Mod1',

    dataHr2Mod3         : 'https://hris.bottis.co.id/dataHr2Mod3',

    dataBSC             : 'https://hris.bottis.co.id/dataBSC',   

    dataBridging        : 'https://hris.bottis.co.id/dataBridging',

    resourceReport      : 'https://hris.bottis.co.id/authInfo', 
    klinik1Java         : 'http://klinik.bottis.co.id/klinik1Java',

    page                : 1,
    rows                : 20,
    headerToken         : 'x-auth-token',
    menuDinamic         : true,
    idleTimeOut         : 240, // menit
    menuStatic          : AppStaticMenu.model,
    socketIO            : 'https://bottis.co.id:2110'
}




var flagsF = function () {
    var flags = [];
    
    flags["id"] = "id";
    flags["us"] = "us";
    
    return flags;
}

export class LangToFlag {
    static flags = flagsF();
}

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////