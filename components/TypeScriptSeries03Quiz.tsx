'use client'

import { SimpleQuiz } from './SimpleQuiz'
import { encryptAnswerAdvanced } from '@/lib/quiz/encryption'

// Quiz questions based on TypeScript Series 03 content
const questions = [
  // Easy questions (3)
  {
    id: 'ts-s03-1',
    question: 'Assignability trong TypeScript là gì?',
    type: 'single-choice' as const,
    options: [
      'Quan hệ một chiều: có thể gán A vào B nhưng không gán B vào A, dựa trên shape chứ không dựa vào tên type',
      'Quan hệ hai chiều: A và B có thể gán cho nhau nếu có cùng tên',
      'Chỉ kiểm tra ở runtime, không có kiểm tra compile-time',
      'Assignability yêu cầu đồng nhất tuyệt đối giữa các type'
    ],
    correctAnswer: 'Quan hệ một chiều: có thể gán A vào B nhưng không gán B vào A, dựa trên shape chứ không dựa vào tên type',
    explanation: 'Assignability là quan hệ một chiều: có thể gán A vào B nhưng không gán B vào A. Quan hệ này không đòi hỏi đồng nhất tuyệt đối; yêu cầu là các thuộc tính và ràng buộc tối thiểu mà bên nhận cần phải có. Do đó, kiểm tra tương thích không dựa vào tên type mà dựa vào cấu trúc (structural typing).',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['assignability', 'basics', 'type-system']
  },
  {
    id: 'ts-s03-2',
    question: 'Sự khác biệt giữa unknown, never và any là gì?',
    type: 'single-choice' as const,
    options: [
      'unknown là top type an toàn nhận mọi giá trị nhưng buộc thu hẹp trước khi dùng; never là bottom type đại diện cho nhánh không thể xảy ra; any là "escape hatch" tắt kiểm tra kiểu',
      'Cả ba đều giống nhau, có thể dùng thay thế cho nhau',
      'unknown và any giống nhau, never chỉ dùng cho error handling',
      'any là an toàn nhất, nên dùng thay cho unknown'
    ],
    correctAnswer: 'unknown là top type an toàn nhận mọi giá trị nhưng buộc thu hẹp trước khi dùng; never là bottom type đại diện cho nhánh không thể xảy ra; any là "escape hatch" tắt kiểm tra kiểu',
    explanation: 'Top/bottom types quy định ranh giới suy luận: unknown là top type an toàn nhận mọi giá trị nhưng buộc thu hẹp trước khi dùng; never là bottom type đại diện cho nhánh không thể xảy ra, hữu ích để kiểm tra tính đầy đủ của xử lý. any là "escape hatch" tắt kiểm tra kiểu; việc sử dụng any lan rộng sẽ làm suy yếu tính dự đoán. Trong codebase production, nên áp dụng "no-new-any" trong CI để ngăn nợ kỹ thuật phát sinh.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['top-bottom-types', 'unknown', 'never', 'any', 'basics']
  },
  {
    id: 'ts-s03-3',
    question: 'Discriminated union là gì?',
    type: 'single-choice' as const,
    options: [
      'Union type có tag ổn định (thường là literal string) xuất hiện trong mọi biến thể, cho phép compiler thu hẹp type dựa trên giá trị tag',
      'Union type không có tag, compiler tự động suy luận',
      'Chỉ dùng cho primitive types, không dùng cho objects',
      'Discriminated union yêu cầu tất cả biến thể phải có cùng shape'
    ],
    correctAnswer: 'Union type có tag ổn định (thường là literal string) xuất hiện trong mọi biến thể, cho phép compiler thu hẹp type dựa trên giá trị tag',
    explanation: 'Discriminated unions hoạt động dựa trên tag ổn định: một thuộc tính chung (thường là literal string) xuất hiện trong mọi biến thể. Trình kiểm tra sử dụng giá trị cụ thể của tag để thu hẹp. Khi thêm một biến thể mới, default branch sẽ bị gán never và phát sinh lỗi, buộc cập nhật xử lý. Điều này chắc chắn hơn so với kiểm tra cấu trúc ngầm định.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['discriminated-unions', 'basics', 'type-safety']
  },
  
  // Medium questions (6)
  {
    id: 'ts-s03-4',
    question: 'Variance trong TypeScript là gì và tại sao mảng mutable không an toàn nếu coi covariant?',
    type: 'multiple-choice' as const,
    options: [
      'Mảng mutable là không an toàn nếu coi covariant theo phần tử, vì có thể chèn phần tử sai kiểu qua tham chiếu chung',
      'readonly tạo bề mặt chỉ đọc để đạt near-covariance an toàn; ReadonlyArray<T> là lựa chọn mặc định khi không cần mutate',
      'Với hàm, tham số là contravariant và kết quả là covariant',
      'TypeScript luôn an toàn với mảng mutable, không cần lo lắng về variance'
    ],
    correctAnswer: ['Mảng mutable là không an toàn nếu coi covariant theo phần tử, vì có thể chèn phần tử sai kiểu qua tham chiếu chung', 'readonly tạo bề mặt chỉ đọc để đạt near-covariance an toàn; ReadonlyArray<T> là lựa chọn mặc định khi không cần mutate', 'Với hàm, tham số là contravariant và kết quả là covariant'],
    explanation: 'Trong mô hình biến thiên (variance), mảng mutable là không an toàn nếu coi covariant theo phần tử, vì có thể chèn phần tử sai kiểu qua tham chiếu chung. Do đó, TypeScript giữ quy ước thận trọng: readonly tạo bề mặt chỉ đọc để đạt near-covariance an toàn; ReadonlyArray<T> là lựa chọn mặc định khi không cần mutate. Với hàm, tham số là contravariant và kết quả là covariant theo trực giác lý thuyết kiểu.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['variance', 'covariant', 'contravariant', 'readonly', 'type-safety']
  },
  {
    id: 'ts-s03-5',
    question: 'Control-flow analysis trong TypeScript cho phép làm gì?',
    type: 'multiple-choice' as const,
    options: [
      'Thu hẹp kiểu dựa trên kiểm tra runtime: typeof, instanceof, in, kiểm tra nullish, so sánh chặt chẽ',
      'Custom type guard với predicate trả về x is S cho phép compiler hiểu S là dạng thu hẹp của T',
      'Kết hợp với discriminated unions, control-flow analysis cho phép đạt tính exhaustive ở compile-time',
      'Control-flow analysis chỉ hoạt động với primitive types, không hoạt động với objects'
    ],
    correctAnswer: ['Thu hẹp kiểu dựa trên kiểm tra runtime: typeof, instanceof, in, kiểm tra nullish, so sánh chặt chẽ', 'Custom type guard với predicate trả về x is S cho phép compiler hiểu S là dạng thu hẹp của T', 'Kết hợp với discriminated unions, control-flow analysis cho phép đạt tính exhaustive ở compile-time'],
    explanation: 'Control-flow analysis cho phép thu hẹp kiểu dựa trên kiểm tra runtime: typeof, instanceof, in, kiểm tra nullish, so sánh chặt chẽ, và đặc biệt là custom type guard. Khi predicate trả về x is S, trình kiểm tra hiểu S là dạng thu hẹp của T. Kết hợp với discriminated unions, control-flow analysis cho phép đạt tính exhaustive ở compile-time, biến lỗi thiếu case thành lỗi biên dịch. Đây là kỹ thuật chủ lực để chuyển lỗi logic về sớm nhất.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['control-flow-analysis', 'type-guards', 'narrowing', 'exhaustiveness']
  },
  {
    id: 'ts-s03-6',
    question: 'Overload resolution hoạt động như thế nào và khi nào nên dùng overload vs generic vs union?',
    type: 'multiple-choice' as const,
    options: [
      'Trình kiểm tra duyệt từ trên xuống, tìm chữ ký "cụ thể" nhất khớp đối số. Khi không có chữ ký cụ thể phù hợp, sẽ rơi về chữ ký cuối cùng',
      'Overload dành cho trường hợp thực sự cần nhiều "hình" đối số với hành vi runtime khác nhau',
      'Generic + conditional types phù hợp khi muốn một cổng vào duy nhất và để trình kiểm tra tính toán kiểu trả về',
      'Lạm dụng overload dẫn đến bảo trì khó và lỗi suy luận mơ hồ'
    ],
    correctAnswer: ['Trình kiểm tra duyệt từ trên xuống, tìm chữ ký "cụ thể" nhất khớp đối số. Khi không có chữ ký cụ thể phù hợp, sẽ rơi về chữ ký cuối cùng', 'Overload dành cho trường hợp thực sự cần nhiều "hình" đối số với hành vi runtime khác nhau', 'Generic + conditional types phù hợp khi muốn một cổng vào duy nhất và để trình kiểm tra tính toán kiểu trả về', 'Lạm dụng overload dẫn đến bảo trì khó và lỗi suy luận mơ hồ'],
    explanation: 'Overload resolution là cơ chế lựa chọn chữ ký phù hợp nhất cho lời gọi. Trình kiểm tra duyệt từ trên xuống, tìm chữ ký "cụ thể" nhất khớp đối số. Khi không có chữ ký cụ thể phù hợp, sẽ rơi về chữ ký cuối cùng (thường là dạng tổng quát). Lạm dụng overload dẫn đến bảo trì khó và lỗi suy luận mơ hồ; nhiều trường hợp conditional types và generics giải quyết gọn hơn. Khi cân nhắc overload vs generic vs union, ưu tiên giữ API tuyến tính về suy luận.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['overload-resolution', 'generics', 'conditional-types', 'api-design']
  },
  {
    id: 'ts-s03-7',
    question: 'Sự khác biệt giữa exact optional và inexact optional là gì?',
    type: 'multiple-choice' as const,
    options: [
      'Với exactOptionalPropertyTypes, thiếu thuộc tính và thuộc tính có giá trị undefined được phân biệt',
      'Exact optional phản ánh sự chính xác mong muốn trong JSON/HTTP where "field missing" khác "field present but null/undefined"',
      'Cấu hình exactOptionalPropertyTypes tăng độ trung thực hợp đồng dữ liệu tại biên, giúp giảm lỗi khi phát triển API',
      'Exact optional và inexact optional hoàn toàn giống nhau, không có sự khác biệt'
    ],
    correctAnswer: ['Với exactOptionalPropertyTypes, thiếu thuộc tính và thuộc tính có giá trị undefined được phân biệt', 'Exact optional phản ánh sự chính xác mong muốn trong JSON/HTTP where "field missing" khác "field present but null/undefined"', 'Cấu hình exactOptionalPropertyTypes tăng độ trung thực hợp đồng dữ liệu tại biên, giúp giảm lỗi khi phát triển API'],
    explanation: 'Exact optional vs inexact optional ảnh hưởng đến assignability. Với exactOptionalPropertyTypes, thiếu thuộc tính và thuộc tính có giá trị undefined được phân biệt. Điều này phản ánh sự chính xác mong muốn trong JSON/HTTP where "field missing" khác "field present but null/undefined". Cấu hình này tăng độ trung thực hợp đồng dữ liệu tại biên, giúp giảm lỗi khi phát triển API.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['exact-optional', 'optional-properties', 'configuration', 'api-design']
  },
  {
    id: 'ts-s03-8',
    question: 'Satisfies operator (TS ≥ 4.9) có tác dụng gì?',
    type: 'multiple-choice' as const,
    options: [
      'Ràng buộc mà giữ nguyên thông tin kiểu cụ thể của biểu thức bên trái',
      'Hữu ích khi đối tượng literal có nhiều thuộc tính hơn hợp đồng, nhưng vẫn muốn IDE giữ intellisense đầy đủ',
      'Phối hợp satisfies với as const tăng tính an toàn khi định nghĩa bảng ánh xạ',
      'Satisfies hoàn toàn giống với type annotation, không có sự khác biệt'
    ],
    correctAnswer: ['Ràng buộc mà giữ nguyên thông tin kiểu cụ thể của biểu thức bên trái', 'Hữu ích khi đối tượng literal có nhiều thuộc tính hơn hợp đồng, nhưng vẫn muốn IDE giữ intellisense đầy đủ', 'Phối hợp satisfies với as const tăng tính an toàn khi định nghĩa bảng ánh xạ'],
    explanation: 'Satisfies (TS ≥ 4.9) đưa ra cách ràng buộc mà giữ nguyên thông tin kiểu cụ thể của biểu thức bên trái. Điều này hữu ích khi đối tượng literal có nhiều thuộc tính hơn hợp đồng, nhưng vẫn muốn IDE giữ intellisense đầy đủ. Phối hợp satisfies với as const tăng tính an toàn khi định nghĩa bảng ánh xạ. Ví dụ: const p3 = { id: "u1", extra: "x" } satisfies Profile; đảm bảo tối thiểu đúng hợp đồng nhưng vẫn giữ toàn bộ shape của p3.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['satisfies', 'type-constraints', 'intellisense', 'best-practices']
  },
  {
    id: 'ts-s03-9',
    question: 'Exhaustiveness checking trong TypeScript đạt được như thế nào?',
    type: 'multiple-choice' as const,
    options: [
      'Union có tag rõ ràng; switch không default, dùng assertNever để compiler kiểm tra đầy đủ',
      'Tách union theo ngữ cảnh để tránh phình to không cần thiết',
      'Dùng type-tests (tsd/expectTypeOf) cho chữ ký phức tạp',
      'Bật strict, exactOptionalPropertyTypes, noUncheckedIndexedAccess, strictFunctionTypes'
    ],
    correctAnswer: ['Union có tag rõ ràng; switch không default, dùng assertNever để compiler kiểm tra đầy đủ', 'Tách union theo ngữ cảnh để tránh phình to không cần thiết', 'Dùng type-tests (tsd/expectTypeOf) cho chữ ký phức tạp', 'Bật strict, exactOptionalPropertyTypes, noUncheckedIndexedAccess, strictFunctionTypes'],
    explanation: 'Ở quy mô codebase lớn, mục tiêu là exhaustive by construction. Thực hành gồm: union có tag rõ ràng; switch không default, dùng assertNever để compiler kiểm tra đầy đủ; tách union theo ngữ cảnh; dùng type-tests (tsd/expectTypeOf) cho chữ ký phức tạp; bật strict, exactOptionalPropertyTypes, noUncheckedIndexedAccess, strictFunctionTypes. Các biện pháp này dịch chuyển sai lệch về thời điểm sớm hơn, nơi sửa chữa rẻ hơn.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['exhaustiveness', 'discriminated-unions', 'type-tests', 'best-practices']
  },
  {
    id: 'ts-s03-10',
    question: 'Type hygiene là gì và các nguyên tắc cơ bản?',
    type: 'multiple-choice' as const,
    options: [
      '"No-surprise" yêu cầu: không lạm dụng as, tránh lộ any trong public API',
      'Tách ranh giới type rõ ràng giữa module',
      'Kèm theo policy CI để chặn thoái lui',
      'Type hygiene không quan trọng, có thể bỏ qua'
    ],
    correctAnswer: ['"No-surprise" yêu cầu: không lạm dụng as, tránh lộ any trong public API', 'Tách ranh giới type rõ ràng giữa module', 'Kèm theo policy CI để chặn thoái lui'],
    explanation: 'Type hygiene là nền tảng cho khả năng tiến hóa. "No-surprise" yêu cầu: không lạm dụng as, tránh lộ any trong public API, tách ranh giới type rõ ràng giữa module, và kèm theo policy CI để chặn thoái lui. Khi áp dụng nhất quán, các cơ chế nói trên biến compiler thành cộng tác viên, giảm entropy runtime và đưa lỗi logic về compile-time nơi có chi phí sửa thấp hơn.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['type-hygiene', 'best-practices', 'ci-cd', 'code-quality']
  },
  
  // Hard questions (3)
  {
    id: 'ts-s03-11',
    question: 'Bạn đang thiết kế một API với các yêu cầu: (1) hỗ trợ nhiều hình dạng đối số với hành vi runtime khác nhau, (2) đảm bảo type safety và suy luận chính xác, (3) tránh lạm dụng overload, (4) hỗ trợ exhaustive checking. Giải pháp tốt nhất là gì?',
    type: 'single-choice' as const,
    options: [
      'Sử dụng overload khi thực sự cần nhiều "hình" đối số với hành vi runtime khác nhau. Với trường hợp chỉ cần ánh xạ kiểu trả về theo kiểu đầu vào, dùng generic + conditional types. Kết hợp discriminated unions với switch và assertNever cho exhaustive checking. Hạn chế số overload, tránh chồng chéo, và đảm bảo test-type cho public signature. Ưu tiên giữ API tuyến tính về suy luận.',
      'Luôn dùng overload cho mọi trường hợp',
      'Chỉ dùng any để tránh phức tạp',
      'Không cần kiểm tra type, để runtime tự xử lý'
    ],
    correctAnswer: 'Sử dụng overload khi thực sự cần nhiều "hình" đối số với hành vi runtime khác nhau. Với trường hợp chỉ cần ánh xạ kiểu trả về theo kiểu đầu vào, dùng generic + conditional types. Kết hợp discriminated unions với switch và assertNever cho exhaustive checking. Hạn chế số overload, tránh chồng chéo, và đảm bảo test-type cho public signature. Ưu tiên giữ API tuyến tính về suy luận.',
    explanation: 'Khi thiết kế API: (1) Overload dành cho trường hợp thực sự cần nhiều "hình" đối số với hành vi runtime khác nhau, (2) Generic + conditional types phù hợp khi muốn một cổng vào duy nhất và để trình kiểm tra tính toán kiểu trả về, (3) Discriminated unions với switch và assertNever đạt exhaustive checking, (4) Hạn chế số overload, tránh chồng chéo, và đảm bảo test-type cho public signature. Tiêu chí thực hành là ưu tiên giữ API tuyến tính về suy luận.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['overload-resolution', 'generics', 'conditional-types', 'discriminated-unions', 'exhaustiveness', 'api-design', 'advanced']
  },
  {
    id: 'ts-s03-12',
    question: 'Trong một codebase lớn, làm thế nào để đảm bảo "exhaustive by construction" và giảm entropy runtime?',
    type: 'single-choice' as const,
    options: [
      'Áp dụng exhaustive by construction: union có tag rõ ràng; switch không default, dùng assertNever; tách union theo ngữ cảnh; dùng type-tests (tsd/expectTypeOf) cho chữ ký phức tạp; bật strict, exactOptionalPropertyTypes, noUncheckedIndexedAccess, strictFunctionTypes. Kết hợp với type hygiene: không lạm dụng as, tránh lộ any trong public API, tách ranh giới type rõ ràng giữa module, và kèm theo policy CI để chặn thoái lui. Các biện pháp này dịch chuyển sai lệch về thời điểm sớm hơn, nơi sửa chữa rẻ hơn.',
      'Chỉ dựa vào code review, không cần tooling',
      'Tắt strict mode để tránh lỗi',
      'Dùng any cho tất cả để linh hoạt'
    ],
    correctAnswer: 'Áp dụng exhaustive by construction: union có tag rõ ràng; switch không default, dùng assertNever; tách union theo ngữ cảnh; dùng type-tests (tsd/expectTypeOf) cho chữ ký phức tạp; bật strict, exactOptionalPropertyTypes, noUncheckedIndexedAccess, strictFunctionTypes. Kết hợp với type hygiene: không lạm dụng as, tránh lộ any trong public API, tách ranh giới type rõ ràng giữa module, và kèm theo policy CI để chặn thoái lui. Các biện pháp này dịch chuyển sai lệch về thời điểm sớm hơn, nơi sửa chữa rẻ hơn.',
    explanation: 'Để đạt exhaustive by construction và giảm entropy runtime: (1) Union có tag rõ ràng; switch không default, dùng assertNever để compiler kiểm tra đầy đủ, (2) Tách union theo ngữ cảnh để tránh phình to không cần thiết, (3) Dùng type-tests (tsd/expectTypeOf) cho chữ ký phức tạp, (4) Bật strict, exactOptionalPropertyTypes, noUncheckedIndexedAccess, strictFunctionTypes, (5) Type hygiene: không lạm dụng as, tránh lộ any trong public API, tách ranh giới type rõ ràng, và kèm theo policy CI. Khi áp dụng nhất quán, compiler trở thành cộng tác viên, giảm entropy runtime và đưa lỗi logic về compile-time.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['exhaustiveness', 'type-hygiene', 'configuration', 'ci-cd', 'best-practices', 'large-codebase', 'advanced']
  },
  {
    id: 'ts-s03-13',
    question: 'Bạn gặp tình huống: cần truyền mảng giữa các module, nhưng muốn đảm bảo an toàn về variance. Mảng mutable có thể gây rủi ro nếu coi covariant. Làm thế nào để giải quyết?',
    type: 'single-choice' as const,
    options: [
      'Sử dụng ReadonlyArray<T> hoặc readonly modifier để tạo bề mặt chỉ đọc, đạt near-covariance an toàn. ReadonlyArray<T> là lựa chọn mặc định khi không cần mutate. Với hàm, đảm bảo strictFunctionTypes được bật để callback được kiểm tra contravariant. Trong thiết kế API, có thể mô phỏng variance bằng readonly, "input-only" hoặc "output-only" wrapper, và phân tách interface công khai thành các bề mặt riêng cho đọc/ghi.',
      'Luôn dùng mảng mutable, không cần lo lắng',
      'Tắt kiểm tra type để tránh lỗi',
      'Dùng any[] cho tất cả mảng'
    ],
    correctAnswer: 'Sử dụng ReadonlyArray<T> hoặc readonly modifier để tạo bề mặt chỉ đọc, đạt near-covariance an toàn. ReadonlyArray<T> là lựa chọn mặc định khi không cần mutate. Với hàm, đảm bảo strictFunctionTypes được bật để callback được kiểm tra contravariant. Trong thiết kế API, có thể mô phỏng variance bằng readonly, "input-only" hoặc "output-only" wrapper, và phân tách interface công khai thành các bề mặt riêng cho đọc/ghi.',
    explanation: 'Mảng mutable là không an toàn nếu coi covariant theo phần tử, vì có thể chèn phần tử sai kiểu qua tham chiếu chung. Do đó, TypeScript giữ quy ước thận trọng: readonly tạo bề mặt chỉ đọc để đạt near-covariance an toàn; ReadonlyArray<T> là lựa chọn mặc định khi không cần mutate. Với hàm, tham số là contravariant và kết quả là covariant. Trong thiết kế API, có thể mô phỏng variance bằng cách dựng hình thức sử dụng tham số kiểu đúng vị trí: readonly, "input-only" hoặc "output-only" wrapper.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['variance', 'readonly', 'covariant', 'contravariant', 'type-safety', 'api-design', 'advanced']
  }
]

// Encrypt the answers
const encryptedQuestions = questions.map(q => ({
  ...q,
  correctAnswer: encryptAnswerAdvanced(q.correctAnswer, q.id)
}))

export function TypeScriptSeries03Quiz() {
  return (
    <SimpleQuiz
      title="TypeScript Series 03: Bí mật của Hệ thống Type - Logic nằm sau Cú pháp - Quiz"
      description="Kiểm tra hiểu biết của bạn về assignability, variance, control-flow analysis, discriminated unions, overload resolution, exact optional, satisfies, exhaustiveness checking, và type hygiene. Dựa trên nội dung chương 3."
      timeLimit={20}
      passingScore={70}
      allowRetake={true}
      showCorrectAnswers={true}
      questions={encryptedQuestions}
    />
  )
}

