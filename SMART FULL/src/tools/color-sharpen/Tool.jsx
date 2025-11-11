import { useState, useRef, useEffect } from "react";
export default function ColorSharpen() {
  const [file, setFile] = useState(null);
  const [imgURL, setImgURL] = useState("");
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [sharpen, setSharpen] = useState(0);
  const [info, setInfo] = useState("");

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  function onSelect(e){ const f=e.target.files[0]; if(!f) return; setFile(f); setInfo(""); setImgURL(URL.createObjectURL(f)); }

  useEffect(()=>{
    if(!imgRef.current||!canvasRef.current) return;
    const img=imgRef.current; const canvas=canvasRef.current; const ctx=canvas.getContext("2d",{willReadFrequently:true});
    img.onload=()=>{
      canvas.width=img.naturalWidth; canvas.height=img.naturalHeight;
      ctx.filter=`brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;
      ctx.drawImage(img,0,0);
      if(sharpen>0) applySharpen(ctx,canvas,sharpen);
    };
  },[imgURL,brightness,contrast,saturation,sharpen]);

  function applySharpen(ctx, canvas, level){
    const weights = level===1 ? [0,-1,0,-1,5,-1,0,-1,0] : [-1,-1,-1,-1,9,-1,-1,-1,-1];
    const side=3, half=1;
    const src=ctx.getImageData(0,0,canvas.width,canvas.height);
    const dst=ctx.createImageData(canvas.width,canvas.height);
    const sw=src.width, sh=src.height, s=src.data, d=dst.data;
    for(let y=0;y<sh;y++){ for(let x=0;x<sw;x++){
      let r=0,g=0,b=0;
      for(let cy=0;cy<side;cy++){ for(let cx=0;cx<side;cx++){
        const scy=y+cy-half, scx=x+cx-half;
        if(scy>=0&&scy<sh&&scx>=0&&scx<sw){ const off=(scy*sw+scx)*4; const wt=weights[cy*side+cx]; r+=s[off]*wt; g+=s[off+1]*wt; b+=s[off+2]*wt; }
      }}
      const doff=(y*sw+x)*4;
      d[doff]=Math.min(Math.max(r,0),255); d[doff+1]=Math.min(Math.max(g,0),255); d[doff+2]=Math.min(Math.max(b,0),255); d[doff+3]=255;
    }}
    ctx.putImageData(dst,0,0);
  }

  function exportImg(){ if(!canvasRef.current) return; const url=canvasRef.current.toDataURL("image/png"); const a=document.createElement("a"); a.href=url; a.download="mejorada.png"; a.click(); setInfo("Listo ✅ — Imagen descargada"); }

  return (<div className="max-w-xl mx-auto bg-panel p-6 rounded-xl border border-[color:var(--line)]">
    <h2 className="text-2xl font-semibold mb-4">Color Boost + Nitidez Pro</h2>
    <input type="file" accept="image/*" onChange={onSelect} className="w-full bg-[#11172b] border border-[color:var(--line)] p-2 rounded mb-3"/>
    {imgURL && (<div className="text-center">
      <img ref={imgRef} src={imgURL} alt="prev" className="hidden"/>
      <canvas ref={canvasRef} className="max-w-full max-h-80 mx-auto rounded bg-[#11172b] p-2"/>
      <div className="mt-4">
        <label className="text-sm">Brillo</label><input type="range" min="0.5" max="2" step="0.05" value={brightness} onChange={(e)=>setBrightness(e.target.value)} className="w-full"/>
        <label className="text-sm">Contraste</label><input type="range" min="0.5" max="2" step="0.05" value={contrast} onChange={(e)=>setContrast(e.target.value)} className="w-full"/>
        <label className="text-sm">Saturación</label><input type="range" min="0" max="3" step="0.1" value={saturation} onChange={(e)=>setSaturation(e.target.value)} className="w-full"/>
        <label className="text-sm">Nitidez</label>
        <select value={sharpen} onChange={(e)=>setSharpen(Number(e.target.value))} className="w-full bg-[#11172b] border border-[color:var(--line)] p-2 rounded mt-2">
          <option value={0}>Sin nitidez</option><option value={1}>Suave</option><option value={2}>Fuerte</option>
        </select>
      </div>
      <button onClick={exportImg} className="w-full bg-brand text-bg py-2 rounded font-bold mt-4">Exportar</button>
      {info && <p className="text-center text-sm mt-2">{info}</p>}
    </div>)}
  </div>);
}
