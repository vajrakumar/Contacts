/**
 * Created by vajra on 04/12/15.
 */
Ext.define('ContactApp.ux.grid.plugin.MultiSelect', {
    extend: 'Ext.Component',
    alias: 'plugin.gridmultiselect',

    requires: [
        'Ext.grid.column.Column'
    ],

    config: {
        /**
         * @private
         */
        grid: null,

        /**
         * The default settings for the selection column.  You may create your
         * own selectionColumn config within your plugin object in order to:
         *
         * + Change column width
         * + Show the selectionColumn by default
         * + Change the default cls or cellCls
         * + Etc.
         */
        selectionColumn: {
            width: 60,
            xtype: 'column',
            cls: Ext.baseCSSPrefix + 'grid-multiselection-column',
            cell: {
                cls: Ext.baseCSSPrefix + 'grid-multiselection-cell'
            },
            ignore: true,
            hidden: true
        },

        /**
         * Determines whether or not the trigger button is show when the grid is loaded.
         * This most commonly be set to false if you wanted to have the selectionColumn
         * shown 100% of the time instead of hidden by default. You could show the {@link #selectionColumn}
         * by modifying its hidden value to be false.
         */
        useTriggerButton: true,

        /**
         * The text of the button used to cancel the {@link #selectionColumn}.
         */
        cancelIconCls: 'fa fa-close'
    },

    init: function (grid) {
        this.setGrid(grid);

        grid.getHeaderContainer().on({
            columntap: 'onColumnTap',
            scope: this
        });
    },

    onSelectTap: function () {
        if (this.getSelectionColumn().isHidden()) {
            this.enterSelectionMode();
        }
    },

    onColumnTap: function (container, column) {
        var grid = this.getGrid();
        if (column === this.getSelectionColumn()) {
            if (grid.getSelectionCount() === grid.getStore().getCount()) {
                grid.deselectAll();
            } else {
                grid.selectAll();
            }
        }
    },

    enterSelectionMode: function () {

        var toolBar = this.getToolbar();
        this.cancelButton = toolBar.insert(0, {
            xtype: 'button',
            iconCls: this.getCancelIconCls(),
            ui: 'normal',
            scope: this
        });

        this.cancelButton.on({
            tap: 'exitSelectionMode',
            scope: this
        });

        this.getSelectionColumn().show();

        this.getGrid().setMode('MULTI');
    },

    exitSelectionMode: function () {
        var grid = this.getGrid();

        this.cancelButton.destroy();
        this.getSelectionColumn().hide();

        grid.setMode('SINGLE');
        grid.deselectAll();
        grid.fireEvent('exitmultiselection', this);
    },

    applySelectionColumn: function (column) {
        if (column && !column.isComponent) {
            column = Ext.factory(column, Ext.grid.Column);
        }
        return column;
    },

    updateSelectionColumn: function (column, oldColumn) {
        var grid = this.getGrid();
        if (grid) {
            if (oldColumn) {
                grid.removeColumn(oldColumn);
            }

            if (column) {
                grid.insertColumn(0, column);
            }
        }
    },

    onGridSelectionChange: function () {
        var grid = this.getGrid(),
            column = this.getSelectionColumn();

        if (grid.getSelectionCount() === grid.getStore().getCount()) {
            column.addCls(Ext.baseCSSPrefix + 'grid-multiselection-allselected');
        } else {
            column.removeCls(Ext.baseCSSPrefix + 'grid-multiselection-allselected');
        }
    },

    updateGrid: function (grid, oldGrid) {
        var delegateCls = '.' + Ext.baseCSSPrefix + 'grid-multiselectioncell';

        if (oldGrid) {
            oldGrid.removeColumn(this.getSelectionColumn());
            oldGrid.un({
                selectionchange: 'onGridSelectionChange',
                scope: this
            });
        }

        if (grid) {
            grid.insertColumn(0, this.getSelectionColumn());
            grid.on({
                selectionchange: 'onGridSelectionChange',
                scope: this
            });
        }
    },
    getToolbar: function () {
        return this.getGrid().down('toolbar');
    }
});
