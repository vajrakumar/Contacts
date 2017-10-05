describe("Contact - Proxy", function() {
    var record;
    
    beforeEach(function() {
        jasmine.Ajax.install();
        jasmine.Ajax
            .stubRequest(/^contacts.*/)
            .andReturn({
                status: 200,
                statusText: 'OK',
                responseHeaders: [{name: 'content-type', value: 'text/plain'}]
            });        
        
        record = Ext.create('ContactApp.model.Contact');
    });
    
    it("should have a REST proxy", function() {
        expect(record.getProxy() instanceof Ext.data.proxy.Rest).toBe(true);
    });
    
    it("new contact should be saved with associated data", function() {
        var data;
            
        record.phoneNumbers().add({
            viewType: 'phoneNumbers',
            type: 'office',
            value: '+39012345678'
        });
    
        record.save({
            success: function(record){
                data = record.getData();
                expect(data.phoneNumbers.length).toEqual(1);
                expect(data.emails.length).toEqual(0);
                expect(data.urls.length).toEqual(0);
                expect(data.dates.length).toEqual(0);
            }
        });

    });
    
    afterEach(function() {
        record.destroy();
        jasmine.Ajax.uninstall();
    });
});