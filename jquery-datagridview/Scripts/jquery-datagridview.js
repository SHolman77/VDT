﻿(function ($) {

    // Extension for creating datagridviews; supports multiple creations in one call
    $.fn.datagridview = function (settings, callback) {
        // Allow callback to be the only argument
        if ($.isFunction(settings)) {
            callback = settings;
            settings = null;
        }

        return $(this).each(function () {
            let datagridview = $(this).data('datagridview');

            if (!$(this).data('datagridview')) {
                // Validate columns
                if (!settings || !settings.columns) {
                    throw 'datagridview error: expected required option "columns"';
                }
                else if (!$.isArray(settings.columns)) {
                    throw 'datagridview error: expected option "columns" to be an array';
                }
                else if (!settings.columns.every(function (column) {
                    return !!column.data;
                })) {
                    throw 'datagridview error: expected each item in option "columns" to have property "data"';
                }

                // Create object
                let options = $.extend({}, $.fn.datagridview.defaults, settings);
                datagridview = new DataGridView($(this), options);

                // Add object to data
                $(this).data('datagridview', datagridview);
            }

            // Call the callback, bound to the datagridview
            if ($.isFunction(callback)) {
                callback.bind(datagridview)(datagridview);
            }
        });
    }

    // Set defaults for extension
    $.fn.datagridview.defaults = {
        // Get initial meta data
        // Expects a DataGridViewMetaData object
        getMetaData: function (element) {
            return new DataGridViewMetaData(null, false, 0, 25, 0);
        },
        // Footer functions, in order, to use for the footer
        getFooterPlugins: function (element) {
            return [
                $.fn.datagridview.footerPlugins.displayBasic,
                $.fn.datagridview.footerPlugins.displayFull,
                $.fn.datagridview.footerPlugins.displayBasic
            ];
        }
    }

    // Pagination footer plugins
    $.fn.datagridview.footerPlugins = {
        displayBasic: function (footerElement, metaData, element) {
            $(footerElement).append($('<div>').text("Page " + metaData.page + " of " + metaData.totalPages));
        },
        displayFull: function (footerElement, metaData, element) {
            let rowStart = metaData.page * metaData.rowsPerPage + 1;
            let rowEnd = (metaData.page + 1) * metaData.rowsPerPage;

            $(footerElement).append($('<div>').text("Page " + metaData.page + " of " + metaData.totalPages + ", rows " + rowStart + " to " + rowEnd + " of " + metaData.totalRows));
        }
    }

    // Datagridview implementation
    function DataGridView(element, options) {
        let base = this;

        this.element = element;
        this.options = options;
        this.data = [];
        this.metaData = this.options.getMetaData(this.element);
        this.elementClass = 'datagridview-' + Math.random().toString().replace('.', '');
        this.element.addClass('datagridview');
        this.element.addClass(this.elementClass);
        this.element.children().hide();
        this.header = this.createElement('<div>', 'datagridview-header');
        this.body = this.createElement('<div>', 'datagridview-body');
        this.contentContainer = this.createElement('<div>', 'datagridview-content-container').append(this.header, this.body);
        this.footer = this.createElement('<div>'); // Placeholder only
        this.footerPlugins = this.options.getFooterPlugins(this.element);
        this.sortToggle = this.createElement('<div>', 'datagridview-sort-toggle');
        this.element.append(
            this.contentContainer,
            this.footer
        );

        this.style = $('<style>', { type: 'text/css' });
        $('body').append(this.style);

        // Create columns
        this.options.columns.forEach(function (column) {
            // Define class
            column.class = 'datagridview-column-' + Math.random().toString().replace('.', '');
            column.width = isNaN(column.width) || column.width <= 0 ? 10 : parseInt(column.width);

            base.header.append($('<div>').text(column.header || column.data)
                .addClass(column.class)
                .addClass('datagridview-header-cell')
                .attr('title', column.header || column.data)
                .data('column', column.data)
                .data('sort-column', column.sortData || column.data));
        });

        this.setColumnWidth();

        // Use the meta data if present to display appropriate sorting and paging
        this.displaySortOrder();
        this.displayFooters();

        // Event handlers
        this.header.on('mouseup', 'div.datagridview-header-cell', this, eventHandlers.headerMouseup);
    }

    // Set the width of the columns
    DataGridView.prototype.setColumnWidth = function () {
        let style = '';
        let tableWidth = this.options.columns.reduce(function (w, c) { return w + c.width; }, 0);

        if (tableWidth > 100) {
            style = '.' + this.elementClass + ' div.datagridview-header, .' + this.elementClass + ' div.datagridview-body { width: ' + tableWidth + '%}\n';
        }

        this.style.html(this.options.columns.reduce(function (style, column) {
            return style + '.' + column.class + '{ flex-grow: ' + column.width + ' }\n';
        }, style));
    }

    // Fill the grid with the data
    // TODO: research performance; preliminary results are 20 cells per ms in Chrome
    DataGridView.prototype.populate = function (metaData, data) {
        let newBody = this.createElement('<div>', 'datagridview-body');

        for (let r = 0; r < data.length; r++) {
            let dataRow = data[r];
            let row = this.createElement('<div>', 'datagridview-row');

            for (let c = 0; c < this.options.columns.length; c++) {
                let column = this.options.columns[c];

                row.append($('<div>').text(dataRow[column.data] || "").addClass(column.class).attr('title', dataRow[column.data] || ""));
            }

            newBody.append(row);
        };

        this.body.replaceWith(newBody);
        this.body = newBody;
        this.data = data;

        // Use the new meta data if present to display appropriate sorting and paging
        this.metaData = metaData || new DataGridViewMetaData(this.metaData.sortColumn, this.metaData.sortDescending, this.data.length, this.data.length, 0);
        this.displaySortOrder();
        this.displayFooters();
    }

    // Create an element and merge attribute objects to attributes
    DataGridView.prototype.createElement = function (tagName, className) {
        let attributes = $.extend.apply({}, Array.prototype.slice.call(arguments, 2));
        let element = $(tagName, attributes).addClass(className);

        return element;
    }

    // Remove the entire datagridview; resets the base element to its former state
    DataGridView.prototype.remove = function () {
        this.element.removeClass('datagridview');
        this.element.removeClass(this.elementClass);
        this.element.children().show();
        this.contentContainer.remove();
        this.footer.remove();
        this.style.remove();
    }

    // Get meta currently in use; these can be edited and passed back via populate
    DataGridView.prototype.getMetaData = function() {
        return this.metaData.clone();
    }

    // Set sorting icon after sorting action
    DataGridView.prototype.displaySortOrder = function () {
        let base = this;
        let header = this.header.find('div.datagridview-header-cell').filter(function () { return $(this).data('sort-column') === base.metaData.sortColumn });

        if (header.length > 0) {
            if (this.metaData.sortDescending) {
                this.sortToggle.removeClass('datagridview-sort-toggle-ascending').addClass('datagridview-sort-toggle-descending');
            }
            else {
                this.sortToggle.removeClass('datagridview-sort-toggle-descending').addClass('datagridview-sort-toggle-ascending');
            }

            header.append(this.sortToggle);
            this.sortToggle.show();
        }
        else {
            this.sortToggle.hide();
        }
    }

    // Create the footers
    DataGridView.prototype.displayFooters = function () {
        let base = this;
        let newFooter = this.createElement('<div>', 'datagridview-footer');

        this.footer.children().remove();

        if (this.footerPlugins.length !== 0) {
            $.each(this.footerPlugins, function () {
                let footerElement = base.createElement('<div>', 'datagridview-footer-element');

                newFooter.append(footerElement);
                this(footerElement, base.getMetaData(), base.element);
            });
        }

        this.footer.replaceWith(newFooter);
    }

    // Event handlers should not be accessible from the object itself
    let eventHandlers = {
        headerMouseup: function (e) {
            if (e.which !== 1) {
                return;
            }

            // In the event handler we work with a copy of the element; we only sort if 
            let metaData = e.data.getMetaData();
            let sortColumn = $(this).data('sort-column');

            if (metaData.sortColumn === sortColumn) {
                metaData.sortDescending = !metaData.sortDescending;
            }
            else {
                metaData.sortColumn = sortColumn;
                metaData.sortDescending = false;
            }

            e.data.element.trigger('datagridview.sorted', metaData);
        }
    }

}(jQuery));

// Datagridview meta data
function DataGridViewMetaData(sortColumn, sortDescending, totalRows, rowsPerPage, page) {
    this.sortColumn = sortColumn;
    this.sortDescending = !!sortDescending;
    this.totalRows = isNaN(totalRows) || totalRows <= 0 ? 0 : parseInt(totalRows);
    this.rowsPerPage = isNaN(rowsPerPage) || rowsPerPage <= 0 ? 25 : parseInt(rowsPerPage);
    this.page = isNaN(page) || page <= 0 ? 0 : parseInt(page);
    this.totalPages = Math.ceil(totalRows / rowsPerPage);
}

// When accessing the meta data normally we get a clone
DataGridViewMetaData.prototype.clone = function () {
    return new DataGridViewMetaData(this.sortColumn, this.sortDescending, this.totalRows, this.rowsPerPage, this.page);
}