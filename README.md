# Aquascape Planner / Journal

## 1. Mục tiêu dự án

Một web app cá nhân dùng để:

- Ghi chép quá trình setup và chăm sóc bể thủy sinh
- Theo dõi các mốc quan trọng theo thời gian (timeline)
- Phát hiện sớm các rủi ro (tảo, thiếu bảo trì…) bằng rule-based insight

Dự án được thiết kế để:

- Hoàn thành trong ~1 tuần (buổi tối 1–2h)
- Tập trung vào **kiến trúc + business logic**
- Phù hợp làm **portfolio project**

---

## 2. Core idea

Người chơi thủy sinh thường chăm bể dựa vào cảm tính:

- Không nhớ lần thay nước gần nhất
- Không rõ nguyên nhân tảo xuất hiện
- Điều chỉnh đèn / lọc / CO₂ thiếu cơ sở

→ App này giải quyết bằng **log + timeline + rule engine**  
→ Không dùng AI, chỉ dùng logic rõ ràng, dễ kiểm soát

---

## 3. Tính năng chính (MVP)

### 3.1 Tank (Bể)

- Tạo / xem danh sách bể
- Thông tin cơ bản:
  - Kích thước
  - Loại lọc
  - Đèn (giờ/ngày)
  - Có / không CO₂

### 3.2 Log (Nhật ký)

- Ghi log theo thời gian:
  - Thay nước (%)
  - Tỉa cây
  - Vệ sinh lọc
  - Vấn đề (tảo, lá úa…)

### 3.3 Timeline

- Hiển thị log theo trục thời gian
- Nhìn được tiến trình phát triển và sự cố

### 3.4 Insight (Rule-based)

Ví dụ:

- Đèn > 8h/ngày + không thay nước > 10 ngày → cảnh báo tảo
- Không vệ sinh lọc > 30 ngày → nhắc bảo trì
- Cây đỏ nhạt màu + ánh sáng thấp → gợi ý tăng sáng

---

## 4. Tech stack

- **React + TypeScript**
- **Vite**
- **Zustand** – state theo feature
- **TanStack Router** – file-based routing
- **shadcn/ui** – UI primitives
- **TailwindCSS**
- Storage: `localStorage` / `IndexedDB` (no backend)

---

## 5. Kiến trúc tổng thể

### 5.1 Nguyên tắc

- Feature-based architecture
- Mỗi feature tự quản lý:
  - model
  - store (zustand)
  - service
  - UI components
- Không có global mega-store
- Router chỉ làm nhiệm vụ orchestration

### 5.2 Cấu trúc thư mục

src/
├─ app/ # router, providers
├─ routes/ # tanstack router (entry point)
├─ features/
│ ├─ tank/
│ ├─ log/
│ └─ insight/
├─ shared/
│ ├─ ui/ # shadcn primitives
│ ├─ lib/
│ └─ hooks/
└─ main.tsx

---

## 6. Vai trò từng thư viện

### Zustand

- Mỗi feature = 1 store riêng
- Chỉ chứa business state
- Có thể persist

### TanStack Router

- Route = nơi ghép feature
- Không xử lý logic nghiệp vụ
- Dễ scale, type-safe

### shadcn/ui

- Chỉ dùng làm UI primitive (Button, Card, Dialog…)
- Không đặt component nghiệp vụ vào `shared/ui`

---

## 7. Quy tắc import

- `routes` → `features`, `shared`
- `features` → `shared`
- `shared` → không import ngược

---

## 8. Phạm vi phát triển

### Bắt buộc (1 tuần)

- CRUD Tank
- CRUD Log
- Timeline
- Rule-based Insight

### Nếu còn thời gian

- Export / Import JSON
- Dark mode
- Persist store
- README giải thích kiến trúc (file này)

---

## 9. Mục tiêu học được

- Thiết kế feature-based architecture thực tế
- Dùng Zustand đúng vai trò
- Tổ chức TanStack Router sạch
- Viết business logic tách khỏi UI

---

## 10. Ghi chú

- Đây là project cá nhân
- Không ưu tiên UI cầu kỳ
- Ưu tiên code clarity, ranh giới rõ ràng
