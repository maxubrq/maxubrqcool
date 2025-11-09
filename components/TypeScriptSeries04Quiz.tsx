'use client'

import { SimpleQuiz } from './SimpleQuiz'
import { encryptAnswerAdvanced } from '@/lib/quiz/encryption'

// Quiz questions based on TypeScript Series 04 content
const questions = [
  // Easy questions (3)
  {
    id: 'ts-s04-1',
    question: 'Generics trong TypeScript được mô tả như thế nào trong chương này?',
    type: 'single-choice' as const,
    options: [
      'Chỉ là công cụ tái sử dụng kiểu (reusability)',
      'Là một ngôn ngữ con ở tầng compile-time, cho phép định nghĩa quy tắc suy luận và biến đổi kiểu tương đương với logic của một chương trình',
      'Chỉ dùng cho function, không dùng cho type',
      'Generics không có inference, phải khai báo rõ ràng mọi lúc'
    ],
    correctAnswer: 'Là một ngôn ngữ con ở tầng compile-time, cho phép định nghĩa quy tắc suy luận và biến đổi kiểu tương đương với logic của một chương trình',
    explanation: 'Generics trong TypeScript không chỉ là công cụ tái sử dụng kiểu (reusability), mà là một ngôn ngữ con ở tầng compile-time. Khi kết hợp với các cơ chế như conditional types hay mapped types, ta có thể định nghĩa những quy tắc suy luận và biến đổi kiểu tương đương với logic của một chương trình. Ở cấp độ hệ thống, generic type đóng vai trò như một metaprogram — một chương trình nhỏ sinh ra ràng buộc thiết kế cho code thật.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['generics', 'compile-time', 'basics', 'type-computation']
  },
  {
    id: 'ts-s04-2',
    question: 'Câu lệnh extends trong generic có nghĩa là gì?',
    type: 'single-choice' as const,
    options: [
      'Là kế thừa, giống như class inheritance',
      'Là ràng buộc miền hợp lệ (constraint domain), cho phép compiler kiểm soát phạm vi inference và bảo đảm các thuộc tính cần thiết được duy trì',
      'Chỉ dùng để giới hạn primitive types',
      'extends không có tác dụng gì trong generic'
    ],
    correctAnswer: 'Là ràng buộc miền hợp lệ (constraint domain), cho phép compiler kiểm soát phạm vi inference và bảo đảm các thuộc tính cần thiết được duy trì',
    explanation: 'Câu lệnh extends trong generic không phải là kế thừa, mà là ràng buộc miền hợp lệ (constraint domain). Nó cho phép compiler kiểm soát phạm vi inference và bảo đảm các thuộc tính cần thiết được duy trì. Ví dụ, trong hàm pick, ta cần đảm bảo K là một tập con của các key trong T. Nếu truyền vào key không có trong T, compiler sẽ phát hiện lỗi ngay ở design-time. Điều này biến "type" thành contract giữa người viết API và người dùng API.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['constraints', 'extends', 'basics', 'type-safety']
  },
  {
    id: 'ts-s04-3',
    question: 'Mapped types cho phép làm gì?',
    type: 'single-choice' as const,
    options: [
      'Chỉ đọc các thuộc tính của object',
      'Áp dụng cùng một phép biến đổi lên tất cả key của một type, hoạt động như bản đồ ánh xạ (mapping) từ tập key sang thuộc tính mới',
      'Chỉ dùng cho array, không dùng cho object',
      'Mapped types không thể biến đổi type'
    ],
    correctAnswer: 'Áp dụng cùng một phép biến đổi lên tất cả key của một type, hoạt động như bản đồ ánh xạ (mapping) từ tập key sang thuộc tính mới',
    explanation: 'Mapped types cho phép áp dụng cùng một phép biến đổi lên tất cả key của một type. Chúng hoạt động như bản đồ ánh xạ (mapping) từ tập key sang thuộc tính mới. Ví dụ: type Readonly<T> = { readonly [K in keyof T]: T[K] }; type Partial<T> = { [K in keyof T]?: T[K] }; Đây là ví dụ điển hình cho cơ chế variance ở cấp thuộc tính — thay đổi khả năng gán và sửa đổi của từng trường.',
    points: 10,
    difficulty: 'easy' as const,
    tags: ['mapped-types', 'basics', 'type-transformation']
  },
  
  // Medium questions (6)
  {
    id: 'ts-s04-4',
    question: 'Conditional types có tính phân phối (distributive) như thế nào?',
    type: 'multiple-choice' as const,
    options: [
      'Nếu T là một union type, conditional types có tính phân phối: biểu thức được áp dụng cho từng phần tử của union rồi hợp lại kết quả',
      'Để vô hiệu hóa tính phân phối, ta chỉ cần bọc T trong tuple: [T] extends [U] ? X : Y',
      'Tính phân phối luôn được bật, không thể tắt',
      'Hiểu được cách phân phối giúp tránh các lỗi không rõ nguyên nhân như "type too complex" hay "depth exceeds recursion limit"'
    ],
    correctAnswer: ['Nếu T là một union type, conditional types có tính phân phối: biểu thức được áp dụng cho từng phần tử của union rồi hợp lại kết quả', 'Để vô hiệu hóa tính phân phối, ta chỉ cần bọc T trong tuple: [T] extends [U] ? X : Y', 'Hiểu được cách phân phối giúp tránh các lỗi không rõ nguyên nhân như "type too complex" hay "depth exceeds recursion limit"'],
    explanation: 'Conditional types cho phép chọn type dựa trên điều kiện ở tầng compile-time. Nếu T là một union type, conditional types có tính phân phối (distributive): biểu thức được áp dụng cho từng phần tử của union rồi hợp lại kết quả. Ví dụ: type Exclude<T, U> = T extends U ? never : T; Nếu muốn vô hiệu hóa tính phân phối, ta chỉ cần bọc T trong tuple: type NonDistribute<T> = [T] extends [string | number] ? true : false;',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['conditional-types', 'distributivity', 'union-types']
  },
  {
    id: 'ts-s04-5',
    question: 'Template literal types cho phép làm gì và giới hạn thực tế là gì?',
    type: 'multiple-choice' as const,
    options: [
      'Cho phép nối và kiểm soát các chuỗi ở tầng type, giúp mô hình hóa key hoặc event name an toàn mà không cần xử lý runtime',
      'Khi kết hợp recursion, nó trở thành một chuỗi sản sinh (string algebra), nhưng đồng thời cũng dễ dẫn đến type explosion nếu không đặt giới hạn độ sâu',
      'Recursion nên dừng ở MaxDepth = 3–5, vì sau đó IDE và compiler bắt đầu giảm tốc độ đáng kể',
      'Template literal types chỉ dùng cho string literals, không thể dùng với variables'
    ],
    correctAnswer: ['Cho phép nối và kiểm soát các chuỗi ở tầng type, giúp mô hình hóa key hoặc event name an toàn mà không cần xử lý runtime', 'Khi kết hợp recursion, nó trở thành một chuỗi sản sinh (string algebra), nhưng đồng thời cũng dễ dẫn đến type explosion nếu không đặt giới hạn độ sâu', 'Recursion nên dừng ở MaxDepth = 3–5, vì sau đó IDE và compiler bắt đầu giảm tốc độ đáng kể'],
    explanation: 'Template literal types cho phép nối và kiểm soát các chuỗi ở tầng type, giúp mô hình hóa key hoặc event name an toàn mà không cần xử lý runtime. Cơ chế này là nền tảng cho việc sinh type động cho các "key path" hoặc contract logging. Khi kết hợp recursion, nó trở thành một chuỗi sản sinh (string algebra), nhưng đồng thời cũng dễ dẫn đến type explosion nếu không đặt giới hạn độ sâu. Giới hạn thực tế: recursion nên dừng ở MaxDepth = 3–5, vì sau đó IDE và compiler bắt đầu giảm tốc độ đáng kể.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['template-literal-types', 'string-algebra', 'recursion-limits', 'performance']
  },
  {
    id: 'ts-s04-6',
    question: 'Các utility types chuẩn của TypeScript và ứng dụng thực tế của chúng là gì?',
    type: 'multiple-choice' as const,
    options: [
      'Partial<T> biến tất cả thuộc tính thành tùy chọn - dùng cho giao diện update object',
      'Pick<T, K> chọn tập con key - dùng để tạo view hoặc DTO nhỏ',
      'Omit<T, K> loại bỏ tập key - dùng để giấu field nội bộ',
      'Record<K, T> map key → type - dùng cho lookup tables'
    ],
    correctAnswer: ['Partial<T> biến tất cả thuộc tính thành tùy chọn - dùng cho giao diện update object', 'Pick<T, K> chọn tập con key - dùng để tạo view hoặc DTO nhỏ', 'Omit<T, K> loại bỏ tập key - dùng để giấu field nội bộ', 'Record<K, T> map key → type - dùng cho lookup tables'],
    explanation: 'TypeScript cung cấp một tập hợp utility types chuẩn, tương đương "stdlib" của tầng type: Partial<T> biến tất cả thuộc tính thành tùy chọn (giao diện update object), Required<T> ngược lại của Partial (chuẩn hóa dữ liệu trước khi lưu), Pick<T, K> chọn tập con key (tạo view hoặc DTO nhỏ), Omit<T, K> loại bỏ tập key (giấu field nội bộ), Record<K, T> map key → type (lookup tables), ReturnType<F> suy ra type trả về của function (API client wrappers). Khi cần mở rộng, nên compose thay vì reinvent.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['utility-types', 'partial', 'pick', 'omit', 'record']
  },
  {
    id: 'ts-s04-7',
    question: 'Các anti-patterns trong type computation và cách khắc phục là gì?',
    type: 'multiple-choice' as const,
    options: [
      'Recursion không điểm dừng → "Type instantiation is excessively deep" - khắc phục: giới hạn depth bằng tham số',
      'Union cực lớn → IDE lag, build chậm - khắc phục: chia thành discriminated unions nhỏ',
      'Lạm dụng as → Compiler mất thông tin ràng buộc - khắc phục: dùng satisfies hoặc thêm generic constraint',
      'Type "wizardry" → Đọc khó, không ai dám sửa - khắc phục: đặt tên rõ, tách helper nhỏ, viết test type'
    ],
    correctAnswer: ['Recursion không điểm dừng → "Type instantiation is excessively deep" - khắc phục: giới hạn depth bằng tham số', 'Union cực lớn → IDE lag, build chậm - khắc phục: chia thành discriminated unions nhỏ', 'Lạm dụng as → Compiler mất thông tin ràng buộc - khắc phục: dùng satisfies hoặc thêm generic constraint', 'Type "wizardry" → Đọc khó, không ai dám sửa - khắc phục: đặt tên rõ, tách helper nhỏ, viết test type'],
    explanation: 'Một số mẫu cần tránh trong hệ thống lớn: (1) Recursion không điểm dừng → "Type instantiation is excessively deep" - khắc phục bằng giới hạn depth bằng tham số, (2) Union cực lớn → IDE lag, build chậm - khắc phục bằng chia thành discriminated unions nhỏ, (3) Lạm dụng as → Compiler mất thông tin ràng buộc - khắc phục bằng dùng satisfies hoặc thêm generic constraint, (4) Type "wizardry" → Đọc khó, không ai dám sửa - khắc phục bằng đặt tên rõ, tách helper nhỏ, viết test type.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['anti-patterns', 'recursion', 'performance', 'best-practices']
  },
  {
    id: 'ts-s04-8',
    question: 'Flatten<T> minh họa những khái niệm gì?',
    type: 'multiple-choice' as const,
    options: [
      'Cách infer tách thành phần từ mảng lồng nhiều cấp',
      'Quan sát cách conditional type phân phối (distribute) qua union',
      'Đo đạc chi phí type-checking khi độ sâu thay đổi',
      'Recursion có kiểm soát với tham số độ sâu (depth-limited recursion)'
    ],
    correctAnswer: ['Cách infer tách thành phần từ mảng lồng nhiều cấp', 'Quan sát cách conditional type phân phối (distribute) qua union', 'Đo đạc chi phí type-checking khi độ sâu thay đổi', 'Recursion có kiểm soát với tham số độ sâu (depth-limited recursion)'],
    explanation: 'Flatten<T> là ví dụ điển hình cho type computation có tính đệ quy có kiểm soát. Mục tiêu: nhận vào một type có thể là mảng lồng nhiều cấp, và trả về phần tử cơ bản của nó. Kết quả mong đợi: hiểu cách infer tách thành phần, quan sát cách conditional type phân phối (distribute) qua union, và đo đạc chi phí type-checking khi độ sâu thay đổi. Giới hạn recursion (D) là bộ đệm bắt buộc để tránh type-explosion.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['flatten', 'infer', 'recursion', 'type-computation']
  },
  {
    id: 'ts-s04-9',
    question: 'UnionToIntersection<U> hoạt động dựa trên cơ chế gì?',
    type: 'multiple-choice' as const,
    options: [
      'Contravariance: khi type được sử dụng làm đầu vào (input parameter), thứ tự tương thích đảo ngược so với covariance',
      'Khi infer tham số của union các hàm, compiler phải chọn type có thể nhận mọi đầu vào hợp lệ của các nhánh, kết quả là intersection',
      'Đây là "nghịch lý contravariant" cho phép tạo ra intersection từ union',
      'UnionToIntersection chỉ hoạt động với primitive types, không hoạt động với objects'
    ],
    correctAnswer: ['Contravariance: khi type được sử dụng làm đầu vào (input parameter), thứ tự tương thích đảo ngược so với covariance', 'Khi infer tham số của union các hàm, compiler phải chọn type có thể nhận mọi đầu vào hợp lệ của các nhánh, kết quả là intersection', 'Đây là "nghịch lý contravariant" cho phép tạo ra intersection từ union'],
    explanation: 'Contravariance là đặc tính của type function parameter: khi type được sử dụng làm đầu vào (input parameter), thứ tự tương thích đảo ngược so với covariance. Khi infer tham số của union các hàm, compiler phải chọn type có thể nhận mọi đầu vào hợp lệ của các nhánh. Kết quả: intersection của tất cả tham số hợp lệ. Đây chính là "nghịch lý contravariant" cho phép tạo ra intersection từ union. UnionToIntersection<U> giúp mô hình hóa pattern "merge tất cả context" an toàn mà không có runtime cost.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['union-to-intersection', 'contravariance', 'inference', 'type-computation']
  },
  {
    id: 'ts-s04-10',
    question: 'StringPath<T> minh họa những cơ chế trọng tâm nào?',
    type: 'multiple-choice' as const,
    options: [
      'Recursion có kiểm soát với tham số độ sâu (depth-limited recursion)',
      'Template literal types như "ngôn ngữ đại số chuỗi" ở tầng compile-time',
      'Constraint solving khi mỗi bước đệ quy phải duy trì mối quan hệ keyof T → T[K]',
      'StringPath chỉ hoạt động với flat objects, không hoạt động với nested objects'
    ],
    correctAnswer: ['Recursion có kiểm soát với tham số độ sâu (depth-limited recursion)', 'Template literal types như "ngôn ngữ đại số chuỗi" ở tầng compile-time', 'Constraint solving khi mỗi bước đệ quy phải duy trì mối quan hệ keyof T → T[K]'],
    explanation: 'StringPath<T> được dùng để sinh ra toàn bộ "đường dẫn" hợp lệ trong một object lồng nhau. Bài toán này minh họa ba cơ chế trọng tâm: (1) Recursion có kiểm soát với tham số độ sâu (depth-limited recursion), (2) Template literal types như "ngôn ngữ đại số chuỗi" ở tầng compile-time, (3) Constraint solving khi mỗi bước đệ quy phải duy trì mối quan hệ keyof T → T[K]. Giới hạn độ sâu D ngăn recursion vô hạn; khi D = 0 hoặc T không còn là object, quá trình dừng.',
    points: 15,
    difficulty: 'medium' as const,
    tags: ['string-path', 'template-literal-types', 'recursion', 'constraint-solving']
  },
  
  // Hard questions (3)
  {
    id: 'ts-s04-11',
    question: 'Bạn đang thiết kế một utility type phức tạp với các yêu cầu: (1) hỗ trợ recursion sâu, (2) tránh type explosion, (3) đảm bảo hiệu năng type-checking, (4) dễ đọc và bảo trì. Giải pháp tốt nhất là gì?',
    type: 'single-choice' as const,
    options: [
      'Sử dụng recursion có kiểm soát với tham số độ sâu (D), giới hạn mặc định D = 2 hoặc 3 cho production. Alias hóa intermediate type để tránh recomputation. Đặt tên helper rõ ràng, tách helper nhỏ thay vì gộp nhiều biến đổi vào một type. Viết type-tests (expectTypeOf/tsd) để đảm bảo tính đúng đắn. Đo lường hiệu năng bằng tsc --diagnostics và ghi vào CI. Nếu recursion quá sâu (> 4-6 cấp), cân nhắc chuyển sang runtime schema validation (Zod) cho phần động.',
      'Luôn dùng recursion không giới hạn để đảm bảo tính đầy đủ',
      'Chỉ dùng any để tránh phức tạp',
      'Không cần kiểm tra hiệu năng, để compiler tự xử lý'
    ],
    correctAnswer: 'Sử dụng recursion có kiểm soát với tham số độ sâu (D), giới hạn mặc định D = 2 hoặc 3 cho production. Alias hóa intermediate type để tránh recomputation. Đặt tên helper rõ ràng, tách helper nhỏ thay vì gộp nhiều biến đổi vào một type. Viết type-tests (expectTypeOf/tsd) để đảm bảo tính đúng đắn. Đo lường hiệu năng bằng tsc --diagnostics và ghi vào CI. Nếu recursion quá sâu (> 4-6 cấp), cân nhắc chuyển sang runtime schema validation (Zod) cho phần động.',
    explanation: 'Để thiết kế utility type phức tạp hiệu quả: (1) Recursion có kiểm soát với tham số độ sâu (D), giới hạn mặc định D = 2 hoặc 3 cho production, (2) Alias hóa intermediate type để tránh recomputation, (3) Đặt tên helper rõ ràng, tách helper nhỏ - mỗi helper nên giải quyết một quy tắc duy nhất, (4) Viết type-tests (expectTypeOf/tsd) để đảm bảo tính đúng đắn, (5) Đo lường hiệu năng bằng tsc --diagnostics và ghi vào CI, (6) Nếu recursion quá sâu (> 4-6 cấp), cân nhắc chuyển sang runtime schema validation. Giới hạn hợp lý nên dựa vào tần suất thay đổi của dữ liệu.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['utility-type-design', 'recursion-control', 'performance', 'type-tests', 'best-practices', 'advanced']
  },
  {
    id: 'ts-s04-12',
    question: 'Khi nào nên dùng compile-time type computation và khi nào nên chuyển sang runtime schema validation?',
    type: 'single-choice' as const,
    options: [
      'Dùng compile-time type computation khi cấu trúc ổn định (ví dụ: Config, LogContext) - type có thể mô tả đầy đủ invariants ngay ở compile-time. Chuyển sang runtime schema validation (Zod, io-ts) khi dữ liệu đến từ nguồn bên ngoài, schema biến đổi liên tục - việc cố ép toàn bộ vào tầng type khiến chi phí bảo trì cao mà lợi ích giảm nhanh. Cách kết hợp phổ biến: dùng Zod schema cho runtime validation, sau đó z.infer để có compile-time type binding.',
      'Luôn dùng compile-time type computation cho mọi trường hợp',
      'Luôn dùng runtime validation, không cần compile-time types',
      'Không có sự khác biệt giữa hai cách tiếp cận'
    ],
    correctAnswer: 'Dùng compile-time type computation khi cấu trúc ổn định (ví dụ: Config, LogContext) - type có thể mô tả đầy đủ invariants ngay ở compile-time. Chuyển sang runtime schema validation (Zod, io-ts) khi dữ liệu đến từ nguồn bên ngoài, schema biến đổi liên tục - việc cố ép toàn bộ vào tầng type khiến chi phí bảo trì cao mà lợi ích giảm nhanh. Cách kết hợp phổ biến: dùng Zod schema cho runtime validation, sau đó z.infer để có compile-time type binding.',
    explanation: 'Biên giới hợp lý giữa compile-time và runtime nên dựa vào tần suất thay đổi của dữ liệu. Nếu cấu trúc ổn định (ví dụ: Config, LogContext), type có thể mô tả đầy đủ invariants ngay ở compile-time. Ngược lại, nếu dữ liệu đến từ nguồn bên ngoài, schema biến đổi liên tục, việc cố ép toàn bộ vào tầng type khiến chi phí bảo trì cao mà lợi ích giảm nhanh. Cách kết hợp phổ biến: const ConfigSchema = z.object({...}); type Config = z.infer<typeof ConfigSchema>; Ở đây, compile-time đảm bảo tính nhất quán của contract, còn runtime kiểm tra dữ liệu thực tế.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['compile-time-vs-runtime', 'schema-validation', 'zod', 'design-decisions', 'advanced']
  },
  {
    id: 'ts-s04-13',
    question: 'Bạn gặp các triệu chứng: IntelliSense trễ vài giây, thông báo lỗi dài hơn nửa trang, một thay đổi nhỏ lan truyền cảnh báo trên hàng chục file. Đây là dấu hiệu của gì và cách giải quyết?',
    type: 'single-choice' as const,
    options: [
      'Đây là dấu hiệu của quá tải type-level: bùng nổ tổ hợp (combinatorial expansion) khi conditional types phân phối trên union quá lớn hoặc recursion không chặn đáy. Giải quyết: giới hạn recursion depth, chia union lớn thành discriminated unions nhỏ, alias hóa intermediate types, di chuyển phần ràng buộc thứ yếu sang runtime schema, chuẩn hóa union sớm, và đo lường bằng tsc --diagnostics. Nếu type quá phức tạp, cân nhắc tách thành helper nhỏ hoặc chuyển sang runtime validation.',
      'Đây là lỗi của compiler, cần báo cáo bug',
      'Cần tắt strict mode để tránh lỗi',
      'Không có cách giải quyết, phải chấp nhận'
    ],
    correctAnswer: 'Đây là dấu hiệu của quá tải type-level: bùng nổ tổ hợp (combinatorial expansion) khi conditional types phân phối trên union quá lớn hoặc recursion không chặn đáy. Giải quyết: giới hạn recursion depth, chia union lớn thành discriminated unions nhỏ, alias hóa intermediate types, di chuyển phần ràng buộc thứ yếu sang runtime schema, chuẩn hóa union sớm, và đo lường bằng tsc --diagnostics. Nếu type quá phức tạp, cân nhắc tách thành helper nhỏ hoặc chuyển sang runtime validation.',
    explanation: 'Các triệu chứng này là dấu hiệu của quá tải type-level. Type computation giúp mã nguồn trở nên tự kiểm chứng, nhưng khi độ trừu tượng vượt ngưỡng, developer phải chi trả bằng trải nghiệm. Các hiện tượng này không phải lỗi của compiler mà là kết quả tự nhiên của bùng nổ tổ hợp (combinatorial expansion) khi conditional types phân phối trên union quá lớn hoặc recursion không chặn đáy. Các biện pháp tối ưu: (1) Chuẩn hóa union (normalize early), (2) Alias hóa intermediate type để tránh recomputation, (3) Di chuyển phần ràng buộc thứ yếu sang runtime schema (Zod/io-ts), (4) Giới hạn recursion depth, (5) Đo lường bằng tsc --diagnostics.',
    points: 20,
    difficulty: 'hard' as const,
    tags: ['type-overload', 'performance', 'diagnostics', 'optimization', 'dx', 'advanced']
  }
]

// Encrypt the answers
const encryptedQuestions = questions.map(q => ({
  ...q,
  correctAnswer: encryptAnswerAdvanced(q.correctAnswer, q.id)
}))

export function TypeScriptSeries04Quiz() {
  return (
    <SimpleQuiz
      title="TypeScript Series 04: Làm chủ Generic và Type Computation - Quiz"
      description="Kiểm tra hiểu biết của bạn về generics như compile-time programs, constraints, mapped types, conditional types, template literal types, utility types, anti-patterns, và các kỹ thuật type computation như Flatten, UnionToIntersection, StringPath. Dựa trên nội dung chương 4."
      timeLimit={25}
      passingScore={70}
      allowRetake={true}
      showCorrectAnswers={true}
      questions={encryptedQuestions}
    />
  )
}

