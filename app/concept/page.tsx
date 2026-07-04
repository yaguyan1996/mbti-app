'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

const coreValues = [
  {
    en: 'Vulnerability',
    ja: '弱さ',
    desc: '弱さと向き合うことが、変化の入り口になる。',
    color: '#6366f1',
  },
  {
    en: 'Growth',
    ja: '成長',
    desc: 'できなかったことができる瞬間の感動が、人を動かす力になる。',
    color: '#8b5cf6',
  },
  {
    en: 'Authenticity',
    ja: '真正性',
    desc: 'ありのままの自分でいることが、最大の強さになる。',
    color: '#10b981',
  },
  {
    en: 'Connection',
    ja: 'つながり',
    desc: '自己理解は他者理解へ。補い合い、発展できる関係をつくる。',
    color: '#f59e0b',
  },
  {
    en: 'Nature',
    ja: '自然',
    desc: '自然の中でこそ、人間の本心は目を覚ます。',
    color: '#06b6d4',
  },
  {
    en: 'Legacy',
    ja: '還元',
    desc: '自分の個性と価値を社会に還元することが、生きがいになる。',
    color: '#ec4899',
  },
]

const lifeStages = [
  { age: '6〜18歳', theme: '人生の土台をつくる', question: '「私はどんな人間？何が好き？」' },
  { age: '20〜40歳', theme: '自分の軸でAI時代を生きる', question: '「私の本当の強みと価値は何？」' },
  { age: '40〜60歳', theme: '豊かな人生の選択をする', question: '「残りの人生を何のために生きる？」' },
  { age: '60〜80歳', theme: '経験と知恵を次世代へ還元する', question: '「私が残せるものは何？」' },
]

