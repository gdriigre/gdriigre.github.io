'use client';

/* oxlint-disable next/no-img-element */
/* oxlint-disable jsx-a11y/media-has-caption -- Both source videos include burned-in Chinese subtitles. */
import { ArrowLeft, ArrowUpRight, Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, WheelEvent as ReactWheelEvent } from 'react';

type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  className?: string;
};

type ProjectVideo = {
  src: string;
  poster: string;
  title: string;
  caption: string;
};

type ProjectDetail = {
  intro: string;
  goal: string;
  features: string[];
  featuresLabel?: string;
  process: string[];
  gallery: GalleryImage[];
  galleryClassName?: string;
  videos?: ProjectVideo[];
};

type Project = {
  number: string;
  title: string;
  category: string;
  stage: string;
  image: string;
  imageAlt: string;
  imageClass: string;
  description: string;
  responsibility: string;
  tags: string[];
  featured?: boolean;
  detail?: ProjectDetail;
};

type ProjectCollection = {
  title: string;
  category: string;
  stage: string;
  theme: 'product' | 'video' | 'visual' | 'automation';
  description: string;
  responsibility: string;
  tags: string[];
  previewImages: Array<Pick<Project, 'image' | 'imageAlt' | 'imageClass'>>;
  items: Project[];
};

type ShowcaseItem = Project | ProjectCollection;

