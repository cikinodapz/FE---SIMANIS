import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const BiodataPage = () => {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    namaPanggilan: "",
    tempatTanggalLahir: "",
    anakKe: "",
    asalSekolah: "",
    jurusan: "",
    ipk: "",
    namaIbu: "",
    pekerjaanIbu: "",
    namaAyah: "",
    pekerjaanAyah: "",
    agama: "",
    nomorHp: "",
    alamatRumah: "",
    alamatSekolah: "",
    riwayatPendidikanSD: "",
    tahunLulusSD: "",
    tempatSD: "",
    alasanMagang: "",
    jadwalMagang: "",
    keterampilan: "",
    unitMagang: "",
  });

  const [isDataCorrect, setIsDataCorrect] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setIsDataCorrect(e.target.checked);
  };

  const handleSubmit = () => {
    console.log("Data yang dikirim: ", formData);
    alert("Data biodata berhasil disimpan!");
  };

  return (
    <div className="flex shadow max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] h-full w-full">
        <Navbar />
        <div className="p-[100px]">
        <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            <h1 className="text-blue-premier text-3xl font-bold">Formulir Biodata</h1>
            <p className="text-sm text-gray-500">Biodata</p>

            <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-10">
              <Input
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                label="Nama Lengkap"
              />
              <Input
                name="namaPanggilan"
                value={formData.namaPanggilan}
                onChange={handleChange}
                placeholder="Masukkan nama panggilan"
                label="Nama Panggilan"
              />
              <Input
                name="tempatTanggalLahir"
                value={formData.tempatTanggalLahir}
                onChange={handleChange}
                placeholder="Contoh: Padang, 29 Februari 2004"
                label="Tempat, Tanggal Lahir"
              />
              <Input
                name="anakKe"
                value={formData.anakKe}
                onChange={handleChange}
                placeholder="Contoh: 2 dari 3 bersaudara"
                label="Anak-Ke"
              />
              <Input
                name="asalSekolah"
                value={formData.asalSekolah}
                onChange={handleChange}
                placeholder="Masukkan asal sekolah/universitas"
                label="Institusi"
              />
              <Input
                name="jurusan"
                value={formData.jurusan}
                onChange={handleChange}
                placeholder="Masukkan jurusan"
                label="Jurusan"
              />
              <Input
                name="ipk"
                value={formData.ipk}
                onChange={handleChange}
                placeholder="Contoh: 3.85"
                label="Indeks Prestasi"
              />
              <Input
                name="namaIbu"
                value={formData.namaIbu}
                onChange={handleChange}
                placeholder="Masukkan nama ibu"
                label="Nama Ibu"
              />
              <Input
                name="pekerjaanIbu"
                value={formData.pekerjaanIbu}
                onChange={handleChange}
                placeholder="Masukkan pekerjaan ibu"
                label="Pekerjaan Ibu"
              />
              <Input
                name="namaAyah"
                value={formData.namaAyah}
                onChange={handleChange}
                placeholder="Masukkan nama ayah"
                label="Nama Ayah"
              />
              <Input
                name="pekerjaanAyah"
                value={formData.pekerjaanAyah}
                onChange={handleChange}
                placeholder="Masukkan pekerjaan ayah"
                label="Pekerjaan Ayah"
              />
              <Input
                name="agama"
                value={formData.agama}
                onChange={handleChange}
                placeholder="Masukkan agama"
                label="Agama"
              />
              <Input
                name="nomorHp"
                value={formData.nomorHp}
                onChange={handleChange}
                placeholder="Masukkan nomor HP"
                label="Nomor Handphone"
              />
              <Input
                name="alamatRumah"
                value={formData.alamatRumah}
                onChange={handleChange}
                placeholder="Masukkan alamat rumah"
                label="Alamat Rumah"
              />
              <Input
                name="alamatSekolah"
                value={formData.alamatSekolah}
                onChange={handleChange}
                placeholder="Masukkan alamat sekolah/universitas"
                label="Alamat Domisili"
              />
              <Input
                name="riwayatPendidikanSD"
                value={formData.riwayatPendidikanSD}
                onChange={handleChange}
                placeholder="Masukkan riwayat pendidikan SD"
                label="Pendidikan SD"
              />
              <Input
                name="tahunLulusSD"
                value={formData.tahunLulusSD}
                onChange={handleChange}
                placeholder="Masukkan tahun lulus SD"
                label="Tahun Tamat"
              />
              <Input
                name="tempatSD"
                value={formData.tempatSD}
                onChange={handleChange}
                placeholder="Masukkan tempat SD"
                label="xxx"
              />
              <Input
                name="alasanMagang"
                value={formData.alasanMagang}
                onChange={handleChange}
                placeholder="Masukkan alasan magang"
                label="Alasan Magang"
              />
              <Input
                name="jadwalMagang"
                value={formData.jadwalMagang}
                onChange={handleChange}
                placeholder="Masukkan jadwal magang"
                label="Jadwal Magang"
              />
              <Input
                name="keterampilan"
                value={formData.keterampilan}
                onChange={handleChange}
                placeholder="Masukkan keterampilan"
                label="Keterampilan"
              />
              <Input
                name="unitMagang"
                value={formData.unitMagang}
                onChange={handleChange}
                placeholder="Masukkan unit magang"
                label="Unit Magang"
              />
              <div className="col-span-2 mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isDataCorrect}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  Saya menyatakan bahwa data yang diisi adalah benar.
                </label>
              </div>

              <div className="col-span-2 text-center mt-6 flex justify-center">
                <Button onClick={handleSubmit} type="button" disabled={!isDataCorrect}>
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiodataPage;
