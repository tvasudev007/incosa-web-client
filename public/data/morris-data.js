$(function() {

    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: '2010',
            AG: 2666,
            SG: null,
            UI: 2647
        }, {
            period: '2011',
            AG: 2778,
            SG: 22,
            UI: 2441
        }, {
            period: '2012 ',
            AG: 4912,
            SG: 1969,
            UI: 2501
        }, {
            period: '2013',
            AG: 3767,
            SG: 3597,
            UI: 5689
        }, {
            period: '2014',
            AG: 6810,
            SG: 1914,
            UI: 2293
        }, {
            period: '2015',
            AG: 5670,
            SG: 4293,
            UI: 1881
        }],
        xkey: 'period',
        ykeys: ['AG', 'SG', 'UI'],
        labels: ['AG', 'SG', 'UI'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });

    Morris.Donut({
        element: 'morris-donut-chart1',
        data: [{
            label: "Diff %",
            value: 3
        }, {
            label: "Exp %",
            value: 30
        }],
        colors:['#F28F0C','#0B62A4'],
        resize: true
    });
    Morris.Donut({
        element: 'morris-donut-chart2',
        data: [{
            label: "Diff %",
            value: 23
        }, {
            label: "Exp %",
            value: 30
        }],
        colors:['#F28F0C','#0B62A4'],
        resize: true
    });
    Morris.Donut({
        element: 'morris-donut-chart3',
        data: [{
            label: "Diff %",
            value: 13
        }, {
            label: "Exp %",
            value: 30
        }],
        colors:['#F28F0C','#0B62A4'],
        resize: true
    });

    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            y: '2006',
            a: 100,
            b: 90
        }, {
            y: '2007',
            a: 75,
            b: 65
        }, {
            y: '2008',
            a: 50,
            b: 40
        }, {
            y: '2009',
            a: 75,
            b: 65
        }, {
            y: '2010',
            a: 50,
            b: 40
        }, {
            y: '2011',
            a: 75,
            b: 65
        }, {
            y: '2012',
            a: 100,
            b: 90
        }],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B'],
        hideHover: 'auto',
        resize: true
    });

});
