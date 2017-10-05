describe("Details - Validation", function() {
    var record;
    
    beforeEach(function() {
        record = Ext.create('ContactApp.model.Details');
    });
    
    it("should have negative identifier", function() {
        expect(record.getId()).toBeLessThan(0);
    });
    
    describe("value validation", function() {
        it("should return string values for viewType different than date", function() {
            record.set({
                viewType: 'phone',
                value: '+3912345678'
            });
            
            expect(record.get('value')).toEqual(jasmine.any(String));
        });
        it("should convert values to date objects for date viewType", function() {
            record.set({
                viewType: 'date',
                value: 'Wed Mar 23 2016 11:46:20 GMT+0100 (CET)'
            });
            
            expect(record.get('value')).toEqual(jasmine.any(Date));
        });
    });
    
    afterEach(function() {
        record.destroy();
    });
});