'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

const features = [
  {
    step: '01',
    title: 'タイプ診断',
    desc: '32問のシナリオベース質問で、あなたの16タイプを特定。5段階スケールで精度の高い診断を実現します。',
    color: '#6366f1',
  },
  {
    step: '02',
    title: '8つの認知機能を理解する',
    desc: '4文字のタイプだけでなく、Te・Fi・Ni・Seなど8つの認知機能スタックを深く理解。思考・感情・直観・感覚のパターンが見えてきます。',
    color: '#8b5cf6',
  },
  {
    step: '03',
    title: '8人のAIエージェントと対話する',
    desc: '各認知機能に特化した専門エージェントが、日常の悩み・仕事・感情パターンをサポート。あなたの内側から自己理解を深めます。',
    color: '#10b981',
  },
  {
    step: '04',
    title: 'AI相談で日常に活かす',
    desc: 'あなたのタイプと認知機能スタックを踏まえたパーソナライズドAIが、人間関係・キャリア・感情の課題に深い洞察を提供します。',
    color: '#f59e0b',
  },
]

const whys = [
  {
    q: 'なぜ「4文字」だけでは足りないのか？',
    a: 'INTJとINTPは同じ「INT」でも、主機能がNi（直観）かTi（思考）かで、まったく異なる行動・感情パターンを持ちます。認知機能を知ることで、初めて「なぜ自分はこう感じるのか」が腑に落ちます。',
  },
  {
    q: 'なぜユング心理学をベースにするのか？',
    a: '100年以上の研究に裏付けられたカール・ユングの心理類型論は、人間の内的構造を最も深く説明するフレームワークのひとつ。スキルや表面的な行動ではなく、思考・感情の「根っこ」にアクセスします。',
  },
  {
    q: 'なぜAIエージェントなのか？',
    a: '自己理解は一度の診断で終わるものではありません。日常の悩みや出来事の中で、繰り返し自分の認知機能パターンと向き合うことが大切。8人のエージェントが、その継続的な伴走者になります。',
  },
]

const values = [
  { icon: '🔍', title: '深さ', desc: '表面的なラベルではなく、思考・感情の根っこにアクセスする' },
  { icon: '🤝', title: '対話', desc: 'AIとの継続的な対話が、自己理解を日常に定着させる' },
  { icon: '🌱', title: '成長', desc: '弱みも強みも、すべてが自己理解の素材になる' },
  { icon: '🎯', title: '実用', desc: '仕事・人間関係・感情管理に、すぐに活かせる視点を提供する' },
]

