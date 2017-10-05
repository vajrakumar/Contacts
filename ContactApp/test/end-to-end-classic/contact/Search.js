describe("Searching contacts", function() {
    beforeAll(Contact.beforeAll);
    afterAll(Contact.afterAll);

    describe("while typing", function() {
        beforeAll(function () {
            Contact.create({
                firstName: 'ArtS1.1'
            });

            Contact.create({
                firstName: 'ArtS1.2'
            });

            Contact.create({
                firstName: 'DonS1'
            });
        });
        
        it("should update results", function() {
            ST.textField('search-field').
                type('A').
                and(function () {
                    var contactsCount = Ext.first('app-main').getViewModel().get('contacts').getCount();
    
                    expect(contactsCount).toBe(2);
                });
        });
    });

}); 