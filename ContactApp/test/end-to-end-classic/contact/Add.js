describe("Adding a contact", function() {
    beforeAll(Contact.beforeAll);
    afterAll(Contact.afterAll);
    
    describe("after pressing save", function() {
        describe("without any data", function() {
            it("should show a error message", function() {
                Contact.pressAdd();
                Contact.pressSave();

                ST.component('toast[title=Form Validation]').
                    visible().
                    textLike(/Please enter First Name/);
            });
        });
        describe("with a first name", function() {
            beforeAll(function () {
                Contact.create({
                    firstName: 'ArtA1'
                });
            });
            
            it("should show the contact view", function() {
                ST.component('contact-view').
                    visible().
                    textLike(/ArtA1/);
            });
            
            it("should show the new contact in the contacts list", function() {
                ST.grid('contact-list').
                    rowWith('firstName', 'ArtA1');
            });
        });
        describe("with contact details on contact view", function() {
            beforeAll(function() {
                Contact.create({
                    firstName: 'ArtA2',
                    lastName: 'Landro',
                    designation: 'CEO',
                    organization: 'Sencha'
                });
            });
            
            it("should show the name", function() {
                // textContent returns &nbsp; as a special character which is not the normal string space 
                ST.component('contact-view').
                    visible().
                    textLike(new RegExp('ArtA2' + String.fromCharCode(160) + 'Landro'));
            });

            it("should show the designation", function() {
                ST.component('contact-view').
                    visible().
                    textLike(/CEO/);
            });
            
            it("should show the organization", function() {
                ST.component('contact-view').
                    visible().
                    textLike(/Sencha/);
            });
        });
        describe("with contact items", function() {
            beforeAll(function () {
                Contact.create({
                    firstName: 'ArtA3'
                }, [
                    ['phoneNumbers', [0, '123456789']]
                ]);
            });
            
            it("should show the phone item on contact view", function() {
                ST.component('contact-view').
                    visible().
                    textLike(/123456789/);
            });
        });
    });

    describe("after pressing enter", function() {
        // Pending tests: Seems like there's no way of triggering enter yet
        describe("with a first name", function() {
            beforeAll(function () {
                Contact.create({
                    firstName: 'ArtE1\n'
                });
            });
            
            xit("should show the contact view", function() {
                ST.component('contact-view').
                    visible().
                    textLike(/ArtE1/);
            });

            xit("should show the new contact in the contacts list", function() {
                ST.grid('contact-list').
                    rowWith('firstName', 'ArtE1');
            });
        });
    });
}); 