import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CONTENT_OUTPUT_REMOTE_MEDIA } from "./content-output-remote.js";

const PROFILE = {
  name: "严欢 / Ryan",
  phone: "18481152238",
  email: "coloh1121@163.com",
};

const FALLBACK_HERO_BACKGROUNDS = [
  "radial-gradient(circle at 72% 46%, rgba(214, 164, 255, 0.75), rgba(92, 182, 255, 0.35) 18%, rgba(113, 54, 149, 0.24) 38%, rgba(4, 6, 12, 0) 62%), repeating-radial-gradient(circle at 72% 46%, rgba(255, 255, 255, 0.14) 0, rgba(255, 255, 255, 0.14) 2px, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0) 34px), linear-gradient(135deg, rgba(2, 8, 18, 0.98), rgba(10, 8, 24, 0.94))",
  "radial-gradient(circle at 78% 44%, rgba(157, 210, 255, 0.68), rgba(139, 92, 246, 0.34) 16%, rgba(16, 77, 117, 0.26) 34%, rgba(4, 6, 12, 0) 58%), repeating-radial-gradient(circle at 78% 44%, rgba(123, 223, 255, 0.16) 0, rgba(123, 223, 255, 0.16) 2px, rgba(123, 223, 255, 0) 2px, rgba(123, 223, 255, 0) 30px), linear-gradient(135deg, rgba(1, 7, 16, 0.98), rgba(7, 11, 26, 0.94))",
];

const heroImageModules = import.meta.glob("../assets/hero/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
});

const heroVideoModules = import.meta.glob("../assets/hero/*.{mp4,webm,mov,m4v}", {
  eager: true,
  import: "default",
});

const HERO_BACKGROUNDS = Object.values(heroImageModules);
const HERO_VIDEO = Object.values(heroVideoModules)[0] || "";

const FEATURED_GRADIENTS = [
  "linear-gradient(135deg, rgba(6, 16, 28, 0.98), rgba(18, 14, 38, 0.96)), radial-gradient(circle at 78% 22%, rgba(104, 214, 255, 0.35), rgba(0, 0, 0, 0) 34%)",
  "linear-gradient(135deg, rgba(8, 10, 20, 0.98), rgba(24, 14, 30, 0.96)), radial-gradient(circle at 72% 28%, rgba(232, 186, 106, 0.28), rgba(0, 0, 0, 0) 30%)",
];

function getCaseAssets(modules) {
  const entries = Object.entries(modules).sort(([left], [right]) =>
    left.localeCompare(right, undefined, { numeric: true })
  );
  const coverEntry = entries.find(([path]) => /\/cover\.(png|jpe?g|webp|avif)$/i.test(path));
  const galleryEntries = entries.filter(([path]) => !/\/cover\.(png|jpe?g|webp|avif)$/i.test(path));

  const cover = coverEntry ? coverEntry[1] : galleryEntries[0]?.[1] || null;
  const gallery = galleryEntries.map(([, value]) => value);

  return {
    cover,
    gallery: gallery.length > 0 ? gallery : cover ? [cover] : [],
  };
}

const COMMUNITY_MODULE_ASSETS = {
  profile: getCaseAssets(
    import.meta.glob("../assets/cases/community/profile/*.{png,jpg,jpeg,webp,avif}", {
      eager: true,
      import: "default",
    })
  ),
  collection: getCaseAssets(
    import.meta.glob("../assets/cases/community/collection/*.{png,jpg,jpeg,webp,avif}", {
      eager: true,
      import: "default",
    })
  ),
  taxonomy: getCaseAssets(
    import.meta.glob("../assets/cases/community/taxonomy/*.{png,jpg,jpeg,webp,avif}", {
      eager: true,
      import: "default",
    })
  ),
  event: getCaseAssets(
    import.meta.glob("../assets/cases/community/event/*.{png,jpg,jpeg,webp,avif}", {
      eager: true,
      import: "default",
    })
  ),
  contentcards: getCaseAssets(
    import.meta.glob("../assets/cases/community/contentcards/*.{png,jpg,jpeg,webp,avif}", {
      eager: true,
      import: "default",
    })
  ),
  gaicpage: getCaseAssets(
    import.meta.glob("../assets/cases/community/gaicpage/*.{png,jpg,jpeg,webp,avif}", {
      eager: true,
      import: "default",
    })
  ),
};

const UI_WORK_ASSETS = {
  nebulaLaunch: getCaseAssets(
    import.meta.glob("../assets/ui/nebula-launch/*.{png,jpg,jpeg,webp,avif}", {
      eager: true,
      import: "default",
    })
  ),
  quantumBoard: getCaseAssets(
    import.meta.glob("../assets/ui/quantum-board/*.{png,jpg,jpeg,webp,avif}", {
      eager: true,
      import: "default",
    })
  ),
  signalMobile: getCaseAssets(
    import.meta.glob("../assets/ui/signal-mobile/*.{png,jpg,jpeg,webp,avif}", {
      eager: true,
      import: "default",
    })
  ),
};

const UI_WORK_FOLDERS = {
  nebulaLaunch: "assets/ui/nebula-launch/",
  quantumBoard: "assets/ui/quantum-board/",
  signalMobile: "assets/ui/signal-mobile/",
};

const FLOW_WORK_ASSETS = {
  contentOpsMap: getCaseAssets(
    import.meta.glob("../assets/flowcharts-playbooks/content-ops-map/*.{png,jpg,jpeg,webp,avif}", {
      eager: true,
      import: "default",
    })
  ),
  promptReviewLoop: getCaseAssets(
    import.meta.glob("../assets/flowcharts-playbooks/prompt-review-loop/*.{png,jpg,jpeg,webp,avif}", {
      eager: true,
      import: "default",
    })
  ),
  assetDeliveryPath: getCaseAssets(
    import.meta.glob("../assets/flowcharts-playbooks/asset-delivery-path/*.{png,jpg,jpeg,webp,avif}", {
      eager: true,
      import: "default",
    })
  ),
};

const FLOW_WORK_FOLDERS = {
  contentOpsMap: "assets/flowcharts-playbooks/content-ops-map/",
  promptReviewLoop: "assets/flowcharts-playbooks/prompt-review-loop/",
  assetDeliveryPath: "assets/flowcharts-playbooks/asset-delivery-path/",
};

function getMixedMediaAssets(modules, remoteItems = []) {
  const remoteEntries = (remoteItems || [])
    .filter((item) => item && typeof item.src === "string" && item.src.trim())
    .map((item, index) => {
      const src = item.src.trim();
      const inferredType =
        item.type === "video" || item.type === "image"
          ? item.type
          : /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(src)
            ? "video"
            : "image";
      const fileName = src.split("/").pop()?.split("?")[0] || `remote-item-${index + 1}`;

      return {
        src,
        type: inferredType,
        path: item.path?.trim() || `remote/${fileName}`,
      };
    });

  const localEntries = Object.entries(modules)
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
    .map(([path, src]) => ({
      src,
      type: /\.(mp4|webm|mov|m4v)$/i.test(path) ? "video" : "image",
      path,
    }));
  const entries = [...remoteEntries, ...localEntries].sort((left, right) =>
    left.path.localeCompare(right.path, undefined, { numeric: true })
  );

  const coverEntry =
    entries.find(({ path }) => /\/cover\.(png|jpe?g|webp|avif|mp4|webm|mov|m4v)$/i.test(path)) || entries[0] || null;

  return {
    cover: coverEntry,
    items: entries,
  };
}

function loadMediaAspectRatio(media) {
  return new Promise((resolve) => {
    if (!media?.src) {
      resolve(1);
      return;
    }

    if (media.type === "video") {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = media.src;
      video.onloadedmetadata = () => {
        const ratio = video.videoWidth > 0 && video.videoHeight > 0 ? video.videoWidth / video.videoHeight : 1;
        resolve(ratio);
      };
      video.onerror = () => resolve(1);
      return;
    }

    const image = new Image();
    image.src = media.src;
    image.onload = () => {
      const ratio = image.naturalWidth > 0 && image.naturalHeight > 0 ? image.naturalWidth / image.naturalHeight : 1;
      resolve(ratio);
    };
    image.onerror = () => resolve(1);
  });
}

function getMediaLabel(media, index) {
  return "Anime";
}

const contentOutputLegacyModules = import.meta.glob(
  "../assets/content-output/launch-teaser/*.{png,jpg,jpeg,webp,avif,mp4,webm,mov,m4v}",
  {
    eager: true,
    import: "default",
  }
);

const contentOutputImageModules = import.meta.glob(
  "../assets/content-output/images/*.{png,jpg,jpeg,webp,avif}",
  {
    eager: true,
    import: "default",
  }
);

const contentOutputVideoModules = import.meta.glob(
  "../assets/content-output/videos/*.{mp4,webm,mov,m4v}",
  {
    eager: true,
    import: "default",
  }
);

