import { now } from './util';

const MAX = 60; // 最多采集最新的 60 帧时间
/**
 * FPS 采集
 */
export class FPS {
  private buffer: number[] = [];
  private raf: number;

  /**
   * 开始采集
   */
  start() {
    this.raf = window.requestAnimationFrame(() => {
      this.buffer.push(now());

      if (this.buffer.length > MAX) {
        this.buffer.shift();
      }

      this.start();
    });
  }

  stop() {
    window.cancelAnimationFrame(this.raf);
    this.buffer = [];
    this.raf = undefined;
  }

  /**
   * 采样
   */
  sample() {
    const min = this.buffer[0];
    const max = this.buffer[this.buffer.length - 1];

    const g = max - min;
    if (!g) return 60;
    return 1000 * (this.buffer.length - 1) / g;
  }
}
