'use client';

import { useRef, type SyntheticEvent } from 'react';

const videos = [
  { file: 'park-commercial', title: '公园里的产品短片', description: '人物与宠物互动，结合产品特写和悬浮运镜。', type: '场景广告', duration: '10 秒' },
  { file: 'crystal-dog', title: '水晶小狗的奇幻旅程', description: '透明机械质感、镜头推进与立体视觉特效。', type: '创意特效', duration: '7 秒' },
  { file: 'warehouse-scene', title: '仓库里的惊喜发现', description: '多人场景中的人物互动与产品展示。', type: '人物情景', duration: '11 秒' },
  { file: 'pet-dialogue', title: '两只小狗的对话', description: '双角色互动、表情变化与宠物趣味表达。', type: '角色互动', duration: '9 秒' },
  { file: 'product-particles', title: '成分光影 · 产品动画', description: '粒子流动、光影变化与产品镜头设计。', type: '产品视觉', duration: '5 秒' },
];

export function AiVideoGallery() {
  const galleryRef = useRef<HTMLDivElement>(null);

  function pauseOtherVideos(event: SyntheticEvent<HTMLVideoElement>) {
    galleryRef.current?.querySelectorAll('video').forEach((video) => {
      if (video !== event.currentTarget) video.pause();
    });
  }

  return (
    <div className="ai-video-grid" ref={galleryRef} aria-label="五个 AI 视频作品">
      {videos.map((video, index) => (
        <article className="ai-video-card" key={video.file}>
          <div className="ai-video-frame">
            <video
              controls
              playsInline
              preload="none"
              poster={`/projects/ai-video/${video.file}.jpg`}
              aria-label={`播放${video.title}`}
              onPlay={pauseOtherVideos}
            >
              <source src={`/projects/ai-video/${video.file}.mp4`} type="video/mp4" />
              你的浏览器暂不支持视频播放。
            </video>
          </div>
          <div className="ai-video-info">
            <div className="ai-video-meta"><span>{String(index + 1).padStart(2, '0')} / {video.type}</span><span>{video.duration}</span></div>
            <h3>{video.title}</h3>
            <p>{video.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
