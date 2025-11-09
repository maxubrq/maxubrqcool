'use client'

import { SimpleQuiz } from './SimpleQuiz'
import { encryptAnswerAdvanced } from '@/lib/quiz/encryption'

// Quiz questions based on TypeScript Series 02 content
const questions = [
  // Easy questions (3)
  {
    id: 'ts-s02-1',
    question: 'Structural typing trong TypeScript là gì?',
    type: 'single-choice' as const,
    options: [
      'Hai type được xem là tương thích nếu chúng có cùng tên (nominal typing)',
      'Hai type được xem là tương thích nếu chúng có cùng "shape" - cùng tập hợp thuộc tính và kiểu giá trị',
      'Type chỉ tồn tại ở runtime, không có kiểm tra compile-time',
      'Mỗi type phải được khai báo rõ ràng, không có inference'
    ],
    correctAnswer: 'Hai type được xem là tương thích nếu chúng có cùng "shape" - cùng tập hợp thuộc tính và kiểu giá trị',
    explanation: 'Structural typing là đặc trưng của TypeScript: hai type được xem là tương thích nếu chúng có cùng "shape", tức cùng tập hợp thuộc tính và kiểu giá trị. Điều này khác với nominal typing (như Java, C#) nơi type phải có cùng tên. Cơ chế này phản ánh đặc trưng của JavaScript - nơi giá trị quan trọng hơn danh xưng.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['structural-typing', 'basics', 'type-system']
  },
  {
    id: 'ts-s02-2',
    question: 'Sự khác biệt chính giữa interface và type alias trong TypeScript là gì?',
    type: 'single-choice' as const,
    options: [
      'Interface và type alias hoàn toàn giống nhau, có thể dùng thay thế cho nhau',
      'Interface mô tả hình dạng của một thực thể có thể mở rộng được, trong khi type alias đại diện cho bất kỳ biểu thức type nào (union, intersection, mapped type)',
      'Type alias chỉ dùng cho primitive types, interface chỉ dùng cho objects',
      'Interface không thể extend, type alias có thể'
    ],
    correctAnswer: 'Interface mô tả hình dạng của một thực thể có thể mở rộng được, trong khi type alias đại diện cho bất kỳ biểu thức type nào (union, intersection, mapped type)',
    explanation: 'Interface phù hợp để định nghĩa các API surface ổn định, nơi khả năng mở rộng quan trọng (ví dụ interface Request có thể được mở rộng bởi nhiều module). Type alias mạnh hơn trong các phép biến đổi type (type-level computation), ví dụ type Result<T> = T | Error. Trong các codebase lớn, thông lệ là dùng interface cho public API và type alias cho logic nội bộ hoặc utility types.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['interface', 'type-alias', 'basics']
  },
  {
    id: 'ts-s02-3',
    question: 'Mục đích của strict mode trong TypeScript là gì?',
    type: 'single-choice' as const,
    options: [
      'Làm cho code chạy nhanh hơn',
      'Ép developer định nghĩa rõ ràng mỗi thuộc tính và tránh những vùng "unknown" mà compiler không thể phân tích',
      'Tự động sửa lỗi trong code',
      'Chỉ dùng cho production, không cần cho development'
    ],
    correctAnswer: 'Ép developer định nghĩa rõ ràng mỗi thuộc tính và tránh những vùng "unknown" mà compiler không thể phân tích',
    explanation: 'Các tùy chọn như strict, noImplicitAny, exactOptionalPropertyTypes, và noUncheckedIndexedAccess nên được bật mặc định trong mọi dự án sản xuất. Chúng ép developer định nghĩa rõ ràng mỗi thuộc tính và tránh những vùng "unknown" mà compiler không thể phân tích. Việc bật strictness có thể tạo ra nhiều lỗi ban đầu, nhưng đó chính là "type debt" được bộc lộ sớm thay vì phát sinh âm thầm trong runtime.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['strict-mode', 'configuration', 'basics']
  },
  
  // Medium questions (6)
  {
    id: 'ts-s02-4',
    question: 'Nguyên tắc "annotate boundary, infer interior" có nghĩa là gì?',
    type: 'multiple-choice' as const,
    options: [
      'Khai báo rõ input và output của function hoặc module (contract bên ngoài), còn bên trong để compiler tự suy luận',
      'Luôn annotate mọi biến và function, không bao giờ để compiler infer',
      'Chỉ annotate ở runtime, không cần ở compile-time',
      'Annotate giúp code dễ đọc và ổn định khi refactor, trong khi inference giảm bớt nhu cầu khai báo dài dòng'
    ],
    correctAnswer: ['Khai báo rõ input và output của function hoặc module (contract bên ngoài), còn bên trong để compiler tự suy luận', 'Annotate giúp code dễ đọc và ổn định khi refactor, trong khi inference giảm bớt nhu cầu khai báo dài dòng'],
    explanation: 'Quy tắc thực hành phổ biến là annotate boundary, infer interior: khai báo rõ input và output của function hoặc module (tức là contract bên ngoài), còn bên trong để compiler tự suy luận. Nhờ đó, hệ thống vừa an toàn vừa linh hoạt. Khi annotation rõ ràng, compiler trở thành cộng sự: nó không chỉ kiểm tra lỗi mà còn giúp tái cấu trúc an toàn.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['inference', 'annotation', 'best-practices']
  },
  {
    id: 'ts-s02-5',
    question: 'Tại sao cần sử dụng "branding" hoặc "nominal tagging" trong TypeScript?',
    type: 'multiple-choice' as const,
    options: [
      'Để phân biệt các domain có cùng shape nhưng khác ý nghĩa nghiệp vụ (ví dụ UserId và CustomerId)',
      'Để tránh "accidental compatibility" - hai cấu trúc chỉ tình cờ trùng shape nhưng không cùng ý nghĩa',
      'Để làm cho code phức tạp hơn',
      'Branding ép compiler xem các type có cùng shape nhưng khác brand là không tương thích'
    ],
    correctAnswer: ['Để phân biệt các domain có cùng shape nhưng khác ý nghĩa nghiệp vụ (ví dụ UserId và CustomerId)', 'Để tránh "accidental compatibility" - hai cấu trúc chỉ tình cờ trùng shape nhưng không cùng ý nghĩa', 'Branding ép compiler xem các type có cùng shape nhưng khác brand là không tương thích'],
    explanation: 'Khi cần độ nghiêm ngặt cao hơn, có thể dùng "branding" hoặc "nominal tagging" để thêm một thuộc tính giả định, ví dụ type UserId = string & { readonly __brand: \'UserId\' }. Nhờ đó, các giá trị có cùng shape (string) nhưng khác brand sẽ không còn tương thích. Đây là cách phổ biến để kiểm soát accidental compatibility trong production systems.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['branding', 'nominal-tagging', 'type-safety']
  },
  {
    id: 'ts-s02-6',
    question: 'Tại sao cần runtime validation (như Zod) khi đã có TypeScript compile-time checking?',
    type: 'multiple-choice' as const,
    options: [
      'TypeScript không tồn tại ở runtime - toàn bộ type bị xóa sau khi biên dịch',
      'Dữ liệu đến từ network, file system hay input người dùng vẫn cần được xác thực ở runtime',
      'TypeScript chỉ kiểm soát compile-time, không thể đảm bảo an toàn tuyệt đối',
      'Runtime validation củng cố contract compile-time, tạo ra hai lớp bảo vệ'
    ],
    correctAnswer: ['TypeScript không tồn tại ở runtime - toàn bộ type bị xóa sau khi biên dịch', 'Dữ liệu đến từ network, file system hay input người dùng vẫn cần được xác thực ở runtime', 'TypeScript chỉ kiểm soát compile-time, không thể đảm bảo an toàn tuyệt đối', 'Runtime validation củng cố contract compile-time, tạo ra hai lớp bảo vệ'],
    explanation: 'TypeScript không thể đảm bảo an toàn tuyệt đối vì type bị loại bỏ sau quá trình compile. Để bù lại, các thư viện như Zod hoặc io-ts cung cấp cơ chế runtime validation đồng bộ với compile-time type, giúp bảo toàn contract cả trong và ngoài compiler. Khi compile-time và runtime hợp nhất, hệ thống trở nên bền vững hơn vì mỗi lớp bảo vệ phát hiện lỗi ở giai đoạn sớm nhất có thể.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['runtime-validation', 'zod', 'compile-time-vs-runtime']
  },
  {
    id: 'ts-s02-7',
    question: 'Widening và narrowing trong TypeScript là gì?',
    type: 'multiple-choice' as const,
    options: [
      'Widening: compiler "mở rộng" giá trị sang type tổng quát hơn (ví dụ từ literal "a" sang string)',
      'Narrowing: compiler "thu hẹp" type trong flow kiểm tra điều kiện (ví dụ khi gặp typeof x === "number")',
      'TypeScript có thể phân tích control flow để dự đoán type tại từng điểm trong chương trình',
      'Widening và narrowing chỉ hoạt động với primitive types, không hoạt động với objects'
    ],
    correctAnswer: ['Widening: compiler "mở rộng" giá trị sang type tổng quát hơn (ví dụ từ literal "a" sang string)', 'Narrowing: compiler "thu hẹp" type trong flow kiểm tra điều kiện (ví dụ khi gặp typeof x === "number")', 'TypeScript có thể phân tích control flow để dự đoán type tại từng điểm trong chương trình'],
    explanation: 'Quy tắc assignability đi kèm với cơ chế widening và narrowing. Khi compiler không thể suy ra type cụ thể, nó "mở rộng" (widen) giá trị sang type tổng quát hơn, như từ literal "a" sang string. Ngược lại, trong flow kiểm tra điều kiện, compiler có thể "thu hẹp" (narrow) type, ví dụ khi gặp typeof x === "number". Nhờ vậy, TypeScript có thể phân tích control flow để dự đoán type tại từng điểm trong chương trình.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['widening', 'narrowing', 'control-flow']
  },
  {
    id: 'ts-s02-8',
    question: 'Exhaustiveness checking với union types giúp gì?',
    type: 'multiple-choice' as const,
    options: [
      'Đảm bảo mọi nhánh logic đều được xử lý - một dạng "exhaustive-by-construction"',
      'Nếu thêm biến thể mới vào union type, compiler sẽ báo lỗi nếu switch/case không xử lý hết',
      'Giúp tránh lỗi runtime khi có trường hợp không được xử lý',
      'Exhaustiveness checking chỉ hoạt động với if-else, không hoạt động với switch'
    ],
    correctAnswer: ['Đảm bảo mọi nhánh logic đều được xử lý - một dạng "exhaustive-by-construction"', 'Nếu thêm biến thể mới vào union type, compiler sẽ báo lỗi nếu switch/case không xử lý hết', 'Giúp tránh lỗi runtime khi có trường hợp không được xử lý'],
    explanation: 'Với union type và switch statement, TypeScript có thể kiểm tra exhaustiveness. Nếu thêm biến thể mới, compiler sẽ báo lỗi vì default không còn "never". Cơ chế này giúp đảm bảo mọi nhánh logic đều được xử lý — một dạng "exhaustive-by-construction". Ví dụ: type RemoteData<T> = { kind: "Idle" } | { kind: "Loading" } | { kind: "Success"; data: T } | { kind: "Failure"; error: Error }',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['exhaustiveness', 'union-types', 'type-safety']
  },
  {
    id: 'ts-s02-9',
    question: 'Triết lý "type như hợp đồng kỹ thuật (contract)" có nghĩa là gì?',
    type: 'multiple-choice' as const,
    options: [
      'Type không chỉ là cú pháp bổ sung, mà là cách biểu đạt contract giữa các phần trong hệ thống',
      'Mỗi module hiểu rõ điều nó mong đợi (input) và điều nó hứa hẹn (output)',
      'Một contract typed là một tài liệu sống: nó di chuyển cùng code, được compiler kiểm chứng mỗi khi thay đổi',
      'Type chỉ dùng để trang trí code, không có giá trị thực tế'
    ],
    correctAnswer: ['Type không chỉ là cú pháp bổ sung, mà là cách biểu đạt contract giữa các phần trong hệ thống', 'Mỗi module hiểu rõ điều nó mong đợi (input) và điều nó hứa hẹn (output)', 'Một contract typed là một tài liệu sống: nó di chuyển cùng code, được compiler kiểm chứng mỗi khi thay đổi'],
    explanation: 'Sự chuyển dịch tư duy ở đây nằm ở việc xem type như hợp đồng kỹ thuật (contract) chứ không phải như cú pháp bổ sung. Khi codebase lớn dần, khả năng compiler hiểu đúng ý định của con người trở nên quan trọng hơn. Một module có type rõ ràng giúp người khác hiểu nhanh ý định của người viết mà không cần đọc chi tiết implementation.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['type-as-contract', 'philosophy', 'best-practices']
  },
  {
    id: 'ts-s02-10',
    question: 'Các tùy chọn cấu hình TypeScript nào nên được bật trong mọi dự án sản xuất?',
    type: 'multiple-choice' as const,
    options: [
      'strict: true - bật tất cả các kiểm tra nghiêm ngặt',
      'noImplicitAny: true - cấm any ngầm định',
      'exactOptionalPropertyTypes: true - kiểm tra chính xác optional properties',
      'noUncheckedIndexedAccess: true - yêu cầu kiểm tra khi truy cập index'
    ],
    correctAnswer: ['strict: true - bật tất cả các kiểm tra nghiêm ngặt', 'noImplicitAny: true - cấm any ngầm định', 'exactOptionalPropertyTypes: true - kiểm tra chính xác optional properties', 'noUncheckedIndexedAccess: true - yêu cầu kiểm tra khi truy cập index'],
    explanation: 'Các tùy chọn như strict, noImplicitAny, exactOptionalPropertyTypes, và noUncheckedIndexedAccess nên được bật mặc định trong mọi dự án sản xuất. Chúng ép developer định nghĩa rõ ràng mỗi thuộc tính và tránh những vùng "unknown" mà compiler không thể phân tích. Nếu dự án quá lớn để bật strict ngay, có thể chia thành nhiều giai đoạn: (1) noImplicitAny, (2) strictNullChecks, (3) exactOptionalPropertyTypes.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['configuration', 'strict-mode', 'best-practices']
  },
  
  // Hard questions (3)
  {
    id: 'ts-s02-11',
    question: 'Bạn đang thiết kế một hệ thống type-safe cho API client với các yêu cầu: (1) validate dữ liệu từ API ở runtime, (2) đảm bảo type safety ở compile-time, (3) tránh accidental compatibility giữa các domain khác nhau, (4) hỗ trợ exhaustive checking cho các trạng thái. Giải pháp tốt nhất là gì?',
    type: 'single-choice' as const,
    options: [
      'Sử dụng Zod schema để validate runtime, dùng z.infer để đồng bộ với compile-time type, áp dụng branding cho các ID khác domain (UserId, OrderId), định nghĩa union types với discriminated union cho các trạng thái, và bật strict mode trong tsconfig. Kết hợp compile-time và runtime validation tạo ra hai lớp bảo vệ, trong khi branding tránh accidental compatibility.',
      'Chỉ dùng TypeScript interface, không cần runtime validation vì TypeScript đã đủ an toàn',
      'Chỉ dùng runtime validation với Zod, không cần TypeScript types',
      'Dùng any cho tất cả để linh hoạt tối đa'
    ],
    correctAnswer: 'Sử dụng Zod schema để validate runtime, dùng z.infer để đồng bộ với compile-time type, áp dụng branding cho các ID khác domain (UserId, OrderId), định nghĩa union types với discriminated union cho các trạng thái, và bật strict mode trong tsconfig. Kết hợp compile-time và runtime validation tạo ra hai lớp bảo vệ, trong khi branding tránh accidental compatibility.',
    explanation: 'Giải pháp tốt nhất kết hợp: (1) Zod schema cho runtime validation với z.infer để đồng bộ compile-time type, (2) Branding (type UserId = string & { readonly __brand: "UserId" }) để phân biệt các domain, (3) Union types với discriminated union (kind: "Success" | "Failure") cho exhaustive checking, (4) Strict mode trong tsconfig để ép kiểm tra nghiêm ngặt. Điểm quan trọng: TypeScript không tồn tại ở runtime, nên cần cả hai lớp bảo vệ. Khi compile-time và runtime hợp nhất, hệ thống trở nên bền vững hơn.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['comprehensive-design', 'zod', 'branding', 'exhaustiveness', 'strict-mode', 'system-design', 'advanced']
  },
  {
    id: 'ts-s02-12',
    question: 'Trong một codebase lớn với nhiều module, làm thế nào để đảm bảo type contract được duy trì và không bị vi phạm khi refactor?',
    type: 'single-choice' as const,
    options: [
      'Áp dụng nguyên tắc "annotate boundary, infer interior": khai báo rõ input/output của public API (interface), để compiler infer bên trong. Thiết lập CI/CD với tsc --noEmit và ESLint rules cấm any. Sử dụng interface cho public API (có thể mở rộng) và type alias cho logic nội bộ. Mỗi thay đổi contract sẽ được compiler phát hiện ngay, và CI chặn mọi rò rỉ any. Type contract trở thành tài liệu sống được kiểm chứng tự động.',
      'Chỉ dựa vào code review, không cần tooling',
      'Tắt strict mode để tránh lỗi khi refactor',
      'Dùng any cho tất cả để tránh lỗi type'
    ],
    correctAnswer: 'Áp dụng nguyên tắc "annotate boundary, infer interior": khai báo rõ input/output của public API (interface), để compiler infer bên trong. Thiết lập CI/CD với tsc --noEmit và ESLint rules cấm any. Sử dụng interface cho public API (có thể mở rộng) và type alias cho logic nội bộ. Mỗi thay đổi contract sẽ được compiler phát hiện ngay, và CI chặn mọi rò rỉ any. Type contract trở thành tài liệu sống được kiểm chứng tự động.',
    explanation: 'Để duy trì type contract trong codebase lớn: (1) Annotate boundary (public API) với interface, infer interior - giúp compiler trở thành cộng sự trong refactor, (2) CI/CD với tsc --noEmit và ESLint (@typescript-eslint/no-explicit-any) - mỗi commit đo "type debt", (3) Interface cho public API (mở rộng được), type alias cho logic nội bộ - tạo ranh giới rõ ràng, (4) Type contract là tài liệu sống - di chuyển cùng code, được kiểm chứng tự động. Khi annotation rõ ràng, compiler không chỉ kiểm tra lỗi mà còn giúp tái cấu trúc an toàn.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['refactoring', 'ci-cd', 'type-contract', 'best-practices', 'large-codebase', 'advanced']
  },
  {
    id: 'ts-s02-13',
    question: 'Bạn gặp tình huống: một object có shape giống hệt interface User nhưng thực chất là Customer (cùng có name: string, age: number). Structural typing cho phép gán lẫn nhau, nhưng điều này gây bug nghiệp vụ. Làm thế nào để giải quyết?',
    type: 'single-choice' as const,
    options: [
      'Sử dụng branding: type UserId = string & { readonly __brand: "UserId" } và type CustomerId = string & { readonly __brand: "CustomerId" }. Thêm brand vào các interface User và Customer. Compiler sẽ xem chúng là không tương thích dù có cùng shape. Đây là cách kiểm soát accidental compatibility trong production systems.',
      'Chấp nhận bug vì structural typing là đặc trưng của TypeScript',
      'Đổi tên các thuộc tính để chúng khác nhau',
      'Dùng any để tránh lỗi type'
    ],
    correctAnswer: 'Sử dụng branding: type UserId = string & { readonly __brand: "UserId" } và type CustomerId = string & { readonly __brand: "CustomerId" }. Thêm brand vào các interface User và Customer. Compiler sẽ xem chúng là không tương thích dù có cùng shape. Đây là cách kiểm soát accidental compatibility trong production systems.',
    explanation: 'Khi hai domain có cùng shape nhưng khác ý nghĩa nghiệp vụ, structural typing có thể gây "accidental compatibility". Giải pháp là branding: thêm một thuộc tính giả định (__brand) vào type. Ví dụ: type UserId = string & { readonly __brand: "UserId" }, type CustomerId = string & { readonly __brand: "CustomerId" }. Branding ép compiler xem chúng là khác biệt, tránh nhầm lẫn logic trong hệ thống nhiều domain. Đây là cách phổ biến để kiểm soát accidental compatibility trong production systems khi cần độ nghiêm ngặt cao hơn structural typing thuần túy.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['branding', 'structural-typing', 'accidental-compatibility', 'type-safety', 'advanced']
  }
]

// Encrypt the answers
const encryptedQuestions = questions.map(q => ({
  ...q,
  correctAnswer: encryptAnswerAdvanced(q.correctAnswer, q.id)
}))

export function TypeScriptSeries02Quiz() {
  return (
    <SimpleQuiz
      title="TypeScript Series 02: Từ 'Hỗn độn' đến 'Rõ ràng' - Quiz"
      description="Kiểm tra hiểu biết của bạn về structural typing, interface vs type alias, inference và annotation, branding, runtime validation, type as contract, và các khái niệm nền tảng của TypeScript. Dựa trên nội dung chương 2."
      timeLimit={20}
      passingScore={70}
      allowRetake={true}
      showCorrectAnswers={true}
      questions={encryptedQuestions}
    />
  )
}

