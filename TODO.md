# TODO & Feature Roadmap — SentenceLab

> Tài liệu tổng hợp các hạng mục nâng cấp chất lượng học tập tiếp theo cho **SentenceLab**, đối chiếu chặt chẽ với [design.md](file:///Users/kelvin/Desktop/study-english/design.md) (chuẩn Monochrome/Minimalist) và [english-learning-webapp.md](file:///Users/kelvin/Desktop/study-english/english-learning-webapp.md) (nghiệp vụ học tiếng Anh qua câu).

---

## 1. Danh sách tính năng ưu tiên (Feature Checklist)

### 🎧 Hạng mục 1: Tích hợp Âm thanh (Audio TTS) & Luyện Nghe - Chép chính tả (Dictation) [HOÀN THÀNH ✓]
- [x] **Nút phát âm thanh (Audio Pronunciation Player):**
  - Tích hợp icon Loa (`Volume2` từ Lucide) bên cạnh câu mẫu tiếng Anh, câu gợi ý và câu sửa của AI.
  - Hỗ trợ 2 tốc độ: `1.0x` (tốc độ tự nhiên bản xứ) và `0.8x` (tốc độ chậm để nghe rõ đuôi `-ed`, `-s`, nối âm).
  - Có trạng thái visual subtle khi đang phát (`animate-pulse` nhẹ nhàng trên icon).
  - Đã tích hợp vào: Bài tập, Lý thuyết câu mẫu, Flashcard Ôn tập (`/review`), và Kho cụm từ (`/vocabulary`).
- [x] **Dạng bài tập Nghe & Chép lại câu (Listening & Dictation Mode):**
  - Đã thêm chế độ bài tập **Listening & Dictation** trực tiếp trong trang luyện bài.
  - Người học nghe audio câu tiếng Anh rồi gõ lại câu hoàn chỉnh, hỗ trợ nghe lại nhiều lần ở tốc độ 1.0x và 0.8x.
- [x] **Chế độ Luyện nói nhại âm (Voice Shadowing Mode):**
  - Nghe người bản xứ phát âm, click nút Mic để nói nhại lại theo ngữ điệu.
  - Nhận diện giọng nói thời gian thực và đo độ khớp phát âm (% match score).
- [x] **Nhập câu trả lời bằng giọng nói (Voice Input):**
  - Nút Microphone ngay trên ô nhập liệu cho phép nói câu dịch tiếng Anh thay vì chỉ gõ bàn phím.

### 🎯 Hạng mục 2: Chế độ Luyện tập lại từ Sổ tay lỗi sai (Practice My Mistakes) [HOÀN THÀNH ✓]
- [x] **Nút "Luyện tập lại các câu sai" trong Sổ tay lỗi sai (`/mistakes`):**
  - Khởi động phiên luyện tập tập trung (Practice Runner) dành riêng cho các câu sai.
  - Hiển thị lại câu tiếng Việt, nhắc lại lỗi sai trước đây (`Past Error`) kèm giải thích.
  - Tích hợp nút nghe phát âm câu chuẩn và nút Mic để nói hoặc gõ câu sửa.
  - Khi AI chấm điểm đạt từ **85 điểm trở lên**, câu tự động được đánh dấu **"Đã khắc phục hoàn toàn" (Mastered ✓)**.
  - Phân loại tab thông minh: `Cần luyện tập (Needs Practice)` | `Đã khắc phục (Mastered)` | `Tất cả (All)`.
  - Hỗ trợ nút luyện tập nhanh cho từng câu riêng lẻ (`Practice this sentence`).

### 🧩 Hạng mục 3: Đa dạng hóa loại bài tập (Sentence Builder & Fill in the Blank) [HOÀN THÀNH ✓]
- [x] **Sắp xếp từ thành câu (Sentence Builder):**
  - Hiển thị các khối từ gợi ý xáo trộn (`[I]`, `[usually]`, `[work]`, `[from]`, `[home]`) kèm các từ gây nhiễu thực tế (distractors).
  - Tương tác chạm/click trực quan, hỗ trợ Undo và Clear nhanh chóng, tối ưu hoàn hảo cho cả thiết bị di động và desktop.
  - Tự động so khớp chuẩn hóa với câu mẫu bản xứ, tích hợp phát âm câu hoàn chỉnh (`1.0x` và `0.8x`).
- [x] **Điền vào chỗ trống (Fill in the Blank / Cloze Test):**
  - Hiển thị câu tiếng Anh với chỗ khuyết `___` và 4 lựa chọn trắc nghiệm A, B, C, D rõ ràng.
  - Điền giới từ, thì động từ, thể bị động, liên từ phụ thuộc và các collocations quan trọng.
  - Cung cấp giải thích ngữ pháp song ngữ (VI & EN) chuyên sâu ngay sau khi trả lời, giải thích tại sao đáp án đúng và phân tích sắc thái.

### 🤖 Hạng mục 4: AI sinh bài tập theo tình huống cá nhân (Custom Scenario Generator) [HOÀN THÀNH ✓]
- [x] **Khung tạo bài học tức thì (On-demand Lesson Generator):**
  - Đã tích hợp khối AI Scenario Generator trực quan ngay trên trang Khám phá bài học (`/learn`).
  - Cung cấp sẵn các gợi ý tình huống thực tế 1-click (Phỏng vấn Senior Developer, deal lương với HR, xin dời deadline, thất lạc hành lý sân bay, hỏi món ăn dị ứng).
  - Tùy chọn trình độ CEFR: `A2` (Cơ bản), `B1` (Trung cấp), `B2` (Nâng cao).
  - Gemini AI tạo ra bộ 5 câu tự nhiên, kèm lý thuyết ngữ cảnh, câu ví dụ thực tế và tự động lưu vào cơ sở dữ liệu để hỗ trợ đầy đủ cả 5 chế độ bài tập (Dịch câu, Sắp xếp câu, Điền từ, Nghe - chép, Shadowing).

---

## 2. Kiến trúc giải pháp Âm thanh (Audio Architecture ADR)

### Câu hỏi: *Phần phát âm thanh sẽ lấy từ đâu để phát cho người dùng nghe?*

Có 3 giải pháp chính trong phát triển Web hiện đại, được so sánh chi tiết dưới đây:

| Tiêu chí | Giải pháp 1: Web Speech API (Khuyên dùng MVP) | Giải pháp 2: Edge-TTS / Azure Neural | Giải pháp 3: OpenAI TTS / ElevenLabs |
|---|---|---|---|
| **Nguồn phát** | Trình duyệt của thiết bị (`window.speechSynthesis`) | Microsoft Edge Neural Voices (Jenny, Guy...) | Cloud API của OpenAI / ElevenLabs |
| **Chi phí** | **0 VNĐ (Miễn phí 100% vĩnh viễn)** | Miễn phí hoặc Free Tier 500k ký tự/tháng | Tốn phí theo token (khoảng 0.015$/1k ký tự) |
| **Độ trễ** | **Gần như 0ms** (phát tức thì khi click) | ~300ms - 600ms (cần tải buffer audio) | ~500ms - 1s |
| **Hạ tầng** | Hoàn toàn chạy Client-side, không tải server | Cần API route trung gian Next.js để stream | Cần API route trung gian Next.js |
| **Chất lượng giọng** | Rất tốt trên macOS, iOS, Windows, Chrome (giọng chuẩn US/UK) | Xuất sắc, cảm xúc rất tự nhiên | Đỉnh cao, giống người thật 99% |
| **Khả năng offline** | Có thể chạy mượt mà ngay cả khi mạng yếu | Phụ thuộc kết nối mạng | Phụ thuộc kết nối mạng |

### 👉 Kiến trúc Hybrid khuyến nghị cho SentenceLab:
1. **Giai đoạn 1 (Ngay lập tức):** Sử dụng **Web Speech Synthesis API** chuẩn của trình duyệt:
   * Không tốn 1 đồng chi phí API.
   * Người dùng bấm nút là nghe được ngay tức thì (0ms latency).
   * Dễ dàng tinh chỉnh tốc độ phát (`speech.rate = 1.0` hoặc `0.8` cho chế độ nghe chậm).
   * Lựa chọn giọng bản xứ tự nhiên: `en-US` (American English) hoặc `en-GB` (British English).
2. **Giai đoạn 2 (Nâng cấp cao cấp):** Bổ sung API route `/api/audio/tts` (sử dụng Edge-TTS neural engine) làm nguồn chất lượng cao phụ trợ khi muốn lưu trữ file MP3 cố định.
