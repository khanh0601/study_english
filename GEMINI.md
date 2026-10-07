# Agent Instructions & Guidelines

Mỗi khi thực hiện bất kỳ công việc nào trong dự án này (lập kế hoạch, triển khai code, chỉnh sửa UI/UX, sửa lỗi, refactor, viết test, thiết kế database, v.v.), Agent **BẮT BUỘC** phải đọc và tuân thủ chặt chẽ 2 tài liệu sau trước khi hành động:

1. **`design.md`** ([design.md](file:///Users/kelvin/Desktop/study-english/design.md))
   - **Mục đích:** Nguồn chân lý duy nhất (Single Source of Truth) cho visual design, UI consistency, hệ thống màu sắc (semantic tokens), typography, layout, spacing và component states.
   - **Định hướng thiết kế:** *Monochrome / Minimal / Calm / Focused* (Next.js, Tailwind CSS, shadcn/ui, Lucide icons).
   - **Quy tắc quan trọng:** Tuyệt đối không dùng gradient rực rỡ, glassmorphism, hiệu ứng 3D lòe loẹt hay emoji làm icon chính; tuân thủ bảng màu đơn sắc grayscale với màu sắc chức năng semantic rõ ràng.

2. **`english-learning-webapp.md`** ([english-learning-webapp.md](file:///Users/kelvin/Desktop/study-english/english-learning-webapp.md))
   - **Mục đích:** Nguồn chân lý duy nhất cho ý tưởng sản phẩm, luồng nghiệp vụ học tiếng Anh qua câu, đối tượng người dùng, tính năng chi tiết, kiến trúc hệ thống và technical specification (Next.js Fullstack, Neon PostgreSQL, Gemini API, Vercel Hobby).
   - **Quy tắc quan trọng:** Bám sát technical decisions, data model, các loại bài tập (dịch, sắp xếp câu, điền từ, nghe - chép, AI feedback), lộ trình triển khai và API specifications đã được thống nhất.

---

## Bắt buộc trong quy trình làm việc (Mandatory Workflow)

- **Bước 1 — Đọc tài liệu:** Trước khi viết code hay đề xuất giải pháp, luôn kiểm tra và đọc nội dung liên quan trong cả 2 file `design.md` và `english-learning-webapp.md`.
- **Bước 2 — Đối chiếu & Tuân thủ:**
  - Logic nghiệp vụ & kỹ thuật phải khớp với `english-learning-webapp.md`.
  - Giao diện và mã nguồn frontend/CSS phải tuân thủ chuẩn trong `design.md`.
- **Bước 3 — Tính nhất quán:** Không tự ý thay đổi stack công nghệ, palette màu hoặc kiến trúc trừ khi có yêu cầu rõ ràng từ người dùng.
