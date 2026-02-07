export interface LinkItem {
  name: string;
  href?: string;
  external?: boolean;
  path?: string;
  isFile?: boolean;
}

export const LINKS: LinkItem[] = [
  { name: "Github", href: "https://github.com/jasonz23", external: true },
  {
    name: "Linkedin",
    href: "https://linkedin.com/in/jason-yd-zhao",
    external: true,
  },
  { name: "About.Me", path: "~/about-me", isFile: false },
  { name: "Projects", path: "~/projects", isFile: false },
  { name: "Experience", path: "~/experience", isFile: false },
  { name: "Education", path: "~/education", isFile: false },
  { name: "Contact.Me", path: "~/contact", isFile: false },
  { name: "Resume", path: "~/resume.txt", isFile: true },
];
