StoreHelper = {
    abeRec: null,
    aaronRec: null,
    edRec: null,
    tommyRec: null,

    store: null,
    User: null,
    data: null,

    //addData: function () {
    //    store.add(this.edRaw, this.abeRaw, this.aaronRaw, this.tommyRaw);
    //    assignRecords();
    //},

    assignRecords: function () {
        this.edRec = this.store.getAt(0);
        this.abeRec = this.store.getAt(1);
        this.aaronRec = this.store.getAt(2);
        this.tommyRec = this.store.getAt(3);
    },

    //makeUser: function (email, data) {
    //    if (Ext.isObject(email)) {
    //        data = email;
    //    } else {
    //        data = data || {};
    //        if (!data.email) {
    //            data.email = email;
    //        }
    //    }
    //    return new User(data);
    //},

    createStore: function (cfg, data) {
        var edRaw =    {name: 'Ed Spencer',   email: 'ed@sencha.com',    evilness: 100, group: 'code',  old: false, age: 25, valid: 'yes'},
            abeRaw  =  {name: 'Abe Elias',    email: 'abe@sencha.com',   evilness: 70,  group: 'admin', old: false, age: 20, valid: 'yes'},
            aaronRaw = {name: 'Aaron Conran', email: 'aaron@sencha.com', evilness: 5,   group: 'admin', old: true,  age: 26, valid: 'yes'},
            tommyRaw = {name: 'Tommy Maintz', email: 'tommy@sencha.com', evilness: -15, group: 'code',  old: true,  age: 70, valid: 'yes'};
        
        cfg = cfg || {};
        
        this.store = new Ext.data.Store(Ext.applyIf(cfg, {
            //asynchronousLoad: false,
            //model: User,
            model: Ext.define(null, {
                extend: 'Ext.data.Model',
                idProperty: 'email',
            
                fields: [
                    {name: 'name',      type: 'string'},
                    {name: 'email',     type: 'string'},
                    {name: 'evilness',  type: 'int'},
                    {name: 'group',     type: 'string'},
                    {name: 'old',       type: 'boolean'},
                    {name: 'valid',     type: 'string'},
                    {
                        name: 'age',
                        type: 'int'
                    }, {
                        name: 'validField',
                        validators: 'presence'
                    }
                ]
            }),
            data: data === true ? [edRaw, abeRaw, aaronRaw, tommyRaw] : data
        }));
        
        if (data) {
            this.assignRecords();
        }
        
        this.data = this.store.data;
        
        return this.store;
    }
};