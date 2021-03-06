﻿describe('in a datagridview a user can select', function () {
    function triggerMouseEvent(element, eventType, ctrlKey, shiftKey) {
        var event = jQuery.Event(eventType);
        event.which = 1;
        event.ctrlKey = !!ctrlKey;
        event.shiftKey = !!shiftKey;

        $(element).trigger(event);
    }

    it('nothing by clicking if selecting is not allowed', function () {
        var grid = $('#selection-no-select');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, }
            ]);
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mouseup');

        expect(grid.find('.datagridview-row-selected').length).toEqual(0);
    });

    it('nothing by clicking if selecting is not allowed and multiselect is on', function () {
        var grid = $('#selection-no-select-multi');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, }
            ]);
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mouseup');

        expect(grid.find('.datagridview-row-selected').length).toEqual(0);
    });

    it('a single row by clicking on the row', function () {
        var grid = $('#selection-single');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, }
            ]);
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mousedown');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mouseup');

        var rows = grid.find('.datagridview-row-selected');

        expect(rows.length).toEqual(1);
        expect(rows[0]).toEqual(grid.find('.datagridview-row')[1]);
    });

    it('a different row after selecting one by clicking on the row in single-select mode', function () {
        var grid = $('#selection-single-different');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, }
            ]);
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mousedown');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mouseup');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(1)'), 'mousedown');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(1)'), 'mouseup');

        var rows = grid.find('.datagridview-row-selected');

        expect(rows.length).toEqual(1);
        expect(rows[0]).toEqual(grid.find('.datagridview-row')[0]);
    });

    it('a different row after selecting one by clicking on the row in multiselect mode', function () {
        var grid = $('#selection-multi-different');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, }
            ]);
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mousedown');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mouseup');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(1)'), 'mousedown');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(1)'), 'mouseup');

        var rows = grid.find('.datagridview-row-selected');

        expect(rows.length).toEqual(1);
        expect(rows[0]).toEqual(grid.find('.datagridview-row')[0]);
    });

    it('an additional row after selecting one by ctrl+clicking on the row in multiselect mode', function () {
        var grid = $('#selection-multi-ctrl');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, }
            ]);
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mousedown');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mouseup');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(1)'), 'mousedown', true);
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(1)'), 'mouseup', true);

        var rows = grid.find('.datagridview-row-selected');

        expect(rows.length).toEqual(2);
        expect(rows[0]).toEqual(grid.find('.datagridview-row')[0]);
        expect(rows[1]).toEqual(grid.find('.datagridview-row')[1]);
    });

    it('nothing by by ctrl+clicking on the selected row in multiselect mode', function () {
        var grid = $('#selection-multi-ctrl-deselect');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, }
            ]);
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mouseup');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mouseup', true);

        expect(grid.find('.datagridview-row-selected').length).toEqual(0);
    });

    it('a range of rows after selecting a higher row by shift+clicking on a lower row in multiselect mode', function () {
        var grid = $('#selection-multi-shift');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, },
                { test: 4, },
                { test: 5, } 
            ]);
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mousedown');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mouseup');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(4)'), 'mousedown', false, true);
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(4)'), 'mouseup', false, true);

        var rows = grid.find('.datagridview-row-selected');

        expect(rows.length).toEqual(3);
        expect(rows[0]).toEqual(grid.find('.datagridview-row')[1]);
        expect(rows[2]).toEqual(grid.find('.datagridview-row')[3]);
    });

    it('a range of rows after selecting a lower row by shift+clicking on a higher row in multiselect mode', function () {
        var grid = $('#selection-multi-shift-reverse');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, },
                { test: 4, },
                { test: 5, }
            ]);
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(4)'), 'mousedown');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(4)'), 'mouseup');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mousedown', false, true);
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mouseup', false, true);

        var rows = grid.find('.datagridview-row-selected');

        expect(rows.length).toEqual(3);
        expect(rows[0]).toEqual(grid.find('.datagridview-row')[1]);
        expect(rows[2]).toEqual(grid.find('.datagridview-row')[3]);
    });

    it('an additional range of rows by ctrl+clicking and ctrl+shift+clicking in multiselect mode', function () {
        var grid = $('#selection-multi-ctrl-shift');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, },
                { test: 4, },
                { test: 5, },
                { test: 6, }
            ]);

            this.setSelectedIndexes([0, 1]);
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(4)'), 'mousedown', true);
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(4)'), 'mouseup', true);
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(5)'), 'mousedown', true, true);
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(5)'), 'mouseup', true, true);

        var rows = grid.find('.datagridview-row-selected');

        expect(rows.length).toEqual(4);
        expect(rows[0]).toEqual(grid.find('.datagridview-row')[0]);
        expect(rows[3]).toEqual(grid.find('.datagridview-row')[4]);
    });

    it('a range of rows by dragging from a higher row to a lower row in multiselect mode', function () {
        var grid = $('#selection-multi-drag');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, },
                { test: 4, }
            ]);
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mousedown');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(4)'), 'mouseenter');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(4)'), 'mouseup');

        var rows = grid.find('.datagridview-row-selected');

        expect(rows.length).toEqual(3);
        expect(rows[0]).toEqual(grid.find('.datagridview-row')[1]);
        expect(rows[2]).toEqual(grid.find('.datagridview-row')[3]);
    });

    it('a range of rows by dragging from a lower row to a higher row in multiselect mode', function () {
        var grid = $('#selection-multi-drag-reverse');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, },
                { test: 4, }
            ]);
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(4)'), 'mousedown');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mouseenter');
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(2)'), 'mouseup');

        var rows = grid.find('.datagridview-row-selected');

        expect(rows.length).toEqual(3);
        expect(rows[0]).toEqual(grid.find('.datagridview-row')[1]);
        expect(rows[2]).toEqual(grid.find('.datagridview-row')[3]);
    });

    it('an additional range of rows by ctrl+dragging in multiselect mode', function () {
        var grid = $('#selection-multi-ctrl-drag');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, },
                { test: 4, },
                { test: 5, },
                { test: 6, }
            ]);

            this.setSelectedIndexes([0, 1]);
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(4)'), 'mousedown', true);
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(5)'), 'mouseenter', true);
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(5)'), 'mouseup', true);

        var rows = grid.find('.datagridview-row-selected');

        expect(rows.length).toEqual(4);
        expect(rows[0]).toEqual(grid.find('.datagridview-row')[0]);
        expect(rows[3]).toEqual(grid.find('.datagridview-row')[4]);
    });

    it('an range of rows triggers selection changed event with new selected data', function () {
        var grid = $('#selection-multi-event');
        var data = null;

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, },
                { test: 4, },
                { test: 5, },
                { test: 6, }
            ]);

            this.setSelectedIndexes([0, 1]);
        });

        grid.on('datagridview.selectionChanged', function (e, d) {
            data = d;
        });

        triggerMouseEvent(grid.find('.datagridview-row:nth-child(4)'), 'mousedown', true);
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(5)'), 'mouseenter', true);
        triggerMouseEvent(grid.find('.datagridview-row:nth-child(5)'), 'mouseup', true);
        
        expect(data).not.toBeNull();
        expect(data.length).toEqual(4);
    });

    it('with checkboxes if multiselect and checkbox select are enabled', function () {
        var grid = $('#selection-multi-checkboxes');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, }
            ]);
        });

        grid.find('.datagridview-row:nth-child(2) input.select-checkbox').click();

        var rows = grid.find('.datagridview-row-selected');

        expect(rows.length).toEqual(1);
        expect(rows[0]).toEqual(grid.find('.datagridview-row')[1]);
    });

    it('but not with checkboxes if only checkbox select is enabled', function () {
        var grid = $('#selection-multi-no-checkboxes');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, }
            ]);
        });

        expect(grid.find('.datagridview-row:nth-child(2) input.select-checkbox').length).toEqual(0);
    });

    it('all rows with header checkbox if multiselect and checkbox select are enabled', function () {
        var grid = $('#selection-multi-checkbox-all');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, }
            ]);
        });

        grid.find('.datagridview-checkbox-header-cell input.select-checkbox').click();

        var rows = grid.find('.datagridview-row-selected');

        expect(rows.length).toEqual(3);
        expect(rows[0]).toEqual(grid.find('.datagridview-row')[0]);
        expect(rows[1]).toEqual(grid.find('.datagridview-row')[1]);
        expect(rows[2]).toEqual(grid.find('.datagridview-row')[2]);
    });

    it('or deselect with checkboxes in previous selection', function () {
        var grid = $('#selection-multi-checkboxes-previous');

        grid.datagridview({
            columns: [
                { data: 'test' }
            ]
        }, function () {
            this.populate(this.getMetaData(), [
                { test: 1, },
                { test: 2, },
                { test: 3, }
            ]);

            this.setSelectedRows('*');
        });

        grid.find('.datagridview-row:nth-child(2) input.select-checkbox').click();

        var rows = grid.find('.datagridview-row-selected');

        expect(rows.length).toEqual(2);
        expect(rows[0]).toEqual(grid.find('.datagridview-row')[0]);
        expect(rows[1]).toEqual(grid.find('.datagridview-row')[2]);
    });
});