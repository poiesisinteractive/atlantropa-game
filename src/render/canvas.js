import { GW_, GH_ } from '../core/geo.js';
const cv=document.getElementById('cv'), ctx=cv.getContext('2d');
const off=document.createElement('canvas'); off.width=GW_; off.height=GH_;
const octx=off.getContext('2d'); const img=octx.createImageData(GW_,GH_);
let view={z:1,ox:0,oy:0};
export { cv, ctx, off, octx, img, view };
