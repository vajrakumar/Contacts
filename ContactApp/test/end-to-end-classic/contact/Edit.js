describe("Editing a contact", function() {
    beforeAll(Contact.beforeAll);
    afterAll(Contact.afterAll);
    
    describe("before pressing save", function() {
        describe("and changing the name", function() {
            // current issue
            xit("should not change name in the contact list before pressing save", function() {});
        });
    });
    
    describe("after pressing save", function() {
        describe("with changed name", function() {
            beforeAll(function () {
                Contact.create({
                    firstName: 'ArtE1'
                });

                Contact.edit({
                    // We're adding 'Changed' to the current value
                    firstName: 'Changed'
                });
            });

            it("should show the updated name on the contact view", function() {
                ST.component('contact-view').
                    visible().
                    textLike(/ArtE1Changed/);
            });

            it("should show the updated name in the contacts list", function() {
                ST.grid('contact-list').
                    rowWith('firstName', 'ArtE1Changed');
            });
        });
        describe("with changed contact details", function() {
            beforeAll(function () {
                Contact.create({
                    firstName: 'ArtE2',
                    organization: 'Sencha'
                });

                Contact.edit({
                    // We're adding 'Changed' to the current value
                    organization: 'Changed'
                });
            });

            it("should show the updated contact details on contact view", function() {
                ST.component('contact-view').
                    visible().
                    textLike(/SenchaChanged/);
            });
        });
        describe("with changed contact items", function() {
            //beforeAll(function () {
            //    Contact.create({
            //        firstName: 'ArtE3'
            //    }, [
            //        ['phoneNumbers', [0, '123456789']]
            //    ]);
            //
            //    Contact.edit({}, [
            //        ['phoneNumbers', [0, '555']]
            //    ]);
            //});

            // not working yet, gets stuck with invalid form values message
            xit("should show the updated phone item on contact view", function() {
                ST.component('contact-view').
                    visible().
                    textLike(/555/);
            });
        });
    });

}); 