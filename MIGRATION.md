# Migrasi dari IndexedDB ke MongoDB

Dokumentasi migrasi data dari IndexedDB (Dexie) ke MongoDB.

## Perubahan yang Dilakukan

### 1. Database Layer
- **MongoDB Connection**: `src/lib/mongodb.ts` - Utility untuk koneksi MongoDB
- **Models**: 
  - `src/lib/models/Peserta.ts` - Model MongoDB untuk Peserta
  - `src/lib/models/NodeAssignment.ts` - Model MongoDB untuk NodeAssignment

### 2. API Routes
Semua API routes berada di `src/app/api/`:
- `/api/peserta` - CRUD operations untuk Peserta
- `/api/peserta/[id]` - Get, Update, Delete Peserta by ID
- `/api/peserta/search` - Search Peserta
- `/api/peserta/bulk` - Bulk upsert Peserta
- `/api/peserta/count` - Count Peserta
- `/api/node-assignments` - CRUD operations untuk NodeAssignment
- `/api/node-assignments/[id]` - Delete NodeAssignment by ID

### 3. Data Access Layer
- **pesertaDB.ts**: Diupdate untuk menggunakan API routes instead of IndexedDB
- **nodeAssignmentsDB.ts**: File baru untuk handle NodeAssignment API calls

### 4. Hooks
- **usePesertaDB**: Diupdate untuk fetch data dari API dengan useState/useEffect
- **useBagan1Data**: Diupdate untuk fetch data dari API, menambahkan `refetch` function
- **useSearchPeserta**: Diupdate untuk menggunakan API search endpoint
- **usePesertaByGroup**: Diupdate untuk fetch dari API
- **usePesertaByStatus**: Diupdate untuk fetch dari API

### 5. Components
- **AssignPesertaModal**: Diupdate untuk menggunakan API routes, menambahkan `onAssignmentChange` callback

## Setup

1. Install dependencies (jika belum):
```bash
npm install mongoose
```

2. Setup MongoDB connection string di `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/the-blind-app
# atau untuk MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/the-blind-app
```

3. Pastikan MongoDB server berjalan (untuk local development):
```bash
# Untuk macOS/Linux dengan Homebrew:
brew services start mongodb-community

# Untuk Windows, jalankan MongoDB sebagai service atau:
mongod --dbpath="C:/data/db"
```

## Catatan Penting

1. **Data Migration**: Data yang ada di IndexedDB tidak otomatis dimigrasi ke MongoDB. Jika perlu, buat script migrasi untuk transfer data.

2. **Real-time Updates**: Karena menggunakan API routes, real-time updates dilakukan dengan:
   - Manual refetch setelah mutations
   - Polling (jika diperlukan di masa depan)

3. **Type Safety**: Types tetap menggunakan struktur yang sama, jadi tidak ada breaking changes pada type definitions.

4. **IndexedDB Code**: File `src/lib/db.ts` masih ada untuk menjaga backward compatibility dengan type imports, tapi Dexie code sudah dihapus.

## Testing

1. Pastikan MongoDB server berjalan
2. Jalankan aplikasi: `npm run dev`
3. Test semua fitur CRUD untuk Peserta dan NodeAssignment
4. Verify data tersimpan di MongoDB database

