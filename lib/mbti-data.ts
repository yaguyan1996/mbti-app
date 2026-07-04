export type CognitiveFunctionId = 'Ni' | 'Ne' | 'Si' | 'Se' | 'Ti' | 'Te' | 'Fi' | 'Fe'
export type MbtiType = 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' |
  'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'

export interface CognitiveFunction {
  id: CognitiveFunctionId
  name: string
  fullName: string
  orientation: 'introverted' | 'extroverted'
  domain: 'intuition' | 'sensing' | 'thinking' | 'feeling'
  description: string
  keywords: string[]
  shadow: string
}

export const cognitiveFunctions: Record<CognitiveFunctionId, CognitiveFunction> = {
  Ni: {
    id: 'Ni',
    name: '内向き直観',
    fullName: 'Introverted Intuition (Ni)',
    orientation: 'introverted',
    domain: 'intuition',
    description: '内向き直観は、複雑なパターンや象徴から深い洞察を引き出す機能です。無意識の処理を通じて、未来のビジョンや本質的な真実を「知る」感覚をもたらします。情報を深く内面で統合し、長期的な見通しや隠れた意味を見抜く力があります。焦点は広さよりも深さにあり、一つの核心的な真実に向かって収束していきます。',
    keywords: ['ビジョン', '洞察', '予感', 'パターン認識', '象徴', '収束思考', '長期的視点', '直感的理解'],
    shadow: 'シャドー機能として現れると、強迫的な予感や根拠のない確信、偏執的な思考パターンとして現れることがあります。',
  },
  Ne: {
    id: 'Ne',
    name: '外向き直観',
    fullName: 'Extroverted Intuition (Ne)',
    orientation: 'extroverted',
    domain: 'intuition',
    description: '外向き直観は、外部世界の可能性やつながりを探索する機能です。あらゆる物事に潜む可能性を見出し、異なるアイデアを結びつけて新しい概念を生み出します。発散的思考が得意で、「もしこうだったら？」という仮説を次々と生み出す創造的なエネルギーを持ちます。広さと多様性を重視し、常に新しい可能性を探し続けます。',
    keywords: ['可能性', '創造性', 'アイデア', '発散思考', 'つながり', '仮説', '探索', '革新'],
    shadow: 'シャドー機能として現れると、不安定さや散漫さ、現実逃避的な思考として現れることがあります。',
  },
  Si: {
    id: 'Si',
    name: '内向き感覚',
    fullName: 'Introverted Sensing (Si)',
    orientation: 'introverted',
    domain: 'sensing',
    description: '内向き感覚は、過去の経験や記憶を詳細に記録・参照する機能です。現在の経験を過去の記憶と比較・対照することで理解を深めます。伝統、慣習、証明された方法を重視し、信頼性と一貫性を大切にします。体の感覚や個人的な記憶を内面に蓄積し、それらを基準として現在の判断に活用します。',
    keywords: ['記憶', '伝統', '詳細', '比較', '信頼性', '慣習', '過去経験', '一貫性'],
    shadow: 'シャドー機能として現れると、変化への過度な抵抗や、過去の傷への固執として現れることがあります。',
  },
  Se: {
    id: 'Se',
    name: '外向き感覚',
    fullName: 'Extroverted Sensing (Se)',
    orientation: 'extroverted',
    domain: 'sensing',
    description: '外向き感覚は、現在の瞬間の外部世界を鋭く知覚する機能です。五感を通じて環境の変化をリアルタイムで察知し、即座に反応する能力を持ちます。今この瞬間の体験を最大化することに価値を置き、行動と経験を重視します。物理的な現実、美的体験、スリルや刺激を求める傾向があります。',
    keywords: ['現在', '五感', '即興', '行動', '体験', '刺激', '現実', '美的感覚'],
    shadow: 'シャドー機能として現れると、衝動的な行動や快楽への依存、リスクの軽視として現れることがあります。',
  },
  Ti: {
    id: 'Ti',
    name: '内向き思考',
    fullName: 'Introverted Thinking (Ti)',
    orientation: 'introverted',
    domain: 'thinking',
    description: '内向き思考は、内部的な論理的一貫性と正確さを追求する機能です。物事の仕組みを深く理解し、独自の分類体系や論理的枠組みを構築します。外部の規則より内部の論理を重視し、「なぜそうなのか」を徹底的に分析します。精密さ、正確さ、理論的純粋さを求め、複雑な問題を分解して理解することが得意です。',
    keywords: ['論理', '分析', '精密さ', '分類', '内部一貫性', '原理', '批判的思考', '独立した判断'],
    shadow: 'シャドー機能として現れると、他者への批判や皮肉、感情的な問題への冷淡さとして現れることがあります。',
  },
  Te: {
    id: 'Te',
    name: '外向き思考',
    fullName: 'Extroverted Thinking (Te)',
    orientation: 'extroverted',
    domain: 'thinking',
    description: '外向き思考は、外部世界を効率的に組織化・構造化する機能です。目標達成のための最も効果的な方法を見つけ出し、システムやプロセスを構築します。客観的なデータ、測定可能な結果、論理的な手順を重視します。決断力があり、物事を効率よく実行に移す能力に優れています。',
    keywords: ['効率', '組織化', '目標達成', 'データ', '構造', '実行力', '客観性', '成果'],
    shadow: 'シャドー機能として現れると、強権的な態度や他者への無配慮、成果主義への偏執として現れることがあります。',
  },
  Fi: {
    id: 'Fi',
    name: '内向き感情',
    fullName: 'Introverted Feeling (Fi)',
    orientation: 'introverted',
    domain: 'feeling',
    description: '内向き感情は、深い個人的な価値観と倫理観に基づいて判断する機能です。自己のアイデンティティと誠実さを最も重視し、外部の期待より内なる価値観に従います。感情を深く内面で処理し、他者の感情に対する強い共感と感受性を持ちます。個人の尊厳、自由、真正性を大切にします。',
    keywords: ['価値観', '誠実さ', '個性', '共感', '感受性', '自己理解', '倫理', '真正性'],
    shadow: 'シャドー機能として現れると、過度な自己批判や他者への道徳的判断、感情の爆発として現れることがあります。',
  },
  Fe: {
    id: 'Fe',
    name: '外向き感情',
    fullName: 'Extroverted Feeling (Fe)',
    orientation: 'extroverted',
    domain: 'feeling',
    description: '外向き感情は、集団の調和と人間関係の質を重視する機能です。他者の感情状態を敏感に察知し、グループ全体の幸福のために行動します。社会的規範、礼儀、人々の感情的なニーズへの配慮を大切にします。温かさ、思いやり、そして人々をつなぐ能力に優れています。',
    keywords: ['調和', '思いやり', '社会的絆', '感情察知', '共感', '礼儀', 'コミュニティ', '協調性'],
    shadow: 'シャドー機能として現れると、感情的な操作や過度な同調圧力、自己犠牲的な行動として現れることがあります。',
  },
}

