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
        'dealerFee': '#dealer-fee',
        'monthly': '#monthly',
        'payments': '#payments',
        'monthlyText': '#monthly-text',
        'taxPercent': 0.06,
        'titleFee': 100,
        'registrationFee': 165,
        'tagsFee': 20,
        'apr': '#apr',
        'feesDetails': '#fees-details',        
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
        var monthly = principal/payments;
        if (0 !== apr) {
            monthly = (principal*x*interest)/(x-1);
        }

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
        var msrp = parent.getValue('msrp');
        var additional = parent.getValue('additional');
        var dealerFee = parent.getValue('dealerFee');
        var stateTax = (msrp + additional) * config.taxPercent;
        var total = Math.round(stateTax) + config.titleFee + config.registrationFee + config.tagsFee + dealerFee;
        
        return {
            'tax': Math.round(stateTax),
            'title': config.titleFee,
            'registration': config.registrationFee,
            'tags': config.tagsFee,
            'dealer': dealerFee,
            'total': total
        };
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
        var total = parent.getValue('price') + parent.getValue('additional') + fees.total;
        var principal = total - parent.getValue('down');
        var apr = parseFloat($(config.apr).val());
        var payments = parent.getValue('payments');
        
        $(config.total).text('$' + total);
        $(config.fees).text('$' + fees.total);
        $(config.feesDetails).text('State Tax: $' + fees.tax + ', Title: $' + fees.title + ', Registration: $' + fees.registration + ', Tags: $' + fees.tags + ', Dealer Fees: $' + fees.dealer);

        console.log(principal);
        console.log(apr);
        console.log(payments);

        var payment = parent.pmt(principal, apr, payments);
        payment = Math.round(payment);
    
        $(config.monthlyText).text('Monthly payment @' + payments + ' months');
        $(config.monthly).text('$' + payment);

        $([document.documentElement, document.body]).animate({
            scrollTop: 0
        }, 1000);        
    };

    return parent;

})(app || {}, $);