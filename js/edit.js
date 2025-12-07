// js/edit.js
import { db } from "./firebase.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ========================================
// CEK LOGIN (untuk Admin)
// ========================================
const raw = sessionStorage.getItem("user");
if (!raw) {
  alert("Harap login terlebih dahulu");
  window.location.href = "index.html";
}

const user = JSON.parse(raw);
if (user.role !== "admin") {
  alert("Akses halaman ini khusus admin");
  window.location.href = "index.html";
}

// ========================================
// AMBIL NIM DARI URL
// ========================================
const urlParams = new URLSearchParams(window.location.search);
const nim = urlParams.get("nim");

console.log("🔍 NIM dari URL:", nim);

if (!nim) {
  alert("NIM tidak ditemukan!");
  window.location.href = "admin-dashboard.html";
}

// Set NIM ke input (readonly/disabled)
document.getElementById("nim").value = nim;

// ========================================
// LOAD DATA MAHASISWA KE FORM
// ========================================
async function loadData() {
  try {
    console.log("📥 Mengambil data dari Firestore...");
    const refData = doc(db, "mahasiswa", nim);
    const snap = await getDoc(refData);

    if (!snap.exists()) {
      alert("Data mahasiswa tidak ditemukan!");
      window.location.href = "admin-dashboard.html";
      return;
    }

    const data = snap.data();
    console.log("📊 Data mahasiswa:", data);

    // ISI FORM DENGAN DATA DARI FIRESTORE
    document.getElementById("nama").value = data.nama || "";
    document.getElementById("tempat_lahir").value = data.tempatLahir || "";
    document.getElementById("tanggal_lahir").value = data.tanggalLahir || "";
    document.getElementById("jenis_kelamin").value = data.jenisKelamin || "";
    document.getElementById("jurusan").value = data.jurusan || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("alamat").value = data.alamat || "";
    document.getElementById("no_hp").value = data.noHp || "";
    document.getElementById("tahun_keluar").value = data.tahunKeluar || "";
    document.getElementById("judul_skripsi").value = data.judulSkripsi || "";
    document.getElementById("penguji_skripsi").value = data.pengujiSkripsi || "";
    document.getElementById("pekerjaan").value = data.pekerjaan || "";

    console.log("✅ Data berhasil dimuat ke form");

  } catch (error) {
    console.error("❌ Error saat load data:", error);
    alert("Gagal memuat data: " + error.message);
  }
}

// Jalankan fungsi load data
loadData();

// ========================================
// HANDLE SUBMIT FORM - UPDATE DATA
// ========================================
const editForm = document.getElementById("editForm");

editForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  console.log("🚀 Memulai proses update...");

  // KUMPULKAN DATA DARI FORM
  const dataUpdate = {
    nim: nim,
    nama: document.getElementById("nama").value.trim(),
    tempatLahir: document.getElementById("tempat_lahir").value.trim(),
    tanggalLahir: document.getElementById("tanggal_lahir").value,
    jenisKelamin: document.getElementById("jenis_kelamin").value,
    jurusan: document.getElementById("jurusan").value.trim(),
    email: document.getElementById("email").value.trim(),
    alamat: document.getElementById("alamat").value.trim(),
    noHp: document.getElementById("no_hp").value.trim(),
    tahunKeluar: document.getElementById("tahun_keluar").value.trim(),
    judulSkripsi: document.getElementById("judul_skripsi").value.trim(),
    pengujiSkripsi: document.getElementById("penguji_skripsi").value.trim(),
    pekerjaan: document.getElementById("pekerjaan").value.trim(),
  };

  console.log("📝 Data yang akan di-update:", dataUpdate);

  // UPDATE DATA KE FIRESTORE
  try {
    console.log("💾 Menyimpan data ke Firestore...");
    const refData = doc(db, "mahasiswa", nim);
    await updateDoc(refData, dataUpdate);
    
    console.log("✅ Data berhasil diupdate!");
    alert("Data mahasiswa berhasil diupdate!");
    
    // Redirect ke admin dashboard
    window.location.href = "admin-dashboard.html";
    
  } catch (error) {
    console.error("❌ Gagal update data:", error);
    alert("Gagal menyimpan perubahan: " + error.message);
  }
});

// ========================================
// TOMBOL BATAL
// ========================================
const btnBatal = document.getElementById("btnBatal");
btnBatal?.addEventListener("click", () => {
  window.location.href = "admin-dashboard.html";
});