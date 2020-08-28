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
        'monthly': '#monthly',
        'payments': '#payments',
        'monthlyText': '#monthly-text',
        'taxPercent': 0.06,
        'titleFee': 100,
        'registrationFee': 165,
        'tagsFee': 20,
        'apr': '#apr',
        'feesDetails': '#fees-details',
        'payment': '#payment',
        'interest': '#interest',
        'financed': '#financed',                                
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

    parent.getFinanced = function () {
        var payment = parent.getValue('payment');
        var payments = parent.getValue('payments');

        return payment * payments;
    };

    parent.getFees = function () {
        var msrp = parent.getValue('msrp');
        var additional = parent.getValue('additional');
        var stateTax = (msrp + additional) * config.taxPercent;
        
        return {
            'tax': Math.round(stateTax),
            'title': config.titleFee,
            'registration': config.registrationFee,
            'tags': config.tagsFee,
        };
    };

    parent.calculate = function () {
        var message = [];
        if (0 === parent.getValue('msrp')) {
            message.push('MSRP price not set');
        };
        if (0 === parent.getValue('payment')) {
            message.push('Monthly payment not set');
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
        
        var financed = parent.getFinanced();
        var fees = parent.getFees();
        var total = financed + parent.getValue('down');
        var apr = parseFloat($(config.apr).val());
        var payments = parent.getValue('payments');
        var principal = financed / (1 + (payments * apr/100/12));
        principal = Math.round(principal);
        var interest = financed - principal;
        var price = parent.getValue('price');
        var additional = parent.getValue('additional');        
        
        $(config.total).text('$' + total);
        $(config.financed).text('$' + financed);
        $(config.interest).text('$' + interest);

        console.log(financed);
        console.log(price);

        var totalFees = total - price - interest - additional;
        console.log(totalFees);
        var fees = parent.getFees();
        var dealerFees = totalFees - fees.tax - fees.title - fees.registration - fees.tags;
        
        $(config.fees).text('$' + totalFees);
        var dealerFeesStr = 'State Tax: <b>$' + fees.tax +  
                            '</b><br>Title: <b>$' + fees.title + 
                            '</b><br>Registration: <b>$' + fees.registration +
                            '</b><br>Tags: <b>$' + fees.tags +
                            '</b><br>Dealer Fees: <b>$' + dealerFees + '</b>'
                            ;
        $(config.feesDetails).html(dealerFeesStr);

        $([document.documentElement, document.body]).animate({
            scrollTop: 0
        }, 1000);        
    };

    return parent;

})(app || {}, $);