export interface MbtiTypeData {
  type: MbtiType
  name: string
  nickname: string
  group: 'Analysts' | 'Diplomats' | 'Sentinels' | 'Explorers'
  groupJa: string
  color: string
  description: string
  longDescription: string
  functions: {
    dominant: CognitiveFunctionId
    auxiliary: CognitiveFunctionId
    tertiary: CognitiveFunctionId
    inferior: CognitiveFunctionId
    // シャドー機能（反対の方向性）
    opposing: CognitiveFunctionId    // 第5機能：反対人格
    criticalParent: CognitiveFunctionId // 第6機能：批判的な親
    trickster: CognitiveFunctionId   // 第7機能：トリックスター
    demon: CognitiveFunctionId       // 第8機能：悪魔
  }
  strengths: string[]
  weaknesses: string[]
  growthAreas: string[]
  famousExamples: string[]
}

export const mbtiTypes: Record<MbtiType, MbtiTypeData> = {
  INTJ: {
    type: 'INTJ',
    name: '建築家',
    nickname: '戦略的思考の独立者',
    group: 'Analysts',
    groupJa: '分析家',
    color: '#6366f1',
    description: '論理的で独立した思考を持つ戦略家。長期的なビジョンを持ち、複雑なシステムを理解して改善する能力に優れています。',
    longDescription: 'INTJは想像力豊かで戦略的な思考者です。すべての計画に具体性を持たせ、それを実現するための確固たる意志を持ちます。内向き直観（Ni）を主機能とし、深いビジョンと洞察力で未来を予見します。外向き思考（Te）が補助機能として機能し、そのビジョンを効率的に実現する方法を構築します。知識の追求と能力の向上に常に努め、高い基準を自己と他者に求めます。社交的な場は消耗しますが、知的な議論と深い対話を楽しみます。',
    functions: { dominant: 'Ni', auxiliary: 'Te', tertiary: 'Fi', inferior: 'Se', opposing: 'Ne', criticalParent: 'Ti', trickster: 'Fe', demon: 'Si' },
    strengths: ['戦略的思考', '独立性', '強い意志力', '問題解決能力', '長期的計画立案', '知的好奇心'],
    weaknesses: ['完璧主義', '孤立しがち', '批判的すぎる', '感情表現が苦手', '柔軟性に欠けることがある'],
    growthAreas: ['感情知性の向上', '現在の瞬間を楽しむ', '他者への配慮', 'チームワークの強化'],
    famousExamples: ['イーロン・マスク', 'レオナルド・ダ・ヴィンチ', 'ニコラ・テスラ', 'マーク・ザッカーバーグ'],
  },
  INTP: {
    type: 'INTP',
    name: '論理学者',
    nickname: '革新的な思考の探求者',
    group: 'Analysts',
    groupJa: '分析家',
    color: '#6366f1',
    description: '革新的な発明家で、知識への飽くなき欲求を持つ思考家。複雑な理論を構築し、あらゆる問題を論理的に分析します。',
    longDescription: 'INTPは高度に理論的で、あらゆる物事の仕組みを理解しようとする欲求を持ちます。内向き思考（Ti）が主機能であり、独自の論理的枠組みを構築することに喜びを見出します。外向き直観（Ne）が補助機能として多くの可能性とアイデアを生み出します。知識体系のどこかに矛盾や欠陥を発見すると、それを修正せずにはいられません。社交は必要最小限で十分と考え、深い思考と分析の時間を重視します。',
    functions: { dominant: 'Ti', auxiliary: 'Ne', tertiary: 'Si', inferior: 'Fe', opposing: 'Te', criticalParent: 'Ni', trickster: 'Se', demon: 'Fi' },
    strengths: ['深い分析力', '客観的思考', '創造的問題解決', '理論構築', '独立した判断', '知識の吸収'],
    weaknesses: ['実行力の欠如', '社交が苦手', '優柔不断', '過度な分析', '感情の無視'],
    growthAreas: ['行動力の向上', '感情への配慮', '社会的絆を築く', '実用的なスキルの活用'],
    famousExamples: ['アルバート・アインシュタイン', 'チャールズ・ダーウィン', 'ビル・ゲイツ', 'アラン・チューリング'],
  },
  ENTJ: {
    type: 'ENTJ',
    name: '指揮官',
    nickname: '生まれながらのリーダー',
    group: 'Analysts',
    groupJa: '分析家',
    color: '#6366f1',
    description: '大胆で想像力豊かなリーダー。強い意志を持ち、常に方法を見つけ出すか、方法を作り出します。',
    longDescription: 'ENTJは生まれながらのリーダーであり、カリスマと自信に満ちています。外向き思考（Te）が主機能として、目標達成のためのシステムを素早く構築します。内向き直観（Ni）が補助として長期的ビジョンを提供します。非効率なことに対して我慢ができず、常により良い方法を追求します。他者を指揮し、組織を動かす力に優れていますが、感情的な配慮が必要な場面で課題が生じることがあります。',
    functions: { dominant: 'Te', auxiliary: 'Ni', tertiary: 'Se', inferior: 'Fi', opposing: 'Ti', criticalParent: 'Ne', trickster: 'Si', demon: 'Fe' },
    strengths: ['リーダーシップ', '戦略的計画', '効率性の追求', '決断力', '自信', '長期的ビジョン'],
    weaknesses: ['頑固さ', '感情への無配慮', '支配的になりすぎる', '忍耐力の欠如', '批判的すぎる'],
    growthAreas: ['感情知性', '他者への共感', '柔軟性', '細部への注意'],
    famousExamples: ['スティーブ・ジョブズ', 'ジャック・ウェルチ', 'マーガレット・サッチャー', '坂本龍馬'],
  },
  ENTP: {
    type: 'ENTP',
    name: '討論者',
    nickname: '悪魔の代弁者',
    group: 'Analysts',
    groupJa: '分析家',
    color: '#6366f1',
    description: '賢く、好奇心旺盛な思考家。知的な挑戦と議論を楽しみ、常に新しい可能性を探求します。',
    longDescription: 'ENTPはアイデアと議論を愛する革新的思考者です。外向き直観（Ne）が主機能として、可能性の海を縦横無尽に泳ぎます。内向き思考（Ti）が補助として、それらのアイデアを論理的に検証します。常識に挑戦し、新しい視点を提示することを楽しみます。議論において反対側の立場をあえて取ることが多く（悪魔の代弁者）、これは思考を深めるためです。ルーティンを嫌い、常に刺激と新鮮さを求めます。',
    functions: { dominant: 'Ne', auxiliary: 'Ti', tertiary: 'Fe', inferior: 'Si', opposing: 'Ni', criticalParent: 'Te', trickster: 'Fi', demon: 'Se' },
    strengths: ['革新的思考', '問題解決', '柔軟性', '機知', '議論力', 'カリスマ'],
    weaknesses: ['実行力の欠如', '議論好きすぎる', '感情への無配慮', 'ルーティンが苦手', '優柔不断'],
    growthAreas: ['一貫性の向上', '感情への配慮', '計画の実行', '深く一つのことに集中する'],
    famousExamples: ['トーマス・エジソン', 'ベンジャミン・フランクリン', 'リチャード・フェインマン', '孫正義'],
  },
  INFJ: {
    type: 'INFJ',
    name: '提唱者',
    nickname: '静かなるビジョナリー',
    group: 'Diplomats',
    groupJa: '外交官',
    color: '#8b5cf6',
    description: '稀有で繊細なタイプ。深い洞察と共感を持ち、人類の向上のために情熱的に取り組みます。',
    longDescription: 'INFJは最も稀少なMBTIタイプの一つで、深い洞察力と強い共感力を持ちます。内向き直観（Ni）が主機能として未来のビジョンを提供し、外向き感情（Fe）が補助として人々との深いつながりを生み出します。他者の感情を直感的に察知し、人々を助けることに深い使命感を感じます。内向的でありながら、人類への深い関心を持つ矛盾した存在です。秘密主義的な面があり、自分の内面世界を全て開示することはありません。',
    functions: { dominant: 'Ni', auxiliary: 'Fe', tertiary: 'Ti', inferior: 'Se', opposing: 'Ne', criticalParent: 'Fi', trickster: 'Te', demon: 'Si' },
    strengths: ['深い洞察力', '共感力', '創造性', '使命感', '誠実さ', '人の気持ちを理解する力'],
    weaknesses: ['完璧主義', '燃え尽き症候群', '孤立しがち', '過度な感受性', '境界設定が苦手'],
    growthAreas: ['セルフケア', '境界線を設ける', '現在を楽しむ', '自分のニーズを優先する'],
    famousExamples: ['マーティン・ルーサー・キング', 'ネルソン・マンデラ', '宮崎駿', '清少納言'],
  },
  INFP: {
    type: 'INFP',
    name: '仲介者',
    nickname: '理想主義的な詩人',
    group: 'Diplomats',
    groupJa: '外交官',
    color: '#8b5cf6',
    description: '詩的で親切で利他的な性格。世界をより良い場所にしたいという深い欲求を持つ理想主義者です。',
    longDescription: 'INFPは深い感受性と豊かな内面世界を持つ理想主義者です。内向き感情（Fi）が主機能として、強固な個人的価値観と誠実さを育てます。外向き直観（Ne）が補助として多くの可能性と創造的なアイデアを生み出します。個人の価値観と世界の現実とのギャップを深く感じ、世界をより良くしたいという強い願望を持ちます。芸術、文学、創造的表現を通じて内面世界を表現することを好みます。',
    functions: { dominant: 'Fi', auxiliary: 'Ne', tertiary: 'Si', inferior: 'Te', opposing: 'Fe', criticalParent: 'Ni', trickster: 'Se', demon: 'Ti' },
    strengths: ['共感力', '創造性', '誠実さ', '理想主義', '適応力', '深い価値観'],
    weaknesses: ['現実離れ', '決断が苦手', '過度に自己批判', '外部組織が苦手', '批判に敏感'],
    growthAreas: ['実行力の向上', '自己批判を和らげる', '構造的アプローチ', '現実的な視点'],
    famousExamples: ['シェイクスピア', 'J.R.R.トールキン', '宮沢賢治', '夏目漱石'],
  },
  ENFJ: {
    type: 'ENFJ',
    name: '主人公',
    nickname: 'カリスマ的な教育者',
    group: 'Diplomats',
    groupJa: '外交官',
    color: '#8b5cf6',
    description: 'カリスマ的で感化力のあるリーダー。他者の成長と潜在能力の開花に深いインスピレーションを覚えます。',
    longDescription: 'ENFJは他者の成長を促すことに情熱を燃やすカリスマ的なリーダーです。外向き感情（Fe）が主機能として、グループの調和と他者の感情的ニーズへの鋭い察知力を提供します。内向き直観（Ni）が補助として深い洞察と未来的なビジョンをもたらします。他者を鼓舞し、チームをまとめる天賦の才能があります。自分の感情より他者のニーズを優先しがちで、境界線の設定が課題となります。',
    functions: { dominant: 'Fe', auxiliary: 'Ni', tertiary: 'Se', inferior: 'Ti', opposing: 'Fi', criticalParent: 'Ne', trickster: 'Si', demon: 'Te' },
    strengths: ['カリスマ性', 'コミュニケーション力', '共感力', 'リーダーシップ', '他者への影響力', '組織力'],
    weaknesses: ['自己犠牲', '批判への過敏さ', '他者への過度な関与', '自分のニーズの軽視'],
    growthAreas: ['自己ケアの優先', '境界線の設定', '論理的思考の強化', '自立性の向上'],
    famousExamples: ['オバマ大統領', 'オプラ・ウィンフリー', '緒方貞子', 'マザー・テレサ'],
  },
  ENFP: {
    type: 'ENFP',
    name: '広報運動家',
    nickname: '自由奔放な精神',
    group: 'Diplomats',
    groupJa: '外交官',
    color: '#8b5cf6',
    description: '熱狂的で創造的な社交家。人生のあらゆる出来事に隠れた理由と繋がりを見出します。',
    longDescription: 'ENFPは人々との深いつながりと人生の可能性を愛する情熱的な存在です。外向き直観（Ne）が主機能として無限の可能性と革新的なアイデアを生み出します。内向き感情（Fi）が補助として深い個人的価値観と真正性への欲求を育みます。人々の可能性を信じ、インスピレーションを与えることに生きがいを感じます。ルーティンや制限を嫌い、自由と表現を重視します。',
    functions: { dominant: 'Ne', auxiliary: 'Fi', tertiary: 'Te', inferior: 'Si', opposing: 'Ni', criticalParent: 'Fe', trickster: 'Ti', demon: 'Se' },
    strengths: ['熱狂と情熱', '創造性', '人を惹きつける力', '共感力', '楽観性', '適応力'],
    weaknesses: ['集中力の維持', '実行力', '過度な理想主義', '感情的な起伏', '細部への注意'],
    growthAreas: ['集中力の向上', '計画の実行', '現実的な見方', '安定性の構築'],
    famousExamples: ['ロビン・ウィリアムズ', 'ウィル・スミス', '手塚治虫', '桐島かれん'],
  },
  ISTJ: {
    type: 'ISTJ',
    name: '管理者',
    nickname: '誠実な監督者',
    group: 'Sentinels',
    groupJa: '番人',
    color: '#10b981',
    description: '実用的で事実に基づく最も信頼性の高いタイプ。責任感が強く、確立された伝統と秩序を重んじます。',
    longDescription: 'ISTJは細部への注意力と高い責任感を持つ信頼できる存在です。内向き感覚（Si）が主機能として、過去の経験と詳細な記憶を基に判断します。外向き思考（Te）が補助として、効率的な組織化と実行を可能にします。規則と手順を遵守することを重視し、信頼性と一貫性で周囲から信頼されます。変化には慎重ですが、証明された方法を着実に実行します。',
    functions: { dominant: 'Si', auxiliary: 'Te', tertiary: 'Fi', inferior: 'Ne', opposing: 'Se', criticalParent: 'Ti', trickster: 'Fe', demon: 'Ni' },
    strengths: ['信頼性', '責任感', '実用的', '詳細への注意', '忍耐力', '誠実さ'],
    weaknesses: ['変化への抵抗', '融通が利かない', '感情表現が苦手', '過度な保守性', '新しいアイデアへの懐疑'],
    growthAreas: ['柔軟性の向上', '新しい可能性への開放性', '感情表現', 'ビッグピクチャーの視点'],
    famousExamples: ['ジョージ・ワシントン', '渋沢栄一', '田中角栄', 'コンドリーザ・ライス'],
  },
  ISFJ: {
    type: 'ISFJ',
    name: '擁護者',
    nickname: '保護者タイプ',
    group: 'Sentinels',
    groupJa: '番人',
    color: '#10b981',
    description: '非常に献身的で温かい守護者。大切な人と物を守るための意欲と情熱を持ちます。',
    longDescription: 'ISFJは思いやりと実用性を兼ね備えた献身的なサポーターです。内向き感覚（Si）が主機能として、詳細な記憶と過去の経験を大切にします。外向き感情（Fe）が補助として、周囲の人々の感情的なニーズへの敏感さをもたらします。他者のために尽くすことに深い満足を感じますが、自分のニーズを後回しにしがちです。伝統と慣習を重視し、安定した環境の中で最高の力を発揮します。',
    functions: { dominant: 'Si', auxiliary: 'Fe', tertiary: 'Ti', inferior: 'Ne', opposing: 'Se', criticalParent: 'Fi', trickster: 'Te', demon: 'Ni' },
    strengths: ['思いやり', '信頼性', '実用性', '詳細への注意', '忠誠心', '支援力'],
    weaknesses: ['自己主張が苦手', '変化への抵抗', '批判への過敏さ', '過度な自己犠牲', '境界線設定'],
    growthAreas: ['自己主張の向上', '自分のニーズへの配慮', '変化への適応', '自己評価の向上'],
    famousExamples: ['マザー・テレサ', 'ロザ・パークス', '雅子皇后', 'アン王女'],
  },
  ESTJ: {
    type: 'ESTJ',
    name: '幹部',
    nickname: '伝統的な管理者',
    group: 'Sentinels',
    groupJa: '番人',
    color: '#10b981',
    description: '優れた管理者で、物事や人々を管理する能力を持つ。規則と秩序の守護者として、コミュニティのまとめ役を果たします。',
    longDescription: 'ESTJは組織と秩序を重視する実用的なリーダーです。外向き思考（Te）が主機能として、効率的な組織化と目標達成への強力な推進力をもたらします。内向き感覚（Si）が補助として、証明された方法と伝統への尊重を提供します。責任と義務を重んじ、コミュニティや組織のために尽力します。明確なルールと期待を好み、それを着実に実行します。',
    functions: { dominant: 'Te', auxiliary: 'Si', tertiary: 'Ne', inferior: 'Fi', opposing: 'Ti', criticalParent: 'Se', trickster: 'Ni', demon: 'Fe' },
    strengths: ['組織力', 'リーダーシップ', '信頼性', '決断力', '実用性', '強い職業倫理'],
    weaknesses: ['柔軟性の欠如', '感情への無配慮', '変化への抵抗', '権威主義的になりがち'],
    growthAreas: ['感情知性', '柔軟な思考', '他者の視点への開放性', '創造的アプローチ'],
    famousExamples: ['ビスマルク', '東条英機', 'ヒラリー・クリントン', 'ジョン・D・ロックフェラー'],
  },
  ESFJ: {
    type: 'ESFJ',
    name: '領事官',
    nickname: '社交的なサポーター',
    group: 'Sentinels',
    groupJa: '番人',
    color: '#10b981',
    description: '非常に配慮があり社交的な人物。人々を気にかける心優しい存在で、常に必要とされることを喜びとします。',
    longDescription: 'ESFJは人々との深いつながりと調和を大切にする社交的なサポーターです。外向き感情（Fe）が主機能として、グループの感情的ニーズへの鋭い察知力と人々をまとめる力をもたらします。内向き感覚（Si）が補助として、信頼できる伝統と過去の経験を基盤にします。他者の幸福のために積極的に行動し、感謝されることで活力を得ます。社会的規範と伝統を重んじ、コミュニティの絆を大切にします。',
    functions: { dominant: 'Fe', auxiliary: 'Si', tertiary: 'Ne', inferior: 'Ti', opposing: 'Fi', criticalParent: 'Se', trickster: 'Ni', demon: 'Te' },
    strengths: ['思いやり', '社交性', '支援力', '組織力', '忠誠心', '実用的'],
    weaknesses: ['批判への過敏さ', '他者の承認への依存', '変化への抵抗', '論理より感情を優先'],
    growthAreas: ['自立心の向上', '批判的思考', '自己主張', '変化への適応力'],
    famousExamples: ['テイラー・スウィフト', 'ジュリア・ロバーツ', '天海祐希', 'デスモンド・ツツ'],
  },
  ISTP: {
    type: 'ISTP',
    name: '巨匠',
    nickname: '大胆な実用主義者',
    group: 'Explorers',
    groupJa: '探検家',
    color: '#f59e0b',
    description: '大胆で実用的な実験家。全種類の道具を器用に使いこなし、物事の仕組みを探求することに喜びを感じます。',
    longDescription: 'ISTPは物事の仕組みを深く理解し、実用的な解決策を見出す職人気質の思考者です。内向き思考（Ti）が主機能として、独自の論理的枠組みで物事を分析します。外向き感覚（Se）が補助として、現在の瞬間の詳細な知覚と即座の対応力をもたらします。行動と実践を通じて学ぶことを好み、抽象的な理論よりも具体的な経験を重視します。危機的状況で冷静さを保ち、実用的な判断ができます。',
    functions: { dominant: 'Ti', auxiliary: 'Se', tertiary: 'Ni', inferior: 'Fe', opposing: 'Te', criticalParent: 'Si', trickster: 'Ne', demon: 'Fi' },
    strengths: ['論理的思考', '実用的スキル', '冷静さ', '適応力', '問題解決', '危機対応'],
    weaknesses: ['感情表現が苦手', '長期計画が苦手', '対人関係', 'コミットメントへの抵抗'],
    growthAreas: ['感情表現の向上', '長期的計画', '人間関係の構築', '将来への見通し'],
    famousExamples: ['スティーブ・ジョブズ（初期）', '宮本武蔵', 'クリント・イーストウッド', 'ブルース・リー'],
  },
  ISFP: {
    type: 'ISFP',
    name: '冒険家',
    nickname: '柔軟な芸術家',
    group: 'Explorers',
    groupJa: '探検家',
    color: '#f59e0b',
    description: '柔軟で魅力的な芸術家。常に自分らしい方法で物事を探求・体験する準備ができています。',
    longDescription: 'ISFPは深い感受性と美的感覚を持つ穏やかな芸術家です。内向き感情（Fi）が主機能として、強い個人的価値観と誠実さへの欲求をもたらします。外向き感覚（Se）が補助として、現在の瞬間の美しさと体験への喜びを提供します。自分の感情や価値観を直接言葉にするのは苦手ですが、芸術や行動を通じて表現します。自由と自己表現を重視し、制限や批判を嫌います。',
    functions: { dominant: 'Fi', auxiliary: 'Se', tertiary: 'Ni', inferior: 'Te', opposing: 'Fe', criticalParent: 'Si', trickster: 'Ne', demon: 'Ti' },
    strengths: ['芸術的感性', '共感力', '柔軟性', '穏やかさ', '誠実さ', '現在を楽しむ力'],
    weaknesses: ['自己主張が苦手', '長期計画', '批判への過敏さ', '競争環境が苦手', '優柔不断'],
    growthAreas: ['自己主張の向上', '長期的目標設定', '批判を建設的に受け取る', '組織力の強化'],
    famousExamples: ['モーツァルト', 'マイケル・ジャクソン', '村上春樹（初期）', '坂本龍一'],
  },
  ESTP: {
    type: 'ESTP',
    name: '起業家',
    nickname: '大胆なトラブルシューター',
    group: 'Explorers',
    groupJa: '探検家',
    color: '#f59e0b',
    description: '賢く、活力に溢れ、非常に知覚力が高い人物。周囲の物事を見て回り、リスクを取ることが好きです。',
    longDescription: 'ESTPは行動と刺激を愛する活動的な現実主義者です。外向き感覚（Se）が主機能として、現在の瞬間への鋭い知覚と即座の行動力をもたらします。内向き思考（Ti）が補助として、状況を素早く分析し実用的な解決策を生み出します。退屈を最も嫌い、常に刺激と新しい体験を求めます。社交的で機知に富み、人々を楽しませる才能があります。リスクを恐れず、ピンチを乗り越える能力に優れています。',
    functions: { dominant: 'Se', auxiliary: 'Ti', tertiary: 'Fe', inferior: 'Ni', opposing: 'Si', criticalParent: 'Te', trickster: 'Fi', demon: 'Ne' },
    strengths: ['行動力', '対人スキル', 'リスク管理', '機知', '問題解決', '現実認識'],
    weaknesses: ['長期計画が苦手', '感情への無配慮', '衝動性', '退屈への耐性', '細部の見落とし'],
    growthAreas: ['長期的思考', '感情知性', '計画性', '深い内省'],
    famousExamples: ['ドナルド・トランプ', 'サミュエル・L・ジャクソン', '武田信玄', '徳川家康'],
  },
  ESFP: {
    type: 'ESFP',
    name: 'エンターテイナー',
    nickname: '自然なパフォーマー',
    group: 'Explorers',
    groupJa: '探検家',
    color: '#f59e0b',
    description: '自発的で活発、熱狂的なエンターテイナー。人生はパーティーで、自分はホストという感覚で生きています。',
    longDescription: 'ESFPは人生を祝祭として体験する情熱的なエンターテイナーです。外向き感覚（Se）が主機能として、現在の瞬間への深い関与と感覚的な喜びをもたらします。内向き感情（Fi）が補助として、真正性と個人的価値観への誠実さを提供します。人々を楽しませることに真の喜びを感じ、グループのエネルギーを高めます。即興と行動を好み、計画よりも流れに従います。生きることそのものを楽しむ天才です。',
    functions: { dominant: 'Se', auxiliary: 'Fi', tertiary: 'Te', inferior: 'Ni', opposing: 'Si', criticalParent: 'Fe', trickster: 'Ti', demon: 'Ne' },
    strengths: ['社交性', '楽観性', '適応力', '実用性', '観察力', '他者を楽しませる力'],
    weaknesses: ['長期計画', '批判への過敏さ', '深い思考への苦手意識', '退屈への耐性', '衝動性'],
    growthAreas: ['長期的視点', '批判的思考', '内省の習慣', '計画実行力'],
    famousExamples: ['マリリン・モンロー', 'エルビス・プレスリー', '浜崎あゆみ', 'マドンナ'],
  },
}

