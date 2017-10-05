describe("Contact - Validation", function() {
    var record;
    
    beforeEach(function() {
        record = Ext.create('ContactApp.model.Contact');
    });
    
    it("should have negative identifier", function() {
        expect(record.getId()).toBeLessThan(0);
    });
    
    describe("firstName", function() {
        it("should create error when empty", function() {
            var isValid, firstNameValidation;
            
            isValid = record.isValid();
            firstNameValidation = record.getValidation().get('firstName');
            
            expect(isValid).toBe(false);
            expect(firstNameValidation).toEqual('Length must be at least 1');
        });
    });
    
    it("should contains an associated phone numbers data store", function() {
        expect(record.phoneNumbers().getCount()).toEqual(0);
    });
    
    afterEach(function() {
        record.destroy();
    });
});