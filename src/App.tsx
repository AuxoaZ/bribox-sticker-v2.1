import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  DarkThemeToggle,
  TextInput,
  Label,
  Textarea,
  Spinner,
  Tooltip
} from "flowbite-react";
import { useState, useRef } from "react";
import generatePDF from "react-to-pdf";
import { CloudDownload, Info, SquareCheckBig, Trash2 } from "lucide-react";
import logo from "../public/img/bribox.png";
import bit from "../public/img/bit-logo.png";

export function App() {
  const [uker, setUker] = useState("");
  const [asset, setAsset] = useState("");
  const [loading, setLoading] = useState(false);
  const [printedAssets, setPrintedAssets] = useState<string[]>([]);
  const targetRef = useRef<HTMLDivElement>(null);

  const getCurrentYear = () => new Date().getFullYear();

  const handlePrint = () => {
    if (!asset.trim()) {
      alert("Isi dulu cuy!");
      return;
    }
    const data = asset.split("\n").map((item) => item.trim()).filter(Boolean);
    setPrintedAssets(data);
  };

  const handleDownload = () => {
    if (printedAssets.length === 0) {
      alert("Belum ada data yang di-publish!");
      return;
    }
    setLoading(true);
    generatePDF(targetRef, {
      filename: `Sticker ${uker}.pdf`,
      page: { margin: { top: 0.5, bottom: 0, left: 0, right: 0 } },
    })
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  const handleReset = () => {
    window.location.reload();
  };

  const fixTotalPages = () => {
    const perPage = 14;
    return printedAssets.length === 0
      ? 0
      : Math.ceil(printedAssets.length / 4 / perPage);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-800 sticky w-full px-2">
        <Navbar fluid rounded className="md:mx-40 lg:mx-80">
          <NavbarBrand>
            <img src={logo} className="mr-3 h-6 sm:h-9" alt="Bribox Logo" />
            <span className="self-center whitespace-nowrap text-md md:text-xl font-semibold dark:text-white">
              Bribox
            </span>
          </NavbarBrand>
          <div className="flex">
            <NavbarToggle />
          </div>
          <NavbarCollapse>
            <DarkThemeToggle />
            <Tooltip content="Made with ❤ by Alvian Nugroho">
              <Info className="mt-2 text-slate-400" style={{ cursor: "pointer" }} />
            </Tooltip>
          </NavbarCollapse>
        </Navbar>
      </nav>

      {/* Main Content */}
      <main className="bg-slate-300 dark:bg-slate-700 px-3">
        <div className="max-w-2xl mt-10 bg-white py-3 mx-auto dark:bg-slate-800 rounded-lg">
          <div className="flex justify-center mt-2">
            <p className="text-base text-center md:text-2xl dark:text-white">
              Asset Sticker Generator V.2
            </p>
          </div>

          {/* Nama Uker */}
          <div className="px-7 lg:px-14 mt-10">
            <div className="mb-2 block">
              <Label htmlFor="base" value="Nama Uker" />
            </div>
            <TextInput
              id="base"
              type="text"
              sizing="md"
              value={uker}
              onChange={(e) => setUker(e.target.value)}
            />
          </div>

          {/* Masukkan Asset */}
          <div className="px-7 lg:px-14 mt-5">
            <div className="mb-2 block">
              <Label htmlFor="comment" value="Masukkan Asset" />
            </div>
            <Textarea
              id="comment"
              required
              rows={10}
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
            />
          </div>

          {/* Tombol Aksi */}
          <div className="px-2 lg:px-24 mt-10 mb-3 grid grid-cols-2 lg:grid-cols-3 gap-3">
            <Button pill onClick={handlePrint}>
              <div className="flex">
                <SquareCheckBig className="mr-2" />
                <span>Publish</span>
              </div>
            </Button>
            <Button pill onClick={handleDownload}>
              {loading ? (
                <div className="flex">
                  <Spinner />
                  <span className="pl-3 text-slate-50">Tunggu coy...</span>
                </div>
              ) : (
                <div className="flex">
                  <CloudDownload className="mr-2" />
                  <span>Download</span>
                </div>
              )}
            </Button>
            <Button color="failure" pill onClick={handleReset}>
              <div className="flex">
                <Trash2 className="mr-2" />
                <span>Delete</span>
              </div>
            </Button>
          </div>

          {/* Ringkasan */}
          {printedAssets.length > 0 && (
            <div className="mt-5 flex justify-center">
              <div className="flex flex-col">
                <p className="text-slate-950 dark:text-slate-50">
                  Jumlah Asset: {printedAssets.length}
                </p>
                <p className="text-slate-950 dark:text-slate-50">
                  Jumlah Halaman: {fixTotalPages()}
                </p>
              </div>
            </div>
          )}
        </div>


<div className="w-full overflow-x-auto  mt-5 grid justify-items-center ">
  <div className="grid grid-cols-4 gap-0 w-max ">
    {printedAssets.map((element, index) => {
      const qrcode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${element}`;
      return (
        <div
          key={index}
          className="border p-2 flex flex-row items-center justify-start w-[300px] h-[120px] bg-white"
        >
          {/* QR CODE */}
          <img
            src={qrcode}
            alt="QR Code"
            className="h-full w-auto object-contain p-3"
            crossOrigin="anonymous"
          />

          {/* INFO */}
          <div className="flex flex-col text-center ml-4">
            <img
              src={bit}
              alt="Logo"
              className="w-36"
            />
            <p className="text-[12px] leading-tight">081222006261</p>
            <p className="text-[12px] leading-tight">bribox.zona2@corp.bri.co.id</p>
            <p className="text-[12px] leading-tight">{getCurrentYear()}</p>
            <p className="text-[12px] leading-tight">{element}</p>
          </div>
        </div>
      );
    })}
  </div>
</div>
        {/* Grid Preview */}
<div className="absolute left-[-9999px]">
<div className="w-full overflow-x-auto bg-white mt-5" ref={targetRef}>
  <div className="grid grid-cols-4 gap-0 w-max">
    {printedAssets.map((element, index) => {
      const qrcode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${element}`;
      return (
        <div
          key={index}
          className="border p-2 flex flex-row items-center justify-start w-[300px] h-[121px]"
        >
          {/* QR CODE */}
          <img
            src={qrcode}
            alt="QR Code"
            className="h-full w-auto object-contain p-3"
            crossOrigin="anonymous"
          />

          {/* INFO */}
          <div className="flex flex-col text-center ml-4">
            <img
              src={bit}
              alt="Logo"
              className="w-36"
            />
            <p className="text-[12px] leading-tight">081222006261</p>
            <p className="text-[12px] leading-tight">bribox.zona2@corp.bri.co.id</p>
            <p className="text-[12px] leading-tight">{getCurrentYear()}</p>
            <p className="text-[12px] leading-tight">{element}</p>
          </div>
        </div>
      );
    })}
  </div>
</div>
</div>




      </main>
    </div>
  );
}

export default App;
