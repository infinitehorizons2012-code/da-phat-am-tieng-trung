export const initials = [
  { id: 'none', label: 'Không âm đầu' },
  { id: 'b', label: 'b' }, { id: 'p', label: 'p' }, { id: 'm', label: 'm' }, { id: 'f', label: 'f' },
  { id: 'd', label: 'd' }, { id: 't', label: 't' }, { id: 'n', label: 'n' }, { id: 'l', label: 'l' },
  { id: 'g', label: 'g' }, { id: 'k', label: 'k' }, { id: 'h', label: 'h' },
  { id: 'j', label: 'j' }, { id: 'q', label: 'q' }, { id: 'x', label: 'x' },
  { id: 'zh', label: 'zh' }, { id: 'ch', label: 'ch' }, { id: 'sh', label: 'sh' }, { id: 'r', label: 'r' },
  { id: 'z', label: 'z' }, { id: 'c', label: 'c' }, { id: 's', label: 's' }
];

export const finals = [
  'a', 'o', 'e', '-i', 'er', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong',
  'i', 'ia', 'ie', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'iong',
  'u', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'ueng',
  'ü', 'üe', 'üan', 'ün'
];

// Bản đồ mapping giữa thanh mẫu (dòng) và vận mẫu (cột) tạo ra Pinyin (Syllable)
// Sử dụng các luật kết hợp Pinyin chuẩn. 
// Chữ Y và W được coi là biến thể của i và u khi không có thanh mẫu.
export const pinyinMatrix = {
  'none': {
    'a': 'a', 'o': 'o', 'e': 'e', 'er': 'er', 'ai': 'ai', 'ei': 'ei', 'ao': 'ao', 'ou': 'ou', 'an': 'an', 'en': 'en', 'ang': 'ang', 'eng': 'eng',
    'i': 'yi', 'ia': 'ya', 'ie': 'ye', 'iao': 'yao', 'iu': 'you', 'ian': 'yan', 'in': 'yin', 'iang': 'yang', 'ing': 'ying', 'iong': 'yong',
    'u': 'wu', 'ua': 'wa', 'uo': 'wo', 'uai': 'wai', 'ui': 'wei', 'uan': 'wan', 'un': 'wen', 'uang': 'wang', 'ueng': 'weng',
    'ü': 'yu', 'üe': 'yue', 'üan': 'yuan', 'ün': 'yun'
  },
  'b': {
    'a': 'ba', 'o': 'bo', 'ai': 'bai', 'ei': 'bei', 'ao': 'bao', 'an': 'ban', 'en': 'ben', 'ang': 'bang', 'eng': 'beng',
    'i': 'bi', 'ie': 'bie', 'iao': 'biao', 'ian': 'bian', 'in': 'bin', 'ing': 'bing',
    'u': 'bu'
  },
  'p': {
    'a': 'pa', 'o': 'po', 'ai': 'pai', 'ei': 'pei', 'ao': 'pao', 'pou': 'pou', 'an': 'pan', 'en': 'pen', 'ang': 'pang', 'eng': 'peng',
    'i': 'pi', 'ie': 'pie', 'iao': 'piao', 'ian': 'pian', 'in': 'pin', 'ing': 'ping',
    'u': 'pu'
  },
  'm': {
    'a': 'ma', 'o': 'mo', 'e': 'me', 'ai': 'mai', 'ei': 'mei', 'ao': 'mao', 'ou': 'mou', 'an': 'man', 'en': 'men', 'ang': 'mang', 'eng': 'meng',
    'i': 'mi', 'ie': 'mie', 'iao': 'miao', 'iu': 'miu', 'ian': 'mian', 'in': 'min', 'ing': 'ming',
    'u': 'mu'
  },
  'f': {
    'a': 'fa', 'o': 'fo', 'ei': 'fei', 'ou': 'fou', 'an': 'fan', 'en': 'fen', 'ang': 'fang', 'eng': 'feng',
    'u': 'fu'
  },
  'd': {
    'a': 'da', 'e': 'de', 'ai': 'dai', 'ei': 'dei', 'ao': 'dao', 'ou': 'dou', 'an': 'dan', 'en': 'den', 'ang': 'dang', 'eng': 'deng', 'ong': 'dong',
    'i': 'di', 'ia': 'dia', 'ie': 'die', 'iao': 'diao', 'iu': 'diu', 'ian': 'dian', 'ing': 'ding',
    'u': 'du', 'uo': 'duo', 'ui': 'dui', 'uan': 'duan', 'un': 'dun'
  },
  't': {
    'a': 'ta', 'e': 'te', 'ai': 'tai', 'ao': 'tao', 'ou': 'tou', 'an': 'tan', 'ang': 'tang', 'eng': 'teng', 'ong': 'tong',
    'i': 'ti', 'ie': 'tie', 'iao': 'tiao', 'ian': 'tian', 'ing': 'ting',
    'u': 'tu', 'uo': 'tuo', 'ui': 'tui', 'uan': 'tuan', 'un': 'tun'
  },
  'n': {
    'a': 'na', 'e': 'ne', 'ai': 'nai', 'ei': 'nei', 'ao': 'nao', 'ou': 'nou', 'an': 'nan', 'en': 'nen', 'ang': 'nang', 'eng': 'neng', 'ong': 'nong',
    'i': 'ni', 'ie': 'nie', 'iao': 'niao', 'iu': 'niu', 'ian': 'nian', 'in': 'nin', 'iang': 'niang', 'ing': 'ning',
    'u': 'nu', 'uo': 'nuo', 'uan': 'nuan',
    'ü': 'nü', 'üe': 'nüe'
  },
  'l': {
    'a': 'la', 'e': 'le', 'ai': 'lai', 'ei': 'lei', 'ao': 'lao', 'ou': 'lou', 'an': 'lan', 'ang': 'lang', 'eng': 'leng', 'ong': 'long',
    'i': 'li', 'ia': 'lia', 'ie': 'lie', 'iao': 'liao', 'iu': 'liu', 'ian': 'lian', 'in': 'lin', 'iang': 'liang', 'ing': 'ling',
    'u': 'lu', 'uo': 'luo', 'uan': 'luan', 'un': 'lun',
    'ü': 'lü', 'üe': 'lüe'
  },
  'g': {
    'a': 'ga', 'e': 'ge', 'ai': 'gai', 'ei': 'gei', 'ao': 'gao', 'ou': 'gou', 'an': 'gan', 'en': 'gen', 'ang': 'gang', 'eng': 'geng', 'ong': 'gong',
    'u': 'gu', 'ua': 'gua', 'uo': 'guo', 'uai': 'guai', 'ui': 'gui', 'uan': 'guan', 'un': 'gun', 'uang': 'guang'
  },
  'k': {
    'a': 'ka', 'e': 'ke', 'ai': 'kai', 'ao': 'kao', 'ou': 'kou', 'an': 'kan', 'en': 'ken', 'ang': 'kang', 'eng': 'keng', 'ong': 'kong',
    'u': 'ku', 'ua': 'kua', 'uo': 'kuo', 'uai': 'kuai', 'ui': 'kui', 'uan': 'kuan', 'un': 'kun', 'uang': 'kuang'
  },
  'h': {
    'a': 'ha', 'e': 'he', 'ai': 'hai', 'ei': 'hei', 'ao': 'hao', 'ou': 'hou', 'an': 'han', 'en': 'hen', 'ang': 'hang', 'eng': 'heng', 'ong': 'hong',
    'u': 'hu', 'ua': 'hua', 'uo': 'huo', 'uai': 'huai', 'ui': 'hui', 'uan': 'huan', 'un': 'hun', 'uang': 'huang'
  },
  'j': {
    'i': 'ji', 'ia': 'jia', 'ie': 'jie', 'iao': 'jiao', 'iu': 'jiu', 'ian': 'jian', 'in': 'jin', 'iang': 'jiang', 'ing': 'jing', 'iong': 'jiong',
    'ü': 'ju', 'üe': 'jue', 'üan': 'juan', 'ün': 'jun'
  },
  'q': {
    'i': 'qi', 'ia': 'qia', 'ie': 'qie', 'iao': 'qiao', 'iu': 'qiu', 'ian': 'qian', 'in': 'qin', 'iang': 'qiang', 'ing': 'qing', 'iong': 'qiong',
    'ü': 'qu', 'üe': 'que', 'üan': 'quan', 'ün': 'qun'
  },
  'x': {
    'i': 'xi', 'ia': 'xia', 'ie': 'xie', 'iao': 'xiao', 'iu': 'xiu', 'ian': 'xian', 'in': 'xin', 'iang': 'xiang', 'ing': 'xing', 'iong': 'xiong',
    'ü': 'xu', 'üe': 'xue', 'üan': 'xuan', 'ün': 'xun'
  },
  'zh': {
    'a': 'zha', 'e': 'zhe', '-i': 'zhi', 'ai': 'zhai', 'ei': 'zhei', 'ao': 'zhao', 'ou': 'zhou', 'an': 'zhan', 'en': 'zhen', 'ang': 'zhang', 'eng': 'zheng', 'ong': 'zhong',
    'u': 'zhu', 'ua': 'zhua', 'uo': 'zhuo', 'uai': 'zhuai', 'ui': 'zhui', 'uan': 'zhuan', 'un': 'zhun', 'uang': 'zhuang'
  },
  'ch': {
    'a': 'cha', 'e': 'che', '-i': 'chi', 'ai': 'chai', 'ao': 'chao', 'ou': 'chou', 'an': 'chan', 'en': 'chen', 'ang': 'chang', 'eng': 'cheng', 'ong': 'chong',
    'u': 'chu', 'ua': 'chua', 'uo': 'chuo', 'uai': 'chuai', 'ui': 'chui', 'uan': 'chuan', 'un': 'chun', 'uang': 'chuang'
  },
  'sh': {
    'a': 'sha', 'e': 'she', '-i': 'shi', 'ai': 'shai', 'ei': 'shei', 'ao': 'shao', 'ou': 'shou', 'an': 'shan', 'en': 'shen', 'ang': 'shang', 'eng': 'sheng',
    'u': 'shu', 'ua': 'shua', 'uo': 'shuo', 'uai': 'shuai', 'ui': 'shui', 'uan': 'shuan', 'un': 'shun', 'uang': 'shuang'
  },
  'r': {
    'e': 're', '-i': 'ri', 'ao': 'rao', 'ou': 'rou', 'an': 'ran', 'en': 'ren', 'ang': 'rang', 'eng': 'reng', 'ong': 'rong',
    'u': 'ru', 'ua': 'rua', 'uo': 'ruo', 'ui': 'rui', 'uan': 'ruan', 'un': 'run'
  },
  'z': {
    'a': 'za', 'e': 'ze', '-i': 'zi', 'ai': 'zai', 'ei': 'zei', 'ao': 'zao', 'ou': 'zou', 'an': 'zan', 'en': 'zen', 'ang': 'zang', 'eng': 'zeng', 'ong': 'zong',
    'u': 'zu', 'uo': 'zuo', 'ui': 'zui', 'uan': 'zuan', 'un': 'zun'
  },
  'c': {
    'a': 'ca', 'e': 'ce', '-i': 'ci', 'ai': 'cai', 'ao': 'cao', 'ou': 'cou', 'an': 'can', 'en': 'cen', 'ang': 'cang', 'eng': 'ceng', 'ong': 'cong',
    'u': 'cu', 'uo': 'cuo', 'ui': 'cui', 'uan': 'cuan', 'un': 'cun'
  },
  's': {
    'a': 'sa', 'e': 'se', '-i': 'si', 'ai': 'sai', 'ao': 'sao', 'ou': 'sou', 'an': 'san', 'en': 'sen', 'ang': 'sang', 'eng': 'seng', 'ong': 'song',
    'u': 'su', 'uo': 'suo', 'ui': 'sui', 'uan': 'suan', 'un': 'sun'
  }
};
