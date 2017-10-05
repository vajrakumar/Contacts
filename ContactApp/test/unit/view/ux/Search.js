describe("ContactApp.ux.Search", function () {
    var searchField,
        local;

    beforeEach(function (done) {
        local = {
            searchHandler: function () {
                //console.log('searchHandler');
            }
        };

        spyOn(local, 'searchHandler').and.callThrough();

        searchField = Ext.create({
            xtype: 'search-field',
            listeners: {
                search: local.searchHandler
            },
            renderTo: Ext.getBody()
        });

        Ext.defer(done, 500); // allow component to repaint/reflow
    });

    afterEach(function (done) {
        // And teardown the fixture to leave the DOM clean.
        searchField = Ext.destroy(searchField);
        Ext.defer(done, 500);
    });
    
    describe("with keyword 'test'", function () {
        it("should call search handler at least once", function () {
            ST.textField('search-field')
                .type('test')
                .and(function () {
                    expect(local.searchHandler).toHaveBeenCalled();
                });
        });
        
        it("should call search handler 4 times", function () {
            ST.textField('search-field')
                .type('test')
                .and(function () {
                    expect(local.searchHandler.calls.count()).toEqual(4);
                });
        });

        // Not working, test runner keeps running and running
        it("should pass the search field component to the search handler as first argument", function () {
            ST.textField('search-field')
                .type('test')
                .and(function () {
                    expect(local.searchHandler.calls.argsFor(0)[0]).toEqual(searchField);
                });
        });
    });
});