const CONTENT_OUTPUT_ASSETS = getMixedMediaAssets(
  {
    ...contentOutputLegacyModules,
    ...contentOutputImageModules,
    ...contentOutputVideoModules,
  },
  CONTENT_OUTPUT_REMOTE_MEDIA
);

const contentOutputBackgroundModules = import.meta.glob(
  "../assets/content-output/background/*.{png,jpg,jpeg,webp,avif}",
  {
    eager: true,
    import: "default",
  }
);

const CONTENT_OUTPUT_FOLDERS = [
  "assets/content-output/images/",
  "assets/content-output/videos/",
  "src/content-output-remote.js",
];
const CONTENT_OUTPUT_BACKGROUND = Object.values(contentOutputBackgroundModules)[0] || "";
const CONTENT_DETAIL_HASH = "#content-detail";

function buildContentDetailHash(mediaPath) {
  return `${CONTENT_DETAIL_HASH}?media=${encodeURIComponent(mediaPath)}`;
}

function parseContentDetailHash(hash) {
  if (!hash || !hash.startsWith(CONTENT_DETAIL_HASH)) {
    return null;
  }

  const [, query = ""] = hash.split("?");
  const params = new URLSearchParams(query);
  const media = params.get("media");

  if (!media) {
    return null;
  }

  try {
    return decodeURIComponent(media);
  } catch (error) {
    return media;
  }
}

function resolveDetailMediaIndex(items, mediaPath) {
  if (!mediaPath) {
    return -1;
  }

  const normalizePath = (value) => String(value || "").replace(/\\/g, "/").normalize("NFC");
  const candidates = new Set([normalizePath(mediaPath)]);

  try {
    candidates.add(normalizePath(decodeURIComponent(mediaPath)));
  } catch (error) {
    // Ignore malformed decode input and keep raw path candidate.
  }

  for (const candidate of candidates) {
    const exactIndex = items.findIndex((item) => normalizePath(item.path) === candidate);
    if (exactIndex >= 0) {
      return exactIndex;
    }
  }

  const targetName = normalizePath(mediaPath).split("/").pop();
  if (!targetName) {
    return -1;
  }

  return items.findIndex((item) => normalizePath(item.path).endsWith(`/${targetName}`));
}

const communityBackgroundVideoModules = import.meta.glob(
  "../assets/cases/community/background/*.{mp4,webm,mov,m4v}",
  {
    eager: true,
    import: "default",
  }
);

const communityBackgroundImageModules = import.meta.glob(
  "../assets/cases/community/background/*.{png,jpg,jpeg,webp,avif}",
  {
    eager: true,
    import: "default",
  }
);

const COMMUNITY_BACKGROUND_VIDEO = Object.values(communityBackgroundVideoModules)[0] || "";
const COMMUNITY_BACKGROUND_IMAGES = Object.values(communityBackgroundImageModules);

