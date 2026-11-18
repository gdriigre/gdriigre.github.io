import { ArrowDown, ArrowRight, ArrowUpRight, Bot, CodeXml, Film, GraduationCap, Image as ImageIcon, Mail, MapPin, PenLine, Phone, Sparkles } from 'lucide-react';
import { PrintResume } from './print-resume';
import { GazePortrait } from './gaze-portrait';
import GooeyNav from './gooey-nav';
import { ProjectShowcase } from './project-showcase';
import { RotatingTagline } from './rotating-tagline';
import { StrokeText } from './stroke-text';
import { EntryIntro } from './entry-intro';
import { AiVideoGallery } from './ai-video-gallery';

const interests = ['AI 内容制作', 'AIGC 视频', '短视频剪辑', '智能体应用（未来方向）'];
const designTools = ['Photoshop', 'AutoCAD', 'SketchUp', '3ds Max', 'Revit'];
const experiences = [
  { date: '2025.07 — 至今（时间待确认）', company: '长沙雨花区宠物电商（公司名称待补充）', role: '视频剪辑 / AI 视频制作', description: '围绕宠物用品制作短视频，使用即梦进行首帧图、视频生成及运镜调整，结合剪映完成剪辑、字幕与成片；拆解同类内容并进行多账号分发。作品数量与成果待补充。' },
  { date: '此前经历 · 工作 4 个月', company: '长沙某家装公司', role: '家装设计相关工作', description: '曾从事家装设计相关工作，接触住宅空间的设计与改造内容。' },
  { date: '工作 4 个月', company: '长沙某别墅改造公司', role: '别墅改造相关工作', description: '参与别墅改造相关工作，接触住宅空间改造与设计内容。' },
  { date: '工作 6 个月', company: '长沙某灯光设计公司', role: '灯光设计相关工作', description: '参与灯光设计相关工作，接触空间照明与灯光设计内容。' },
];