export default function ConceptPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f0' }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block text-xs px-3 py-1 rounded-full mb-8 font-medium tracking-widest"
            style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
            CONCEPT
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-stone-800 mb-6 leading-tight">
            自分の「なぜ」を、<br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              認知機能で解き明かす。
            </span>
          </h1>
          <p className="text-stone-500 text-lg leading-relaxed max-w-2xl mx-auto">
            なぜ自分はこう感じるのか。なぜあの人とぶつかるのか。なぜ同じ失敗を繰り返すのか。
          </p>
          <p className="text-stone-500 text-lg leading-relaxed max-w-2xl mx-auto mt-3">
            SELF TYPEは、ユング心理学の認知機能理論をベースに、その「なぜ」に答えます。
          </p>
        </div>
      </section>

      {/* なぜ認知機能か */}
      <section className="py-20 px-4" style={{ background: 'rgba(99,102,241,0.04)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold tracking-widest mb-4 text-center" style={{ color: '#6366f1' }}>WHY</div>
          <h2 className="text-3xl font-bold text-stone-800 mb-12 text-center">3つの「なぜ」</h2>
          <div className="space-y-6">
            {whys.map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white" style={{ border: '1px solid rgba(99,102,241,0.15)' }}>
                <h3 className="text-lg font-bold text-stone-800 mb-3">{item.q}</h3>
                <p className="text-stone-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使い方・ステップ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold tracking-widest mb-4 text-center" style={{ color: '#6366f1' }}>HOW IT WORKS</div>
          <h2 className="text-3xl font-bold text-stone-800 mb-12 text-center">SELF TYPEの使い方</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.step} className="p-7 rounded-2xl"
                style={{ background: `${f.color}08`, border: `1px solid ${f.color}20` }}>
                <div className="text-4xl font-bold mb-3" style={{ color: `${f.color}30` }}>{f.step}</div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">{f.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 認知機能スタック図解 */}
      <section className="py-20 px-4" style={{ background: 'rgba(99,102,241,0.04)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#6366f1' }}>COGNITIVE FUNCTIONS</div>
          <h2 className="text-3xl font-bold text-stone-800 mb-4">8つの認知機能</h2>
          <p className="text-stone-500 mb-12 max-w-2xl mx-auto">
            誰もが8つすべての認知機能を持っています。ただ、その順番（スタック）がタイプによって異なる。
            その違いが、思考・感情・行動のパターンを決定します。
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'Ni', name: '内向き直観', desc: 'ビジョン・洞察', color: '#6366f1' },
              { id: 'Ne', name: '外向き直観', desc: '可能性・創造', color: '#8b5cf6' },
              { id: 'Si', name: '内向き感覚', desc: '記憶・伝統', color: '#10b981' },
              { id: 'Se', name: '外向き感覚', desc: '現在・体験', color: '#f59e0b' },
              { id: 'Ti', name: '内向き思考', desc: '論理・分析', color: '#3b82f6' },
              { id: 'Te', name: '外向き思考', desc: '効率・組織', color: '#06b6d4' },
              { id: 'Fi', name: '内向き感情', desc: '価値観・誠実', color: '#ec4899' },
              { id: 'Fe', name: '外向き感情', desc: '調和・共感', color: '#f97316' },
            ].map((func) => (
              <div key={func.id} className="p-4 rounded-xl text-center"
                style={{ background: `${func.color}12`, border: `1px solid ${func.color}25` }}>
                <div className="text-xl font-bold mb-1" style={{ color: func.color }}>{func.id}</div>
                <div className="text-stone-700 text-sm font-medium">{func.name}</div>
                <div className="text-stone-500 text-xs mt-1">{func.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* アプリの価値観 */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold tracking-widest mb-4 text-center" style={{ color: '#6366f1' }}>VALUES</div>
          <h2 className="text-3xl font-bold text-stone-800 mb-12 text-center">SELF TYPEが大切にすること</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {values.map((v) => (
              <div key={v.title} className="flex gap-4 p-6 rounded-2xl bg-white"
                style={{ border: '1px solid rgba(99,102,241,0.12)' }}>
                <div className="text-3xl">{v.icon}</div>
                <div>
                  <div className="font-bold text-stone-800 mb-1">{v.title}</div>
                  <div className="text-stone-500 text-sm leading-relaxed">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 想い */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg, #1B4332 0%, #2C5F2E 100%)' }}>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#a7f3d0' }}>OUR STORY</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            弱さを知った日から、<br />本当の自分が始まる。
          </h2>
          <p className="text-green-200 text-lg" style={{ opacity: 0.8 }}>— ありのままの自分で、命を燃やして生きるために —</p>
        </div>

        {/* 時代の問い */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#a7f3d0' }}>時代の問い</div>
          <div className="space-y-4 text-green-100 leading-loose text-lg" style={{ opacity: 0.9 }}>
            <p>肩書き、スキル、収入、実績。<br />私たちはずっと、それを積み上げることを「生きること」だと思ってきた。</p>
            <p>でもAIが、それらを静かに代替し始めている。</p>
            <p>仕事のあり方が変わる時、鎧が剥がれた時——<br />残るのは、ただひとつ。</p>
            <p className="text-2xl font-bold text-white text-center py-4">「あなたは、何者か。」</p>
            <p>その問いに答えられる人だけが、AI時代を人間らしく生きていける。<br />
            スキルではなく個性で。肩書きではなく存在で。<br />
            AIにはできない、あなただけの価値で——世界と関わることができる。</p>
          </div>
        </div>

        {/* 原点 */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#a7f3d0' }}>原点</div>
          <div className="space-y-4 text-green-100 leading-loose" style={{ opacity: 0.9 }}>
            <p>これは、創業者自身の悩みから生まれた。</p>
            <p>目標を達成することに価値を感じ、感情より目的を優先して生きてきた。<br />仲間はいる。でも、ひとりぼっちの感覚がずっとあった。</p>
            <p>できないことが多かった。<br />でも学び、研究し、努力を重ねた。<br />できるようになった瞬間の喜びと感動が、次への力になった。</p>
            <p>そして、一番辛かったのは——<br />弱さと向き合うことだった。</p>
            <p>理想の自分、期待している自分、大きく見せたい自分。<br />素直になれない自分、恥ずかしい自分。</p>
            <p>それを手放してありのままの自分と向き合う瞬間は、<br />辛く、受け入れがたく、悔しく——<br />自分が小さく、価値がないように感じた。</p>
            <p>でも、その瞬間から何かが変わった。</p>
            <p>素直に助けを求められるようになった。<br />頼れるようになった。<br />一緒に取り組める仲間が、集まってきた。</p>
            <p className="text-xl font-bold text-white border-l-4 pl-4" style={{ borderColor: '#a7f3d0' }}>
              弱さを受け入れた時にこそ、人は本当に強くなれる。
            </p>
            <p>その体験が、INNER NATUREの原点だ。</p>
          </div>
        </div>

        {/* 人が変わる瞬間 */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#a7f3d0' }}>人が変わる瞬間</div>
          <div className="space-y-4 text-green-100 leading-loose" style={{ opacity: 0.9 }}>
            <p>レベルは関係ない。</p>
            <p className="text-2xl font-bold text-white text-center py-4">「できなかったことが、できるようになった」</p>
            <p>その瞬間の喜びと感動が、人を変える。</p>
            <p>小さな一歩に見えても、それは必ず大きな変化につながっている。<br />
            弱さを認めた小さな勇気が、<br />
            素直に頼れた小さな一歩が、<br />
            諦めずにやり続けた小さな積み重ねが——</p>
            <p className="text-xl font-bold text-white">気づいた時、昨日とは違う自分になっている。</p>
          </div>
        </div>

        {/* 自然の役割 */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#a7f3d0' }}>自然の役割</div>
          <div className="space-y-4 text-green-100 leading-loose" style={{ opacity: 0.9 }}>
            <p>人間はもともと、自然から生まれた。</p>
            <p>デジタルとAIに囲まれた時代だからこそ、人は本能的に自然を求める。</p>
            <p>森の静けさ、風の音、土の匂い、光と影。<br />五感をフルに使った時、人は初めて頭を止め、心の声を聞く。</p>
            <p>自然は優しく、時に厳しい。<br />その中で人は喜怒哀楽を感じ、真・美・善を学ぶ。</p>
            <p className="text-xl font-bold text-white">INNER NATUREの自然は、ただの景色ではない。<br />人間の本心を呼び覚ます、最大の教師だ。</p>
          </div>
        </div>

        {/* 自己理解がもたらすもの */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#a7f3d0' }}>自己理解がもたらすもの</div>
          <div className="space-y-4 text-green-100 leading-loose" style={{ opacity: 0.9 }}>
            <p>自己理解とは、自分を評価することではない。</p>
            <p className="text-xl font-bold text-white">強みも弱みも、光も影も、すべてを知り——<br />「これが私だ」と受け入れることだ。</p>
            <p>強みは、誰かのために使える。<br />弱みは、誰かに助けてもらえる。<br />失敗は、恥ではなく自己理解の喜びになる。<br />成長が、義務ではなくワクワクになる。</p>
            <p>そして自分をありのままに受け入れた人は、他者もありのままに受け入れることができる。</p>
            <p className="text-xl font-bold text-white">自己理解は、豊かな人間関係の入り口だ。</p>
          </div>
        </div>

        {/* コアバリュー */}
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold tracking-widest mb-4 text-center" style={{ color: '#a7f3d0' }}>CORE VALUES</div>
          <h3 className="text-2xl font-bold text-white text-center mb-8">コアバリュー</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { en: 'Vulnerability', ja: '弱さ', desc: '弱さと向き合うことが、変化の入り口になる。' },
              { en: 'Growth', ja: '成長', desc: 'できなかったことができる瞬間の感動が、人を動かす力になる。' },
              { en: 'Authenticity', ja: '真正性', desc: 'ありのままの自分でいることが、最大の強さになる。' },
              { en: 'Connection', ja: 'つながり', desc: '自己理解は他者理解へ。補い合い、発展できる関係をつくる。' },
              { en: 'Nature', ja: '自然', desc: '自然の中でこそ、人間の本心は目を覚ます。' },
              { en: 'Legacy', ja: '還元', desc: '自分の個性と価値を社会に還元することが、生きがいになる。' },
            ].map((v) => (
              <div key={v.en} className="p-6 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-bold text-white text-lg">{v.en}</span>
                  <span className="text-green-300 text-sm">（{v.ja}）</span>
                </div>
                <p className="text-green-100 text-sm leading-relaxed" style={{ opacity: 0.85 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">まず、自分のタイプを知ろう。</h2>
          <p className="text-indigo-100 mb-8 leading-relaxed">
            32問の診断テストで、あなたの認知機能スタックを特定します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/test"
              className="px-8 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
              style={{ background: 'white', color: '#6366f1' }}>
              診断テストを受ける
            </Link>
            <Link href="/"
              className="px-8 py-3 rounded-xl font-semibold border transition-all hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
              トップに戻る
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