const projects: Project[] = [
  {
    number: '01',
    title: '小达朝饭 · 家庭点菜小程序',
    category: '微信小程序',
    stage: '已上线',
    image: '/projects/xiaoda-ordering.webp',
    imageAlt: '小达朝饭点菜小程序首页，展示湖南家常菜、口味分类和点菜入口',
    imageClass: 'project-image-ordering',
    description: '为家人朋友制作的点菜小程序，包含 18 道湖南家常菜、辣度选择、收藏和多人共享菜单。',
    responsibility: '需求设计、视觉方向、AI 协同开发与上线推进',
    tags: ['微信原生', 'CloudBase', 'AI 协作'],
    detail: {
      intro: '从“今天吃什么”这个真实需求出发，把选菜、口味和家庭菜单放进一个轻量的小程序里。',
      goal: '减少来回问菜和重复确认，让家人能直观看菜、选辣度，并共同维护当天菜单。',
      features: ['18 道湖南家常菜分类浏览', '每份菜可单独选择辣度', '菜品详情与食材说明', '收藏、共享与菜单确认流程'],
      process: ['梳理家庭点菜场景与信息层级', '确定暖色餐饮视觉和卡片交互', '配合 AI 完成开发、测试与上线'],
      gallery: [
        { src: '/projects/xiaoda-ordering.webp', alt: '小达朝饭首页与菜品列表', caption: '首页 · 分类浏览与家庭菜单', className: 'detail-image-top' },
        { src: '/projects/details/ordering-detail.webp', alt: '农家小炒肉菜品详情', caption: '菜品详情 · 食材与口味说明' },
        { src: '/projects/details/ordering-spice.webp', alt: '小达朝饭辣度选择弹窗', caption: '关键交互 · 单独选择辣度' },
      ],
    },
  },
  {
    number: '02',
    title: 'Manio · 美甲选款小程序',
    category: '交互产品',
    stage: '原型完成',
    image: '/projects/manio-nail.webp',
    imageAlt: 'Manio 美甲小程序首页，展示粉紫色选款界面和美甲分类',
    imageClass: 'project-image-nail',
    description: '用左侧分类与右侧浏览组织美甲款式，串联搜索、收藏、心动清单和预约流程。',
    responsibility: '产品结构、视觉方向与 AI 协同开发',
    tags: ['微信小程序', 'UI / UX', '预约流程'],
    detail: {
      intro: '围绕“快速找到喜欢的款式”设计选款体验，用粉紫色视觉和清晰分类降低浏览成本。',
      goal: '把灵感查找、收藏、加入清单和预约意向串成一条完整体验路径。',
      features: ['款式搜索与多分类筛选', '收藏和心动清单', '款式详情与价格展示', '门店、时间与美甲师预约流程'],
      process: ['整理选款、服务和个人中心结构', '建立品牌色、角色形象和卡片规范', '制作可操作网页原型并逐项验收'],
      gallery: [
        { src: '/projects/manio-nail.webp', alt: 'Manio 美甲选款首页', caption: '选款首页 · 分类、搜索与推荐', className: 'detail-image-top' },
        { src: '/projects/details/nail-cat-eye.webp', alt: 'Manio 猫眼款式内容图', caption: '内容素材 · 猫眼款式' },
        { src: '/projects/details/nail-gradient.webp', alt: 'Manio 渐变款式内容图', caption: '内容素材 · 渐变款式' },
      ],
    },
  },
  {
    number: '03',
    title: '机车图鉴 · 智能选车',
    category: '内容型产品',
    stage: '持续迭代',
    image: '/projects/moto-catalog.webp',
    imageAlt: '科技科幻风机车图鉴车型详情页，展示车型图片、参数和配色选择',
    imageClass: 'project-image-moto',
    description: '围绕品牌、车系和车型详情搭建机车图鉴，当前整理至 12 个品牌、160 款车型，并加入智能选车与车型对比。',
    responsibility: '需求规划、内容整理、AI 素材与开发验收',
    tags: ['产品策划', 'AIGC', '数据整理'],
    detail: {
      intro: '把分散的品牌、车型图片和参数整理成统一图鉴，并用问答方式帮助用户缩小选车范围。',
      goal: '让用户从品牌浏览进入车型详情，再通过预算和用途等条件完成智能筛选与对比。',
      features: ['12 个品牌与 160 款车型资料', '车型图片、配色与完整参数', '预算导向的智能选车问答', '车型收藏与横向对比'],
      process: ['建立品牌和车型数据结构', '统一科技感界面与图片规格', '持续补充素材并进行页面验收'],
      gallery: [
        { src: '/projects/moto-catalog.webp', alt: '机车图鉴车型展示页', caption: '车型展示 · 配色与基础参数' },
        { src: '/projects/details/moto-selector.webp', alt: '机车图鉴智能选车预算问题', caption: '智能选车 · 预算问答流程' },
        { src: '/projects/details/moto-detail.webp', alt: 'Ninja 500 车型详情与完整参数', caption: '车型详情 · 图片与完整参数' },
      ],
    },
  },
  {
    number: '04',
    title: '宠物产品内容自动化',
    category: 'AIGC 视觉',
    stage: '流程实践',
    image: '/projects/product-automation.webp',
    imageAlt: '沃修堂宠物营养补充剂电商主图，展示产品、猫和狗',
    imageClass: 'project-image-product',
    description: '依据包装实拍，把宠物痛点、产品、配方、咨询售后和日常场景整理成每日可重复执行的内容流程。',
    responsibility: '资料核对、视觉策划、提示词、图片制作与流程整理',
    tags: ['每日 15 图', '内容自动化', 'AIGC 视觉'],
    detail: {
      intro: '以产品包装实拍和资料库为输入，把零散的产品信息转化为固定结构、可连续执行的宠物内容生产流程，同时保留不同产品与视觉主题的变化。',
      goal: '在保证产品名称、成分、规格和用量信息可核对的前提下，提高多产品宣传图与短视频选题的日常产出效率。',
      featuresLabel: '自动化输出',
      features: ['每天 3 组图片，每组 5 张，共 15 张', '痛点、产品、配方、咨询售后、日常状态五段结构', '同步整理每天 4 条短视频选题与文案任务', '每套保留成品、总览、底图、说明和制作脚本'],
      process: ['从包装正反面实拍核对产品名称、成分、规格和用量', '为不同产品设定可轮换的视觉主题与固定信息结构', '生成底图、后期排版、逐张复核并按日期归档复用'],
      gallery: [
        { src: '/projects/details/product-auto-pain.webp', alt: '宠物神经营养因子片痛点观察宣传图，展示猫咪躲在窗帘后的场景', caption: '痛点观察 · 真实宠物场景与异常提醒' },
        { src: '/projects/details/product-auto-promo.webp', alt: '蒲公英薏苡仁麦冬片产品宣传图，展示产品包装和主要原料信息', caption: '产品主图 · 从包装实拍提取可核对信息' },
        { src: '/projects/details/product-auto-ingredients.webp', alt: 'Hairball Control 配方用料信息图，展示包装背标和原料保证值', caption: '配方信息 · 依据背标整理原料与保证值' },
      ],
    },
  },
  {
    number: '05',
    title: 'Rosewood Satin · 口红视觉系列',
    category: 'AIGC 商业视觉',
    stage: '系列完成',
    image: '/projects/lipstick-campaign.webp',
    imageAlt: '玫瑰木调缎光口红产品主视觉，展示酒红色口红与香槟金包装',
    imageClass: 'project-image-lipstick',
    description: '围绕玫瑰木调口红建立统一视觉，从产品主图延展到质地、妆效、包装细节和使用步骤。',
    responsibility: '视觉定位、提示词设计、画面筛选与系列编排',
    tags: ['产品主图', 'AIGC', '系列视觉'],
    detail: {
      intro: '以酒红、香槟金和暖米白建立高级温暖的美妆视觉，让同一支口红在不同页面里保持统一质感。',
      goal: '完成一套可连续展示的虚拟口红产品视觉，兼顾第一眼吸引力、质地表达和细节说明。',
      featuresLabel: '系列内容',
      features: ['产品主视觉与色号氛围', '缎光质地与膏体微距', '薄涂、叠涂妆效对比', '包装结构与使用步骤'],
      process: ['确定酒红、香槟金与暖米白的视觉方向', '围绕主图、妆效和细节拆分画面内容', '筛选成图并统一文案、构图与展示顺序'],
      gallery: [
        { src: '/projects/details/lipstick-finish.webp', alt: '玫瑰木调口红缎光产品展示', caption: '产品氛围 · 玫瑰木调与缎光质感', className: 'detail-image-top' },
        { src: '/projects/details/lipstick-texture.webp', alt: '口红膏体纹理与色彩质地微距画面', caption: '质地特写 · 膏体纹理与色彩' },
        { src: '/projects/details/lipstick-details.webp', alt: '口红包装标志、旋出结构与包装盒细节', caption: '结构细节 · 包装与使用设计' },
      ],
    },
  },
  {
    number: '06',
    title: '短视频多账号工作台',
    category: '桌面自动化',
    stage: '投入使用',
    image: '/projects/short-video-workspace.png',
    imageAlt: '短视频综合工作台界面，左侧集中显示抖音和视频号账号，右侧提供打开、新增与重命名操作',
    imageClass: 'project-image-workspace',
    description: '为公司多平台账号搭建统一入口，集中管理 6 个抖音与 2 个视频号账号，减少重复登录和切换串号。',
    responsibility: '需求梳理、账号工作流设计、AI 协同开发与落地使用',
    tags: ['多账号管理', '桌面工具', '流程自动化'],
    detail: {
      intro: '把分散在抖音和微信视频号的公司账号集中到一个桌面工作台，每个账号保留独立登录环境，从同一入口快速进入对应创作后台。',
      goal: '降低多账号内容发布时反复查找、重复登录和账号混用的成本，让运营人员更快进入正确账号的发布环境。',
      features: ['统一管理 8 个账号入口', '覆盖 6 个抖音与 2 个视频号账号', '每个账号独立保存浏览器登录状态', '支持打开选中、批量打开、新增与重命名'],
      process: ['梳理公司多平台账号与日常发布流程', '为每个账号建立互不混用的独立浏览器环境', '封装为可直接运行的 Windows 工作台并投入使用'],
      gallery: [
        { src: '/projects/short-video-workspace.png', alt: '短视频综合工作台完整界面', caption: '工作台总览 · 账号列表与快捷操作', className: 'detail-image-contain' },
      ],
    },
  },
  {
    number: '07',
    title: '宠物健康产品短视频系列',
    category: '短视频剪辑',
    stage: '成片展示',
    image: '/projects/pet-video-series-cover.jpg',
    imageAlt: '两支宠物健康产品竖屏短视频的代表画面，展示产品与宠物场景',
    imageClass: 'project-image-video-series',
    description: '围绕宠物健康产品，把仓储实拍、宠物素材、字幕、产品镜头与情景演示编排成两支约一分钟的竖屏内容。',
    responsibility: '素材筛选、节奏剪辑、字幕包装与产品内容编排',
    tags: ['竖屏短视频', '产品内容', '剪辑包装'],
    featured: true,
    detail: {
      intro: '两支面向短视频平台的宠物健康产品内容，用真实宠物行为切入，再串联产品镜头、场景说明和喂养画面，让信息在一分钟内完整表达。',
      goal: '把产品介绍转化为更容易观看的短视频节奏，通过痛点、解释、产品和使用场景的连续结构完成内容表达。',
      featuresLabel: '作品内容',
      features: ['9:16 竖屏成片，时长约 61 秒与 66 秒', '宠物行为与健康痛点作为内容开场', '仓储实拍、宠物素材和产品视觉混合编排', '字幕贯穿重点信息并配合画面节奏'],
      process: ['筛选仓储、宠物与产品相关素材', '按痛点、解释、产品、使用场景重组节奏', '统一字幕、转场与竖屏成片输出'],
      gallery: [],
      videos: [
        {
          src: '/projects/videos/pet-nutrition-0910.mp4',
          poster: '/projects/videos/pet-nutrition-0910-poster.jpg',
          title: '宠物营养产品 · 场景种草',
          caption: '01 / 约 61 秒 · 仓储实拍、宠物痛点、产品镜头与喂养场景',
        },
        {
          src: '/projects/videos/pet-hairball-0908.mp4',
          poster: '/projects/videos/pet-hairball-0908-poster.jpg',
          title: '宠物毛球问题 · 痛点科普',
          caption: '02 / 约 66 秒 · 行为切入、问题说明、产品介绍与日常喂养',
        },
      ],
    },
  },
  {
    number: '08',
    title: '乡村别墅焕新 · 空间改造',
    category: '空间设计 / AIGC',
    stage: '概念方案',
    image: '/projects/details/villa-renovation/03-exterior-left.webp',
    imageAlt: '两层乡村别墅改造后的左前方外观概念效果图',
    imageClass: 'project-image-villa',
    description: '从原有两层住宅出发，统一外立面，并延展客厅、厨房、卧室和两层平面布局的完整改造构想。',
    responsibility: '现状梳理、改造构思、空间规划、AIGC 效果图与方案编排',
    tags: ['别墅改造', '空间规划', 'AIGC 视觉'],
    detail: {
      intro: '一组从原始建筑现状延伸出来的乡村别墅改造概念方案，以外观焕新、两层布局和主要居住空间效果图串起完整表达。所有图片用于设计构想展示，不代表已经施工落地。',
      goal: '用统一的外立面语言和清晰的两层空间关系，把零散的改造想法整理成可以直观看懂、方便继续深化的视觉方案。',
      featuresLabel: '方案内容',
      features: ['原始外观与改造后立面对比', '首层与二层空间布局示意', '客厅、厨房和多类卧室效果展示', '暖白、原木与自然景观相协调的视觉方向'],
      process: ['整理原始建筑外观与需要表达的空间范围', '确定简洁外立面、深色窗框与原木室内方向', '规划两层功能关系并生成各空间概念效果', '筛选图片，按改造前、外观、平面与室内顺序编排'],
      galleryClassName: 'is-landscape',
      gallery: [
        { src: '/projects/details/villa-renovation/01-before.webp', alt: '两层乡村住宅改造前的正立面', caption: '改造前 · 原始建筑外观' },
        { src: '/projects/details/villa-renovation/02-exterior-front.webp', alt: '两层乡村别墅改造后的正立面概念效果', caption: '外观方案 · 正立面' },
        { src: '/projects/details/villa-renovation/03-exterior-left.webp', alt: '两层乡村别墅改造后的左前方概念效果', caption: '外观方案 · 左前方视角' },
        { src: '/projects/details/villa-renovation/04-exterior-aerial.webp', alt: '乡村别墅改造后的庭院与建筑鸟瞰概念效果', caption: '整体关系 · 建筑与庭院' },
        { src: '/projects/details/villa-renovation/05-ground-floor.webp', alt: '乡村别墅首层空间平面布局示意', caption: '首层规划 · 客餐厅、厨房与卧室' },
        { src: '/projects/details/villa-renovation/06-upper-floor.webp', alt: '乡村别墅二层空间平面布局示意', caption: '二层规划 · 卧室与阳台' },
        { src: '/projects/details/villa-renovation/07-living-room.webp', alt: '暖白与原木风格的别墅客厅概念效果', caption: '客厅 · 开敞、温暖的公共空间' },
        { src: '/projects/details/villa-renovation/08-kitchen.webp', alt: '原木橱柜和大窗户的别墅厨房概念效果', caption: '厨房 · 收纳、采光与操作空间' },
        { src: '/projects/details/villa-renovation/09-master-bedroom.webp', alt: '带转角窗景的别墅主卧概念效果', caption: '主卧 · 木色收纳与自然采光' },
        { src: '/projects/details/villa-renovation/10-bedroom-detail.webp', alt: '暖白原木风格的卧室正面概念效果', caption: '卧室 · 简洁安静的休息氛围' },
        { src: '/projects/details/villa-renovation/11-bedroom-study.webp', alt: '带书桌和窗景的次卧概念效果', caption: '次卧 · 休息与学习功能结合' },
        { src: '/projects/details/villa-renovation/12-twin-bedroom.webp', alt: '双床卧室概念效果', caption: '双床房 · 灵活的家庭居住空间' },
      ],
    },
  },
];

