import { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const Graph = ({ chartData }) => {
  useEffect(() => {
    let root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);
    root?._logo?.dispose();

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
      })
    );

    // X-Axis
    let xRenderer = am5xy.AxisRendererX.new(root, {
      stroke: am5.color(0xffffff), // Make axis line white
    });
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "date",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xRenderer.labels.template.setAll({
      fill: am5.color(0xffffff), // Make x-axis labels white
    });
    xRenderer.grid.template.setAll({
      stroke: am5.color(0xffffff), // Make x-axis grid lines white
      strokeOpacity: 0.5, // Adjust visibility
    });

    // Y-Axis
    let yRenderer = am5xy.AxisRendererY.new(root, {
      stroke: am5.color(0xffffff), // Make axis line white
    });
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yRenderer,
      })
    );

    yRenderer.labels.template.setAll({
      fill: am5.color(0xffffff), // Make y-axis labels white
    });
    yRenderer.grid.template.setAll({
      stroke: am5.color(0xffffff), // Make y-axis grid lines white
      strokeOpacity: 0.5, // Adjust visibility
    });

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Active Users",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "date",
        tooltip: am5.Tooltip.new(root, { labelText: "{valueY}" }),
      })
    );

    xAxis.data.setAll(chartData);
    series.data.setAll(chartData);

    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [chartData]);

  return <div id="chartdiv" className="h-80"></div>;
};

export default Graph;