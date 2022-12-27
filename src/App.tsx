import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";

interface ApiResponse {
  chanceOfUnderPerformingBenchmark: number;
  expectedAmounts: {
    10: number;
    50: number;
    75: number;
    benchmark: number;
  };
  sequence: number;
  totalDeposit: number;
  yearMonth: string;
}

function App() {
  const [data1, setData1] = useState<any>([]);
  const [data2, setData2] = useState<any>([]);
  const [data3, setData3] = useState<any>([]);
  const [data4, setData4] = useState<any>([]);
  const [data5, setData5] = useState<any>([]);
  const [form, setForm] = useState({
    initialInvestment: 200,
    monthlyInvestment: 100,
  });

  useEffect(() => {
    const getData = async () => {
      const result: Array<ApiResponse> = await fetch(
        "http://www.mocky.io/v2/5e69de892d00007a005f9e29?mocky-delay=2000ms",
        {
          method: "post",
          body: JSON.stringify({
            initialInvestment: form.initialInvestment,
            monthlyInvestment: form.monthlyInvestment,
          }),
        }
      ).then((response) => response.json());

      const data1 = result.map((x) => ({
        name: moment(x?.yearMonth).format("MMMM YYYY"),
        y: x?.expectedAmounts[75],
      }));
      const data2 = result.map((x) => ({
        name: moment(x?.yearMonth).format("MMMM YYYY"),
        y: x?.expectedAmounts[50],
      }));
      const data3 = result.map((x) => ({
        name: moment(x?.yearMonth).format("MMMM YYYY"),
        y: x?.expectedAmounts[10],
      }));
      const data4 = result.map((x) => ({
        name: moment(x?.yearMonth).format("MMMM YYYY"),
        y: x?.expectedAmounts["benchmark"],
      }));
      const data5 = result.map((x) => ({
        name: x?.yearMonth.substring(0, 4),
        y: x?.totalDeposit,
      }));

      setData1(data1);
      setData2(data2);
      setData3(data3);
      setData4(data4);
      setData5(data5);
    };
    getData();
  }, [form]);

  const onChangeInput = useCallback(
    (e: any, prop: string) => {
      const updatedForm = { ...form, [prop]: +e.target.value };
      setForm(updatedForm);
    },
    [form]
  );

  return (
    <div>
      <div style={{ display: "flex", margin: "20px" }}>
        <label style={{ margin: " 0 10px 0 20px" }}>Initial Investment</label>
        <div>
          <input
            name="Initial Investment"
            value={form.initialInvestment}
            onChange={(e) => onChangeInput(e, "initialInvestment")}
          />
        </div>
        <label style={{ margin: " 0 10px 0 20px" }}>Monthly Investment</label>
        <div>
          <input
            name="Monthly Investment"
            value={form.monthlyInvestment}
            onChange={(e) => onChangeInput(e, "monthlyInvestment")}
          />
        </div>
      </div>
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
            text: "Plan Projection",
            align: "left",
          },
          xAxis: {
            type: "linear",
            tickInterval: 60,
            labels: {
              enabled: true,
              formatter: function (x: any) {
                return moment(data1[x.pos]?.["name"]).format("YYYY");
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
          series: [
            {
              name: "Top 25%",
              data: data1,
              marker: {
                symbol: "circle",
              },
            },
            {
              name: "Median",
              data: data2,
              marker: {
                symbol: "circle",
              },
            },
            {
              name: "Bottom 10%",
              data: data3,
              marker: {
                symbol: "circle",
              },
            },
            {
              name: "Benchmark",
              data: data4,
              marker: {
                symbol: "circle",
              },
            },
            {
              name: "Total deposit",
              data: data5,
              marker: {
                symbol: "circle",
                radius: 2,
              },
            },
          ],
        }}
      />
    </div>
  );
}

export default App;
