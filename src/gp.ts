import { FPS } from './fps';
import { Timer } from './timer';
import { collectPlot, collectCanvas } from './util';
import { Datum, Plot, Canvas } from './interface';

const FONT_SIZE = 10; // 字体大小 10
const RATIO = window.devicePixelRatio;

export class GP {
  private plot: Plot;
  private canvas: Canvas;

  private fps: FPS;
  private timer: Timer;

  private c: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(plot: Plot); // 用于 g2
  constructor(canvas: Canvas); // 用于 g
  constructor(plot: Plot | Canvas) {
    // G2 有 canvas 属性
    if (!plot.get('canvas')) {
      this.plot = undefined;
      this.canvas = plot as Canvas;
    } else {
      this.plot = plot as Plot;
      this.canvas = plot.get('canvas') as Canvas;
    }

    this.fps = new FPS();
    this.timer = new Timer(() => {
      this.draw();
    });
  }

  /**
   * 启动
   */
  public start() {
    if (!this.c || !this.ctx) {
      this.createCanvas();
    }

    this.fps.start();
    this.timer.start();
  }

  /**
   * 停止
   */
  public stop() {
    this.fps.stop();

    this.timer.stop();

    this.c.parentNode.removeChild(this.c);
    this.c = undefined;
    this.ctx = undefined;
  }

  /**
   * 采集当前的一条数据数据
   */
  public collect(): Datum {
    const canvasDatum = collectCanvas(this.canvas);
    const plotDatum = collectPlot(this.plot);
    const fps = this.fps.sample();

    return Object.assign({}, canvasDatum, plotDatum, { fps });
  }

  private createCanvas() {
    this.c = document.createElement('canvas');
    const w = 200;
    const h = 36;
    this.c.setAttribute(
      'style',
      `position: fixed; bottom: 4px; left: 4px; width: ${w}px; height: ${h}px`,
    );
    this.c.width = w * RATIO;
    this.c.height = h * RATIO;

    document.body.appendChild(this.c);

    this.ctx = this.c.getContext('2d');

    // ctx 样式
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillStyle = 'black';

    this.ctx.font = `${FONT_SIZE * RATIO}px Menlo`;
    this.ctx.textBaseline = 'top';
  }

  private getDrawTexts(datum: Datum): string[] {
    return datum ? [
      `FPS| ${datum.fps.toFixed(3)}`,
      `G  | GSE ${datum.cGroup} / ${datum.cShape} / ${datum.cEvent}`,
      `G2 | VEE ${datum.pView} / ${datum.pElement} / ${datum.pEvent}`,
    ] : [ '', '', '' ];
  }

  // 绘制图形
  private draw() {
    // 采集一次数据
    const datum = this.collect();

    const texts = this.getDrawTexts(datum);

    this.ctx.clearRect(0, 0, this.c.width, this.c.height);

    // 两行文本的位置基本是固定的！
    this.ctx.fillText(texts[0], 2, 1);
    this.ctx.fillText(texts[1], 2, 1 + FONT_SIZE * RATIO + 2);
    this.ctx.fillText(texts[2], 2, 1 + FONT_SIZE * RATIO * 2 + 4);
  }
}