export interface TestQuestion {
  id: number
  text: string
  dimensionA: 'E' | 'S' | 'T' | 'J'
  dimensionB: 'I' | 'N' | 'F' | 'P'
  labelA: string
  labelB: string
}

export const testQuestions: TestQuestion[] = [
  // ===== E / I (8問) =====
  { id: 1, dimensionA: 'E', dimensionB: 'I', text: '仕事で大事な決断をする前、あなたは自然とどちらに向かいますか？', labelA: '誰かに話して考えを整理する', labelB: 'まず一人で頭の中で考え抜く' },
  { id: 2, dimensionA: 'E', dimensionB: 'I', text: '大人数のイベントや飲み会が終わった後、あなたはどんな感覚ですか？', labelA: '楽しかった、もっと話したかった', labelB: '疲れた、一人になってほっとする' },
  { id: 3, dimensionA: 'E', dimensionB: 'I', text: 'あなたが最も集中できるのはどんな状況ですか？', labelA: '周りに人がいて適度に活気がある場所', labelB: '誰にも邪魔されない静かな一人の空間' },
  { id: 4, dimensionA: 'E', dimensionB: 'I', text: 'アイデアが浮かんだとき、あなたは最初にどうしますか？', labelA: 'すぐ誰かに話して反応をもらいながら深める', labelB: '自分の中で十分に温めてから話す' },
  { id: 5, dimensionA: 'E', dimensionB: 'I', text: '仕事のモチベーションが上がるのはどんな時ですか？', labelA: 'チームで盛り上がって一緒に動いている時', labelB: '自分のペースで深く集中して取り組んでいる時' },
  { id: 6, dimensionA: 'E', dimensionB: 'I', text: '初めて参加するグループでは、あなたはどちらに近いですか？', labelA: '自分から積極的に声をかけ、多くの人と話す', labelB: '様子を見て、気の合う人が見つかってから深く話す' },
  { id: 7, dimensionA: 'E', dimensionB: 'I', text: '休日に何の予定もない時、自然とどちらに引き寄せられますか？', labelA: '誰かを誘うか、人がいる場所に出かける', labelB: '一人で好きなことに没頭してゆっくり過ごす' },
  { id: 8, dimensionA: 'E', dimensionB: 'I', text: '感情的に辛いことがあった時、あなたはどうしますか？', labelA: '誰かに話して発散する', labelB: '一人で内省して自分なりに整理する' },

  // ===== S / N (8問) =====
  { id: 9, dimensionA: 'S', dimensionB: 'N', text: '新しいプロジェクトを任された時、最初に気になるのはどちらですか？', labelA: '具体的な手順・期日・必要なリソース', labelB: 'このプロジェクトの目的・意味・大きな方向性' },
  { id: 10, dimensionA: 'S', dimensionB: 'N', text: '誰かの話を聞いていて、あなたが興味を持つのはどちらですか？', labelA: '実際に起きた出来事・具体的なエピソード', labelB: 'そこに潜むパターン・背景にある意味や可能性' },
  { id: 11, dimensionA: 'S', dimensionB: 'N', text: '信頼できる判断基準はどちらですか？', labelA: '実際に試して効果が実証された方法', labelB: '論理的に正しいと感じる新しいアプローチ' },
  { id: 12, dimensionA: 'S', dimensionB: 'N', text: '問題にぶつかった時、あなたはまず何を考えますか？', labelA: '過去に似たケースはなかったか、前例はどうだったか', labelB: '根本的にどういう構造の問題か、本質は何か' },
  { id: 13, dimensionA: 'S', dimensionB: 'N', text: 'あなたの学び方はどちらに近いですか？', labelA: '具体的な事例・実践・経験から積み上げて理解する', labelB: '全体の概念・理論を先に把握してから細部に入る' },
  { id: 14, dimensionA: 'S', dimensionB: 'N', text: '将来のことを考える時、あなたはどちらに向きますか？', labelA: '現実的で達成可能な近い将来の計画', labelB: '5年後・10年後の大きなビジョンや理想像' },
  { id: 15, dimensionA: 'S', dimensionB: 'N', text: '仕事で最も力を発揮できるのはどんな場面ですか？', labelA: '正確さ・細部への注意が求められる作業', labelB: 'アイデア出し・概念的な設計・可能性を探る作業' },
  { id: 16, dimensionA: 'S', dimensionB: 'N', text: '「なぜそうなるのか」を理解する時、あなたはどちらが腑に落ちますか？', labelA: '具体的な事実とデータで説明されると納得できる', labelB: '背後にあるメカニズムやパターンで説明されると納得できる' },

  // ===== T / F (8問) =====
  { id: 17, dimensionA: 'T', dimensionB: 'F', text: '親しい友人が悩みを打ち明けてきた時、あなたは自然とどうしますか？', labelA: '原因を分析して具体的な解決策を提案する', labelB: 'まず気持ちに寄り添い、とにかく聴く' },
  { id: 18, dimensionA: 'T', dimensionB: 'F', text: '組織で不公平なルールがあった時、あなたはどちらを重視しますか？', labelA: '全員に同じ基準を適用することの公平さ', labelB: '一人ひとりの事情に配慮した柔軟な対応' },
  { id: 19, dimensionA: 'T', dimensionB: 'F', text: '誰かの考えに同意できない時、あなたはどうしますか？', labelA: '論理的な矛盾を指摘し、正しい方向に是正する', labelB: '相手の気持ちを傷つけないよう言い方に気をつけながら伝える' },
  { id: 20, dimensionA: 'T', dimensionB: 'F', text: '批判やネガティブなフィードバックを受けた時、最初の反応はどちらですか？', labelA: '内容が論理的に正しいかを考える（感情より内容）', labelB: '相手との関係や、どんな意図で言ったのかが気になる' },
  { id: 21, dimensionA: 'T', dimensionB: 'F', text: 'チームで意見が割れた時、あなたはどう動きますか？', labelA: 'データと論拠を示して最も合理的な結論を導く', labelB: '全員が納得感を持てるよう、対話を重ねて合意を作る' },
  { id: 22, dimensionA: 'T', dimensionB: 'F', text: '優れたリーダーシップとは何だと思いますか？', labelA: '目標を明確にして、結果を出すために厳しく導く力', labelB: 'チームの感情と関係を大切にして、人をひとつにする力' },
  { id: 23, dimensionA: 'T', dimensionB: 'F', text: '正しいことを言う時と、相手が傷つくことを言わない時、どちらを優先しますか？', labelA: '正しいことを伝えることの方が長期的には相手のためになる', labelB: '今の関係と感情を守ることが優先されることが多い' },
  { id: 24, dimensionA: 'T', dimensionB: 'F', text: '仕事での評価で、あなたが最も重視するのはどちらですか？', labelA: '成果・実績・能力', labelB: 'プロセス・姿勢・周囲への影響' },

  // ===== J / P (8問) =====
  { id: 25, dimensionA: 'J', dimensionB: 'P', text: '急に予定が変更になった時、あなたはどう感じますか？', labelA: 'ストレスを感じる、できれば変えたくない', labelB: '状況次第ではむしろ面白い、対応できる' },
  { id: 26, dimensionA: 'J', dimensionB: 'P', text: '締め切りのある仕事、あなたはどちらのタイプですか？', labelA: '余裕をもって早めに仕上げて、見直し時間を確保する', labelB: '直前に集中力が上がり、追い込まれた時の方が力が出る' },
  { id: 27, dimensionA: 'J', dimensionB: 'P', text: '旅行に行く時、あなたはどちらですか？', labelA: '宿・観光地・食事まで事前にリサーチして計画する', labelB: '大まかな方向だけ決めて、現地の流れを楽しむ' },
  { id: 28, dimensionA: 'J', dimensionB: 'P', text: '仕事の進め方として、あなたに合うのはどちらですか？', labelA: '一つを完結させてから次に進む', labelB: '複数を同時に進めながら、その時の状況で優先順位を決める' },
  { id: 29, dimensionA: 'J', dimensionB: 'P', text: '「まだ決めない」という状況に対して、あなたはどう感じますか？', labelA: '早く決めてスッキリしたい、宙ぶらりんは落ち着かない', labelB: '可能性を開けておきたい、焦って決める必要はない' },
  { id: 30, dimensionA: 'J', dimensionB: 'P', text: '毎日のルーティンについて、あなたはどちらに近いですか？', labelA: '決まったリズムがあると安心して動きやすい', labelB: '毎日同じパターンより、その日の流れに合わせたい' },
  { id: 31, dimensionA: 'J', dimensionB: 'P', text: 'やるべきことを管理する方法として、あなたはどちらですか？', labelA: 'リスト・スケジュール・計画表を作って管理する', labelB: '頭の中や直感で管理して、必要な時に動く' },
  { id: 32, dimensionA: 'J', dimensionB: 'P', text: '仕事や生活空間について、あなたはどちらを自然と好みますか？', labelA: '整理整頓されていて体系的な状態', labelB: '少しカオスでも自分なりの秩序がある状態' },
]

