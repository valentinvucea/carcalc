$(function () {
    $('body').on('click', '#calculate', function () {
        app.calculate();
    });
});

/** global: Utils */

var app = (function(parent, $) {
    var config = {
        'alert': '#alert',
        'msrp': '#msrp',
        'price': '#price',
        'down': '#down',
        'additional': '#additional',
        'total': '#total',
        'fees': '#fees',
        'monthly60': '#monthly60',
        'monthly72': '#monthly72',
        'taxPercent': 0.06,
        'titleFee': 100,
        'registrationFee': 185,
        'tagsFee': 15,
        'apr': 0.9,
    };

    parent.getValue = function (field) {
        return parseInt($(config[field]).val());

    };

    parent.setAlert = function (hide, message) {
        if (true === hide) {
            $(config.alert).addClass('d-none').html('');
        } else {
            $(config.alert).removeClass('d-none').html(message);
        }
    };
    
    parent.pmt = function (principal, apr, payments) {
        var interest = apr / 100 / 12;
        var x = Math.pow(1 + interest, payments);
        var monthly = (principal*x*interest)/(x-1);
        
        // Check that the result is a finite number. If so, display the results.
        if (!isNaN(monthly) && 
            (monthly != Number.POSITIVE_INFINITY) &&
            (monthly != Number.NEGATIVE_INFINITY)) {
    
            return Math.round(monthly);
        } else {
            return ""; 
        }
    };

    parent.getFees = function () {
        return (parent.getValue('msrp') + parent.getValue('additional')) * config.taxPercent + config.titleFee + config.registrationFee + config.tagsFee;
    };

    parent.calculate = function () {
        var message = [];
        if (0 === parent.getValue('msrp')) {
            message.push('MSRP price not set');
        };
        if (0 === parent.getValue('price')) {
            message.push('Negociated price not set');
        };

        if (0 !== message.length) {
            parent.setAlert(false, message.join('<br>'));
            
            $([document.documentElement, document.body]).animate({
                scrollTop: 0
            }, 1000);
            return false;
        }

        parent.setAlert(true);
        
        /** Calculate fees */
        var fees = parent.getFees();
        var total = parent.getValue('price') + parent.getValue('additional') + fees;
        var principal = total - parent.getValue('down');

        $(config.total).text('$' + total);
        $(config.fees).text('$' + fees);
        $(config.monthly60).text('$' + parent.pmt(principal, config.apr, 60));
        $(config.monthly72).text('$' + parent.pmt(principal, config.apr, 72));

        $([document.documentElement, document.body]).animate({
            scrollTop: 0
        }, 1000);        
    };

    return parent;

})(app || {}, $);