let totalSalesFigure = 0;
let totalCash = 0;

const displaySaleChart = (saleChartData) => {
  document.getElementById('totalSale').innerText = `${(totalSalesFigure)}`;

  new Highcharts.chart("salesChart", {
		chart: {
			height: 350,
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: !1,
			type: "pie",
			styledMode: !0
		},
		credits: {
			enabled: !1
		},
		title: {
			text: ""
		},
		subtitle: {
			text: ""
		},
		tooltip: {
			pointFormat: "{series.name}: <b>{point.y}</b>"
		},
		accessibility: {
			point: {
				valueSuffix: "%"
			}
		},
		plotOptions: {
			pie: {
				allowPointSelect: !0,
				cursor: "pointer",
				innerSize: 120,
				dataLabels: {
					enabled: !0,
					format: "<b>{point.name}</b>: {point.percentage:.1f} %"
				},
				showInLegend: !0
			}
		},
		series: [{
			name: "Sales Summary",
			colorByPoint: !0,
			data: saleChartData
		}],
		responsive: {
			rules: [{
				condition: {
					maxWidth: 500
				},
				chartOptions: {
					plotOptions: {
						pie: {
							innerSize: 140,
							dataLabels: {
								enabled: !1
							}
						}
					}
				}
			}]
		}
	})
}

const getSaleChartData = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/accountStats/departmentalSaleAccounts`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true
    });
    
    let saleChartData = [];

    if(res.data.status === 'success') {

      let res2;
      let id;
      
      for(let i = 0; i < res.data.data.data.length; i++){
        id = res.data.data.data[i].id;
        res2 = await axios({
          method: 'GET',
          url: `/api/v1/accountStats/departmentSale/${id}`,
          // credentials: 'include',
          mode: 'cors',
          withCredentials: true
        });
        saleChartData.push({ name: res.data.data.data[i].title.split(' - ')[0], y: res2.data.data.SUM * 1 });
        totalSalesFigure += parseFloat(res2.data.data.SUM);
      }
      displaySaleChart(saleChartData);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

getSaleChartData();

const displayCashChart = (cashChartData) => {
  document.getElementById('cashSummary').innerText = `Cash Summary ( ${totalCash} )`;

  Highcharts.chart("cashChart", {
    chart: {
      height: 350,
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: !1,
      type: "pie",
      styledMode: !0
    },
    credits: {
      enabled: !1
    },
    title: {
      text: ""
    },
    subtitle: {
      text: ""
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>"
    },
    accessibility: {
      point: {
        valueSuffix: "%"
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: !0,
        cursor: "pointer",
        innerSize: 120,
        dataLabels: {
          enabled: !0,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %"
        },
        showInLegend: !0
      }
    },
    series: [{
      name: "Cash Accounts",
      colorByPoint: !0,
      data: cashChartData 
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          plotOptions: {
            pie: {
              innerSize: 140,
              dataLabels: {
                enabled: !1
              }
            }
          }
        }
      }]
    }
  });
};

const getCashChartData = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/accountStats/cashAccounts`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true
    });

    if(res.data.status === 'success') {
      let cashChartData = [];
      res.data.data.data.forEach(element => {
        cashChartData.push({ name: element.title, y: element.balance * 1 });
        totalCash += parseFloat(element.balance);
      });

      displayCashChart(cashChartData);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

getCashChartData();