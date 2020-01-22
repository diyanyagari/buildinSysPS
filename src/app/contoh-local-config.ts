var vlocal = {
    apiBackend          : '',

    dataMaster          : 'http://127.0.0.1:9292',
    dataMasterNew       : 'http://127.0.0.1:9292',

    resourceFile        : 'http://127.0.0.1:9797',
    report              : 'http://127.0.0.1:9797',
    authLogin           : 'http://127.0.0.1:9797',

    dataHr1Mod1         : 'http://127.0.0.1:9393',
    dataHr1Mod2         : 'http://127.0.0.1:9393',
    dataHr2Mod1         : 'http://127.0.0.1:9393',
    dataHr2Mod2         : 'http://127.0.0.1:9393',

    dataHr2Mod3         : 'http://127.0.0.1:9696',

    dataBSC             : 'http://127.0.0.1:9898',

    dataBridging        : 'http://127.0.0.1:9193',

    resourceReport      : 'http://127.0.0.1:9797',
    page                : 1,
    rows                : 10,
    headerToken         : 'x-auth-token',
    menuDinamic         : true,
    menuStatic          :  [{
           "label": "Dashboard",
           "icon": "fa fa-fw fa-chevron-right",
           "routerLink": ["/"] 
        }],
    socketIO            : 'http://127.0.0.1:2222'
}

export default vlocal;