const miniPrograms = projects.slice(0, 3);
const videoProjects = [projects[6]];
const visualProjects = [projects[4], projects[7]];
const automationProjects = [projects[3], projects[5]];

const miniProgramCollection: ProjectCollection = {
  title: '小程序 · 产品体验',
  category: '作品分类',
  stage: `${miniPrograms.length} 个项目`,
  theme: 'product',
  description: '从家庭点菜、美甲选款到机车图鉴，整理真实需求、页面结构和完整使用体验。',
  responsibility: '产品规划、视觉设计、内容整理与 AI 协同开发',
  tags: ['微信小程序', '产品设计', '交互体验'],
  previewImages: miniPrograms.map(({ image, imageAlt, imageClass }) => ({ image, imageAlt, imageClass })),
  items: miniPrograms,
};

const videoCollection: ProjectCollection = {
  title: '视频与内容 · 剪辑作品',
  category: '作品分类',
  stage: `${videoProjects.length} 个项目`,
  theme: 'video',
  description: '围绕宠物健康产品完成素材筛选、内容编排、字幕包装和两支完整竖屏成片。',
  responsibility: '素材筛选、节奏剪辑、字幕包装与产品内容编排',
  tags: ['短视频剪辑', '内容表达', '字幕包装'],
  previewImages: videoProjects.map(({ image, imageAlt, imageClass }) => ({ image, imageAlt, imageClass })),
  items: videoProjects,
};