const CONTENT = {
  en: {
    lang: "en",
    title: "AIGC Portfolio",
    navAria: "Primary navigation",
    nav: [
      { href: "#home", label: "Home" },
      { href: "#featured", label: "Featured" },
      { href: "#video", label: "Content" },
      { href: "#ui", label: "UI" },
      { href: "#workflows", label: "Workflows" },
    ],
    contact: {
      name: "Name",
      phone: "Phone",
      email: "Email",
    },
    hero: {
      lines: ["HELLO", "I'M", "YAN", "HUAN"],
      nativeName: "严 欢",
      tags: ["Product Manager", "Content Operations", "AIGC Creator"],
      playLabel: "Play intro",
    },
    gallery: {
      imagesLabel: "Screens",
      emptyLabel: "Drop screenshots into the matching local folder to enable the gallery.",
      prevLabel: "Prev",
      nextLabel: "Next",
    },
    mediaGallery: {
      itemsLabel: "Media",
      emptyLabel: "Drop videos or images into the matching local folder to enable the showcase.",
      prevLabel: "Prev",
      nextLabel: "Next",
    },
    flowGallery: {
      imagesLabel: "Flowcharts",
      emptyLabel: "Drop flowchart images into the matching local folder to enable the gallery.",
      prevLabel: "Prev",
      nextLabel: "Next",
    },
    sections: {
      featured: {
        number: "01",
        kicker: "Featured / Highlights",
        title: "Requirement Build Outcomes",
        subtitle: "",
      },
      skills: {
        number: "02",
        kicker: "Skills / Toolchain",
        title: "Capabilities & Toolchain",
        subtitle: "A compact overview of the tools and workflow behind the portfolio.",
        toolchainTitle: "Toolchain",
        toolchainCopy: "Design, generation and delivery tools used across UI, video and workflow outputs.",
        workflowTitle: "Workflow Steps",
      },
      ui: {
        number: "",
        kicker: "UI Showcase",
        title: "UI",
        subtitle: "",
      },
      video: {
        number: "",
        kicker: "Content Output",
        title: "Content Output",
        subtitle: "Video and image outputs collected from past work.",
      },
      workflows: {
        number: "",
        kicker: "Product Systems / AI Workflows",
        title: "Flowchart Design & Requirement Brief Showcase",
        subtitle: "",
        footer: "",
      },
    },
    featuredItems: [
      {
        caseType: "community",
        title: "Ima Studio Community",
        desc: "Requirement Build Outcomes",
        entryLabel: "Module Showcase",
        imagesLabel: "Screens",
        emptyLabel: "Drop screenshots into the matching local folder to enable the carousel.",
        prevLabel: "Prev",
        nextLabel: "Next",
        moduleEntries: [
          {
            id: "profile",
            title: "Creator Profile",
            summary: "Build a creator homepage with work showcase, creator info and personal content management.",
            detail:
              "Responsible for the design and implementation of the Creator Profile page for Ima Studio, providing a dedicated space for creators to showcase their identity, works, and personal content management. The page structure was designed around creator presentation and user browsing behavior, including key sections such as creator information, series and collections display, content listings, and personal modules like favorites and templates. This structure allows users to quickly understand a creator's profile and explore their works efficiently. A modular layout was implemented to better organize content and enable creators to showcase their projects and collections within a unified personal homepage, improving creator visibility and supporting the growth of the community ecosystem.",
            buttonLabel: "View",
          },
          {
            id: "gaicpage",
            title: "GAIC Event Page",
            summary: "Build the GAIC activity page for event exposure, participation flow and campaign delivery.",
            detail:
              "Responsible for the structural design and page development of the GAIC event page: https://www.imastudio.com/gaic. Designed the information architecture around the creator participation flow, including key modules such as event overview, reward mechanisms, submission entry, and featured works display. Implemented a card-based and modular layout to improve information readability and browsing efficiency, and promoted a componentized and configurable page structure to enable flexible updates for event content. The page serves as the core entry point for the GAIC campaign, guiding creators to participate in AI content challenges, submit their works, and explore community creations, ultimately increasing creator engagement and community activity on the platform.",
            buttonLabel: "View",
          },
          {
            id: "collection",
            title: "Collections",
            summary: "Support collection creation and management for grouping related works and improving organization.",
            detail:
              "Responsible for the design and functional planning of the Ima Studio Collection page, which organizes and presents serialized video content and tutorial resources. Based on the user scenario of continuous viewing and content aggregation, the page structure includes key modules such as the video player area, collection playlist panel, creator information, and interaction entry points. A sidebar playlist was designed to improve navigation efficiency, allowing users to quickly locate and switch between chapters within a collection. The page also optimizes information hierarchy and viewing flow, enabling users to browse content, navigate episodes, and access creation tools within a single interface, ultimately improving content consumption experience and supporting structured presentation of creators' serialized works.",
            buttonLabel: "View",
          },
          {
            id: "taxonomy",
            title: "Tags System",
            summary: "Build the community taxonomy to support content classification, search and recommendation.",
            detail:
              "Responsible for the design and implementation of the Tags System for the Ima Studio community, aimed at supporting content classification, search, and recommendation. Based on the platform's content ecosystem and user discovery behavior, the taxonomy structure and tagging logic were defined to create a standardized labeling system for community content. Tag navigation and filtering mechanisms were designed to help users quickly discover related works through tags. The system improves content searchability and recommendation efficiency, providing a scalable foundation for content discovery and distribution within the community.",
            buttonLabel: "View",
          },
          {
            id: "event",
            title: "Community Events",
            summary: "Show official community activities including challenges, competitions and reward mechanisms.",
            detail:
              "Responsible for the design and implementation of the Community Events page for Ima Studio, which serves as a centralized hub for official community activities, creative challenges, and reward programs. The page structure was designed around the creator participation journey, including key modules such as event status segmentation (Live / Upcoming / Past), event cards, detail entry points, and participation actions. A card-based and modular layout was implemented to organize event information clearly and improve browsing efficiency. This allows creators to easily discover active challenges, understand reward mechanisms, and quickly access event details to participate, ultimately increasing engagement and content creation activity within the community.",
            buttonLabel: "View",
          },
          {
            id: "contentcards",
            title: "Content Cards",
            summary: "Unify the community content card structure to improve browsing efficiency and visual consistency.",
            detail:
              "Responsible for designing and standardizing the Content Card system for the Ima Studio community, creating a unified structure for how content is previewed across the platform. The card layout was designed around content discovery and browsing behavior, organizing key information such as content preview, creator information, interaction metrics, and action entry points. This allows users to quickly understand a piece of content and access the detail page directly from listing views. The card component was built with a modular structure so it can be reused across multiple scenarios such as the homepage feed, tag pages, and collections, improving browsing efficiency, visual consistency, and component reusability across the product.",
            buttonLabel: "View",
          },
        ],
      },
    ],
    toolchain: ["Figma", "Photoshop", "After Effects", "Midjourney", "Runway", "Cursor"],
    workflowSteps: [
      { label: "Idea", desc: "Define the core scenario and output goal before building visuals." },
      { label: "Prompt", desc: "Translate direction into structured prompts and reusable templates." },
      { label: "Iterate", desc: "Refine layout, visual density and copy with small comparison rounds." },
      { label: "Deliver", desc: "Package assets into pages, visuals and interview-ready storytelling." },
    ],
    uiWorks: [
      {
        id: "nebulaLaunch",
        title: "Ima Studio Community Profile UI Design",
        desc: "UI design showcase for the Ima Studio community personal page.",
        meta: "UI Design",
      },
      {
        id: "quantumBoard",
        title: "Community Collection Detail UI Design",
        desc: "UI design showcase for the community collection detail page.",
        meta: "UI Design",
      },
      {
        id: "signalMobile",
        title: "Community Events Page UI Optimization",
        desc: "UI update and optimization for the community events page.",
        meta: "UI Design",
      },
    ],
    videoWorks: [
      {
        id: "launchTeaser",
        title: "Launch Teaser",
        desc: "Fast-cut product teaser with AI-generated frames and motion typography.",
        meta: "Ads",
      },
      {
        id: "animeClip",
        title: "Anime Clip",
        desc: "Short animated sequence exploring stylized character motion and pacing.",
        meta: "Anime",
      },
      {
        id: "tutorialReel",
        title: "Tutorial Reel",
        desc: "Workflow explanation video with prompt steps and output comparison.",
        meta: "Tutorial",
      },
    ],
    flowWorks: [
      {
        id: "contentOpsMap",
        title: "IMA STUDIO Community Flowchart Design",
        desc: "IMA STUDIO Community Flowchart Design",
        meta: "",
      },
      {
        id: "promptReviewLoop",
        title: "GAIC Event Page Requirement Design (Partial)",
        desc: "GAIC Event Page Requirement Design (Partial)",
        meta: "",
      },
      {
        id: "assetDeliveryPath",
        title: "Community Personal Site Requirement Design (Partial)",
        desc: "Community Personal Site Requirement Design (Partial)",
        meta: "",
      },
    ],
    metaDescription: "AIGC Portfolio homepage built with React.",
  },
  zh: {
    lang: "zh-CN",
    title: "AIGC Portfolio",
    navAria: "主导航",
    nav: [
      { href: "#home", label: "首页" },
      { href: "#featured", label: "精选" },
      { href: "#video", label: "内容产出" },
      { href: "#ui", label: "UI" },
      { href: "#workflows", label: "工作流" },
    ],
    contact: {
      name: "姓名",
      phone: "电话",
      email: "邮箱",
    },
    hero: {
      lines: ["HELLO", "I'M", "YAN", "HUAN"],
      nativeName: "严 欢",
      tags: ["产品经理", "内容运营", "AIGC 创作者"],
      playLabel: "播放介绍",
    },
    gallery: {
      imagesLabel: "页面截图",
      emptyLabel: "将截图放入对应本地目录后，这里会自动启用图片展示。",
      prevLabel: "上一张",
      nextLabel: "下一张",
    },
    mediaGallery: {
      itemsLabel: "媒体内容",
      emptyLabel: "将视频或图片放入对应本地目录后，这里会自动启用作品展示。",
      prevLabel: "上一项",
      nextLabel: "下一项",
    },
    flowGallery: {
      imagesLabel: "流程图",
      emptyLabel: "将流程图放入对应本地目录后，这里会自动启用图片展示。",
      prevLabel: "上一张",
      nextLabel: "下一张",
    },
    sections: {
      featured: {
        number: "01",
        kicker: "Featured / Highlights",
        title: "需求搭建成果",
        subtitle: "",
      },
      skills: {
        number: "02",
        kicker: "Skills / Toolchain",
        title: "能力栈与工具链",
        subtitle: "简要说明这个作品集背后的工具与工作方式。",
        toolchainTitle: "工具链",
        toolchainCopy: "覆盖设计、生成、后期与交付的常用工具。",
        workflowTitle: "工作流程",
      },
      ui: {
        number: "",
        kicker: "UI Showcase",
        title: "UI",
        subtitle: "",
      },
      video: {
        number: "",
        kicker: "Content Output",
        title: "内容产出",
        subtitle: "包含过往产出的视频&图片内容。",
      },
      workflows: {
        number: "",
        kicker: "Product Systems / AI Workflows",
        title: "流程图设计与需求文档简要展示",
        subtitle: "",
        footer: "",
      },
    },
    featuredItems: [
      {
        caseType: "community",
        title: "Ima Studio 社区",
        desc: "需求搭建成果",
        entryLabel: "模块展示",
        imagesLabel: "页面截图",
        emptyLabel: "将截图放入对应本地目录后，这里会自动启用图片切换。",
        prevLabel: "上一张",
        nextLabel: "下一张",
        moduleEntries: [
          {
            id: "profile",
            title: "创作者主页",
            summary: "搭建创作者个人主页，支持作品展示、创作者信息展示与个人内容管理。",
            detail:
              "负责 Ima Studio 创作者主页的设计与实现，为创作者提供展示个人身份、作品以及个人内容管理的专属空间。页面结构围绕创作者展示与用户浏览行为设计，涵盖创作者信息、系列与合集展示、内容列表，以及收藏、模板等个人模块。这一结构使用户能够快速理解创作者身份并高效浏览其作品。通过模块化布局，更好地组织内容，同时支持创作者在统一的个人主页中展示项目与合集，提升创作者曝光度并支持社区生态的持续增长。",
            buttonLabel: "查看",
          },
          {
            id: "gaicpage",
            title: "GAIC 活动页面",
            summary: "用于承接 GAIC 活动曝光、参与流程与活动页面整体交付。",
            detail:
              "负责 GAIC 活动页面的结构设计与页面开发，页面链接：https://www.imastudio.com/gaic。围绕创作者参与流程搭建信息架构，涵盖活动概览、奖励机制、投稿入口、精选作品展示等核心模块。通过卡片化与模块化布局提升信息可读性与浏览效率，并推动页面结构组件化、可配置化，以支持活动内容的灵活更新。该页面作为 GAIC 活动的核心入口，承担引导创作者参与 AI 内容挑战、提交作品并浏览社区创作内容的功能，进一步提升平台创作者参与度与社区活跃度。",
            buttonLabel: "查看",
          },
          {
            id: "collection",
            title: "合集管理",
            summary: "支持用户创建与管理内容合集，用于聚合相关作品并提升内容组织能力。",
            detail:
              "负责 Ima Studio 合集页面的设计与功能规划，用于组织和呈现系列化视频内容与教程资源。基于用户连续观看与内容聚合的使用场景，页面结构涵盖视频播放区、合集播放列表面板、创作者信息以及互动入口等核心模块。通过设计侧边播放列表提升导航效率，帮助用户在同一合集内快速定位并切换不同章节内容。页面同时优化了信息层级与观看路径，使用户能够在单一界面中完成内容浏览、章节跳转以及创作工具入口访问，进一步提升内容消费体验，并支持创作者系列作品的结构化展示。",
            buttonLabel: "查看",
          },
          {
            id: "taxonomy",
            title: "标签体系",
            summary: "构建社区标签体系，实现内容分类、搜索与推荐能力。",
            detail:
              "负责 Ima Studio 社区标签系统的设计与实现，目标是支持内容分类、搜索与推荐能力。基于平台内容生态和用户发现内容的行为路径，定义了标签体系结构与标注逻辑，为社区内容建立标准化的标签系统。通过设计标签导航与筛选机制，帮助用户基于标签快速发现相关作品。该系统提升了内容的可搜索性与推荐效率，并为社区内内容发现与分发提供可扩展的基础能力。",
            buttonLabel: "查看",
          },
          {
            id: "event",
            title: "社区活动",
            summary: "展示官方社区活动，包括创作挑战、比赛与奖励机制。",
            detail:
              "负责 Ima Studio 社区活动页面的设计与实现，该页面作为官方社区活动、创作挑战和奖励机制的集中承载中心。页面结构围绕创作者参与路径展开，涵盖活动状态分区（进行中 / 即将开始 / 已结束）、活动卡片、详情入口以及参与操作等核心模块。通过卡片化与模块化布局，对活动信息进行清晰组织并提升浏览效率，使创作者能够快速发现正在进行的挑战、理解奖励机制，并便捷进入活动详情完成参与，最终提升社区内的参与度与内容创作活跃度。",
            buttonLabel: "查看",
          },
          {
            id: "contentcards",
            title: "内容卡片",
            summary: "统一社区内容展示结构，提升浏览效率与视觉统一性。",
            detail:
              "负责 Ima Studio 社区内容卡片系统的设计与标准化，构建平台内统一的内容预览结构。卡片布局围绕内容发现与浏览行为设计，组织了内容预览、创作者信息、互动数据以及操作入口等关键信息，使用户能够在列表视图中快速理解内容并直接进入详情页。该卡片组件采用模块化结构搭建，可复用于首页信息流、标签页、合集页等多个场景，进一步提升产品中的浏览效率、视觉一致性和组件复用能力。",
            buttonLabel: "查看",
          },
        ],
      },
    ],
    toolchain: ["Figma", "Photoshop", "After Effects", "Midjourney", "Runway", "Cursor"],
    workflowSteps: [
      { label: "Idea", desc: "先明确核心场景和输出目标，再开始构建视觉。" },
      { label: "Prompt", desc: "把方向拆成结构化提示词和可复用模板。" },
      { label: "Iterate", desc: "通过小步对比迭代优化布局、视觉密度和文案。" },
      { label: "Deliver", desc: "整理成页面、视觉稿和可用于面试讲述的输出。" },
    ],
    uiWorks: [
      {
        id: "nebulaLaunch",
        title: "Ima Studio社区个人页UI设计展示",
        desc: "Ima Studio 社区个人页 UI 设计展示。",
        meta: "UI设计",
      },
      {
        id: "quantumBoard",
        title: "社区合集详情页UI设计",
        desc: "社区合集详情页 UI 设计展示。",
        meta: "UI设计",
      },
      {
        id: "signalMobile",
        title: "社区活动页面UI修改+调整",
        desc: "社区活动页面 UI 修改与调整。",
        meta: "UI设计",
      },
    ],
    videoWorks: [
      {
        id: "launchTeaser",
        title: "Launch Teaser",
        desc: "结合 AI 生成画面与动效排版的产品宣传短片。",
        meta: "广告",
      },
      {
        id: "animeClip",
        title: "Anime Clip",
        desc: "探索角色运动与节奏表现的动漫风格短片实验。",
        meta: "动漫",
      },
      {
        id: "tutorialReel",
        title: "Tutorial Reel",
        desc: "展示提示词步骤与结果对比的教程类视频。",
        meta: "教程",
      },
    ],
    flowWorks: [
      {
        id: "contentOpsMap",
        title: "IMA STUDIO社区构流程图设计",
        desc: "IMA STUDIO社区构流程图设计",
        meta: "",
      },
      {
        id: "promptReviewLoop",
        title: "GAIC活动页面需求设计（部分）",
        desc: "GAIC活动页面需求设计（部分）",
        meta: "",
      },
      {
        id: "assetDeliveryPath",
        title: "社区个人站需求设计（部分）",
        desc: "社区个人站需求设计（部分）",
        meta: "",
      },
    ],
    metaDescription: "基于 React 构建的 AIGC 作品集首页。",
  },
};

