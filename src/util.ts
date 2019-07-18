import { CanvasDatum, PlotDatum, Canvas, Plot, Group, View } from './interface';

const clock = typeof performance === 'object' && performance.now ? performance : Date;

/**
 * 收集 canvas 事件数、group、shape 数量
 * @param canvas
 */
export const collectCanvas = (canvas: Canvas): CanvasDatum => {
  const data: CanvasDatum = {
    cEvent: 0,
    cGroup: 0,
    cShape: 0,
  };

  // 分别处理，并计数
  const loop = (node: Group) => {
    if (!node) return;

    if (node.isGroup) {
      data.cGroup ++;
    } else {
      data.cShape ++;
    }
    data.cEvent += Object.keys(node.getEvents()).length;

    const children = node.get('children');
    if (Array.isArray(children)) {
      children.forEach(loop);
    }
  };

  loop(canvas);

  return data;
};

/**
 * 收集事件数、view、element 数量
 * @param plot
 */
export const collectPlot = (plot: Plot): PlotDatum => {
  const data = {
    pEvent: 0,
    pView: 0,
    pElement: 0,
  };

  // 分别处理，并计数
  const loop = (node: View) => {
    if (!node) return;

    const elements = node.get('elements') || [];

    data.pView ++;
    data.pEvent += Object.keys(node.getEvents()).length;
    data.pElement += elements.length;

    const views = node.get('views');
    if (Array.isArray(views)) {
      views.forEach(loop);
    }
  };

  loop(plot);

  return data;
};

/**
 * 当前时间
 */
export const now = () => {
  return clock.now();
};
