export interface DownloadLink {
  label: string;
  url: string;
}

export interface FSNode {
  type: "file" | "dir";
  content?: string;
  downloadUrl?: string;
  downloadLinks?: DownloadLink[];
  children?: Record<string, FSNode>;
}

export const FILE_SYSTEM: FSNode = {
  type: "dir",
  children: {
    "about-me": {
      type: "dir",
      children: {
        "README.md": {
          type: "file",
          content: [
            "# Jason Zhao",
            "",
            "COO at Omnipresent | Vancouver, BC",
            "",
            "Product-minded engineer and operator with experience",
            "spanning software engineering, product ownership, and",
            "growth operations. UBC Computer Science graduate with",
            "a 3.9/4.0 GPA and Dean's List honors.",
            "",
            "## Product Skills",
            "",
            "  - Road Mapping & PRDs",
            "  - GTM Planning & Execution",
            "  - KPI Frameworks & A/B Testing",
            "  - Growth Experimentation",
            "  - Lifecycle Journey Optimization",
            "",
            "## Languages & Frameworks",
            "",
            "  - TypeScript, JavaScript, Python, Solidity",
            "  - Next.js, Nest.js, React.js, Node.js",
            "  - PHP, HTML, CSS, C#, Java",
            "",
            "## Tools & Technologies",
            "",
            "  - AI, Notion, Asana, Git, Jira",
            "  - Postgres, SQL, Prisma, REST",
            "  - Agile, Scrum, Tailwind",
          ].join("\n"),
        },
      },
    },
    projects: {
      type: "dir",
      children: {
        "README.md": {
          type: "file",
          content: [
            "# Projects",
            "",
            "## 1. DuoASL",
            "   1st Place - Healthcare & Accessibility Hackathon",
            "   Gamified learning app that teaches ASL powered by",
            "   an LSTM Deep Learning Model with 90% accuracy.",
            "   Tech: Next.js, React.js, TypeScript, Auth0, Flask,",
            "         Python, TensorFlow, Tailwind",
            "",
            "## 2. Terminal Portfolio",
            "   This website! A Tron-inspired personal portfolio",
            "   with WebGL animations and interactive terminal.",
            "   Tech: Next.js, TypeScript, Three.js, Tailwind CSS",
            "",
            "## 3. AI Notion-Telegram Integration",
            "   Custom AI-powered integration between Notion and",
            "   Telegram that reduced task turnaround by 30% and",
            "   improved KPI attainment by 22% across clients.",
          ].join("\n"),
        },
      },
    },
    experience: {
      type: "dir",
      children: {
        "README.md": {
          type: "file",
          content: [
            "# Work Experience",
            "",
            "## COO - Omnipresent",
            "   September 2025 - Present | Remote",
            "   Scaled marketing and growth operations by leading a",
            "   cross-functional team of 19 to execute GTM and TGE",
            "   launches valued at $100M-$700M+.",
            "   Generated 100M+ impressions across KOL campaigns.",
            "   Reduced CPM by 24% via KPI frameworks.",
            "   Improved delivery by 35% managing Gantt timelines.",
            "",
            "## Technical Product Owner - Animoca Brands",
            "   May 2024 - Feb 2026 | Remote",
            "   (Acquired SFT Studios)",
            "   Drove user growth and retention across the Animoca",
            "   Brands ecosystem, leading integrations across 10+",
            "   sister organizations, increasing users by 24%.",
            "",
            "## Technical Product Owner & Engineer - SFT Studios",
            "   May 2024 - Feb 2026 | Vancouver, BC",
            "   Owned product strategy across 3 products: gaming app,",
            "   e-commerce, and anime loyalty platform. Led team of",
            "   6 engineers and 2 designers. Scaled from 0 to 130K users.",
            "   Built and deployed smart contracts in Solidity.",
            "   Drove 30% increase in retention and 20% boost in traffic.",
            "",
            "## Software Engineer - Splunk",
            "   January - April 2024 | San Francisco, CA",
            "   Built Saved Searches feature for Enterprise Dashboard,",
            "   improving usability across 1,000+ enterprise clients.",
            "   Led cross-functional coordination across 3 teams.",
            "   Achieved 20% improvement in dashboard load times.",
            "",
            "## Software Engineer - KLKTN",
            "   May - December 2023 | Vancouver, BC",
            "   Full software development lifecycle of React.js/Next.js/",
            "   Nest.js web applications. Scaled product from 0 to 15K users.",
            "",
            "## Software Developer - STN Video",
            "   September 2022 - April 2023",
            "",
            "## Web Application Developer - Goopter eCommerce Solutions",
            "   May - August 2022",
          ].join("\n"),
        },
      },
    },
    education: {
      type: "dir",
      children: {
        "README.md": {
          type: "file",
          content: [
            "# Education",
            "",
            "## University of British Columbia",
            "   BSc. Computer Science",
            "   GPA: 3.9 / 4.0",
            "   Dean's List",
            "   Vancouver, BC",
          ].join("\n"),
        },
      },
    },
    contact: {
      type: "dir",
      children: {
        "README.md": {
          type: "file",
          content: [
            "# Contact Me",
            "",
            "  Email:    jason1382311@gmail.com",
            "  Phone:    (403)-616-9399",
            "  Github:   github.com/jasonz23",
            "  LinkedIn: linkedin.com/in/jason-yd-zhao",
            "  Location: Vancouver, BC",
            "",
            "Feel free to reach out!",
          ].join("\n"),
        },
      },
    },
    "resume.txt": {
      type: "file",
      downloadLinks: [
        {
          label: "Engineering Resume (PDF)",
          url: "/resumes/Resume_JasonZhao_Engineer.pdf",
        },
        {
          label: "Product Resume (PDF)",
          url: "/resumes/Resume_JasonZhao_Product.pdf",
        },
      ],
      content: [
        "========================================",
        "         JASON ZHAO - RESUME",
        "========================================",
        "",
        "Vancouver, BC | (403)-616-9399",
        "jason1382311@gmail.com",
        "",
        "EDUCATION",
        "---------",
        "University of British Columbia",
        "BSc. Computer Science | 3.9/4.0 GPA | Dean's List",
        "",
        "EXPERIENCE",
        "----------",
        "COO | Omnipresent | Sep 2025 - Present",
        "  - Led cross-functional team of 19",
        "  - GTM/TGE launches valued at $100M-$700M+",
        "  - 100M+ impressions, reduced CPM by 24%",
        "  - Improved delivery by 35%",
        "",
        "Technical Product Owner | Animoca Brands | May 2024 - Feb 2026",
        "  - Drove growth across 10+ sister organizations",
        "  - Increased users by 24%",
        "",
        "Technical Product Owner & Engineer | SFT Studios | May 2024 - Feb 2026",
        "  - 3 products, team of 6 engineers + 2 designers",
        "  - Scaled from 0 to 130K users",
        "  - Solidity smart contracts",
        "  - 30% retention increase, 20% traffic boost",
        "",
        "Software Engineer | Splunk | Jan - Apr 2024",
        "  - Enterprise Dashboard, 1,000+ clients",
        "  - 20% improvement in load times",
        "",
        "Software Engineer | KLKTN | May - Dec 2023",
        "  - React.js/Next.js/Nest.js applications",
        "  - Scaled 0 to 15K users",
        "",
        "Software Developer | STN Video | Sep 2022 - Apr 2023",
        "Web App Developer | Goopter eCommerce | May - Aug 2022",
        "",
        "SKILLS",
        "------",
        "Product: Road mapping, PRDs, GTM, KPI,",
        "  A/B testing, growth experimentation",
        "Languages: TypeScript, Next.js, Nest.js,",
        "  JavaScript, PHP, Solidity, Python, C#, Java",
        "Tools: AI, Notion, Asana, Git, Postgres, SQL,",
        "  Node.js, REST, Jira, Prisma, Tailwind",
        "",
        "PROJECTS",
        "--------",
        "DuoASL - 1st Place Healthcare & Accessibility",
        "  Gamified ASL learning app with LSTM model (90%)",
        "",
        "========================================",
      ].join("\n"),
    },
  },
};

export function getNode(path: string): FSNode | null {
  if (path === "~" || path === "") return FILE_SYSTEM;
  const parts = path.replace(/^~\/?/, "").split("/").filter(Boolean);
  let current = FILE_SYSTEM;
  for (const part of parts) {
    if (current.type !== "dir" || !current.children?.[part]) {
      return null;
    }
    current = current.children[part];
  }
  return current;
}

export function resolvePath(cwd: string, target: string): string {
  if (!target || target === "~") return "~";
  if (target === "/") return "~";

  let parts: string[];
  if (target.startsWith("~/")) {
    parts = target.slice(2).split("/").filter(Boolean);
  } else if (target.startsWith("/")) {
    parts = target.slice(1).split("/").filter(Boolean);
  } else {
    const cwdParts =
      cwd === "~" ? [] : cwd.replace(/^~\/?/, "").split("/").filter(Boolean);
    const targetParts = target.split("/");
    parts = [...cwdParts];
    for (const part of targetParts) {
      if (part === "..") {
        parts.pop();
      } else if (part !== "." && part !== "") {
        parts.push(part);
      }
    }
  }

  return parts.length === 0 ? "~" : "~/" + parts.join("/");
}