const visualCollection: ProjectCollection = {
  title: 'AI 视觉 · 图片与空间',
  category: '作品分类',
  stage: `${visualProjects.length} 个项目`,
  theme: 'visual',
  description: '从商业产品视觉延展到空间改造方案，用统一画面语言呈现不同类型的创意构想。',
  responsibility: '视觉定位、AIGC 制作、画面筛选与系列编排',
  tags: ['AIGC 视觉', '商业图片', '空间方案'],
  previewImages: visualProjects.map(({ image, imageAlt, imageClass }) => ({ image, imageAlt, imageClass })),
  items: visualProjects,
};

const automationCollection: ProjectCollection = {
  title: '智能体与工具 · 自动化实践',
  category: '作品分类',
  stage: `${automationProjects.length} 个项目`,
  theme: 'automation',
  description: '把内容生产和多账号运营中的重复工作整理成可持续执行的流程与桌面工具。',
  responsibility: '需求梳理、流程设计、AI 协同开发与落地使用',
  tags: ['内容自动化', '桌面工具', '工作流设计'],
  previewImages: automationProjects.map(({ image, imageAlt, imageClass }) => ({ image, imageAlt, imageClass })),
  items: automationProjects,
};

const showcaseItems: ShowcaseItem[] = [miniProgramCollection, videoCollection, visualCollection, automationCollection];

