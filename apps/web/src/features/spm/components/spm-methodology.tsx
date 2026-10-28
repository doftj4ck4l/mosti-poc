import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export function SpmMethodology() {
  return (
    <Alert>
      <Info className='size-4' />
      <AlertTitle>Kaedah &amp; Nota Data SPM</AlertTitle>
      <AlertDescription>
        <ul className='mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed'>
          <li>
            <span className='font-medium text-foreground'>GPMP / GPN / GPK</span> — nilai gred
            purata yang lebih kecil menunjukkan pencapaian yang lebih baik (skala 0.00–9.00).
          </li>
          <li>
            <span className='font-medium text-foreground'>2021</span> — ditanda sebagai perubahan
            konteks: kohort pertama KSSM dan gangguan pandemik. Perbandingan sebelum/selepas 2021
            perlu dibaca dengan berhati-hati.
          </li>
          <li>
            <span className='font-medium text-foreground'>Bilangan outcome calon</span> — bilangan
            gagal dan sekurang-kurangnya kepujian ialah anggaran daripada peratusan yang dilaporkan
            × bilangan calon menduduki; peratusan dibundarkan.
          </li>
          <li>
            <span className='font-medium text-foreground'>Penyertaan</span> — “calon menduduki”
            ialah bilangan yang mengambil peperiksaan bagi mata pelajaran tersebut; ia bukan
            enrolmen mata pelajaran.
          </li>
          <li>
            <span className='font-medium text-foreground'>Sumber</span> — Laporan Analisis Keputusan
            SPM 2018–2025, Lembaga Peperiksaan, Kementerian Pendidikan Malaysia. Rujukan halaman
            bagi setiap angka tersedia dalam katalog sumber data.
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  )
}