export function calculateMbtiType(answers: Record<number, number>): MbtiType {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

  testQuestions.forEach((q) => {
    const answer = answers[q.id]
    if (answer === undefined || answer === null) return
    // 5-point scale: 1=strongly A, 2=somewhat A, 3=neutral, 4=somewhat B, 5=strongly B
    if (answer === 1) { scores[q.dimensionA] += 2 }
    else if (answer === 2) { scores[q.dimensionA] += 1 }
    else if (answer === 4) { scores[q.dimensionB] += 1 }
    else if (answer === 5) { scores[q.dimensionB] += 2 }
    // answer === 3 → no score
  })

  const type =
    (scores.E >= scores.I ? 'E' : 'I') +
    (scores.S >= scores.N ? 'S' : 'N') +
    (scores.T >= scores.F ? 'T' : 'F') +
    (scores.J >= scores.P ? 'J' : 'P')

  return type as MbtiType
}

export const typeGroups = {
  Analysts: { types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'] as MbtiType[], color: '#6366f1', ja: '分析家' },
  Diplomats: { types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'] as MbtiType[], color: '#8b5cf6', ja: '外交官' },
  Sentinels: { types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'] as MbtiType[], color: '#10b981', ja: '番人' },
  Explorers: { types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'] as MbtiType[], color: '#f59e0b', ja: '探検家' },
}
