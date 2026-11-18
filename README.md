# 谢达个人作品网页

网站源代码位于 GitHub 的 `source` 分支，GitHub Pages 从 `main` 分支根目录发布静态文件。

安装依赖后，执行 `pnpm build:pages`，生成的 `dist/client` 包含可发布的静态网页和素材。发布时保留 `main` 分支根目录的 `.nojekyll` 文件，并在更新前核对远程分支，避免覆盖其他修改。

AI 视频作品放在 `public/projects/ai-video`，对应展示内容在 `app/ai-video-gallery.tsx`。