export default function Home() {
  return (
    <div className="site-shell" id="home">
      <EntryIntro />
      <a className="skip-link" href="#main">跳转到主要内容</a>
      <header className="site-header container">
        <a href="#home" className="wordmark" aria-label="谢达，返回首页">XD<span>.</span></a>
        <GooeyNav />
        <a href="#contact" className="availability" aria-label="正在寻找工作机会，联系谢达"><span className="status-dot" />寻找工作机会<ArrowUpRight size={14} /></a>
      </header>

      <main id="main">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span />CREATIVE MIND, AI POWERED</p>
            <p className="hello">Hello, I’m</p>
            <h1 id="hero-title" aria-label="谢达，XIE DA。">谢达<StrokeText className="latin-name" text="XIE DA." strokeColor="#a957ce" fillColor="#292b32" accentColor="#b95dde" accentLast strokeWidth={1.35} interactive /></h1>
            <RotatingTagline />
            <p className="hero-description is-stroke-description" aria-label="一年多短视频剪辑经验，使用剪映与即梦完成 AI 视频制作。求职方向：AI 内容制作、AIGC 视频。">
              <StrokeText className="hero-description-line" text="一年多短视频经验，探索 AI 内容创作。" strokeColor="#a776bb" fillColor="#74717e" strokeWidth={0.65} drawDuration={0.85} stagger={0.025} delay={0.15} />
              <StrokeText className="hero-description-line" text="求职方向：AI 内容制作 · AIGC 视频" strokeColor="#a776bb" fillColor="#74717e" strokeWidth={0.65} drawDuration={0.85} stagger={0.025} delay={0.32} />
            </p>
            <div className="hero-actions">
              <a className="action primary-action" href="#contact">联系我<ArrowUpRight size={18} /></a>
              <a className="action secondary-action" href="#ai-work">AI 视频作品<ArrowUpRight size={17} /></a>
            </div>
            <div className="hero-school"><GraduationCap size={18} /><span>毕业于长沙环境保护职业技术学院</span></div>
          </div>

          <div className="hero-visual">
            <div className="portrait-glow" aria-hidden="true" />
            <GazePortrait />
            <span className="floating-icon icon-ai" aria-hidden="true"><Sparkles /></span>
            <span className="floating-icon icon-video" aria-hidden="true"><Film /></span>
            <span className="floating-icon icon-code" aria-hidden="true"><CodeXml /></span>
            <span className="floating-icon icon-visual" aria-hidden="true"><ImageIcon /></span>
            <div className="portrait-caption"><span className="caption-star">✳</span><span>让灵感，发生。<small>MADE OF IDEAS</small></span></div>
          </div>
          <a className="scroll-cue" href="#creative"><span>向下探索</span><ArrowDown size={13} /></a>
        </section>

        <div className="discipline-strip container" aria-label="创作领域">
          <span>VIDEO EDITING</span><i>✳</i><span>CONTENT</span><i>✳</i><span>AI VISUAL</span><i>✳</i><span>AI AGENTS</span>
        </div>

        <section className="creative-section container" id="creative" aria-labelledby="creative-title">
          <div className="creative-mosaic">
            <div className="mosaic-glow" aria-hidden="true" />
            <div className="mosaic-inner focus-mosaic">
              <article className="creative-card video-card">
                <div className="card-topline"><span>01 / VIDEO</span><Film size={20} /></div>
                <div><h3>Video<br />Editing<span className="card-dot">.</span></h3><p>剪辑运营</p></div>
              </article>
              <article className="creative-card content-card">
                <div className="card-topline"><span>02 / CONTENT</span><PenLine size={20} /></div>
                <div><h3>Content<br />Creation</h3><p>内容创作</p></div>
              </article>
              <article className="creative-card visual-card">
                <div className="card-topline"><span>03 / VISUAL</span><ImageIcon size={20} /></div>
                <div><h3>AI Visual</h3><p>图片创作</p></div>
              </article>
              <article className="creative-card agent-card">
                <div className="card-topline"><span>04 / AGENTS</span><Bot size={20} /></div>
                <div><h3>AI Agents</h3><p>智能体应用</p></div>
              </article>
            </div>
          </div>
          <div className="creative-copy">
            <p className="eyebrow">01 — CREATIVE FOCUS</p>
            <h2 id="creative-title">What I Do<span>.</span></h2>
            <h3>把创意做出来。</h3>
            <p>专注 AI 内容制作与短视频剪辑，结合分镜、即梦生成和剪映后期，把创意变成可交付的内容。</p>
            <div className="interest-tags">{interests.map((interest) => <span key={interest}>{interest}</span>)}</div>
            <a href="#about" className="text-link">更多关于我<ArrowRight size={17} /></a>
          </div>
        </section>

        <ProjectShowcase />

        <section className="ai-work-section container" id="ai-work" aria-labelledby="ai-work-title">
          <div className="ai-work-copy">
            <p className="eyebrow">02 / AI VIDEO SHOWCASE</p>
            <h2 id="ai-work-title">AI 视频作品展<span>。</span></h2>
            <p>用即梦探索宠物内容的不同表达。从人物情景、角色互动到产品与视觉特效，记录创意变成画面的过程。</p>
            <div className="tool-tags"><span>即梦 AI</span><span>场景构思</span><span>角色互动</span><span>视觉特效</span><span>产品镜头</span></div>
          </div>
          <AiVideoGallery />
        </section>

        <section className="about-section container" id="about" aria-labelledby="about-title">
          <div className="about-heading">
            <p className="eyebrow">03 — A LITTLE ABOUT ME</p>
            <h2 id="about-title">有设计基础，<br />也有把事做好的耐心<span>。</span></h2>
            <p>你好，我是谢达，毕业于长沙环境保护职业技术学院环境艺术设计专业。设计学习让我建立了构图、色彩与空间表现的基础，也让我开始探索 AI 在视觉与内容创作中的应用。</p>
            <p>有一年多全职短视频剪辑经验，熟练使用剪映与即梦，关注从分镜到 AI 画面生成、剪辑成片的完整流程。希望从事 AI 内容制作 / AIGC 视频工作，也计划学习低代码智能体工具。</p>
            <div className="resume-actions">
              <a className="action secondary-action" href="#ai-work">查看 AI 视频作品<ArrowUpRight size={16} /></a>
              <PrintResume />
            </div>
          </div>
          <div className="resume-card">
            <div className="resume-card-heading"><span>个人简介</span><span className="resume-number">PROFILE / XD</span></div>
            <dl>
              <div><dt>姓名</dt><dd className="resume-name">谢达 <span>XIE DA</span></dd></div>
              <div><dt>毕业院校</dt><dd>长沙环境保护职业技术学院</dd></div>
              <div><dt>专业学历</dt><dd>环境艺术设计 · 大专<br /><span className="education-detail">2023 — 2025</span></dd></div>
              <div><dt>所在城市</dt><dd className="resume-location"><MapPin size={16} />长沙</dd></div>
              <div><dt>求职方向</dt><dd className="resume-interests">{interests.map((interest) => <span key={interest}>{interest}</span>)}</dd></div>
              <div><dt>当前状态</dt><dd className="resume-status"><span className="status-dot" />正在寻找工作机会</dd></div>
            </dl>
            <div className="resume-note"><Sparkles size={16} /><span>让每一个想法，都有落地的可能。</span></div>
          </div>
        </section>

        <section className="experience-section container" id="experience" aria-labelledby="experience-title">
          <div className="experience-column">
            <p className="eyebrow">04 — EXPERIENCE & SKILLS</p>
            <h2 id="experience-title">经历，塑造做事的方式<span>。</span></h2>
            <ol className="experience-list">
              {experiences.map((experience) => (
                <li key={experience.company}>
                  <p className="experience-date">{experience.date}</p>
                  <h3>{experience.company}<span>{experience.role}</span></h3>
                  <p className="experience-description">{experience.description}</p>
                </li>
              ))}
            </ol>
          </div>
          <aside className="skills-card" aria-labelledby="skills-title">
            <div className="skills-card-heading"><Sparkles size={19} /><h3 id="skills-title">AIGC 内容与剪辑</h3></div>
            <p><strong>剪映：</strong>分镜、素材编排、字幕配音与节奏剪辑，独立完成短视频成片。</p>
            <p><strong>即梦 AI：</strong>首帧图、视频生成、运镜、口型同步；关注角色、道具与画风的一致性。</p>
            <p><strong>内容制作：</strong>提示词与分镜描述、同类内容拆解、宠物用品带货、多账号分发与批量产出。</p>
            <div className="tool-tags"><span>剪映</span><span>即梦 AI</span><span>提示词</span><span>短视频剪辑</span><span>宠物用品内容</span></div>
            <div className="skills-note"><span>设计基础</span><p>环境艺术设计专业，具备构图、光影、色彩与空间表现基础。</p><div className="tool-tags">{designTools.map((tool) => <span key={tool}>{tool}</span>)}</div></div>
            <div className="skills-note"><span>未来学习方向</span><p>可灵、Runway、Midjourney、Stable Diffusion；低代码智能体工具 Coze / Dify。</p></div>
          </aside>
        </section>

        <section className="contact-section container" id="contact" aria-labelledby="contact-title">
          <div className="contact-heading">
            <p className="eyebrow">05 — LET’S CONNECT</p>
            <h2 id="contact-title">聊聊下一次合作<span>。</span></h2>
            <p>如果有合适的岗位或创作机会，欢迎联系我。</p>
          </div>
          <div className="contact-links">
            <a className="contact-card" href="tel:18075909903" aria-label="拨打谢达的电话 18075909903">
              <span className="contact-icon"><Phone size={21} /></span>
              <span className="contact-detail"><span className="contact-label">电话 · 点击拨打</span><strong>18075909903</strong></span>
              <ArrowUpRight size={18} className="contact-arrow" />
            </a>
            <a className="contact-card" href="mailto:2031124397@qq.com" aria-label="发送邮件至 2031124397@qq.com">
              <span className="contact-icon"><Mail size={21} /></span>
              <span className="contact-detail"><span className="contact-label">邮箱 · 点击写信</span><strong>2031124397@qq.com</strong></span>
              <ArrowUpRight size={18} className="contact-arrow" />
            </a>
          </div>
          <a className="resume-file-card" href="#ai-work" aria-label="查看 AI 视频作品">
            <span className="resume-folder-icon" aria-hidden="true"><Film size={88} strokeWidth={1.35} /></span>
            <span className="resume-file-info"><span className="resume-file-type">AI VIDEO</span><strong>谢达 · AI 视频制作</strong><span className="resume-file-meta">5 条精选视频 · 观看作品</span></span>
            <span className="resume-file-open" aria-hidden="true"><ArrowUpRight size={25} /></span>
          </a>
        </section>
      </main>

      <footer className="site-footer container">
        <a href="#home" className="wordmark" aria-label="谢达，返回首页">XD<span>.</span></a>
        <p>谢达 · AI 内容制作与 AIGC 视频</p>
        <a href="#home" className="back-to-top">回到顶部<ArrowUpRight size={15} /></a>
      </footer>
    </div>
  );
}
