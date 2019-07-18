# g-perf

> 监控 G / G2 中的节点数量、事件数量，可以辅助调试在动态渲染图形的时候，是否存在泄露。


## Usage

 - 开发调试

```js
import GP from '@antv/g-perf';

// 监控 G2 plot 和 G
new GP(plot).start();
```

即可在页面左下角出现一个调试区域，实时显示当前画布的节点数量。

 - 单测中使用

```js
import GP from '@antv/g-perf';

// 监控 G2 plot 和 G
const gp = new GP(plot);

const datum = gp.collect();

expect(datum.pEvent).to.be.equal(100);
```


## TODO

 - draw call
 - 多实例的统一监控
 - spark line 可视化数据
