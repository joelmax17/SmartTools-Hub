import { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: false });

export default function VideoConverter() {
  const [file, setFile] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [info, setInfo] = useState("");
  const [convertType, setConvertType] = useState("mp4");
  const [processing, setProcessing] = useState(false);

  async function loadFFmpeg() {
    if (!loaded) {
      setInfo("Cargando motor de conversión...");
      await ffmpeg.load();
      setLoaded(true);
      setInfo("");
    }
  }

  async function onSelect(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setInfo("");
    await loadFFmpeg();
  }

  async function convert() {
    if (!file) return;
    setProcessing(true);
    setInfo("Procesando...");

    const inputName = file.name;
    const base = inputName.split(".")[0];
    const outputName = convertType === "mp4" ? `${base}.mp4` : `${base}.mp3`;

    ffmpeg.FS("writeFile", inputName, await fetchFile(file));

    let cmd;
    if (convertType === "mp4") {
      cmd = ["-i", inputName, "-c:v", "libx264", "-c:a", "aac", outputName];
    } else {
      cmd = ["-i", inputName, "-q:a", "2", "-map", "a", outputName];
    }

    try {
      await ffmpeg.run(...cmd);
      const data = ffmpeg.FS("readFile", outputName);
      const blob = new Blob([data.buffer], { type: convertType === "mp4" ? "video/mp4" : "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = outputName; a.click();
      setInfo(`Listo ✅ - Descargado ${outputName}`);
    } catch (err) {
      console.error(err);
      setInfo("❌ Error convirtiendo archivo");
    }
    setProcessing(false);
  }

  return (
    <div className="max-w-xl mx-auto bg-panel p-6 rounded-xl border border-[color:var(--line)]">
      <h2 className="text-2xl font-semibold mb-4">Video → MP4 / MP3</h2>
      <input type="file" accept="video/*" onChange={onSelect} className="w-full bg-[#11172b] border border-[color:var(--line)] p-2 rounded mb-3"/>
      {file && (<p className="text-sm mb-3">Archivo: <strong>{file.name}</strong></p>)}
      <label className="text-sm">Formato de salida:</label>
      <select value={convertType} onChange={(e)=>setConvertType(e.target.value)} className="w-full bg-[#11172b] border border-[color:var(--line)] p-2 rounded mb-3">
        <option value="mp4">MP4 (video)</option>
        <option value="mp3">MP3 (solo audio)</option>
      </select>
      <button disabled={!file || processing} onClick={convert} className="w-full bg-brand text-bg py-2 rounded font-bold disabled:opacity-40">
        {processing ? "Convirtiendo..." : "Convertir"}
      </button>
      {info && <p className="text-center mt-2 text-sm">{info}</p>}
    </div>
  );
}
