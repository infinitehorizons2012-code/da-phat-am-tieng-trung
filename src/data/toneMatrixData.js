export const toneMatrixData = [
  // Hàng 1 (Thanh 1)
  [
    { row: 1, col: 1, hanzi: '咖啡', pinyin: 'kāfēi', tokens: [{base: 'ka', tone: 1, displayTone: 1}, {base: 'fei', tone: 1, displayTone: 1}] },
    { row: 1, col: 2, hanzi: '中国', pinyin: 'zhōngguó', tokens: [{base: 'zhong', tone: 1, displayTone: 1}, {base: 'guo', tone: 2, displayTone: 2}] },
    { row: 1, col: 3, hanzi: '机场', pinyin: 'jīchǎng', tokens: [{base: 'ji', tone: 1, displayTone: 1}, {base: 'chang', tone: 3, displayTone: 3}] },
    { row: 1, col: 4, hanzi: '音乐', pinyin: 'yīnyuè', tokens: [{base: 'yin', tone: 1, displayTone: 1}, {base: 'yue', tone: 4, displayTone: 4}] },
    { row: 1, col: 5, hanzi: '妈妈', pinyin: 'māma', tokens: [{base: 'ma', tone: 1, displayTone: 1}, {base: 'ma', tone: 5, displayTone: 5}] },
  ],
  // Hàng 2 (Thanh 2)
  [
    { row: 2, col: 1, hanzi: '明天', pinyin: 'míngtiān', tokens: [{base: 'ming', tone: 2, displayTone: 2}, {base: 'tian', tone: 1, displayTone: 1}] },
    { row: 2, col: 2, hanzi: '银行', pinyin: 'yínháng', tokens: [{base: 'yin', tone: 2, displayTone: 2}, {base: 'hang', tone: 2, displayTone: 2}] },
    { row: 2, col: 3, hanzi: '苹果', pinyin: 'píngguǒ', tokens: [{base: 'ping', tone: 2, displayTone: 2}, {base: 'guo', tone: 3, displayTone: 3}] },
    { row: 2, col: 4, hanzi: '决定', pinyin: 'juédìng', tokens: [{base: 'jue', tone: 2, displayTone: 2}, {base: 'ding', tone: 4, displayTone: 4}] },
    { row: 2, col: 5, hanzi: '时候', pinyin: 'shíhou', tokens: [{base: 'shi', tone: 2, displayTone: 2}, {base: 'hou', tone: 5, displayTone: 5}] },
  ],
  // Hàng 3 (Thanh 3)
  [
    { row: 3, col: 1, hanzi: '老师', pinyin: 'lǎoshī', tokens: [{base: 'lao', tone: 3, displayTone: 3}, {base: 'shi', tone: 1, displayTone: 1}] },
    { row: 3, col: 2, hanzi: '语言', pinyin: 'yǔyán', tokens: [{base: 'yu', tone: 3, displayTone: 3}, {base: 'yan', tone: 2, displayTone: 2}] },
    { row: 3, col: 3, hanzi: '你好', pinyin: 'nǐhǎo', tokens: [{base: 'ni', tone: 3, displayTone: 2}, {base: 'hao', tone: 3, displayTone: 3}] }, // Có biến điệu 3+3 -> 2+3
    { row: 3, col: 4, hanzi: '感谢', pinyin: 'gǎnxiè', tokens: [{base: 'gan', tone: 3, displayTone: 3}, {base: 'xie', tone: 4, displayTone: 4}] },
    { row: 3, col: 5, hanzi: '姐姐', pinyin: 'jiějie', tokens: [{base: 'jie', tone: 3, displayTone: 3}, {base: 'jie', tone: 5, displayTone: 5}] },
  ],
  // Hàng 4 (Thanh 4)
  [
    { row: 4, col: 1, hanzi: '认真', pinyin: 'rènzhēn', tokens: [{base: 'ren', tone: 4, displayTone: 4}, {base: 'zhen', tone: 1, displayTone: 1}] },
    { row: 4, col: 2, hanzi: '问题', pinyin: 'wèntí', tokens: [{base: 'wen', tone: 4, displayTone: 4}, {base: 'ti', tone: 2, displayTone: 2}] },
    { row: 4, col: 3, hanzi: '汉语', pinyin: 'hànyǔ', tokens: [{base: 'han', tone: 4, displayTone: 4}, {base: 'yu', tone: 3, displayTone: 3}] },
    { row: 4, col: 4, hanzi: '现代', pinyin: 'xiàndài', tokens: [{base: 'xian', tone: 4, displayTone: 4}, {base: 'dai', tone: 4, displayTone: 4}] },
    { row: 4, col: 5, hanzi: '爸爸', pinyin: 'bàba', tokens: [{base: 'ba', tone: 4, displayTone: 4}, {base: 'ba', tone: 5, displayTone: 5}] },
  ]
];

export const matrixRowHeaders = [
  { id: 1, label: 'Thanh 1', description: 'Nguyên âm cao' },
  { id: 2, label: 'Thanh 2', description: 'Dốc nâng hơi' },
  { id: 3, label: 'Thanh 3', description: 'Nửa sâu quặt' },
  { id: 4, label: 'Thanh 4', description: 'Đập búa phát dứt' },
];

export const matrixColHeaders = [
  { id: 1, label: 'Thanh 1 (¯)', description: 'Ngang cao [55]' },
  { id: 2, label: 'Thanh 2 (´)', description: 'Dốc lên [35]' },
  { id: 3, label: 'Thanh 3 (ˇ)', description: 'Trầm móc [214]' },
  { id: 4, label: 'Thanh 4 (`)', description: 'Giáng đột [51]' },
  { id: 5, label: 'Thanh 5 ( )', description: 'Thanh nhẹ' },
];
