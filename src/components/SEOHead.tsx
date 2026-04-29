import { useEffect } from "react";

const DEFAULTS = {
  title: "Roadmapper — Visual Roadmap Planning",
  description:
    "The visual roadmap tool that keeps your team aligned. Drag, drop, and plan product priorities on one shared canvas.",
  image: "/social-card.svg",
  url: "/",
  type: "website",
};

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

function setMeta(property: string, content: string, isName = false) {
  const attr = isName ? "name" : "property";
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function toAbsoluteUrl(value: string) {
  try {
    return new URL(value, window.location.origin).toString();
  } catch {
    return value;
  }
}

export default function SEOHead({
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  image = DEFAULTS.image,
  url = DEFAULTS.url,
  type = DEFAULTS.type,
}: SEOHeadProps) {
  useEffect(() => {
    const pageUrl = toAbsoluteUrl(url);
    const pageImage = toAbsoluteUrl(image);
    const defaultUrl = toAbsoluteUrl(DEFAULTS.url);
    const defaultImage = toAbsoluteUrl(DEFAULTS.image);

    document.title = title;
    setMeta("og:type", type);
    setMeta("og:url", pageUrl);
    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:image", pageImage);
    setMeta("og:image:width", "1200");
    setMeta("og:image:height", "630");
    setMeta("twitter:card", "summary_large_image", true);
    setMeta("twitter:title", title, true);
    setMeta("twitter:description", description, true);
    setMeta("twitter:image", pageImage, true);
    setMeta("description", description, true);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);

    return () => {
      document.title = DEFAULTS.title;
      setMeta("og:title", DEFAULTS.title);
      setMeta("og:description", DEFAULTS.description);
      setMeta("og:url", defaultUrl);
      setMeta("og:type", DEFAULTS.type);
      setMeta("og:image", defaultImage);
      setMeta("twitter:title", DEFAULTS.title, true);
      setMeta("twitter:description", DEFAULTS.description, true);
      setMeta("twitter:image", defaultImage, true);
      setMeta("description", DEFAULTS.description, true);
    };
  }, [title, description, image, url, type]);

  return null;
}
