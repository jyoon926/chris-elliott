import { Link } from "react-router-dom";

/**
 * Create a lowercase, dash-separated slug for URLs.
 * @param str String to convert.
 * @returns Converted string.
 */
export const stringToUrl = (str: string) => {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
};

export const urlToString = (url: string): string => {
  return url
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()) // Capitalize the first letter of each word
    .replace(/[^a-zA-Z0-9\s]/g, ""); // Restore special characters if needed
};

export const preloadImages = (imageUrls: string[]) => {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

export function formatBiography(bio: string) {
  // Split into paragraphs by two or more newlines
  const paragraphs = bio.split(/\n\s*\n/).filter(Boolean);

  return paragraphs.map((para, i) => {
    // Detect markdown-like [text](url) links
    const linkMatch = para.match(/\[([^\]]+)\]\(([^)]+)\)/);

    if (linkMatch) {
      const [, linkText, linkUrl] = linkMatch;
      const beforeLink = para.slice(0, para.indexOf("[")); // text before link
      const afterLink = para.slice(para.indexOf(")") + 1); // text after link

      return (
        <p
          key={i}
          className="opacity-60"
        >
          {beforeLink}
          <Link
            className="underline text-blue-600 border-blue-600"
            to={linkUrl}
            target="_blank"
          >
            {linkText}
          </Link>
          {afterLink}
        </p>
      );
    }

    return <p key={i}>{para}</p>;
  });
}

export function toSentenceCase(str: string): string {
  if (typeof str !== 'string' || str.length === 0) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}