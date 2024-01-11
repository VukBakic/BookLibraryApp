import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/service/user.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss'],
})
export class GraphsComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getGraph().subscribe((next) => {
      let dates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (Array.isArray(next)) {
        next.forEach((e) => {
          if (e._id) {
            dates[e._id] = e.count;
          }
        });
        this.options.series = [
          {
            data: dates,
            type: 'bar',
          },
        ];
      }
    });

    this.userService.getGraph2().subscribe((next) => {
      let genreName: any = [];
      let genreCount: any = [];
      if (Array.isArray(next)) {
        next.forEach((e) => {
          if (e._id) {
            genreName.push(e._id.name);
            genreCount.push(e.count);
          }
        });
        this.options2.series = [
          {
            data: genreCount,
            type: 'bar',
          },
        ];
        this.options2.xAxis = {
          type: 'category',
          data: genreName,
        };
      }
    });
  }

  options: EChartsOption = {
    color: ['#0f7173'],

    xAxis: {
      type: 'category',
      data: [
        'Jan',
        'Feb',
        'Mart',
        'Apr',
        'Maj',
        'Jun',
        'Jul',
        'Avg',
        'Sep',
        'Okt',
        'Nov',
        'Dec',
      ],
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'bar',
      },
    ],
  };

  options2: EChartsOption = {
    color: ['#0f7173'],

    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    series: [
      {
        type: 'bar',
      },
    ],
  };
}
