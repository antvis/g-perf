
export interface CanvasDatum {
  cEvent: number;
  cGroup: number;
  cShape: number;
}

export interface PlotDatum {
  pEvent: number;
  pView: number;
  pElement: number;
}

export interface FPSDatum {
  fps: number;
}

export interface Datum extends CanvasDatum, PlotDatum, FPSDatum {

}

export interface Base {
  readonly get: (key: string) => any;
  readonly getEvents: () => object;
}

export interface View extends Base {

}

export interface Plot extends View {
}

export interface Group extends Base {
  readonly isGroup: boolean;
}

export interface Canvas extends Group {
}