function isProjectCollection(item: ShowcaseItem): item is ProjectCollection {
  return 'items' in item;
}

export function ProjectShowcase() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<ProjectCollection | null>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const lastRailJumpRef = useRef(0);
  const modalOpen = Boolean(selectedProject || selectedCollection);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    const cards = Array.from(stack.querySelectorAll<HTMLElement>('.project-card'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reducedMotion.matches) {
      cards.forEach((card) => card.classList.add('is-visible'));
      return;
    }

    stack.classList.add('has-stack-motion');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
    );

    cards.forEach((card) => revealObserver.observe(card));

    let animationFrame = 0;
    const updateStackDepth = () => {
      animationFrame = 0;
      cards.forEach((card, index) => {
        const nextCard = cards[index + 1];
        if (!nextCard) {
          card.style.setProperty('--project-stack-scale', '1');
          return;
        }

        const stickyTop = Number.parseFloat(window.getComputedStyle(card).top) || 0;
        const approachDistance = Math.max(window.innerHeight * 0.64, 360);
        const nextTop = nextCard.getBoundingClientRect().top;
        const progress = Math.min(1, Math.max(0, 1 - (nextTop - stickyTop) / approachDistance));
        card.style.setProperty('--project-stack-scale', String(1 - progress * 0.045));
      });
    };

    const requestStackUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateStackDepth);
    };

    updateStackDepth();
    window.addEventListener('scroll', requestStackUpdate, { passive: true });
    window.addEventListener('resize', requestStackUpdate);

    return () => {
      stack.classList.remove('has-stack-motion');
      revealObserver.disconnect();
      window.removeEventListener('scroll', requestStackUpdate);
      window.removeEventListener('resize', requestStackUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (selectedProject && selectedCollection) {
        setSelectedProject(null);
      } else {
        setSelectedProject(null);
        setSelectedCollection(null);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [modalOpen, selectedCollection, selectedProject]);

  const closeAllProjects = () => {
    setSelectedProject(null);
    setSelectedCollection(null);
  };

  const jumpPastProjects = (direction: 'up' | 'down') => {
    const target = document.getElementById(direction === 'down' ? 'about' : 'projects');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const handleRailWheel = (event: ReactWheelEvent<HTMLButtonElement>) => {
    if (Math.abs(event.deltaY) < 4) return;
    event.preventDefault();

    const now = Date.now();
    if (now - lastRailJumpRef.current < 700) return;
    lastRailJumpRef.current = now;
    jumpPastProjects(event.deltaY > 0 ? 'down' : 'up');
  };

  return (
    <>
      <section className="projects-section container" id="projects" aria-labelledby="projects-title">
        <div className="projects-heading">
          <div>
            <p className="eyebrow">02 — SELECTED WORK</p>
            <h2 id="projects-title">把想法，做成能用的东西<span>。</span></h2>
          </div>
          <p>8 个真实作品已整理成 4 个方向。先选择分类，再进入具体项目，查看页面、成片和完整创作过程。</p>
        </div>
        <div className="project-stage">
          <div className="project-grid" ref={stackRef}>
            {showcaseItems.map((item, index) => (
              <article
                className="project-card"
                key={item.title}
                style={{
                  '--project-stack-top': `${96 + index * 14}px`,
                  '--project-stack-top-tablet': `${82 + index * 10}px`,
                  '--project-stack-top-mobile': `${68 + index * 8}px`,
                  zIndex: index + 1,
                } as CSSProperties}
              >
                <div className={isProjectCollection(item) ? `project-media project-collection-cover is-count-${item.previewImages.length} project-collection-${item.theme}` : 'project-media'}>
                  {isProjectCollection(item) ? (
                    item.previewImages.map((image, previewIndex) => (
                      <span className="project-collection-preview" key={image.image}>
                        <img className={image.imageClass} src={image.image} alt={image.imageAlt} loading="lazy" width="700" height="900" />
                        <small>{String(previewIndex + 1).padStart(2, '0')}</small>
                      </span>
                    ))
                  ) : (
                    <img className={item.imageClass} src={item.image} alt={item.imageAlt} loading="lazy" width="1200" height="1200" />
                  )}
                  <span className="project-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="project-body">
                  <div className="project-meta"><span>{item.category}</span><span>{item.stage}</span></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="project-responsibility"><span>我负责</span><strong>{item.responsibility}</strong></div>
                  <ul className="project-tags" aria-label={`${item.title}使用的方向与工具`}>
                    {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
                <button
                  className="project-card-hitarea"
                  type="button"
                  aria-label={isProjectCollection(item) ? `打开${item.title}分类` : `打开${item.title}详情`}
                  aria-haspopup="dialog"
                  onClick={() => isProjectCollection(item) ? setSelectedCollection(item) : setSelectedProject(item)}
                />
                <span className="project-open-icon" aria-hidden="true"><ArrowUpRight size={19} /></span>
              </article>
            ))}
          </div>
          <button
            className="project-scroll-rail"
            type="button"
            aria-label="跳过作品，前往关于我"
            onClick={() => jumpPastProjects('down')}
            onWheel={handleRailWheel}
          >
            <span>向下浏览</span>
            <i />
            <b>↓</b>
          </button>
        </div>
      </section>

      {selectedCollection && !selectedProject && (
        <dialog className="project-modal project-category-modal" open aria-modal="true" aria-labelledby="project-category-title">
          <button className="project-modal-backdrop" type="button" onClick={closeAllProjects} aria-label={`关闭${selectedCollection.title}分类`} />
          <article className="project-modal-panel project-category-panel">
            <header className="project-modal-header">
              <div>
                <p>PROJECT CATEGORY / {selectedCollection.stage}</p>
                <h2 id="project-category-title">{selectedCollection.title}</h2>
              </div>
              <button className="project-modal-close" type="button" onClick={closeAllProjects} aria-label={`关闭${selectedCollection.title}分类`}><X size={20} /></button>
            </header>
            <div className="project-detail-intro project-category-intro">
              <p>{selectedCollection.description} 选择一个项目，继续查看完整过程与成果。</p>
              <span>共 {selectedCollection.items.length} 个项目</span>
            </div>
            {selectedCollection.items.length > 1 && (
              <div className="project-category-mobile-hint" aria-hidden="true">左右滑动查看全部 {selectedCollection.items.length} 个项目 <span>→</span></div>
            )}
            <div className={`project-category-grid is-count-${selectedCollection.items.length}`}>
              {selectedCollection.items.map((project) => (
                <button className="project-category-card" type="button" key={project.title} onClick={() => setSelectedProject(project)}>
                  <span className="project-category-image">
                    <img className={project.imageClass} src={project.image} alt={project.imageAlt} loading="lazy" width="720" height="900" />
                  </span>
                  <span className="project-category-copy">
                    <span className="project-category-meta"><b>{project.number}</b><small>{project.stage}</small></span>
                    <strong>{project.title}</strong>
                    <span>{project.description}</span>
                  </span>
                  <i aria-hidden="true"><ArrowUpRight size={18} /></i>
                </button>
              ))}
            </div>
          </article>
        </dialog>
      )}

      {selectedProject?.detail && (
        <dialog className="project-modal" open aria-modal="true" aria-labelledby="project-modal-title">
          <button className="project-modal-backdrop" type="button" onClick={closeAllProjects} aria-label="关闭项目详情" />
          <article className="project-modal-panel">
            <header className="project-modal-header">
              <div>
                <p>{selectedProject.number} / {selectedProject.category}</p>
                <h2 id="project-modal-title">{selectedProject.title}</h2>
              </div>
              <div className="project-modal-actions">
                {selectedCollection && (
                  <button className="project-modal-back" type="button" onClick={() => setSelectedProject(null)} aria-label={`返回${selectedCollection.title}分类`}><ArrowLeft size={18} /><span>返回分类</span></button>
                )}
                <button className="project-modal-close" type="button" onClick={closeAllProjects} aria-label="关闭项目详情"><X size={20} /></button>
              </div>
            </header>

            <div className="project-detail-intro">
              <p>{selectedProject.detail.intro}</p>
              <span>{selectedProject.stage}</span>
            </div>

            {selectedProject.detail.gallery.length > 0 && (
              <div className={`project-detail-gallery${selectedProject.detail.gallery.length === 1 ? ' is-single' : ''}${selectedProject.detail.galleryClassName ? ` ${selectedProject.detail.galleryClassName}` : ''}`}>
                {selectedProject.detail.gallery.map((item) => (
                  <figure key={item.src}>
                    <div><img className={item.className} src={item.src} alt={item.alt} loading="lazy" /></div>
                    <figcaption>{item.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}

            {selectedProject.detail.videos && (
              <div className="project-video-grid" aria-label={`${selectedProject.title}视频作品`}>
                {selectedProject.detail.videos.map((video) => (
                  <article className="project-video-card" key={video.src}>
                    <div className="project-video-frame">
                      <video controls playsInline preload="metadata" poster={video.poster} aria-label={`播放${video.title}`}>
                        <source src={video.src} type="video/mp4" />
                        你的浏览器暂不支持视频播放。
                      </video>
                    </div>
                    <h3>{video.title}</h3>
                    <p>{video.caption}</p>
                  </article>
                ))}
              </div>
            )}

            <div className="project-detail-columns">
              <section>
                <span className="project-detail-label">项目目标</span>
                <p>{selectedProject.detail.goal}</p>
              </section>
              <section>
                <span className="project-detail-label">{selectedProject.detail.featuresLabel ?? '核心功能'}</span>
                <ul>{selectedProject.detail.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
              </section>
              <section>
                <span className="project-detail-label">我的工作</span>
                <ol>{selectedProject.detail.process.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
              </section>
            </div>
          </article>
        </dialog>
      )}
    </>
  );
}
