
"use strict";
// import moment from 'moment';
import { Chart } from 'chart.js';

function CoCreateChart(el) {
    this.el = el;

    this.datasets_el = [];

    this.labels = [];
    this.type = "line";
    this.title = "";
    this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false
    };

    this.datasets = [];
    this.COLORS = [
        '#4dc9f6',
        '#f67019',
        '#f53794',
        '#537bc4',
        '#acc236',
        '#166a8f',
        '#00a950',
        '#58595b',
        '#8549ba'
    ]

    this.chart = null;
    this._init(el);
    this.createChart();
}

CoCreateChart.prototype = {

    _init: function (el) {
        var options = el.getAttribute("chart-options");
        var type = el.getAttribute("chart-type");
        var labels = el.getAttribute("chart-labels");
        var title = el.getAttribute("chart-title");

        if (options) {
            options = JSON.parse(options);
            this.chartOptions = Object.assign(this.chartOptions, options)
        }
        if (type) {
            this.type = type;
        }

        if (labels) {
            this.labels = labels.split(",");
        }
        this.title = title;

        var nCnt = this.labels.length;

        this.datasets_el = el.querySelectorAll("[chart-dataset-type], [chart-dataset-label]");
        for (var i = 0; i < this.datasets_el.length; i++) {
            this.datasets.push(this._createDataSet(this.datasets_el[i], i, nCnt));
        }

        var single_charts = ["pie", "polarArea", "doughnut"];

        let label = this.datasets_el[0].getAttribute("chart-dataset-label");
        if (this.datasets_el.length == 1 && this.isEmpty(label) && !single_charts.includes(this.type)) {
            this.chartOptions.legend = {
                display: false
            };
        }

    },

    _createDataSet: function (el, idx, n) {
        var data = []
        var color = this.COLORS[idx % this.COLORS.length];
        var label = el.getAttribute("chart-dataset-label");
        var type = el.getAttribute("chart-dataset-type");
        var dataset_info = {};
        console.log(Chart)
        var bgColor = Chart.helpers.color(color).alpha(0.5).rgbString();

        var arrayColor_charts = ["pie", "polarArea", "doughnut"];

        label = this.isEmpty(label) ? "Data " + idx : label;

        for (var i = 0; i < n; i++) {
            data.push(0);
        }
        if (arrayColor_charts.includes(this.type)) {
            bgColor = [];
            var n_color = this.COLORS.length;

            for (var i = 0; i < n; i++) {
                bgColor.push(Chart.helpers.color(this.COLORS[i % n_color]).alpha(0.5).rgbString())
            }
        }

        dataset_info = {
            label: label,
            fill: false,
            backgroundColor: bgColor,
            borderColor: color,
            borderWidth: 1,
            data: data
        };

        if (type && type != "") {
            dataset_info.type = type;
        }
        return dataset_info;
    },

    createChart: function () {
        var ctx = this.el.getContext('2d');
        if (!this.isEmpty(this.title)) {
            this.chartOptions.title = {
                display: true,
                text: this.title,
                fontSize: 16
            }
        }

        this.chart = new Chart(ctx, {
            type: this.type,
            options: this.chartOptions,
            data: {
                labels: this.labels,
                datasets: this.datasets,
                options: this.chartOptions
            }
        })
    },

    // setData: function (value, set_idx, item_idx) {
    //     this.chart.data.datasets[set_idx].data[item_idx] = value;
    //     this.chart.update();
    // },

    isEmpty: function (data) {
        if (!data || data == "") {
            return true;
        }
        return false;
    }
}


function CoCreateChartManager() {
    this.charts = [];
    this._initSocket();
    this._createCharts();
    this._initfetchData();
}

CoCreateChartManager.prototype = {
    _createCharts: function () {
        var els = document.querySelectorAll("[chart='chartjs']");
        for (var i = 0; i < els.length; i++) {
            this.charts.push(new CoCreateChart(els[i]));
        }
    },

    _initfetchData: async function () {
        for (let i = 0; i < this.charts.length; i++) {

            for (let ii = 0; ii < this.charts[i].datasets_el.length; ii++) {

                let elements = this.charts[i].datasets_el[ii].children;

                for (let j = 0; j < elements.length; j++) {
                    const operator = elements[j].getAttribute("chart-operator");


                    // var eObj = {
                    //     method: 'object.read',
                    //     "metadata": {
                    //         chart_idx: i,
                    //         datasets_idx: ii,
                    //         data_idx: j, 
                    //          name: fetch_name,
                    //         operator,
                    //     },
                    //     // TODO update to use query,sort
                    //     "array": collect,
                    //     "element": `${i}-${ii}`,
                    // }

                    let data
                    if (elements[j].getValue)
                        data = await elements[j].getValue()
                    if (data)
                        this.setData(data, operator);

                    elements[i].setValue = (data) => {
                        this.setData(data, elements[j].getAttribute("chart-operator"));
                    }

                }
            }
        }
    },

    // setData: function (value, set_idx, item_idx)

    setData: function (data, operator) {
        var r_data = this.calcProcessing(data.object, info.name, operator);
        // this.charts[info.chart_idx].setData(r_data, info.datasets_idx, info.data_idx);
        this.chart.data.datasets[set_idx].data[item_idx] = value;
        this.chart.update();

    },

    calcProcessing(data, key, operator) {

        var data_list = [];

        var cnt = 0;
        var sum = 0;
        var result = 0;

        for (var i = 0; i < data.length; i++) {
            if (data[i][key] != null) {
                const number = isNaN(data[i][key]) ? 0 : Number(data[i][key]);
                data_list.push(number);
                sum += number
                cnt++;
            }
        }

        if (cnt === 0) {
            return 0;
        }

        operator = (operator) ? operator : 'sum';

        switch (operator) {
            case 'sum':
                result = sum;
                break;
            case 'count':
                result = cnt;
                break;
            case 'average':
                result = sum / cnt;
                break;
        }

        return result;
    },

    isEmpty: function (data, match) {
        if (!data || data == "") {
            return true;
        }
        return false;
    }
}

let chartManager = new CoCreateChartManager();

function loadChartData() {
    chartManager._initfetchData();
}


