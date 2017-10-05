describe("ContactApp.utils.Helper", function () {
    var Helper,
        url;
    
    beforeEach(function () {
        // ContactApp is not defined in parent describe block yet, therefore assigning it here to our shortcut
        Helper = ContactApp.utils.Helper;
    });

    describe("scaleImage", function () {
        var img;
        
        beforeEach(function() {
            img = document.createElement('img');
            document.body.appendChild(img);
        });

        afterEach(function() {
            var el = Ext.cache[img.id];

            if (el) {
                el.destroy();
            } else {
                document.body.removeChild(img);
            }
        });
        
        it("should correctly scale square images", function () {
            img.width = 100;
            img.height = 100;

            Helper.scaleImage(img, 40, 40, false);

            expect(img.style.left).toBe('0px');
            expect(img.style.top).toBe('0px');

            expect(img.style.width).toBe('40px');
            expect(img.style.height).toBe('40px');
        });

        it("should correctly scale portrait images", function () {
            img.width = 50;
            img.height = 100;

            Helper.scaleImage(img, 40, 40, false);

            expect(img.style.left).toBe('0px');
            expect(img.style.top).toBe('-20px');

            expect(img.style.width).toBe('40px');
            expect(img.style.height).toBe('80px');
        });

        it("should correctly scale landscape images", function () {
            img.width = 100;
            img.height = 50;

            Helper.scaleImage(img, 40, 40, false);

            expect(img.style.left).toBe('-20px');
            expect(img.style.top).toBe('0px');

            expect(img.style.width).toBe('80px');
            expect(img.style.height).toBe('40px');
        });
    });

    describe("isStoreModified", function () {
        var abeRaw, aaronRaw, edRaw, tommyRaw,
            abeRec, aaronRec, edRec, tommyRec,
            store, User, data;
        
        function addStoreData() {
            store.add(edRaw, abeRaw, aaronRaw, tommyRaw);
            assignRecs();
        }

        function assignRecs() {
            edRec    = store.getAt(0);
            abeRec   = store.getAt(1);
            aaronRec = store.getAt(2);
            tommyRec = store.getAt(3);
        }

        function makeUser(email, data) {
            if (Ext.isObject(email)) {
                data = email;
            } else {
                data = data || {};
                if (!data.email) {
                    data.email = email;
                }
            }
            return new User(data);
        }

        function createStore(cfg, withData) {
            cfg = cfg || {};
            store = new Ext.data.Store(Ext.applyIf(cfg, {
                //asynchronousLoad: false,
                model: User,
                data: withData ? [edRaw, abeRaw, aaronRaw, tommyRaw] : null
            }));
            if (withData) {
                assignRecs();
            }
            data = store.data;
        }

        beforeEach(function() {
            //User = Ext.define('spec.User', {
            //    extend: 'Ext.data.Model',
            //    idProperty: 'email',
            //
            //    fields: [
            //        {name: 'name',      type: 'string'},
            //        {name: 'email',     type: 'string'},
            //        {name: 'evilness',  type: 'int'},
            //        {name: 'group',     type: 'string'},
            //        {name: 'old',       type: 'boolean'},
            //        {name: 'valid',     type: 'string'},
            //        {
            //            name: 'age',
            //            type: 'int'
            //        }, {
            //            name: 'validField',
            //            validators: 'presence'
            //        }
            //    ]
            //});

            edRaw    = {name: 'Ed Spencer',   email: 'ed@sencha.com',    evilness: 100, group: 'code',  old: false, age: 25, valid: 'yes'};
            abeRaw   = {name: 'Abe Elias',    email: 'abe@sencha.com',   evilness: 70,  group: 'admin', old: false, age: 20, valid: 'yes'};
            aaronRaw = {name: 'Aaron Conran', email: 'aaron@sencha.com', evilness: 5,   group: 'admin', old: true,  age: 26, valid: 'yes'};
            tommyRaw = {name: 'Tommy Maintz', email: 'tommy@sencha.com', evilness: -15, group: 'code',  old: true,  age: 70, valid: 'yes'};
            
            createStore();
            addStoreData();
            store.commitChanges();
        });

        afterEach(function() {
            //Ext.undefine('spec.User');
            Ext.data.Model.schema.clear();
            store = User = data = Ext.destroy(store);
            edRaw = edRec = abeRaw = abeRec = aaronRaw = aaronRec = tommyRaw = tommyRec = null;
        });

        it("should return true if store has new records", function () {
            store.add({
                name: 'New person'
            });
            expect(Helper.isStoreModified(store)).toBe(true);
        });

        it("should return true if store has modified records", function () {
            edRec.set('name', 'Ed2');
            expect(Helper.isStoreModified(store)).toBe(true);
        });

        it("should return true if store has removed records", function () {
            store.remove(edRec);
            expect(Helper.isStoreModified(store)).toBe(true);
        });

        it("should return false if store has no new, modified or removed records", function () {
            expect(Helper.isStoreModified(store)).toBe(false);
        });
    });
    
    describe("mobileDeviceAccessFunctionality", function () {
        beforeEach(function () {
            spyOn(window, 'open');
        });
        
        it("should open the correct url for phoneNumbers", function () {
            url = Helper.mobileDeviceAccessFunctionality('phoneNumbers', '123');
            
            expect(window.open).toHaveBeenCalledWith('tel:123');
        });

        it("should open the correct url for emails", function () {
            url = Helper.mobileDeviceAccessFunctionality('emails', 'mail@example.com');

            expect(window.open).toHaveBeenCalledWith('mailto:mail@example.com');
        });

        it("should open the correct url for urls", function () {
            url = Helper.mobileDeviceAccessFunctionality('urls', 'http://example.com');

            expect(window.open).toHaveBeenCalledWith('http://example.com');
        });

        it("should open the correct url for addresses", function () {
            url = Helper.mobileDeviceAccessFunctionality('address', 'main street');

            expect(window.open).toHaveBeenCalledWith('https://www.google.com/maps/dir/Current+Location/main street');
        });
    });
});