export default function ConceptPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f0' }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center" style={{ background: 'linear-gradient(180deg, #1B4332 0%, #2C5F2E 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="inline-block text-xs px-3 py-1 rounded-full mb-8 font-medium tracking-widest"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#a7f3d0' }}>
            INNER NATURE
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            弱さを知った日から、<br />本当の自分が始まる。
          </h1>
          <p className="text-green-200 text-lg leading-relaxed" style={{ opacity: 0.85 }}>
            — ありのままの自分で、命を燃やして生きるために —
          </p>
        </div>
      </section>

      {/* 時代の問い */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#2C5F2E' }}>CONCEPT</div>
          <h2 className="text-3xl font-bold text-stone-800 mb-8">時代の問い</h2>
          <div className="space-y-4 text-stone-600 leading-loose text-lg">
            <p>肩書き、スキル、収入、実績。<br />私たちはずっと、それを積み上げることを「生きること」だと思ってきた。</p>
            <p>でもAIが、それらを静かに代替し始めている。</p>
            <p>仕事のあり方が変わる時、鎧が剥がれた時——<br />残るのは、ただひとつ。</p>
            <p className="text-2xl font-bold text-stone-800 py-4">「あなたは、何者か。」</p>
            <p>その問いに答えられる人だけが、AI時代を人間らしく生きていける。<br />
            スキルではなく個性で。肩書きではなく存在で。<br />
            AIにはできない、あなただけの価値で——世界と関わることができる。</p>
          </div>
        </div>
      </section>

      {/* 原点 */}
      <section className="py-20 px-4" style={{ background: 'rgba(44,95,46,0.04)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#2C5F2E' }}>FOUNDER'S STORY</div>
          <h2 className="text-3xl font-bold text-stone-800 mb-8">創業者の想い</h2>
          <div className="space-y-5 text-stone-600 leading-loose">
            <p>これは、創業者自身の悩みから生まれた。</p>
            <p>目標を達成することに価値を感じ、感情より目的を優先して生きてきた。<br />仲間はいる。でも、ひとりぼっちの感覚がずっとあった。</p>
            <p>できないことが多かった。<br />でも学び、研究し、努力を重ねた。<br />できるようになった瞬間の喜びと感動が、次への力になった。</p>
            <p>そして、一番辛かったのは——<br />弱さと向き合うことだった。</p>
            <p>理想の自分、期待している自分、大きく見せたい自分。<br />素直になれない自分、恥ずかしい自分。</p>
            <p>それを手放してありのままの自分と向き合う瞬間は、<br />辛く、受け入れがたく、悔しく——<br />自分が小さく、価値がないように感じた。</p>
            <p>でも、その瞬間から何かが変わった。</p>
            <p>素直に助けを求められるようになった。<br />頼れるようになった。<br />一緒に取り組める仲間が、集まってきた。</p>
            <p className="text-xl font-bold text-stone-800 border-l-4 pl-4" style={{ borderColor: '#2C5F2E' }}>
              弱さを受け入れた時にこそ、人は本当に強くなれる。
            </p>
            <p>その体験が、INNER NATUREの原点だ。</p>
          </div>
        </div>
      </section>

      {/* 人が変わる瞬間 */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#2C5F2E' }}>MOMENT OF CHANGE</div>
          <h2 className="text-3xl font-bold text-stone-800 mb-8">人が変わる瞬間</h2>
          <div className="space-y-4 text-stone-600 leading-loose">
            <p>レベルは関係ない。</p>
            <p className="text-2xl font-bold text-stone-800 py-4 text-center">「できなかったことが、できるようになった」</p>
            <p>その瞬間の喜びと感動が、人を変える。</p>
            <p>小さな一歩に見えても、それは必ず大きな変化につながっている。<br />
            弱さを認めた小さな勇気が、<br />
            素直に頼れた小さな一歩が、<br />
            諦めずにやり続けた小さな積み重ねが——</p>
            <p className="text-xl font-bold text-stone-800">気づいた時、昨日とは違う自分になっている。</p>
            <p>INNER NATUREは、その「変わる瞬間」が生まれる場所をつくる。</p>
          </div>
        </div>
      </section>

      {/* 自然の役割 */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2C5F2E 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#a7f3d0' }}>ROLE OF NATURE</div>
          <h2 className="text-3xl font-bold text-white mb-8">自然の役割</h2>
          <div className="space-y-4 text-green-100 leading-loose text-lg" style={{ opacity: 0.9 }}>
            <p>人間はもともと、自然から生まれた。</p>
            <p>デジタルとAIに囲まれた時代だからこそ、<br />人は本能的に自然を求める。</p>
            <p className="text-white font-medium">森の静けさ、風の音、土の匂い、光と影。<br />五感をフルに使った時、人は初めて頭を止め、心の声を聞く。</p>
            <p>自然は優しく、時に厳しい。<br />その中で人は喜怒哀楽を感じ、真・美・善を学ぶ。</p>
            <p className="text-xl font-bold text-white">INNER NATUREの自然は、ただの景色ではない。<br />人間の本心を呼び覚ます、最大の教師だ。</p>
          </div>
        </div>
      </section>

      {/* 自己理解がもたらすもの */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#2C5F2E' }}>WHAT SELF-UNDERSTANDING BRINGS</div>
          <h2 className="text-3xl font-bold text-stone-800 mb-8">自己理解がもたらすもの</h2>
          <div className="space-y-4 text-stone-600 leading-loose">
            <p>自己理解とは、自分を評価することではない。</p>
            <p className="text-xl font-bold text-stone-800">強みも弱みも、光も影も、すべてを知り——<br />「これが私だ」と受け入れることだ。</p>
            <div className="grid md:grid-cols-2 gap-4 my-8">
              {[
                { label: '強みは', value: '誰かのために使える。' },
                { label: '弱みは', value: '誰かに助けてもらえる。' },
                { label: '失敗は', value: '恥ではなく自己理解の喜びになる。' },
                { label: '成長が', value: '義務ではなくワクワクになる。' },
              ].map((item) => (
                <div key={item.label} className="p-5 rounded-xl"
                  style={{ background: 'rgba(44,95,46,0.06)', border: '1px solid rgba(44,95,46,0.15)' }}>
                  <span className="font-bold text-stone-700">{item.label}</span>
                  <span className="text-stone-600">　{item.value}</span>
                </div>
              ))}
            </div>
            <p>そして自分をありのままに受け入れた人は、<br />他者もありのままに受け入れることができる。</p>
            <p className="text-xl font-bold text-stone-800">自己理解は、豊かな人間関係の入り口だ。</p>
          </div>
        </div>
      </section>

      {/* ライフステージ */}
      <section className="py-20 px-4" style={{ background: 'rgba(44,95,46,0.04)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#2C5F2E' }}>LIFE STAGES</div>
          <h2 className="text-3xl font-bold text-stone-800 mb-4">ライフステージと向き合う問い</h2>
          <p className="text-stone-500 mb-10">INNER NATUREは、一度行けば終わりの場所ではない。<br />人生のどのステージでも、何度でも戻ってこられる場所だ。</p>
          <div className="space-y-4">
            {lifeStages.map((stage, i) => (
              <div key={i} className="flex gap-6 p-6 rounded-2xl items-start"
                style={{ background: '#fff', border: '1px solid rgba(44,95,46,0.15)' }}>
                <div className="shrink-0 w-20 text-center">
                  <div className="text-sm font-bold" style={{ color: '#2C5F2E' }}>{stage.age}</div>
                </div>
                <div>
                  <div className="font-bold text-stone-700 mb-1">{stage.theme}</div>
                  <div className="text-stone-500 text-sm">{stage.question}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* コアバリュー */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#2C5F2E' }}>CORE VALUES</div>
          <h2 className="text-3xl font-bold text-stone-800 mb-10">コアバリュー</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {coreValues.map((v) => (
              <div key={v.en} className="p-6 rounded-2xl"
                style={{ background: `${v.color}08`, border: `1px solid ${v.color}25` }}>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-bold text-lg" style={{ color: v.color }}>{v.en}</span>
                  <span className="text-stone-500 text-sm">（{v.ja}）</span>
                </div>
                <p className="text-stone-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2C5F2E 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">自分を知る旅を、今日から始めよう。</h2>
          <p className="text-green-200 mb-8 leading-relaxed" style={{ opacity: 0.85 }}>
            SELF TYPEで認知機能タイプを診断し、<br />あなただけの自己理解の地図を描き始めましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/test"
              className="px-8 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
              style={{ background: 'white', color: '#1B4332' }}>
              タイプ診断を受ける
            </Link>
            <Link href="/"
              className="px-8 py-3 rounded-xl font-semibold border transition-all hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
              アプリに戻る
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 text-center text-stone-500 border-t border-stone-200">
        <p>© 2024 SELF TYPE. Powered by Claude AI.</p>
      </footer>
    </div>
  )
}
