describe("Contact - Data Associations", function() {
    var record;
    
    beforeEach(function() {
        record = Ext.create('ContactApp.model.Contact');
    });
    
    describe("should have associated empty data stores", function() {
        it("Phone numbers verification", function() {
            expect(record.phoneNumbers().getCount()).toEqual(0);
        });
        it("Emails verification", function() {
            expect(record.emails().getCount()).toEqual(0);
        });
        it("Urls verification", function() {
            expect(record.urls().getCount()).toEqual(0);
        });
        it("Dates verification", function() {
            expect(record.dates().getCount()).toEqual(0);
        });
    });

    describe("associated data should be of type Details", function() {
        var modelName = 'ContactApp.model.Details';
        it("Phone numbers verification", function() {
            expect(record.phoneNumbers().model.$className).toEqual(modelName);
        });
        it("Emails verification", function() {
            expect(record.emails().model.$className).toEqual(modelName);
        });
        it("Urls verification", function() {
            expect(record.urls().model.$className).toEqual(modelName);
        });
        it("Dates verification", function() {
            expect(record.dates().model.$className).toEqual(modelName);
        });
    });
    
    it("should allow new phone numbers", function() {
        var phoneNumbers = record.phoneNumbers(),
            phone;

        phoneNumbers.add({
            viewType: 'phoneNumbers',
            type: 'office',
            value: '+39012345678'
        });
        
        phone = phoneNumbers.getAt(0);
        
        expect(phoneNumbers.getCount()).toEqual(1);
        expect(phone.get('type')).toEqual('office');
        expect(phone.get('value')).toEqual('+39012345678');
    });
    
    afterEach(function() {
        record.destroy();
    });
});