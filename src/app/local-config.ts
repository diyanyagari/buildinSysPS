
var vlocal = {
    apiBackend: '',
    dataMaster: 'http://192.168.0.177:9292',
    dataMasterNew: 'http://192.168.0.177:9292',

    report: 'http://192.168.0.177:9797',
    authLogin: 'http://192.168.0.177:9797',

    dataHr1Mod1: 'http://192.168.0.177:9393',
    dataHr1Mod2: 'http://192.168.0.177:9393',
    dataHr2Mod1: 'http://192.168.0.177:9393',
    dataHr2Mod2: 'http://192.168.0.143:10002',

    dataHr2Mod3: 'http://192.168.0.177:9696',
    dataBSC: 'http://192.168.0.177:9898',

    dataBridging: 'http://192.168.0.177:9193',

    resourceReport: 'http://192.168.177.69:9797',
    klinik1Java: 'http://192.168.0.177:9898',
    resourceFile: 'http://192.168.0.177:9797',
    

    page: 1,
    rows: 10,
    headerToken: 'x-auth-token',
    menuDinamic: true,
    idleTimeOut: 1440, // menit
    menuStatic: [{
        "label": "Dashboard",
        "icon": "fa fa-fw fa-chevron-right",
        "routerLink": ["/"]
    }],
    socketIO: 'http://192.168.0.22:2110'
}

export default vlocal;