function Header({ activeSection, locale, onLocaleChange, text }) {
  return (
    <header className="site-header glass-panel">
      <div className="header-inner">
        <a className="brand" href="#home" aria-label="Back home">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark-core">AIGC</span>
            <span className="brand-mark-ring brand-mark-ring-one"></span>
            <span className="brand-mark-ring brand-mark-ring-two"></span>
            <span className="brand-mark-glow"></span>
          </span>
          <span className="brand-copy">
            <strong>Portfolio</strong>
          </span>
        </a>

        <div className="header-tools">
          <nav className="site-nav" aria-label={text.navAria}>
            {text.nav.map((item) => (
              <a
                key={item.href}
                className={`nav-link ${activeSection === item.href.slice(1) ? "is-active" : ""}`}
                href={item.href}
                aria-current={activeSection === item.href.slice(1) ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="language-toggle" role="group" aria-label="Language switch">
            <button
              className={`lang-button ${locale === "en" ? "is-active" : ""}`}
              type="button"
              onClick={() => onLocaleChange("en")}
              aria-pressed={locale === "en"}
            >
              EN
            </button>
            <button
              className={`lang-button ${locale === "zh" ? "is-active" : ""}`}
              type="button"
              onClick={() => onLocaleChange("zh")}
              aria-pressed={locale === "zh"}
            >
              中
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function SectionHeading({ section }) {
  return (
    <div className="section-intro">
      <div className="section-kicker">{section.kicker}</div>
      <div className="section-title-row">
        {section.number ? <span className="section-number">{section.number}</span> : null}
        <div>
          <h2 className="section-title">{section.title}</h2>
          <p className="section-subtitle">{section.subtitle}</p>
        </div>
      </div>
      <div className="section-rule"></div>
    </div>
  );
}

function renderTextWithLinks(text) {
  const urlPattern = /(https?:\/\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  const isValidHttpUrl = (value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (error) {
      return false;
    }
  };
  const trimTrailingPunctuation = (rawUrl) => {
    let cleanUrl = rawUrl;
    let trailing = "";

    while (cleanUrl.length > 0) {
      const lastChar = cleanUrl.at(-1);
      if (!/[)\].,!?;:]/.test(lastChar)) {
        break;
      }

      if (lastChar === ")") {
        const openCount = (cleanUrl.match(/\(/g) || []).length;
        const closeCount = (cleanUrl.match(/\)/g) || []).length;
        if (closeCount <= openCount) {
          break;
        }
      }

      if (lastChar === "]") {
        const openCount = (cleanUrl.match(/\[/g) || []).length;
        const closeCount = (cleanUrl.match(/\]/g) || []).length;
        if (closeCount <= openCount) {
          break;
        }
      }

      trailing = lastChar + trailing;
      cleanUrl = cleanUrl.slice(0, -1);
    }

    while (cleanUrl && !isValidHttpUrl(cleanUrl)) {
      trailing = cleanUrl.slice(-1) + trailing;
      cleanUrl = cleanUrl.slice(0, -1);
    }

    return { cleanUrl, trailing };
  };

  while ((match = urlPattern.exec(text)) !== null) {
    const [fullMatch, rawUrl] = match;
    const start = match.index;
    const { cleanUrl, trailing } = trimTrailingPunctuation(rawUrl);

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    if (cleanUrl) {
      parts.push(
        <a key={`${cleanUrl}-${start}`} href={cleanUrl} target="_blank" rel="noreferrer">
          {cleanUrl}
        </a>
      );
    } else {
      parts.push(rawUrl);
    }

    if (trailing) {
      parts.push(trailing);
    }

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function getCircularOffset(index, activeIndex, total) {
  let offset = index - activeIndex;
  const half = total / 2;

  if (offset > half) {
    offset -= total;
  } else if (offset < -half) {
    offset += total;
  }

  return offset;
}

function ModuleViewerModal({ text, module, onClose }) {
  const [imageIndex, setImageIndex] = useState(0);
  const assets = COMMUNITY_MODULE_ASSETS[module.id] || { cover: null, gallery: [] };
  const images = assets.gallery;

  useEffect(() => {
    setImageIndex(0);
  }, [module.id]);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowRight" && images.length > 1) {
        setImageIndex((current) => (current + 1) % images.length);
      }
      if (event.key === "ArrowLeft" && images.length > 1) {
        setImageIndex((current) => (current - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [images.length, onClose]);

  return (
    <div className="module-modal" role="dialog" aria-modal="true" aria-label={module.title}>
      <button className="module-modal-backdrop" type="button" aria-label="Close" onClick={onClose}></button>
      <div className="module-modal-panel glass-panel">
        <div className="module-modal-head">
          <div>
            <h3 className="module-modal-title">{module.title}</h3>
            <p className="module-modal-copy">{module.summary}</p>
          </div>
          <button className="module-modal-close" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="module-modal-stage">
          {images.length > 0 ? (
            <>
              <div className="module-modal-frame">
                <img src={images[imageIndex]} alt={module.title} className="module-modal-image" />
              </div>
              <div className="module-modal-text glass-panel">
                <h4 className="module-modal-text-title">{module.title}</h4>
                <p className="module-modal-text-copy">{renderTextWithLinks(module.detail || module.summary)}</p>
              </div>
              <div className="module-modal-toolbar">
                <span className="meta-inline">
                  {text.imagesLabel} {imageIndex + 1}/{images.length}
                </span>
                <div className="module-modal-controls">
                  <button
                    className="toggle-button"
                    type="button"
                    onClick={() => setImageIndex((current) => (current - 1 + images.length) % images.length)}
                  >
                    {text.prevLabel}
                  </button>
                  <button
                    className="toggle-button"
                    type="button"
                    onClick={() => setImageIndex((current) => (current + 1) % images.length)}
                  >
                    {text.nextLabel}
                  </button>
                </div>
              </div>
              {images.length > 1 ? (
                <div className="module-modal-thumbs">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      className={`module-thumb ${index === imageIndex ? "is-active" : ""}`}
                      type="button"
                      onClick={() => setImageIndex(index)}
                    >
                      <img src={image} alt={`${module.title} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="module-modal-empty">
              <p>{text.emptyLabel}</p>
              <code>{`assets/cases/community/${module.id}/`}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkGalleryModal({ assets, folderPath, item, labels, onClose }) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = assets.gallery;
  const dragStartX = useRef(null);

  useEffect(() => {
    setImageIndex(0);
  }, [item.id]);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowRight" && images.length > 1) {
        setImageIndex((current) => (current + 1) % images.length);
      }
      if (event.key === "ArrowLeft" && images.length > 1) {
        setImageIndex((current) => (current - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [images.length, onClose]);

  const goPrev = () => {
    setImageIndex((current) => (current - 1 + images.length) % images.length);
  };

  const goNext = () => {
    setImageIndex((current) => (current + 1) % images.length);
  };

  const handlePointerDown = (event) => {
    dragStartX.current = event.clientX;
  };

  const handlePointerUp = (event) => {
    if (dragStartX.current === null || images.length <= 1) {
      dragStartX.current = null;
      return;
    }

    const delta = event.clientX - dragStartX.current;
    if (Math.abs(delta) > 48) {
      if (delta < 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    dragStartX.current = null;
  };

  const prevIndex = images.length > 1 ? (imageIndex - 1 + images.length) % images.length : imageIndex;
  const nextIndex = images.length > 1 ? (imageIndex + 1) % images.length : imageIndex;

  return (
    <div className="module-modal" role="dialog" aria-modal="true" aria-label={item.title}>
      <button className="module-modal-backdrop" type="button" aria-label="Close" onClick={onClose}></button>
      <div className="module-modal-panel glass-panel ui-gallery-modal">
        <div className="module-modal-head">
          <div>
            <h3 className="module-modal-title">{item.title}</h3>
          </div>
          <button className="module-modal-close" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="module-modal-stage">
          {images.length > 0 ? (
            <>
              <div
                className="ui-gallery-stage"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => {
                  dragStartX.current = null;
                }}
              >
                {images.length > 1 ? (
                  <button className="ui-gallery-side ui-gallery-side-prev" type="button" onClick={goPrev}>
                    <img src={images[prevIndex]} alt={`${item.title} ${prevIndex + 1}`} className="ui-gallery-side-image" />
                  </button>
                ) : null}
                <div className="ui-gallery-main">
                  <img src={images[imageIndex]} alt={item.title} className="ui-gallery-main-image" />
                </div>
                {images.length > 1 ? (
                  <button className="ui-gallery-side ui-gallery-side-next" type="button" onClick={goNext}>
                    <img src={images[nextIndex]} alt={`${item.title} ${nextIndex + 1}`} className="ui-gallery-side-image" />
                  </button>
                ) : null}
              </div>
              <div className="ui-gallery-copy glass-panel">
                <p className="module-modal-copy">{item.desc}</p>
              </div>
              <div className="module-modal-toolbar">
                <span className="meta-inline">
                  {labels.imagesLabel} {imageIndex + 1}/{images.length}
                </span>
                <div className="module-modal-controls">
                  <button
                    className="toggle-button"
                    type="button"
                    onClick={goPrev}
                  >
                    {labels.prevLabel}
                  </button>
                  <button
                    className="toggle-button"
                    type="button"
                    onClick={goNext}
                  >
                    {labels.nextLabel}
                  </button>
                </div>
              </div>
              {images.length > 1 ? (
                <div className="ui-gallery-thumbs">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      className={`ui-gallery-thumb ${index === imageIndex ? "is-active" : ""}`}
                      type="button"
                      onClick={() => setImageIndex(index)}
                    >
                      <img src={image} alt={`${item.title} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="module-modal-empty">
              <p>{labels.emptyLabel}</p>
              <code>{folderPath}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContentMediaModal({ assets, folderPath, item, labels, onClose }) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const mediaItems = assets.items;

  useEffect(() => {
    setMediaIndex(0);
  }, [item.id]);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowRight" && mediaItems.length > 1) {
        setMediaIndex((current) => (current + 1) % mediaItems.length);
      }
      if (event.key === "ArrowLeft" && mediaItems.length > 1) {
        setMediaIndex((current) => (current - 1 + mediaItems.length) % mediaItems.length);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [mediaItems.length, onClose]);

  const activeMedia = mediaItems[mediaIndex] || null;

  return (
    <div className="module-modal" role="dialog" aria-modal="true" aria-label={item.title}>
      <button className="module-modal-backdrop" type="button" aria-label="Close" onClick={onClose}></button>
      <div className="module-modal-panel glass-panel content-modal">
        <div className="module-modal-head">
          <div>
            <h3 className="module-modal-title">{item.title}</h3>
            <p className="module-modal-copy">{item.desc}</p>
          </div>
          <button className="module-modal-close" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="module-modal-stage">
          {activeMedia ? (
            <>
              <div className="content-modal-stage">
                {activeMedia.type === "video" ? (
                  <video className="content-modal-media" src={activeMedia.src} controls playsInline />
                ) : (
                  <img className="content-modal-media" src={activeMedia.src} alt={item.title} />
                )}
              </div>
              <div className="module-modal-toolbar">
                <span className="meta-inline">
                  {labels.itemsLabel} {mediaIndex + 1}/{mediaItems.length}
                </span>
                <div className="module-modal-controls">
                  <button
                    className="toggle-button"
                    type="button"
                    onClick={() => setMediaIndex((current) => (current - 1 + mediaItems.length) % mediaItems.length)}
                  >
                    {labels.prevLabel}
                  </button>
                  <button
                    className="toggle-button"
                    type="button"
                    onClick={() => setMediaIndex((current) => (current + 1) % mediaItems.length)}
                  >
                    {labels.nextLabel}
                  </button>
                </div>
              </div>
              {mediaItems.length > 1 ? (
                <div className="content-modal-rail">
                  {mediaItems.map((media, index) => (
                    <button
                      key={`${media.src}-${index}`}
                      className={`content-modal-thumb ${index === mediaIndex ? "is-active" : ""}`}
                      type="button"
                      onClick={() => setMediaIndex(index)}
                    >
                      {media.type === "video" ? (
                        <video src={media.src} muted playsInline />
                      ) : (
                        <img src={media.src} alt={`${item.title} ${index + 1}`} />
                      )}
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="module-modal-empty">
              <p>{labels.emptyLabel}</p>
              <code>{folderPath}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContentDetailPage({ media, title, onClose }) {
  const videoRef = useRef(null);
  const panelRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(media.type === "video");
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [onClose]);

  useEffect(() => {
    setIsPlaying(media.type === "video");
    setIsMuted(false);
    setIsFullscreen(false);
    setCurrentTime(0);
    setDuration(0);
    setIsSeeking(false);
  }, [media]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const togglePlayback = () => {
    if (media.type !== "video" || !videoRef.current) {
      return;
    }

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (media.type !== "video" || !videoRef.current) {
      return;
    }

    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const toggleFullscreen = async () => {
    if (!panelRef.current) {
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await panelRef.current.requestFullscreen();
      }
    } catch (error) {
      console.error("Failed to toggle fullscreen", error);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || isSeeking) {
      return;
    }

    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) {
      return;
    }

    setDuration(videoRef.current.duration || 0);
  };

  const handleSeekInput = (event) => {
    if (!videoRef.current) {
      return;
    }

    const nextTime = Number(event.target.value);
    videoRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
    if (!videoRef.current) {
      return;
    }
    setCurrentTime(videoRef.current.currentTime);
  };

  const progressValue = duration > 0 ? (currentTime / duration) * 100 : 0;
  const progressStyle = {
    background: `linear-gradient(90deg, #20d6ff 0%, #20d6ff ${progressValue}%, rgba(255, 255, 255, 0.14) ${progressValue}%, rgba(255, 255, 255, 0.14) 100%)`,
  };

  return (
    <div className="content-detail-page" aria-label={title}>
      <div ref={panelRef} className={`content-detail-panel ${media.type === "video" ? "is-video" : "is-image"}`}>
        <div className="content-detail-topbar">
          <button className="content-detail-back" type="button" onClick={onClose} aria-label="Back">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 5.5 8 12l6.5 6.5" />
            </svg>
          </button>
          <button className="content-detail-share" type="button" aria-label="Share">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.5 8.5 9 12l6.5 3.5" />
              <circle cx="18" cy="7" r="2" />
              <circle cx="6" cy="12" r="2" />
              <circle cx="18" cy="17" r="2" />
            </svg>
          </button>
        </div>
        <div className="content-detail-shell">
          <div className="content-detail-stage-shell">
            <button
              className={`content-detail-favorite ${isLiked ? "is-active" : ""}`}
              type="button"
              aria-label={isLiked ? "Remove favorite" : "Add favorite"}
              onClick={() => setIsLiked((prev) => !prev)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20.5 4.9 14a4.7 4.7 0 0 1 6.6-6.7L12 7.8l.5-.5A4.7 4.7 0 0 1 19.1 14L12 20.5Z" />
              </svg>
            </button>
            <div className="content-detail-stage">
              <div className="content-detail-media-frame">
                {media.type === "video" ? (
                  <>
                    <video
                      ref={videoRef}
                      className="content-detail-asset is-video"
                      src={media.src}
                      autoPlay
                      playsInline
                      onClick={togglePlayback}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                    />
                    <button
                      className={`content-detail-stage-play ${isPlaying ? "is-hidden" : ""}`}
                      type="button"
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                      onClick={togglePlayback}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 7.5v9l7-4.5Z" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <img className="content-detail-asset is-image" src={media.src} alt={title} />
                )}
              </div>
            </div>
            {media.type === "video" ? (
              <div className="content-detail-player is-overlay">
                <input
                  className="content-detail-progress"
                  type="range"
                  min="0"
                  max={duration || 0.1}
                  step="0.1"
                  value={currentTime}
                  onInput={handleSeekInput}
                  onChange={handleSeekInput}
                  onPointerDown={handleSeekStart}
                  onPointerUp={handleSeekEnd}
                  onPointerCancel={handleSeekEnd}
                  onBlur={handleSeekEnd}
                  aria-label="Seek"
                  style={progressStyle}
                  disabled={duration <= 0}
                />
                <div className="content-detail-player-row">
                  <div className="content-detail-player-main-controls">
                    <button className="content-detail-control-button" type="button" onClick={togglePlayback} aria-label="Play or pause">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        {isPlaying ? (
                          <path d="M9 7h2.75v10H9zm4.25 0H16v10h-2.75z" />
                        ) : (
                          <path d="M9 7.5v9l7-4.5Z" />
                        )}
                      </svg>
                    </button>
                    <button className="content-detail-control-button" type="button" onClick={toggleMute} aria-label="Toggle mute">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        {isMuted ? (
                          <>
                            <path d="M5 10.5h3.2l4.3-3.7v10.4l-4.3-3.7H5z" />
                            <path d="m16 9 4 6M20 9l-4 6" />
                          </>
                        ) : (
                          <>
                            <path d="M5 10.5h3.2l4.3-3.7v10.4l-4.3-3.7H5z" />
                            <path d="M16 9.2a4.8 4.8 0 0 1 0 5.6" />
                            <path d="M18.4 7a8 8 0 0 1 0 10" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  <div className="content-detail-player-meta">
                    <button className="content-detail-control-button" type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        {isFullscreen ? (
                          <>
                            <path d="M9 4.5H4.5V9" />
                            <path d="M15 4.5h4.5V9" />
                            <path d="M9 19.5H4.5V15" />
                            <path d="M15 19.5h4.5V15" />
                          </>
                        ) : (
                          <>
                            <path d="M9 4.5H4.5V9" />
                            <path d="M15 4.5h4.5V9" />
                            <path d="M9 19.5H4.5V15" />
                            <path d="M15 19.5h4.5V15" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ text }) {
  const [activeBackground, setActiveBackground] = useState(0);
  const backgrounds = HERO_BACKGROUNDS.length > 0 ? HERO_BACKGROUNDS : FALLBACK_HERO_BACKGROUNDS;

  useEffect(() => {
    if (HERO_VIDEO) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setActiveBackground((current) => (current + 1) % backgrounds.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [backgrounds.length]);

  return (
    <section id="home" className="section hero-section">
      <div className="section-shell hero-shell">
        <div className="hero-stage glass-panel">
          <div className="hero-viewport" aria-hidden="true">
            {HERO_VIDEO ? (
              <video className="hero-video" src={HERO_VIDEO} autoPlay muted loop playsInline />
            ) : (
              backgrounds.map((background, index) => (
                <div
                  key={background}
                  className={`hero-media ${index === activeBackground ? "is-active" : ""}`}
                  style={{
                    backgroundImage: HERO_BACKGROUNDS.length > 0 ? `url(${background})` : background,
                  }}
                />
              ))
            )}
            <div className="hero-shade hero-shade-top"></div>
            <div className="hero-shade hero-shade-bottom"></div>
            <div className="hero-grid-lines"></div>
          </div>

          <div className="hero-stage-grid">
            <div className="hero-copy-panel">
              <div className="hero-editorial">
                <h1 className="hero-title" aria-label={text.hero.lines.join(" ")}>
                  {text.hero.lines.map((line, index) => (
                    <span key={line} className="hero-title-line">
                      {line}
                      {index === text.hero.lines.length - 1 && text.hero.nativeName ? (
                        <span className="hero-title-native">{text.hero.nativeName}</span>
                      ) : null}
                    </span>
                  ))}
                </h1>
                <div className="hero-tag-row" aria-label="Highlights">
                  {text.hero.tags.map((tag) => (
                    <span key={tag} className="hero-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="hero-meta-grid" aria-label="Contact">
                  <div className="hero-meta-item">
                    <span className="hero-meta-label">{text.contact.phone}</span>
                    <strong className="hero-meta-value">{PROFILE.phone}</strong>
                  </div>
                  <div className="hero-meta-item">
                    <span className="hero-meta-label">{text.contact.email}</span>
                    <strong className="hero-meta-value">{PROFILE.email}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedSection({ text }) {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [activeModule, setActiveModule] = useState(null);
  const communityItem = text.featuredItems.find((item) => item.caseType === "community");
  const otherItems = text.featuredItems.filter((item) => item.caseType !== "community");
  const [activeCommunityIndex, setActiveCommunityIndex] = useState(1);
  const dragStartX = useRef(null);
  const dragMoved = useRef(false);
  const moduleChipRefs = useRef([]);

  useEffect(() => {
    if (!communityItem) {
      return;
    }
    setActiveCommunityIndex((current) => Math.min(current, communityItem.moduleEntries.length - 1));
  }, [communityItem]);

  useEffect(() => {
    const chip = moduleChipRefs.current[activeCommunityIndex];
    if (chip instanceof HTMLElement) {
      chip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeCommunityIndex]);

  const activeCommunityModule = communityItem?.moduleEntries[activeCommunityIndex] || null;

  const updateCommunityIndex = (nextIndex) => {
    if (!communityItem) {
      return;
    }
    const total = communityItem.moduleEntries.length;
    setActiveCommunityIndex(((nextIndex % total) + total) % total);
  };

  const handleCommunityPointerDown = (event) => {
    dragStartX.current = event.clientX;
    dragMoved.current = false;
  };

  const handleCommunityPointerMove = (event) => {
    if (dragStartX.current === null) {
      return;
    }
    const delta = event.clientX - dragStartX.current;
    if (Math.abs(delta) < 56) {
      return;
    }
    dragMoved.current = true;
    updateCommunityIndex(activeCommunityIndex + (delta < 0 ? 1 : -1));
    dragStartX.current = event.clientX;
  };

  const handleCommunityPointerUp = () => {
    dragStartX.current = null;
    window.setTimeout(() => {
      dragMoved.current = false;
    }, 0);
  };

  return (
    <section id="featured" className="section">
      <div className="section-shell">
        {communityItem ? (
          <div className="community-feature-breakout">
          <div className="community-feature-block">
            {COMMUNITY_BACKGROUND_VIDEO ? (
              <div className="community-feature-video-shell" aria-hidden="true">
                <video
                  className="community-feature-video"
                  src={COMMUNITY_BACKGROUND_VIDEO}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="community-feature-video-shade"></div>
              </div>
            ) : COMMUNITY_BACKGROUND_IMAGES.length > 0 ? (
              <div className="community-feature-video-shell" aria-hidden="true">
                <div
                  className="community-background-slide is-active"
                  style={{ backgroundImage: `url(${COMMUNITY_BACKGROUND_IMAGES[0]})` }}
                ></div>
                <div className="community-feature-video-shade"></div>
              </div>
            ) : null}
            <div className="community-feature-head">
              <div>
                <h3 className="community-feature-title">{communityItem.title}</h3>
                {communityItem.desc ? <p className="community-feature-subtitle">{communityItem.desc}</p> : null}
              </div>
            </div>
            <div className="featured-detail-block">
              {activeCommunityModule ? (
                <div className="community-floating-title" aria-live="polite">
                  <div className="community-floating-title-blur"></div>
                  <div className="community-floating-title-inner">
                    <span className="community-floating-title-kicker">
                      {String(activeCommunityIndex + 1).padStart(2, "0")}
                    </span>
                    <h4 className="community-floating-title-text">{activeCommunityModule.title}</h4>
                  </div>
                </div>
              ) : null}
              <div
                className="community-fan-stage"
                onPointerDown={handleCommunityPointerDown}
                onPointerMove={handleCommunityPointerMove}
                onPointerUp={handleCommunityPointerUp}
                onPointerCancel={handleCommunityPointerUp}
                onPointerLeave={handleCommunityPointerUp}
              >
                {communityItem.moduleEntries.map((module, moduleIndex) => {
                  const preview = COMMUNITY_MODULE_ASSETS[module.id]?.cover;
                  const offset = getCircularOffset(
                    moduleIndex,
                    activeCommunityIndex,
                    communityItem.moduleEntries.length
                  );
                  const absOffset = Math.abs(offset);
                  const hidden = absOffset > 2.5;
                  const baseScale =
                    moduleIndex === activeCommunityIndex ? 1 : Math.max(0.78, 0.94 - absOffset * 0.07);
                  const hoverScale = baseScale + 0.03;
                  const direction = Math.sign(offset) || 1;
                  const arcX = Math.sin((offset / 3) * Math.PI * 0.9) * 300;
                  const arcY = absOffset === 0 ? 0 : 26 + Math.pow(absOffset, 1.45) * 28;
                  const rotation = direction * Math.min(15, absOffset * 7);

                  return (
                    <button
                      key={module.id}
                      className={`community-fan-card ${moduleIndex === activeCommunityIndex ? "is-active" : ""}`}
                      type="button"
                      style={{
                        "--fan-translate-x": `${arcX}px`,
                        "--fan-translate-y": `${arcY}px`,
                        "--fan-rotate": `${rotation}deg`,
                        "--fan-scale": baseScale,
                        "--fan-hover-scale": hoverScale,
                        "--fan-opacity": hidden ? 0 : Math.max(0.22, 1 - absOffset * 0.2),
                        zIndex: 20 - absOffset,
                      }}
                      onClick={() => {
                        if (moduleIndex === activeCommunityIndex && !dragMoved.current) {
                          setActiveModule({ ...module, text: communityItem });
                          return;
                        }
                        updateCommunityIndex(moduleIndex);
                      }}
                    >
                      <div className="community-fan-surface">
                        {preview ? (
                          <img src={preview} alt={module.title} className="community-fan-image" />
                        ) : (
                          <div
                            className="community-fan-placeholder"
                            style={{ backgroundImage: FEATURED_GRADIENTS[moduleIndex % FEATURED_GRADIENTS.length] }}
                          ></div>
                        )}
                        <div className="community-fan-corner-label">
                          <span className="community-fan-corner-index">
                            {String(moduleIndex + 1).padStart(2, "0")}
                          </span>
                          <span className="community-fan-corner-title">{module.title}</span>
                        </div>
                        <div className="community-fan-overlay">
                          <h4>{module.title}</h4>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="community-fan-action">
                <button
                  className="community-fan-view"
                  type="button"
                  onClick={() => activeCommunityModule && setActiveModule({ ...activeCommunityModule, text: communityItem })}
                >
                  {activeCommunityModule?.buttonLabel || "View"}
                </button>
              </div>
              <div className="community-module-rail" role="tablist" aria-label={communityItem.entryLabel}>
                {communityItem.moduleEntries.map((module, moduleIndex) => (
                  <button
                    key={module.id}
                    ref={(node) => {
                      moduleChipRefs.current[moduleIndex] = node;
                    }}
                    className={`community-module-chip ${moduleIndex === activeCommunityIndex ? "is-active" : ""}`}
                    type="button"
                    onClick={() => updateCommunityIndex(moduleIndex)}
                    aria-pressed={moduleIndex === activeCommunityIndex}
                  >
                    <span className="community-module-index">{String(moduleIndex + 1).padStart(2, "0")}</span>
                    <span className="community-module-name">{module.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          </div>
        ) : null}
        {otherItems.length > 0 ? (
          <div className="featured-grid">
            {otherItems.map((item, index) => (
            <article
              key={item.title}
              className={`featured-card glass-panel featured-work-card ${expandedIndex === index ? "is-expanded" : ""}`}
            >
              <div className="card-cover-wrap">
                <div
                  className="card-cover featured-work-cover"
                  style={{ backgroundImage: FEATURED_GRADIENTS[index % FEATURED_GRADIENTS.length] }}
                ></div>
              </div>
              <div className="card-body">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.desc}</p>
                <div className="card-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  className="featured-toggle"
                  type="button"
                  onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
                  aria-expanded={expandedIndex === index}
                >
                  {expandedIndex === index ? "−" : "+"}
                </button>
                {expandedIndex === index ? (
                  <div className="featured-detail">
                    <div className="featured-detail-block">
                      <span className="featured-detail-label">{item.roleLabel}</span>
                      <p>{item.role}</p>
                    </div>
                    <div className="featured-detail-block">
                      <span className="featured-detail-label">{item.modulesLabel}</span>
                      <ul className="featured-detail-list">
                        {item.modules.map((module) => (
                          <li key={module}>{module}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            </article>
            ))}
          </div>
        ) : null}
        {activeModule ? <ModuleViewerModal text={activeModule.text} module={activeModule} onClose={() => setActiveModule(null)} /> : null}
      </div>
    </section>
  );
}

function CardGridSection({
  id,
  section,
  items,
  className = "works-grid",
  cardClassName = "work-card",
  galleryLabels = null,
  assetMap = null,
  folderMap = null,
  footerText = "",
}) {
  const [activeItem, setActiveItem] = useState(null);
  const hasGallery = Boolean(assetMap && folderMap && galleryLabels);

  return (
    <section id={id} className="section">
      <div className="section-shell full-width-shell">
        <SectionHeading section={section} />
        <div className={className}>
          {items.map((item) => {
            const canOpenGallery = hasGallery && Boolean(item.id);
            const coverImage = canOpenGallery ? assetMap[item.id]?.cover : null;

            return (
            <article
              key={item.title}
              className={`${cardClassName} glass-panel ${canOpenGallery ? "is-clickable" : ""}`}
              onClick={() => {
                if (canOpenGallery) {
                  setActiveItem(item);
                }
              }}
            >
              <div className="card-cover-wrap">
                {coverImage ? (
                  <img src={coverImage} alt={item.title} className="card-cover" />
                ) : (
                  <div className="card-cover card-cover-gradient"></div>
                )}
              </div>
              <div className="card-body">
                {item.meta ? (
                  <div className="card-meta">
                    <span className="meta-inline">{item.meta}</span>
                  </div>
                ) : null}
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.desc}</p>
              </div>
            </article>
            );
          })}
        </div>
        {footerText ? <p className="footer-note">{footerText}</p> : null}
        {hasGallery && activeItem ? (
          <WorkGalleryModal
            assets={assetMap[activeItem.id] || { cover: null, gallery: [] }}
            folderPath={folderMap[activeItem.id]}
            item={activeItem}
            labels={galleryLabels}
            onClose={() => setActiveItem(null)}
          />
        ) : null}
      </div>
    </section>
  );
}

function ContentOutputSection({ section, labels, onOpenDetail }) {
  const [mediaRatios, setMediaRatios] = useState({});
  const [activeTopic, setActiveTopic] = useState("video");
  const [gridWidth, setGridWidth] = useState(0);
  const gridRef = useRef(null);
  const previewVideoRefs = useRef(new Map());
  const mediaItems = CONTENT_OUTPUT_ASSETS.items;
  const imageItems = mediaItems.filter((media) => media.type === "image");
  const videoItems = mediaItems.filter((media) => media.type === "video");

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      mediaItems.map(async (media) => ({
        src: media.src,
        ratio: await loadMediaAspectRatio(media),
      }))
    ).then((entries) => {
      if (cancelled) {
        return;
      }

      setMediaRatios(
        Object.fromEntries(entries.map(({ src, ratio }) => [src, ratio]))
      );
    });

    return () => {
      cancelled = true;
    };
  }, [mediaItems]);

  useEffect(() => {
    if (activeTopic === "image" && imageItems.length === 0 && videoItems.length > 0) {
      setActiveTopic("video");
      return;
    }

    if (activeTopic === "video" && videoItems.length === 0 && imageItems.length > 0) {
      setActiveTopic("image");
    }
  }, [activeTopic, imageItems.length, videoItems.length]);

  const filteredItems = activeTopic === "video" ? videoItems : imageItems;
  const collections = [
    { id: "video", title: "Video Collection", items: videoItems },
    { id: "image", title: "Image Collection", items: imageItems },
  ];
  const GRID_GAP = 4;
  const GRID_ROW_SIZE = 2;

  useEffect(() => {
    if (!gridRef.current) {
      return undefined;
    }

    const updateWidth = () => {
      if (!gridRef.current) {
        return;
      }

      setGridWidth(gridRef.current.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(gridRef.current);
    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const getGridColumns = () => {
    if (gridWidth <= 820) {
      return 2;
    }

    if (gridWidth <= 1100) {
      return 3;
    }

    return 5;
  };

  const gridColumns = getGridColumns();
  const columnWidth =
    gridColumns > 0 ? (gridWidth - GRID_GAP * (gridColumns - 1)) / gridColumns : 0;
  const getAdaptiveDisplayRatio = (ratio, mediaType) => {
    const fallback = mediaType === "video" ? 9 / 16 : 1;
    const safeRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : fallback;
    const minRatio = 0.15;
    const maxRatio = 6;
    return Math.min(maxRatio, Math.max(minRatio, safeRatio));
  };

  const registerPreviewVideo = (key, node) => {
    if (!key) {
      return;
    }

    if (node) {
      previewVideoRefs.current.set(key, node);
    } else {
      previewVideoRefs.current.delete(key);
    }
  };

  const playPreviewVideo = (key) => {
    const node = previewVideoRefs.current.get(key);
    if (!node) {
      return;
    }

    const playPromise = node.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  const resetPreviewVideo = (key) => {
    const node = previewVideoRefs.current.get(key);
    if (!node) {
      return;
    }

    node.pause();
    try {
      node.currentTime = 0;
    } catch (error) {
      // Ignore seek errors for streams or constrained media states.
    }
  };

  return (
    <section id="video" className="section content-output-section">
      <div className="section-shell content-output-shell full-width-shell">
        {CONTENT_OUTPUT_BACKGROUND ? (
          <div
            className="content-output-background"
            aria-hidden="true"
            style={{ backgroundImage: `url(${CONTENT_OUTPUT_BACKGROUND})` }}
          ></div>
        ) : null}
        <SectionHeading section={section} />
        <div className="content-output-collections" role="tablist" aria-label={`${section.title} collections`}>
          {collections.map((collection) => (
            <button
              key={collection.id}
              className={`content-output-collection ${activeTopic === collection.id ? "is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeTopic === collection.id}
              onClick={() => setActiveTopic(collection.id)}
            >
              <div className="content-output-collection-stack" aria-hidden="true">
                {collection.items.slice(0, 3).map((media, index) => (
                  <div key={`${collection.id}-${media.src}-${index}`} className={`content-output-collection-layer layer-${index + 1}`}>
                    {media.type === "video" ? (
                      <video
                        className="content-output-collection-media"
                        src={media.src}
                        muted
                        playsInline
                        preload="metadata"
                        disablePictureInPicture
                      />
                    ) : (
                      <img className="content-output-collection-media" src={media.src} alt="" draggable="false" />
                    )}
                  </div>
                ))}
              </div>
              <div className="content-output-collection-meta">
                <span className="content-output-collection-title">{collection.title}</span>
                <span className="content-output-collection-count">{collection.items.length} items</span>
              </div>
            </button>
          ))}
        </div>
        <div ref={gridRef} className="content-output-grid">
          {filteredItems.map((media, index) => {
            const ratio = mediaRatios[media.src] || 1;
            const adaptiveRatio = getAdaptiveDisplayRatio(ratio, media.type);
            const itemWidth = columnWidth > 0 ? columnWidth : 0;
            const itemHeight = itemWidth > 0 ? itemWidth / adaptiveRatio : 320;
            const renderedHeight = Math.max(120, Math.min(960, itemHeight));
            const estimatedRows = Math.max(1, Math.ceil((renderedHeight + GRID_GAP) / (GRID_ROW_SIZE + GRID_GAP)));
            const cardStyle = {
              gridRow: `span ${estimatedRows}`,
              height: `${renderedHeight}px`,
            };
            const previewKey = `${activeTopic}-${media.path}-${index}`;

            return (
              <button
                key={`${activeTopic}-${media.src}-${index}`}
                className={`content-output-card ${media.type === "video" ? "is-video" : "is-image"}`}
                type="button"
                onClick={() => onOpenDetail(media)}
                aria-label={getMediaLabel(media, index)}
                style={cardStyle}
                onMouseEnter={() => {
                  if (media.type === "video") {
                    playPreviewVideo(previewKey);
                  }
                }}
                onMouseLeave={() => {
                  if (media.type === "video") {
                    resetPreviewVideo(previewKey);
                  }
                }}
                onFocus={() => {
                  if (media.type === "video") {
                    playPreviewVideo(previewKey);
                  }
                }}
                onBlur={() => {
                  if (media.type === "video") {
                    resetPreviewVideo(previewKey);
                  }
                }}
              >
                <div className="content-output-card-shell">
                  {media.type === "video" ? (
                    <video
                      ref={(node) => registerPreviewVideo(previewKey, node)}
                      className="content-output-card-media is-video"
                      src={media.src}
                      muted
                      playsInline
                      loop
                      preload="metadata"
                    />
                  ) : (
                    <img
                      className="content-output-card-media"
                      src={media.src}
                      alt={`${section.title} ${index + 1}`}
                      draggable="false"
                    />
                  )}
                  <span className="content-output-card-badge">
                    {media.type === "video" ? "Video" : "Image"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {mediaItems.length === 0 ? (
          <div className="content-output-empty">
            <p>{labels.emptyLabel}</p>
            {CONTENT_OUTPUT_FOLDERS.map((folder) => (
              <code key={folder}>{folder}</code>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function App() {
  const [locale, setLocale] = useState("en");
  const [activeSection, setActiveSection] = useState("home");
  const [detailMediaPath, setDetailMediaPath] = useState(() => parseContentDetailHash(window.location.hash));
  const detailReturnSnapshotRef = useRef(null);
  const text = CONTENT[locale];
  const contentItems = CONTENT_OUTPUT_ASSETS.items;
  const detailMediaIndex = resolveDetailMediaIndex(contentItems, detailMediaPath);
  const detailMedia = detailMediaIndex >= 0 ? contentItems[detailMediaIndex] : null;

  useEffect(() => {
    document.title = text.title;
    document.documentElement.lang = text.lang;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", text.metaDescription);
    }
  }, [text]);

  useEffect(() => {
    const syncDetailPathFromHash = () => {
      setDetailMediaPath(parseContentDetailHash(window.location.hash));
    };

    syncDetailPathFromHash();
    window.addEventListener("hashchange", syncDetailPathFromHash);

    return () => {
      window.removeEventListener("hashchange", syncDetailPathFromHash);
    };
  }, []);

  useLayoutEffect(() => {
    const initialHash = window.location.hash;
    if (initialHash.startsWith(CONTENT_DETAIL_HASH)) {
      return;
    }

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const targetHash = "#home";
    const resetToHero = () => {
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${targetHash}`);
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetToHero();
    requestAnimationFrame(() => {
      requestAnimationFrame(resetToHero);
    });
  }, []);

  useEffect(() => {
    const handlePageShow = () => {
      if (window.location.hash.startsWith(CONTENT_DETAIL_HASH)) {
        return;
      }

      if (window.location.hash !== "#home") {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#home`);
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  useEffect(() => {
    const sectionIds = text.nav.map((item) => item.href.slice(1));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section) => section instanceof HTMLElement);

    if (sections.length === 0) {
      return undefined;
    }

    const updateActiveSection = () => {
      const viewportAnchor = window.innerHeight * 0.36;
      let currentSection = sections[0].id;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportAnchor) {
          currentSection = section.id;
        } else {
          break;
        }
      }

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [text.nav]);

  const handleOpenContentDetail = (media) => {
    if (!media?.path) {
      return;
    }

    const snapshot = {
      hash: window.location.hash,
      scrollY: window.scrollY,
    };
    detailReturnSnapshotRef.current = snapshot;

    window.location.hash = buildContentDetailHash(media.path);
  };

  const handleCloseContentDetail = () => {
    const snapshot = detailReturnSnapshotRef.current;
    detailReturnSnapshotRef.current = null;

    const targetHash =
      snapshot?.hash && !snapshot.hash.startsWith(CONTENT_DETAIL_HASH)
        ? snapshot.hash
        : "#video";

    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      setDetailMediaPath(null);
    }

    const restoreScroll = () => {
      window.scrollTo({
        top: snapshot?.scrollY || 0,
        left: 0,
        behavior: "auto",
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(restoreScroll);
    });
  };

  return (
    <>
      <div className="bg-orb bg-orb-cyan" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-violet" aria-hidden="true"></div>
      <Header activeSection={activeSection} locale={locale} onLocaleChange={setLocale} text={text} />
      <main id="page">
        <Hero text={text} />
        <FeaturedSection text={text} />
        <ContentOutputSection section={text.sections.video} labels={text.mediaGallery} onOpenDetail={handleOpenContentDetail} />
        <CardGridSection
          id="ui"
          section={text.sections.ui}
          items={text.uiWorks}
          galleryLabels={text.gallery}
          assetMap={UI_WORK_ASSETS}
          folderMap={UI_WORK_FOLDERS}
        />
        <CardGridSection
          id="workflows"
          section={text.sections.workflows}
          items={text.flowWorks}
          className="workflow-grid"
          cardClassName="work-card flow-card"
          galleryLabels={text.flowGallery}
          assetMap={FLOW_WORK_ASSETS}
          folderMap={FLOW_WORK_FOLDERS}
          footerText={text.sections.workflows.footer}
        />
      </main>
      {detailMedia ? (
        <ContentDetailPage
          media={detailMedia}
          title={getMediaLabel(detailMedia, detailMediaIndex)}
          onClose={handleCloseContentDetail}
        />
      ) : null}
    </>
  );
}
