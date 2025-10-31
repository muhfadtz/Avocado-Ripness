
# 🥑 Avocado Ripeness Classifier API

API ini digunakan untuk mendeteksi **tingkat kematangan buah alpukat** dari gambar menggunakan model Machine Learning.  
Dibangun dengan **Flask** dan mendukung **CORS**, sehingga mudah diintegrasikan dengan aplikasi web atau mobile.


## 🚀 Fitur Utama

* Prediksi kematangan alpukat (Belum Matang / Matang) dari gambar
* Preprocessing otomatis (resize, normalisasi, ekstraksi fitur)
* Dukungan feature extractor eksternal (misal PCA/Scaler)
* Respons cepat berbentuk JSON
* Siap digunakan di backend production


## 🧱 Struktur Folder

```text
project/
├── app.py                    # Main Flask API
├── model/
│   ├── model_alpukat.pkl     # Model klasifikasi utama
│   └── feature_extractor.pkl # (Opsional) Scaler/PCA untuk preprocessing
├── requirements.txt          # Daftar dependensi Python
└── README.md                 # Dokumentasi proyek
````


## ⚙️ Instalasi

### 1️⃣ Clone Repository

```bash
git clone https://github.com/username/avocado-ripeness-api.git
cd avocado-ripeness-api
```

### 2️⃣ Buat Virtual Environment

```bash
python -m venv venv
# Linux/Mac
source venv/bin/activate
# Windows
venv\Scripts\activate
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

## 📦 Jalankan Aplikasi

### 1️⃣ Pastikan Model Sudah Ada

Letakkan file berikut di folder `model/`:

* `model_alpukat.pkl`
* `feature_extractor.pkl` *(opsional)*

### 2️⃣ Jalankan Flask

```bash
python app.py
```

Aplikasi akan berjalan di:
👉 **[http://localhost:5000](http://localhost:5000)**


## 🌐 Endpoint

### 🔹 `GET /`

Cek status API.

**Response:**

```json
{
  "message": "🍈 Avocado Ripeness Recognition API is running!",
  "status": "OK"
}
```

### 🔹 `POST /predict`

Prediksi kematangan alpukat dari file gambar.

**Form Data:**

| Key  | Type                  | Deskripsi                           |
| :--- | :-------------------- | :---------------------------------- |
| file | File (image/jpeg/png) | Gambar alpukat yang akan diprediksi |

**Response (contoh):**

```json
{
  "label": "Matang",
  "confidence": 0.9735
}
```

**Error Response (contoh):**

```json
{
  "error": "Dimensi fitur tidak cocok",
  "expected": 150528,
  "received": 100000
}
```


## 🧠 Cara Kerja Singkat

1. Gambar diunggah ke endpoint `/predict`
2. Sistem melakukan:

   * Konversi ke RGB
   * Resize ke 224×224
   * Normalisasi & Flatten
   * (Opsional) Transformasi lewat feature extractor
3. Model ML memprediksi label
4. API mengembalikan hasil prediksi + confidence


## 🧰 Dependencies

```text
Flask
Flask-Cors
numpy
Pillow
joblib
scikit-learn
```

```

Jika mau, saya bisa buatkan **versi README yang lebih “eye-catching”** dengan **badge, screenshot, dan contoh curl request**, sehingga bisa langsung terlihat profesional seperti proyek open-source besar.  

Apakah mau saya buatkan versi itu juga?
```
