describe('Contacts', function () {
    var Contact = {
        waitTime: 300,
        /**
         * This method display for the UX component ContactApp.ux.MenuButton
         * @param {string} itemId ItemId of the ContactApp.ux.MenuButton
         */
        buttonClick: function (itemId, timeOut) {
            ST.button('#' + itemId)
                .wait(timeOut || Contact.waitTime)
                .click();
        },
        /**
         * This method display for the UX component ContactApp.ux.MenuButton.
         */
        pressAdd: function () {
            this.buttonClick('singleSelectMenuBtnButton');
            ST.grid('#singleSelectMenuBtnList')
                //Since viewReady is not available for modern toolkit wait is used
                .wait(Contact.waitTime)
                .visible()
                //Throws error 'hasCls' error on call of add()
                // .and(
                //     function (el) {
                //         debugger;
                //         var addBtn = el.getItemAt(0);
                //         el.fireEvent('itemtap', el, 0, addBtn, addBtn.getRecord());
                //     }
                // );
                .click(42, 15);
        },

        pressSave: function (callBack, timeOut) {
            var btn = ST.button('#saveButton', timeOut)
                //Since viewReady is not available for modern toolkit wait is used
                .wait(this.waitTime)
                .visible()
                .click();

            if (callBack) {
                btn.and(callBack);
            }
        },
        deleteAll: function (done) {
            Ext.Ajax.request({
                url: '/resetdb',
                method: 'GET',
                success: done
            });
        },

        fillTextField: function (fields) {
            Ext.Object.each(fields, function (name, value) {
                ST.field('#' + name)
                    .wait(100)
                    .and(function (el) {
                        el.setValue(value);
                    });
            });
        },

        create: function (fields) {
            console.log('create Call');
            Contact.pressAdd();
            Contact.fillTextField(fields);
            Contact.pressSave();
        },

        rejectChanges: function () {
            this.buttonClick('rejectButton');
        },

        hideView: function () {
            this.buttonClick('hideViewBtn');
        }
    };

    beforeAll(function (done) {
        ST.component('app-main')
            .wait(Contact.waitTime)
            .visible()
            .and(function () {
                console.log('delete all');
                Contact.deleteAll(function () {
                    Ext.first('app-main').getViewModel().get('contacts').load(done);
                });
            });
    });

    describe('Add a new contact', function () {
        describe("After pressing save", function () {
            describe("Without any data", function () {
                it('Should show a error message', function () {
                    Contact.create({});
                    ST.component('panel[title=Form Error]')
                        .visible()
                        .textLike(/Please enter First Name/);
                    Contact.rejectChanges();
                });
            });

            describe('With First Name', function () {
                beforeAll(function () {
                    Contact.create({
                        firstName: 'Art1'
                    });
                });

                it("should show the contact view", function () {
                    ST.component('contact-view')
                        .wait(Contact.waitTime)
                        .visible()
                        .textLike(/Art1/);
                    Contact.hideView();
                });

                // ViewReady is not available for modern hence it is failing
                xit('should show the new contact in the contacts list', function () {
                    ST.grid('contact-list')
                        .wait(Contact.waitTime)
                        .rowWith('firstName', 'Art1');
                });
            });

            describe("with contact details on contact view", function () {
                beforeAll(function () {
                    Contact.create({
                        firstName: 'ArtA2',
                        lastName: 'Landro',
                        designation: 'CEO',
                        organization: 'Sencha'
                    });
                });
                it("should show the name", function () {
                    ST.component('contact-view')
                        .wait(Contact.waitTime * 4)
                        .visible()
                        .textLike(new RegExp('ArtA2' + String.fromCharCode(160) + 'Landro'));
                });
                it("should show the designation", function () {
                    ST.component('contact-view')
                        .wait(Contact.waitTime * 4)
                        .visible()
                        .textLike(/CEO/);
                });
                it("should show the organization", function () {
                    ST.component('contact-view')
                        .wait(Contact.waitTime * 4)
                        .visible()
                        .textLike(/Sencha/);
                });
            });

        });
    });
});