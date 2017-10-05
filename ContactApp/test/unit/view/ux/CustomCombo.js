describe("ContactApp.ux.CustomCombo", function() {
    var customCombo;

    beforeEach(function (done) {
        var store = StoreHelper.createStore({}, [
            { name: 'home' },
            { name: 'Custom...' }
        ]);
        
        customCombo = Ext.create({
            xtype: 'customCombo',
            store: store,
            renderTo: Ext.getBody()
        });

        Ext.defer(done, 500); // allow component to repaint/reflow
    });

    afterEach(function (done) {
        // And teardown the fixture to leave the DOM clean.
        customCombo = Ext.destroy(customCombo);
        Ext.defer(done, 500);
    });
    
    it("should allow entering a value after selecting 'Custom...'", function() {
        ST.play([
            { type: "tap", target: "customCombo", x: 156, y: 15 },
            { type: "tap", target: "boundlist => [data-recordindex=\"1\"]", x: 71, y: 12 },
            { type: "type", target: "customCombo => input", text: "test" }
        ]);
        
        ST.comboBox('customCombo').value('test');
    });

    it("should reset to first option if combo loses focus and no value is entered in custom mode", function() {
        ST.play([
            { type: "tap", target: "customCombo", x: 156, y: 15 },
            { type: "tap", target: "boundlist => [data-recordindex=\"1\"]", x: 71, y: 12 }
        ]);

        // remove focus from combobox (by clicking somewhere outside the combobox)
        // needs a wait otherwise click isn't happening
        ST.component('>> body').wait(10).click(10, 100);

        ST.comboBox('customCombo').value('home');
    });
    
});