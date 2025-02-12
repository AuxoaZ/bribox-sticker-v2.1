import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle, DarkThemeToggle, TextInput, Label, Tooltip, Textarea, Spinner } from "flowbite-react";
import { useState, useRef } from "react";
import generatePDF from 'react-to-pdf';
import { CloudDownload, Info, SquareCheckBig, Trash2 } from "lucide-react";
import logo from "../public/img/bribox.png";
import bit from "../public/img/bit-logo.png";


export function App() {
  const [uker, setUker] = useState<string>('');
  const [asset, setAsset] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // State untuk loading
  const [show, setShow] = useState<boolean>(false)
  const [totalRows, setTotalRows] = useState<number>(0)
  const targetRef = useRef<HTMLTableElement>(null);

  const getCurrentYear = () => new Date().getFullYear();

  

  const handlePrint = () => {
    const data = asset.split('\n');
    const table = document.getElementById("myTable") as HTMLTableElement;
    let rowIndex = 0;
    let colIndex = 0;
    let dataCounter = 0; // Menghitung hanya baris yang berisi data

    if (data.length > 0 && asset.trim()) {
        setShow(true);

        data.forEach((element) => {
            // Tambahkan baris kosong setelah 15 baris data
            if (dataCounter > 0 && dataCounter % 15 === 0 && colIndex === 0) {
                const emptyRow = table.insertRow(rowIndex++);
                const emptyCell = emptyRow.insertCell(0);
                emptyCell.colSpan = 4;
                emptyCell.innerHTML = `<div style="height: 55px; background: transparent; border: none;"></div>`;
            }

            // Menambahkan data ke dalam tabel
            let row;
            if (table.rows[rowIndex]) {
                row = table.rows[rowIndex];
            } else {
                row = table.insertRow(rowIndex);
            }

            const cell = row.insertCell(colIndex);
            const qrcode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${element}`;

            cell.innerHTML = `
                <div class="bg-white flex flex-row justify-between">
                    <div class="py-4 px-5 flex justify-center">
                        <img src="${qrcode}" alt="QR Code" width="80px" crossOrigin="anonymous" />
                    </div>
                    <div class="py-2 px-5 text-center">
                        <img src=${bit} alt="Logo" width="120px" class="ml-2" />
                        <p class="text-xs">081222006261</p>
                        <p class="text-xs">bribox.zona2@corp.bri.co.id</p>
                        <p class="text-xs">${getCurrentYear()}</p>
                        <p class="text-xs">${element}</p>
                    </div>
                </div>`;

            colIndex++;
            if (colIndex === 4) {
                rowIndex++;
                colIndex = 0;
                dataCounter++; // Hanya naik jika satu baris penuh (4 kolom)
            }
        });

        setTotalRows(table.rows.length);
    } else {
        alert("Isi dulu cuy!");
    }
};




  const handleReset = () => {
    window.location.reload();
  };

  const handleDownload = () => {

    if (asset.split('\n').length > 0 && asset.trim()){
    setLoading(true); // Set loading ke true saat proses dimulai
    generatePDF(targetRef, {
          filename: `Sticker ${uker}.pdf`,
      page: {
        margin: { top: 0, bottom: 0, left: 0, right: 0 }
      }
    })
      .then(() => {  
        setLoading(false); // Set loading ke false setelah proses selesai
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        setLoading(false); // Set loading ke false jika terjadi error
      });
    }else {
      alert("Isi dulu cuy!")
    }
  };

  const fixTotalRows = () => {

      if (totalRows/15 < 1) {
          return 1; // Jika angka kurang dari 1, kembalikan 1
      } else {
          return Math.ceil(totalRows/15); // Jika angka 1 atau lebih, bulatkan ke atas
      }
  }
  


  return (
    <div>
      <nav className="bg-white dark:bg-slate-800 sticky w-full">
        <Navbar fluid rounded className="md:mx-40 lg:mx-80">
          <NavbarBrand>
            <img src={logo} className="mr-3 h-6 sm:h-9" alt="Bribox Logo" />
            <span className="self-center whitespace-nowrap text-md md:text-xl font-semibold dark:text-white">Bribox</span>
          </NavbarBrand>
          <div className="flex">
            <NavbarToggle />
          </div>
          <NavbarCollapse >
            <DarkThemeToggle />
            <Tooltip content="Made with ❤ by Alvian Nugroho" >
              <Info className="mt-2 text-slate-400" style={{cursor:'pointer'}} />
           </Tooltip>
          </NavbarCollapse>
        </Navbar>
      </nav>
      <main className="bg-slate-300 dark:bg-slate-700 ">
        <div className="max-w-2xl mt-10 bg-white py-3 mx-auto dark:bg-slate-800 rounded-lg">
          <div className="flex justify-center mt-2">
            <p className="text-base text-center md:text-2xl dark:text-white">
              {/* Sekarang 1000 lembar juga bisa :P */}
              Asset Sticker Generator V.2
            </p>
          </div>
          <div className="px-14 mt-10">
            <div className="mb-2 block">
              <Label htmlFor="base" value="Nama Uker" />
            </div>
            <TextInput id="base" type="text" sizing="md" onChange={(e) => setUker(e.target.value)} />
          </div>
          <div className="px-14 mt-5">
            <div className="mb-2 block">
              <Label htmlFor="comment" value="Masukkan Asset" />
            </div>
            <Textarea id="comment" required rows={10} onChange={(e) => setAsset(e.target.value)} />
          </div>
          <div className="px-24 mt-10 mb-3 flex justify-around">
            <Button pill onClick={handlePrint}><div className="flex"> <SquareCheckBig className="mr-2" /> <span>Publish</span></div></Button>
            <Button pill onClick={handleDownload}>
            
              {loading ? <div><Spinner/> <span className="pl-3 text-slate-50">Tunggu coy...</span></div> : <div className="flex"> <CloudDownload className="mr-2" /> <span>Download</span></div> }
            </Button>
            <Button color="failure" pill onClick={handleReset}><div className="flex"> <Trash2 className="mr-2" /> <span>Delete</span></div></Button>
          </div>
          {show &&
            <div className="mt-5 flex  justify-center">
            <div className="flex flex-col">
              <p className="text-slate-950 dark:text-slate-50" >Jumlah Asset: {asset.split('\n').length}</p>
              <p className="text-slate-950 dark:text-slate-50">Jumlah Halaman: {fixTotalRows()}</p>
            </div>
          </div>
          }

        </div>
        <div className="mt-5 ">
          <div className="w-full overflow-x-auto flex  justify-center">
            <table id="myTable" className="bg-white" ref={targetRef}>
              <thead></thead>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
