import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";

interface Props {
  chartTitle: string;
  series: Array<{
    name: string;
    data: Array<{
      name: string;
      y: any;
    }>;
    marker: {
      symbol: string;
    };
  }>;
}

const InvestmentChart: React.FC<Props> = ({ chartTitle, series }) => {
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: {
          type: "spline",
          scrollablePlotArea: {
            minWidth: 600,
            scrollPositionX: 1,
          },
        },
        title: {
          text: chartTitle,
          align: "left",
        },
        xAxis: {
          type: "linear",
          tickInterval: 60,
          labels: {
            enabled: true,
            formatter: function (x: any) {
              return moment(series[0].data[x.pos]?.["name"]).format("YYYY");
            },
          },
        },
        yAxis: {
          title: {
            text: "",
          },
          opposite: true,
          lineWidth: 1,
          gridLineWidth: 0,
          tickInterval: 500000,
        },
        tooltip: {
          valuePrefix: "S$",
          shared: true,
          crosshairs: true,
        },
        plotOptions: {
          spline: {
            lineWidth: 2,
            marker: {
              enabled: false,
            },
          },
        },
        series,
      }}
    />
  );
};

export default InvestmentChart;
